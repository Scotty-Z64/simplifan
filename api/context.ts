import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";

// Lazy import auth to prevent startup crash
type AuthFn = typeof import("./kimi/auth").authenticateRequest;
let authenticateRequest: AuthFn | null = null;

try {
  const auth = await import("./kimi/auth");
  authenticateRequest = auth.authenticateRequest;
} catch (e: any) {
  console.error("[CONTEXT] Auth module failed to load:", e.message);
  console.error("[CONTEXT] Stack:", e.stack?.split("\n")?.slice(0, 3)?.join("\n"));
}

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };
  if (!authenticateRequest) return ctx;
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // Authentication is optional
  }
  return ctx;
}
