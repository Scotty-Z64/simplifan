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
    console.log("[DB] Connecting... URL length:", url?.length || 0);
    console.log("[DB] URL prefix:", url?.substring(0, 40) || "EMPTY");
    
    try {
      const pool = createPool({
        uri: url,
        connectionLimit: 3,
        connectTimeout: 15000,
        acquireTimeout: 15000,
        enableKeepAlive: true,
      });
      
      instance = drizzle(pool, {
        schema: fullSchema,
        mode: "default",
      });
      
      console.log("[DB] Drizzle instance created successfully");
    } catch (e: any) {
      console.error("[DB] FAILED to create pool:", e.message);
      throw e;
    }
  }
  return instance;
}
