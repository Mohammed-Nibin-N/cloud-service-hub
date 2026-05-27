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
}

export interface CreateRequestBody {
  projectName: string;
  awsAccount: string;
  environment: string;
  bucketName: string;
  filePath?: string;
  justification: string;
  notificationEmails: string[];
}
