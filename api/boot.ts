import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import fs from "fs";
import path from "path";
import { Paths } from "@contracts/constants";

const app = new Hono();
const port = parseInt(process.env.PORT || "3000");

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

// OAuth
try {
  const { createOAuthCallbackHandler } = await import("./kimi/auth");
  app.get(Paths.oauthCallback, createOAuthCallbackHandler());
} catch (e) {
  console.warn("[BOOT] OAuth skip:", (e as Error).message);
}

// tRPC
let apiReady = false;
try {
  const { appRouter } = await import("./router");
  const { createContext } = await import("./context");
  app.use("/api/trpc/*", async (c) => {
    return fetchRequestHandler({ endpoint: "/api/trpc", req: c.req.raw, router: appRouter, createContext });
  });
  apiReady = true;
  console.log("[BOOT] API ready");
} catch (e) {
  console.error("[BOOT] API fail:", (e as Error).message);
  app.use("/api/trpc/*", (c) => c.json({ error: "API unavailable" }, 503));
}

// Static files
const publicPath = path.resolve(process.cwd(), "dist/public");
app.use("*", serveStatic({ root: "dist/public" }));
app.notFound((c) => {
  try {
    const html = fs.readFileSync(path.resolve(publicPath, "index.html"), "utf-8");
    return c.html(html);
  } catch {
    return c.json({ error: "Not found" }, 404);
  }
});

// Start
console.log(`[BOOT] Starting on port ${port}...`);
serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`[BOOT] Running on http://0.0.0.0:${port}`);
});
