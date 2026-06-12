import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { compress } from "hono/compress";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import fs from "fs";
import path from "path";

console.log("[BOOT] Starting SimpliPlan...");

const app = new Hono();
const port = 3000;

// Enable gzip compression for all responses
app.use("*", compress());

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

// tRPC API
let apiReady = false;
try {
  const { appRouter } = await import("./router");
  const { createContext } = await import("./context");
  app.use("/api/trpc/*", async (c) => {
    return fetchRequestHandler({ endpoint: "/api/trpc", req: c.req.raw, router: appRouter, createContext });
  });
  apiReady = true;
  console.log("[BOOT] API ready");
} catch (e: any) {
  console.error("[BOOT] API fail:", e.message);
  app.use("/api/trpc/*", (c) => c.json({ error: "API unavailable", message: e.message }, 503));
}

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

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`[BOOT] Running on port ${port}`);
});
