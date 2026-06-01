import { Router } from 'express';
import type { Request, Response } from 'express';
import { getNextRequestId, createRequest, getAllRequests, updateRequestStatus, createProvisioningJob, getJobsByRequestId } from '../db.js';
import { deriveProjectIdentifier } from '../terraform-executor.js';
import type { CreateRequestBody } from '../types.js';

const router = Router();

// POST /api/requests — Create a new request
router.post('/', (req: Request, res: Response) => {
  const {
    accountName,
    awsAccount,
    environment,
    bucketName,
    filePath,
    justification,
    notificationEmails,
  } = req.body as CreateRequestBody;

  // Basic validation
  if (!accountName || !awsAccount || !environment || !bucketName || !justification || !notificationEmails) {
    res.status(400).json({
      error: 'Missing required fields',
      message: 'Please provide all required fields: accountName, awsAccount, environment, bucketName, justification, notificationEmails',
    });
    return;
  }

  try {
    const requestId = getNextRequestId();

    // Derive project name from AWS account name
    const projectName = deriveProjectIdentifier(accountName);

    const emailsStr = Array.isArray(notificationEmails)
      ? notificationEmails.join(', ')
      : String(notificationEmails);

    createRequest({
      requestId,
      projectName,
      awsAccountNumber: awsAccount,
      environment,
      accessTarget: bucketName,
      notificationEmails: emailsStr,
      justification,
      filePath: filePath || null,
    });

    console.log(`[${new Date().toISOString()}] New request created: ${requestId} (account: ${accountName}, project: ${projectName})`);

    res.status(201).json({
      success: true,
      requestId,
      message: 'Request submitted successfully',
    });
  } catch (err) {
    console.error('Failed to create request:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to save request. Please try again.',
    });
  }
});

// GET /api/requests — List all requests
router.get('/', (_req: Request, res: Response) => {
  try {
    const requests = getAllRequests();
    res.json({ requests, total: requests.length });
  } catch (err) {
    console.error('Failed to fetch requests:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve requests.',
    });
  }
});

// GET /api/requests/:requestId/jobs — Get provisioning jobs for a request
router.get('/:requestId/jobs', (req: Request, res: Response) => {
  const requestId = req.params.requestId as string;
  try {
    const jobs = getJobsByRequestId(requestId);
    res.json({ jobs });
  } catch (err) {
    console.error('Failed to fetch jobs:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve provisioning jobs.',
    });
  }
});

// PATCH /api/requests/:requestId/status — Update request status
router.patch('/:requestId/status', (req: Request, res: Response) => {
  const requestId = req.params.requestId as string;
  const { status } = req.body;

  const validStatuses = ['pending', 'approved', 'rejected', 'provisioning', 'completed', 'failed'];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({
      error: 'Invalid status',
      message: `Status must be one of: ${validStatuses.join(', ')}`,
    });
    return;
  }

  try {
    const updated = updateRequestStatus(requestId, status);

    if (!updated) {
      res.status(404).json({
        error: 'Not found',
        message: `Request ${requestId} not found`,
      });
      return;
    }

    console.log(`[${new Date().toISOString()}] Request ${requestId} status updated to: ${status}`);

    // When approved, create a provisioning job (worker will pick it up)
    if (status === 'approved') {
      createProvisioningJob(requestId);
      console.log(`[${new Date().toISOString()}] Provisioning job created for ${requestId}`);
    }

    res.json({
      success: true,
      requestId,
      status,
      message: `Request ${requestId} has been ${status}`,
    });
  } catch (err) {
    console.error('Failed to update request status:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update request status.',
    });
  }
});

export { router as requestsRouter };
