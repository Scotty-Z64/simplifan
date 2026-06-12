import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

function parseDbUrl(url: string) {
  // mysql://user:pass@host:port/dbname
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    console.error("[DB] Failed to parse URL");
    return null;
  }
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
    console.log("[DB] Connecting...");
    
    const parsed = parseDbUrl(url);
    if (!parsed) {
      throw new Error("Failed to parse DATABASE_URL");
    }
    
    console.log("[DB] Host:", parsed.host);
    console.log("[DB] Port:", parsed.port);
    console.log("[DB] User:", parsed.user);
    console.log("[DB] Database:", parsed.database);
    
    const pool = createPool({
      host: parsed.host,
      port: parsed.port,
      user: parsed.user,
      password: parsed.password,
      database: parsed.database,
      connectionLimit: 3,
      connectTimeout: 15000,
      enableKeepAlive: true,
    });
    
    instance = drizzle(pool, {
      schema: fullSchema,
      mode: "default",
    });
    
    console.log("[DB] Pool created");
  }
  return instance;
}
