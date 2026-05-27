import { Router } from 'express';
import type { Request, Response } from 'express';
import { getNextRequestId, createRequest, getAllRequests } from '../db.js';
import type { CreateRequestBody } from '../types.js';

const router = Router();

// POST /api/requests — Create a new request
router.post('/', (req: Request, res: Response) => {
  const {
    projectName,
    awsAccount,
    environment,
    bucketName,
    filePath,
    justification,
    notificationEmails,
  } = req.body as CreateRequestBody;

  // Basic validation
  if (!projectName || !awsAccount || !environment || !bucketName || !justification || !notificationEmails) {
    res.status(400).json({
      error: 'Missing required fields',
      message: 'Please provide all required fields: projectName, awsAccount, environment, bucketName, justification, notificationEmails',
    });
    return;
  }

  try {
    const requestId = getNextRequestId();

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

    console.log(`[${new Date().toISOString()}] New request created: ${requestId} for ${projectName}`);

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

export { router as requestsRouter };
