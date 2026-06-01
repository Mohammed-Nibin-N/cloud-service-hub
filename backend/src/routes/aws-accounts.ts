import { Router } from 'express';
import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.resolve(__dirname, '..', '..', 'config', 'awsAccounts.json');

const router = Router();

export interface AwsAccount {
  accountName: string;
  accountNumber: string;
  environment: string;
  buckets: string[];
}

function loadAccounts(): AwsAccount[] {
  const raw = readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw) as AwsAccount[];
}

// GET /api/aws-accounts — Return configured AWS accounts
router.get('/', (_req: Request, res: Response) => {
  try {
    const accounts = loadAccounts();
    res.json({ accounts });
  } catch (err) {
    console.error('Failed to load AWS accounts config:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to load AWS accounts configuration.',
    });
  }
});

export { router as awsAccountsRouter };
