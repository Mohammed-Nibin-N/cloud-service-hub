import {
  getOldestPendingJob,
  markJobRunning,
  markJobCompleted,
  markJobFailed,
  getRequestById,
  updateRequestStatus,
  completeProvisioning,
} from './db.js';
import { executeTerraform, generateIamUsername } from './terraform-executor.js';

const POLL_INTERVAL_MS = 3000; // Poll every 3 seconds

let isProcessing = false;

/**
 * Background worker that polls for pending provisioning jobs
 * and processes them sequentially via Terraform.
 */
export function startProvisioningWorker(): void {
  console.log(`[${timestamp()}] [Worker] Provisioning worker started (polling every ${POLL_INTERVAL_MS / 1000}s)`);

  setInterval(async () => {
    if (isProcessing) return;

    const job = getOldestPendingJob();
    if (!job) return;

    isProcessing = true;

    try {
      await processJob(job.id, job.requestId);
    } catch (err) {
      console.error(`[${timestamp()}] [Worker] Unexpected error:`, err);
    } finally {
      isProcessing = false;
    }
  }, POLL_INTERVAL_MS);
}

async function processJob(jobId: number, requestId: string): Promise<void> {
  const request = getRequestById(requestId);
  if (!request) {
    markJobFailed(jobId, `Request ${requestId} not found`);
    console.error(`[${timestamp()}] [Worker] Job ${jobId}: Request ${requestId} not found`);
    return;
  }

  // Mark job as running, update request status to provisioning
  markJobRunning(jobId);
  updateRequestStatus(requestId, 'provisioning');
  console.log(`[${timestamp()}] [Worker] Job ${jobId}: Terraform provisioning started for ${requestId} (${request.projectName})`);

  try {
    // Generate unique IAM username from project name + request ID
    const iamUsername = generateIamUsername(request.projectName, requestId);
    console.log(`[${timestamp()}] [Worker] Job ${jobId}: Generated IAM username: ${iamUsername}`);

    // Execute Terraform
    const outputs = await executeTerraform({
      project_name: request.projectName,
      environment: request.environment,
      bucket_name: request.accessTarget,
      iam_username: iamUsername,
      aws_account_id: request.awsAccountNumber,
    });

    // Save outputs to DB
    const region = 'us-east-1';
    completeProvisioning(requestId, {
      awsConsoleUrl: outputs.aws_console_url,
      iamUsername: outputs.iam_username || iamUsername,
      region,
      provisioningMessage: 'Access successfully provisioned via Terraform',
      temporaryPassword: outputs.temporary_password,
      awsConsoleSigninUrl: outputs.aws_console_signin_url,
    });

    markJobCompleted(jobId);
    console.log(`[${timestamp()}] [Worker] Job ${jobId}: Terraform completed for ${requestId} → IAM: ${outputs.iam_username}, Bucket: ${outputs.bucket_name}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown Terraform error';
    // Truncate very long error messages (Terraform output can be verbose)
    const truncatedError = errorMessage.length > 500 ? errorMessage.slice(0, 500) + '...' : errorMessage;

    markJobFailed(jobId, truncatedError);
    updateRequestStatus(requestId, 'failed');
    console.error(`[${timestamp()}] [Worker] Job ${jobId}: Terraform FAILED for ${requestId}`);
    console.error(`[${timestamp()}] [Worker] Error: ${truncatedError}`);
  }
}

function timestamp(): string {
  return new Date().toISOString();
}
