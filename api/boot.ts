import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import fs from "fs";
import path from "path";
import { appRouter } from "./router";
import { createContext } from "./context";

// Test database connection at startup
console.log("[BOOT] Starting SimpliPlan...");
try {
  const { getDb } = await import("./queries/connection");
  const db = getDb();
  const { vendors } = await import("@db/schema");
  const { count } = await import("drizzle-orm");
  const result = await db.select({ count: count() }).from(vendors);
  console.log("[BOOT] DB connected! Vendors:", result[0]?.count ?? "unknown");
} catch (e: any) {
  console.error("[BOOT] DB CONNECTION FAILED:", e.message);
  console.error("[BOOT] Full error:", e.stack?.substring(0, 500) || e);
}

const app = new Hono();
const port = 3000;

// CORS
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (c.req.method === "OPTIONS") return c.text("", 204);
  await next();
});

// Health
app.get("/api/trpc/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/health", (c) => c.json({ status: "ok", time: new Date().toISOString() }));
app.get("/version", (c) => c.json({ version: "1.0.2", port: 3000, ts: Date.now() }));

// tRPC API
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({ endpoint: "/api/trpc", req: c.req.raw, router: appRouter, createContext });
});

// Static files
app.use("*", serveStatic({ root: "dist/public" }));
app.notFound((c) => {
  try {
    const html = fs.readFileSync(path.resolve("dist/public/index.html"), "utf-8");
    return c.html(html);
  } catch {
    return c.json({ error: "Not found" }, 404);
  }
});

// Start
serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`[BOOT] Running on port ${port}`);
});
