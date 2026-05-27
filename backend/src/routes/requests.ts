import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// In-memory store
interface StoredRequest {
  requestId: string;
  projectName: string;
  awsAccount: string;
  environment: string;
  bucketName: string;
  filePath?: string;
  justification: string;
  notificationEmails: string[];
  createdAt: string;
}

const requests: StoredRequest[] = [];
let requestCounter = 1001;

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
  } = req.body;

  // Basic validation
  if (!projectName || !awsAccount || !environment || !bucketName || !justification || !notificationEmails) {
    res.status(400).json({
      error: 'Missing required fields',
      message: 'Please provide all required fields: projectName, awsAccount, environment, bucketName, justification, notificationEmails',
    });
    return;
  }

  // Generate request ID
  const requestId = `CSH-${requestCounter++}`;

  const newRequest: StoredRequest = {
    requestId,
    projectName,
    awsAccount,
    environment,
    bucketName,
    filePath: filePath || undefined,
    justification,
    notificationEmails: Array.isArray(notificationEmails) ? notificationEmails : [notificationEmails],
    createdAt: new Date().toISOString(),
  };

  requests.push(newRequest);

  console.log(`[${new Date().toISOString()}] New request created: ${requestId} for ${projectName}`);

  res.status(201).json({
    success: true,
    requestId,
    message: 'Request submitted successfully',
  });
});

// GET /api/requests — List all requests (for debugging)
router.get('/', (_req: Request, res: Response) => {
  res.json({ requests, total: requests.length });
});

export { router as requestsRouter };
