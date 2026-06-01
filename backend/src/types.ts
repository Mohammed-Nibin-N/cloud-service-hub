export interface AccessRequest {
  id: number;
  requestId: string;
  projectName: string;
  awsAccountNumber: string;
  environment: string;
  accessTarget: string;
  notificationEmails: string;
  justification: string;
  filePath: string | null;
  createdAt: string;
  status: string;
  awsConsoleUrl: string | null;
  iamUsername: string | null;
  region: string | null;
  provisioningMessage: string | null;
  temporaryPassword: string | null;
  awsConsoleSigninUrl: string | null;
}

export interface ProvisioningJob {
  id: number;
  requestId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
}

export interface CreateRequestBody {
  accountName: string;
  awsAccount: string;
  environment: string;
  bucketName: string;
  filePath?: string;
  justification: string;
  notificationEmails: string[];
}
