import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb() {
  if (!instance) {
    const url = env.databaseUrl;
    console.log("[DB] Connecting with URL:", url ? url.substring(0, 30) + "..." : "EMPTY");
    
    // Create connection pool for regular MySQL
    const pool = createPool({
      uri: url,
      connectionLimit: 5,
      connectTimeout: 10000,
      enableKeepAlive: true,
    });
    
    instance = drizzle(pool, {
      schema: fullSchema,
      mode: "default", // Use regular MySQL mode, not PlanetScale
    });
  }
  return instance;
}
