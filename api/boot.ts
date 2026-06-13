import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { registerWhatsAppWebhook } from "./whatsapp/webhook";

console.log("[BOOT] Starting SimpliPlan...");

const app = new Hono();
const port = 3000;
const PUBLIC_DIR = path.resolve("dist/public");

// Pre-compress all static assets at startup
const COMPRESSED_CACHE = new Map<string, Buffer>();

function precompressAssets() {
  const assetsDir = path.join(PUBLIC_DIR, "assets");
  if (!fs.existsSync(assetsDir)) return;

  const files = fs.readdirSync(assetsDir);
  let total = 0;
  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && stat.size > 1024) {
      const content = fs.readFileSync(filePath);
      const compressed = zlib.gzipSync(content, { level: 9 });
      COMPRESSED_CACHE.set(`/assets/${file}`, compressed);
      total++;
    }
  }
  console.log(`[BOOT] Pre-compressed ${total} assets`);
}

precompressAssets();

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
    const res = await fetchRequestHandler({ endpoint: "/api/trpc", req: c.req.raw, router: appRouter, createContext });
    // Clone response and add CORS headers for cross-origin frontend
    const headers = new Headers(res.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return new Response(res.body, { status: res.status, headers });
  });
  apiReady = true;
  console.log("[BOOT] API ready");
} catch (e: any) {
  console.error("[BOOT] API fail:", e.message);
  app.use("/api/trpc/*", (c) => {
    c.header("Access-Control-Allow-Origin", "*");
    return c.json({ error: "API unavailable", message: e.message }, 503);
  });
}

// WhatsApp webhook (must be BEFORE static files catch-all)
registerWhatsAppWebhook(app);

// Static files with gzip compression
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  let filePath = path.join(PUBLIC_DIR, url.pathname);

  // Default to index.html for SPA routes
  if (url.pathname === "/" || !fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_DIR, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    return next();
  }

  const ext = path.extname(filePath);
  const mimeTypes: Record<string, string> = {
    ".js": "text/javascript",
    ".css": "text/css",
    ".html": "text/html",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  // Check if we have a pre-compressed version
  const relativePath = url.pathname === "/" ? "/index.html" : url.pathname;
  const compressed = COMPRESSED_CACHE.get(relativePath);

  if (compressed) {
    c.header("Content-Type", contentType);
    c.header("Content-Encoding", "gzip");
    c.header("Content-Length", compressed.length.toString());
    c.header("Cache-Control", "public, max-age=31536000, immutable");
    return c.body(compressed);
  }

  // Serve uncompressed for small files / images
  const content = fs.readFileSync(filePath);
  c.header("Content-Type", contentType);
  return c.body(content);
});

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`[BOOT] Running on port ${port}`);
});
// WhatsApp bot + webhook registered above
