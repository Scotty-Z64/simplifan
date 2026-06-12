// ─── In-Memory Session Store for WhatsApp Conversations ───
// Persists to SQLite for restart recovery

import { getPool } from "../queries/connection";

export interface WASession {
  phone: string;
  name: string;
  step: number; // 0=greeting, 1=name, 2=eventType, 3=province, 4=date, 5=guests, 6=budget, 7=confirm, 8=done
  data: Record<string, any>;
  lastActivity: number;
}

const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

function getDb() {
  return getPool();
}

// Ensure table exists
export function initSessionsTable() {
  const db = getDb();
  db.exec(`CREATE TABLE IF NOT EXISTS wa_sessions (
    phone TEXT PRIMARY KEY,
    name TEXT,
    step INTEGER DEFAULT 0,
    data TEXT DEFAULT '{}',
    lastActivity INTEGER DEFAULT (unixepoch())
  )`);
}

export function getSession(phone: string): WASession | null {
  const db = getDb();
  const row = db.prepare(
    "SELECT * FROM wa_sessions WHERE phone = ? AND lastActivity > ?"
  ).get(phone, Math.floor(Date.now() / 1000) - 1800) as any;

  if (!row) return null;

  return {
    phone: row.phone,
    name: row.name || "",
    step: row.step || 0,
    data: row.data ? JSON.parse(row.data) : {},
    lastActivity: row.lastActivity,
  };
}

export function saveSession(session: WASession) {
  const db = getDb();
  session.lastActivity = Math.floor(Date.now() / 1000);

  db.prepare(
    `INSERT OR REPLACE INTO wa_sessions (phone, name, step, data, lastActivity)
     VALUES (?, ?, ?, ?, ?)`
  ).run(session.phone, session.name, session.step, JSON.stringify(session.data), session.lastActivity);
}

export function clearSession(phone: string) {
  const db = getDb();
  db.prepare("DELETE FROM wa_sessions WHERE phone = ?").run(phone);
}

export function resetSession(phone: string, name: string): WASession {
  const session: WASession = {
    phone,
    name,
    step: 0,
    data: {},
    lastActivity: Math.floor(Date.now() / 1000),
  };
  saveSession(session);
  return session;
}
