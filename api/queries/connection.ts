import { drizzle } from "drizzle-orm/mysql2";
import { createPool, Pool } from "mysql2/promise";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let pool: Pool;
let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

function parseDbUrl(url: string) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) return null;
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  };
}

export function getDb() {
  if (!instance) {
    const url = env.databaseUrl;
    console.log("[DB] Creating pool...");
    
    const parsed = parseDbUrl(url);
    if (!parsed) throw new Error("Failed to parse DATABASE_URL");
    
    console.log("[DB] Host:", parsed.host, "Port:", parsed.port);
    
    pool = createPool({
      host: parsed.host,
      port: parsed.port,
      user: parsed.user,
      password: parsed.password,
      database: parsed.database,
      connectionLimit: 3,
      connectTimeout: 10000,
      enableKeepAlive: true,
    });
    
    instance = drizzle(pool, { schema: fullSchema, mode: "default" });
    console.log("[DB] Pool created");
  }
  return instance;
}

// Export pool for raw SQL queries
export function getPool(): Pool {
  getDb(); // Ensure pool is created
  return pool;
}

// Test connection
export async function testConnection() {
  const p = getPool();
  try {
    const [rows] = await p.execute("SELECT COUNT(*) as count FROM vendors");
    console.log("[DB] Connection OK! Vendors:", (rows as any)[0].count);
    return true;
  } catch (e: any) {
    console.error("[DB] Connection FAILED:", e.message);
    return false;
  }
}
