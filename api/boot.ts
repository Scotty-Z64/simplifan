import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import fs from "fs";
import path from "path";
import { appRouter } from "./router";
import { createContext } from "./context";

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
