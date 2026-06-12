// ─── WhatsApp Webhook Handler ───
// Receives messages from Meta's WhatsApp Cloud API

import type { Hono } from "hono";
import { handleIncomingMessage } from "./conversation-engine";
import { initSessionsTable } from "./session-store";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "simplipan-dev-token";

export function registerWhatsAppWebhook(app: Hono) {
  // Initialize sessions table
  initSessionsTable();

  // ─── GET /api/webhook/whatsapp ───
  // Meta verifies this endpoint when you configure the webhook
  app.get("/api/webhook/whatsapp", (c) => {
    const mode = c.req.query("hub.mode");
    const token = c.req.query("hub.verify_token");
    const challenge = c.req.query("hub.challenge");

    console.log("[WhatsApp Webhook] Verification attempt:", { mode, token });

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[WhatsApp Webhook] ✅ Verified successfully");
      return new Response(challenge || "OK", { status: 200 });
    }

    console.log("[WhatsApp Webhook] ❌ Verification failed");
    return c.json({ error: "Verification failed" }, 403);
  });

  // ─── POST /api/webhook/whatsapp ───
  // Receives actual messages from WhatsApp
  app.post("/api/webhook/whatsapp", async (c) => {
    try {
      const body = await c.req.json();
      console.log("[WhatsApp Webhook] Received message:", JSON.stringify(body, null, 2));

      // Extract messages from the payload
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};
          const messages = value.messages || [];

          for (const message of messages) {
            const from = message.from; // Phone number
            const type = message.type;

            let textContent = "";

            if (type === "text" && message.text) {
              textContent = message.text.body;
            } else if (type === "interactive" && message.interactive) {
              // User tapped a list button
              if (message.interactive.type === "list_reply") {
                textContent = message.interactive.list_reply.id;
              } else if (message.interactive.type === "button_reply") {
                textContent = message.interactive.button_reply.id;
              }
            }

            if (from && textContent) {
              // Get sender name if available
              const contacts = value.contacts || [];
              const contact = contacts.find((c: any) => c.wa_id === from);
              const name = contact?.profile?.name || undefined;

              // Process the message asynchronously (don't block response)
              handleIncomingMessage(from, textContent, name).catch(err => {
                console.error("[WhatsApp Webhook] Message handling error:", err);
              });
            }
          }
        }
      }

      // Always return 200 to Meta (otherwise they retry)
      return c.json({ status: "received" }, 200);
    } catch (err: any) {
      console.error("[WhatsApp Webhook] Error:", err.message);
      // Still return 200 to prevent Meta retries
      return c.json({ status: "error", message: err.message }, 200);
    }
  });

  // ─── Health check for webhook ───
  app.get("/api/webhook/whatsapp/health", (c) => {
    return c.json({
      status: "ready",
      verifyTokenConfigured: !!VERIFY_TOKEN,
      verifyTokenValue: VERIFY_TOKEN,
      instructions: "Set webhook URL in Meta Developer Dashboard to: YOUR_RAILWAY_URL/api/webhook/whatsapp",
    });
  });

  // ─── Test endpoint (simulate incoming WhatsApp message) ───
  app.post("/api/webhook/whatsapp/test", async (c) => {
    const { phone, message, name } = await c.req.json();

    if (!phone || !message) {
      return c.json({ error: "phone and message required" }, 400);
    }

    try {
      await handleIncomingMessage(phone, message, name);
      return c.json({ status: "processed", phone, message });
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  });

  console.log("[WhatsApp Webhook] Registered at /api/webhook/whatsapp");
}
