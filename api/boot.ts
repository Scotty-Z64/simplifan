import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

// ─── Health check (no dependencies) ───
app.get("/api/trpc/ping", (c) => c.json({ ok: true, ts: Date.now() }));
app.get("/health", (c) => c.json({ status: "ok", time: new Date().toISOString() }));
app.get("/", (c) => c.json({ message: "SimpliPlan API is running" }));

// ─── Body limit ───
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// ─── OAuth callback ───
try {
  const { createOAuthCallbackHandler } = await import("./kimi/auth");
  app.get(Paths.oauthCallback, createOAuthCallbackHandler());
} catch (e) {
  console.warn("[BOOT] OAuth not configured:", (e as Error).message);
}

// ─── tRPC API ───
let apiReady = false;
try {
  const { appRouter } = await import("./router");
  const { createContext } = await import("./context");
  
  app.use("/api/trpc/*", async (c) => {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext,
    });
  });
  apiReady = true;
  console.log("[BOOT] tRPC API loaded successfully");
} catch (e) {
  console.error("[BOOT] tRPC API failed to load:", (e as Error).message);
  app.use("/api/trpc/*", (c) => {
    return c.json({ 
      error: "API temporarily unavailable", 
      details: process.env.DEBUG ? (e as Error).message : undefined 
    }, 503);
  });
}

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// ─── Production server ───
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  console.log("[BOOT] Starting in PRODUCTION mode");
  console.log("[BOOT] API ready:", apiReady);
  console.log("[BOOT] PORT:", process.env.PORT || "3000");
  
  try {
    const { serve } = await import("@hono/node-server");
    const { serveStaticFiles } = await import("./lib/vite");
    serveStaticFiles(app);
    
    const port = parseInt(process.env.PORT || "3000");
    serve({ fetch: app.fetch, port }, () => {
      console.log(`[BOOT] Server running on port ${port}`);
    });
  } catch (e) {
    console.error("[BOOT] Failed to start server:", (e as Error).message);
    // Exit gracefully so Railway knows it failed
    process.exit(1);
  }
}

export default app;
