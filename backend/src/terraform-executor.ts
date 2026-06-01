import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TERRAFORM_DIR = path.resolve(__dirname, '..', '..', 'terraform');

export interface TerraformVars {
  project_name: string;
  environment: string;
  bucket_name: string;
  iam_username: string;
  aws_account_id: string;
  aws_region?: string;
}

export interface TerraformOutputs {
  iam_username: string;
  aws_console_url: string;
  aws_console_signin_url: string;
  temporary_password: string;
  bucket_name: string;
  s3_bucket_arn: string;
}

/**
 * Derives a project identifier from an AWS account name.
 * Strips environment suffixes (prod, nonprod, non-prod) and sanitizes.
 * Examples:
 *   "Dealer Sales Portal Non-Prod" → "dealersalesportal"
 *   "GoodyearCare Prod" → "goodyearcare"
 */
export function deriveProjectIdentifier(accountName: string): string {
  return accountName
    .toLowerCase()
    .replace(/\b(non-?prod|prod)\b/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .replace(/^-|-$/g, '');
}

/**
 * Generates a unique IAM username from project name and request ID.
 * Convention: <projectname>_<requestid>_datauploader
 * Examples:
 *   "Dealer Sales Portal Non-Prod", "CSH-1001" → "dealersalesportal_csh1001_datauploader"
 *   "GoodyearCare Prod", "CSH-1002" → "goodyearcare_csh1002_datauploader"
 */
export function generateIamUsername(accountName: string, requestId: string): string {
  const sanitizedProject = deriveProjectIdentifier(accountName);
  const sanitizedRequestId = requestId.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${sanitizedProject}_${sanitizedRequestId}_datauploader`;
}

/**
 * Writes a temporary .tfvars file for the Terraform run.
 * Returns the file path.
 */
function writeTfvars(vars: TerraformVars): string {
  const tfvarsPath = path.join(TERRAFORM_DIR, `auto-${Date.now()}.tfvars`);

  const content = [
    `project_name   = "${vars.project_name}"`,
    `environment    = "${vars.environment}"`,
    `bucket_name    = "${vars.bucket_name}"`,
    `iam_username   = "${vars.iam_username}"`,
    `aws_account_id = "${vars.aws_account_id}"`,
    `aws_region     = "${vars.aws_region || 'us-east-1'}"`,
  ].join('\n');

  writeFileSync(tfvarsPath, content, 'utf-8');
  return tfvarsPath;
}

/**
 * Cleans up a temporary tfvars file.
 */
function cleanupTfvars(tfvarsPath: string): void {
  try {
    if (existsSync(tfvarsPath)) {
      unlinkSync(tfvarsPath);
    }
  } catch {
    // Non-critical — log but don't throw
    console.warn(`[Terraform] Warning: Could not clean up ${tfvarsPath}`);
  }
}

/**
 * Runs terraform init if .terraform directory doesn't exist.
 */
function ensureInit(): void {
  const terraformStateDir = path.join(TERRAFORM_DIR, '.terraform');
  if (!existsSync(terraformStateDir)) {
    console.log(`[${timestamp()}] [Terraform] Running terraform init...`);
    const output = execSync('terraform init -no-color', {
      cwd: TERRAFORM_DIR,
      encoding: 'utf-8',
      timeout: 60000,
    });
    console.log(`[${timestamp()}] [Terraform] Init completed`);
    console.log(output);
  }
}

/**
 * Runs terraform apply with the given vars file.
 */
function runApply(tfvarsPath: string): string {
  const varFile = path.basename(tfvarsPath);
  console.log(`[${timestamp()}] [Terraform] Running terraform apply -auto-approve -var-file="${varFile}"...`);

  const output = execSync(
    `terraform apply -auto-approve -no-color -var-file="${varFile}"`,
    {
      cwd: TERRAFORM_DIR,
      encoding: 'utf-8',
      timeout: 300000, // 5 minute timeout
    }
  );

  console.log(`[${timestamp()}] [Terraform] Apply completed`);
  return output;
}

/**
 * Captures terraform output values as JSON.
 */
function captureOutputs(): TerraformOutputs {
  const outputJson = execSync('terraform output -json -no-color', {
    cwd: TERRAFORM_DIR,
    encoding: 'utf-8',
    timeout: 30000,
  });

  const parsed = JSON.parse(outputJson);

  return {
    iam_username: parsed.iam_username?.value || '',
    aws_console_url: parsed.aws_console_url?.value || '',
    aws_console_signin_url: parsed.aws_console_signin_url?.value || '',
    temporary_password: parsed.temporary_password?.value || '',
    bucket_name: parsed.bucket_name?.value || parsed.s3_bucket_name?.value || '',
    s3_bucket_arn: parsed.s3_bucket_arn?.value || '',
  };
}

/**
 * Executes the full Terraform provisioning workflow:
 * 1. Write temp tfvars
 * 2. terraform init (if needed)
 * 3. terraform apply -auto-approve
 * 4. Capture outputs
 * 5. Clean up tfvars
 */
export async function executeTerraform(vars: TerraformVars): Promise<TerraformOutputs> {
  let tfvarsPath = '';

  try {
    // Write temporary tfvars
    tfvarsPath = writeTfvars(vars);
    console.log(`[${timestamp()}] [Terraform] Generated tfvars: ${path.basename(tfvarsPath)}`);

    // Ensure terraform is initialized
    ensureInit();

    // Run apply
    runApply(tfvarsPath);

    // Capture outputs
    const outputs = captureOutputs();
    console.log(`[${timestamp()}] [Terraform] Outputs captured: IAM=${outputs.iam_username}, Bucket=${outputs.bucket_name}`);

    return outputs;
  } finally {
    // Always clean up temp tfvars
    if (tfvarsPath) {
      cleanupTfvars(tfvarsPath);
      console.log(`[${timestamp()}] [Terraform] Cleaned up temp tfvars`);
    }
  }
}

function timestamp(): string {
  return new Date().toISOString();
}
