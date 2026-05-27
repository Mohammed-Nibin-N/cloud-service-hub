import Database, { type Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AccessRequest } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'requests.db');

// Ensure data directory exists
import { mkdirSync } from 'fs';
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db: DatabaseType = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create table if not exists
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
    status TEXT NOT NULL DEFAULT 'pending'
  )
`);

// Prepared statements
const insertStmt = db.prepare(`
  INSERT INTO requests (requestId, projectName, awsAccountNumber, environment, accessTarget, notificationEmails, justification, filePath, createdAt, status)
  VALUES (@requestId, @projectName, @awsAccountNumber, @environment, @accessTarget, @notificationEmails, @justification, @filePath, @createdAt, @status)
`);

const getAllStmt = db.prepare(`SELECT * FROM requests ORDER BY id DESC`);

const getNextIdStmt = db.prepare(`SELECT MAX(id) as maxId FROM requests`);

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

  insertStmt.run({
    ...data,
    createdAt,
    status,
  });

  return {
    id: 0, // will be set by DB
    ...data,
    createdAt,
    status,
  };
}

export function getAllRequests(): AccessRequest[] {
  return getAllStmt.all() as AccessRequest[];
}

export default db;
