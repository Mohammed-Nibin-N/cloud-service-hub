import Database, { type Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
import type { AccessRequest, ProvisioningJob } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'requests.db');

// Ensure data directory exists
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db: DatabaseType = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// ─── Requests table ───────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requestId TEXT NOT NULL UNIQUE,
    projectName TEXT NOT NULL,
    awsAccountNumber TEXT NOT NULL,
    environment TEXT NOT NULL,
    accessTarget TEXT NOT NULL,
    notificationEmails TEXT NOT NULL,
    justification TEXT NOT NULL,
    filePath TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'pending',
    awsConsoleUrl TEXT,
    iamUsername TEXT,
    region TEXT,
    provisioningMessage TEXT
  )
`);

// Migration: add provisioning columns if missing
const columns = db.prepare("PRAGMA table_info(requests)").all() as { name: string }[];
const columnNames = columns.map((c) => c.name);
if (!columnNames.includes('awsConsoleUrl')) db.exec('ALTER TABLE requests ADD COLUMN awsConsoleUrl TEXT');
if (!columnNames.includes('iamUsername')) db.exec('ALTER TABLE requests ADD COLUMN iamUsername TEXT');
if (!columnNames.includes('region')) db.exec('ALTER TABLE requests ADD COLUMN region TEXT');
if (!columnNames.includes('provisioningMessage')) db.exec('ALTER TABLE requests ADD COLUMN provisioningMessage TEXT');
if (!columnNames.includes('temporaryPassword')) db.exec('ALTER TABLE requests ADD COLUMN temporaryPassword TEXT');
if (!columnNames.includes('awsConsoleSigninUrl')) db.exec('ALTER TABLE requests ADD COLUMN awsConsoleSigninUrl TEXT');

// ─── Provisioning Jobs table ──────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS provisioning_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requestId TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    startedAt TEXT,
    completedAt TEXT,
    errorMessage TEXT,
    FOREIGN KEY (requestId) REFERENCES requests(requestId)
  )
`);

// ─── Prepared statements: Requests ────────────────────────────────────────────

const insertRequestStmt = db.prepare(`
  INSERT INTO requests (requestId, projectName, awsAccountNumber, environment, accessTarget, notificationEmails, justification, filePath, createdAt, status)
  VALUES (@requestId, @projectName, @awsAccountNumber, @environment, @accessTarget, @notificationEmails, @justification, @filePath, @createdAt, @status)
`);

const getAllRequestsStmt = db.prepare(`SELECT * FROM requests ORDER BY id DESC`);
const getNextIdStmt = db.prepare(`SELECT MAX(id) as maxId FROM requests`);
const updateStatusStmt = db.prepare(`UPDATE requests SET status = @status WHERE requestId = @requestId`);
const getByRequestIdStmt = db.prepare(`SELECT * FROM requests WHERE requestId = @requestId`);

const completeProvisioningStmt = db.prepare(`
  UPDATE requests
  SET status = @status, awsConsoleUrl = @awsConsoleUrl, iamUsername = @iamUsername, region = @region, provisioningMessage = @provisioningMessage, temporaryPassword = @temporaryPassword, awsConsoleSigninUrl = @awsConsoleSigninUrl
  WHERE requestId = @requestId
`);

// ─── Prepared statements: Jobs ────────────────────────────────────────────────

const insertJobStmt = db.prepare(`
  INSERT INTO provisioning_jobs (requestId, status, createdAt)
  VALUES (@requestId, 'pending', @createdAt)
`);

const getOldestPendingJobStmt = db.prepare(`
  SELECT * FROM provisioning_jobs WHERE status = 'pending' ORDER BY id ASC LIMIT 1
`);

const markJobRunningStmt = db.prepare(`
  UPDATE provisioning_jobs SET status = 'running', startedAt = @startedAt WHERE id = @id
`);

const markJobCompletedStmt = db.prepare(`
  UPDATE provisioning_jobs SET status = 'completed', completedAt = @completedAt WHERE id = @id
`);

const markJobFailedStmt = db.prepare(`
  UPDATE provisioning_jobs SET status = 'failed', completedAt = @completedAt, errorMessage = @errorMessage WHERE id = @id
`);

const getJobsByRequestIdStmt = db.prepare(`
  SELECT * FROM provisioning_jobs WHERE requestId = @requestId ORDER BY id DESC
`);

// ─── Request functions ────────────────────────────────────────────────────────

export function getNextRequestId(): string {
  const row = getNextIdStmt.get() as { maxId: number | null };
  const nextNum = (row.maxId || 0) + 1001;
  return `CSH-${nextNum}`;
}

export function createRequest(data: {
  requestId: string;
  projectName: string;
  awsAccountNumber: string;
  environment: string;
  accessTarget: string;
  notificationEmails: string;
  justification: string;
  filePath: string | null;
}): AccessRequest {
  const createdAt = new Date().toISOString();
  const status = 'pending';

  insertRequestStmt.run({ ...data, createdAt, status });

  return {
    id: 0,
    ...data,
    createdAt,
    status,
    awsConsoleUrl: null,
    iamUsername: null,
    region: null,
    provisioningMessage: null,
    temporaryPassword: null,
    awsConsoleSigninUrl: null,
  };
}

export function getAllRequests(): AccessRequest[] {
  return getAllRequestsStmt.all() as AccessRequest[];
}

export function getRequestById(requestId: string): AccessRequest | undefined {
  return getByRequestIdStmt.get({ requestId }) as AccessRequest | undefined;
}

export function updateRequestStatus(requestId: string, status: string): boolean {
  const result = updateStatusStmt.run({ requestId, status });
  return result.changes > 0;
}

export function completeProvisioning(requestId: string, data: {
  awsConsoleUrl: string;
  iamUsername: string;
  region: string;
  provisioningMessage: string;
  temporaryPassword: string;
  awsConsoleSigninUrl: string;
}): boolean {
  const result = completeProvisioningStmt.run({ requestId, status: 'completed', ...data });
  return result.changes > 0;
}

// ─── Job functions ────────────────────────────────────────────────────────────

export function createProvisioningJob(requestId: string): void {
  insertJobStmt.run({ requestId, createdAt: new Date().toISOString() });
}

export function getOldestPendingJob(): ProvisioningJob | undefined {
  return getOldestPendingJobStmt.get() as ProvisioningJob | undefined;
}

export function markJobRunning(jobId: number): void {
  markJobRunningStmt.run({ id: jobId, startedAt: new Date().toISOString() });
}

export function markJobCompleted(jobId: number): void {
  markJobCompletedStmt.run({ id: jobId, completedAt: new Date().toISOString() });
}

export function markJobFailed(jobId: number, errorMessage: string): void {
  markJobFailedStmt.run({ id: jobId, completedAt: new Date().toISOString(), errorMessage });
}

export function getJobsByRequestId(requestId: string): ProvisioningJob[] {
  return getJobsByRequestIdStmt.all({ requestId }) as ProvisioningJob[];
}

export default db;
