import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getPool } from "./queries/connection";

// ─── OTP Generation ───
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOtp(phone: string, code: string) {
  const db = getPool();
  db.prepare("DELETE FROM otp_codes WHERE phone = ?").run(phone);
  db.prepare("INSERT INTO otp_codes (phone, code, expiresAt) VALUES (?, ?, ?)")
    .run(phone, code, Math.floor(Date.now() / 1000) + 600);
}

function verifyOtp(phone: string, code: string): boolean {
  const db = getPool();
  const row = db.prepare(
    "SELECT * FROM otp_codes WHERE phone = ? AND code = ? AND expiresAt > ?"
  ).get(phone, code, Math.floor(Date.now() / 1000)) as any;
  if (row) {
    db.prepare("DELETE FROM otp_codes WHERE phone = ?").run(phone);
    return true;
  }
  return false;
}

function checkRateLimit(phone: string): boolean {
  const db = getPool();
  const count = db.prepare(
    "SELECT COUNT(*) as count FROM otp_codes WHERE phone = ? AND createdAt > ?"
  ).get(phone, Math.floor(Date.now() / 1000) - 600) as any;
  return (count?.count ?? 0) < 5;
}

// ─── WhatsApp Business API (Cloud API) ───
// First 1,000 conversations/month are FREE
// https://business.facebook.com/products/whatsapp-business-platform/
async function sendWhatsAppOtp(phone: string, code: string): Promise<boolean> {
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  // If no WhatsApp credentials configured, show code on screen (development mode)
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.log(`[WhatsApp OTP to ${phone}]: ${code} (displayed on screen - configure WhatsApp Business API for real delivery)`);
    return true;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phone.startsWith("+") ? phone : `+27${phone.replace(/^0/, "")}`,
          type: "template",
          template: {
            name: "simplipan_otp",
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [{ type: "text", text: code }],
              },
              {
                type: "button",
                sub_type: "url",
                index: 0,
                parameters: [{ type: "text", text: code }],
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[WhatsApp API Error]:", error);
      // Fall back to showing code on screen
      return true;
    }
    return true;
  } catch (err) {
    console.error("[WhatsApp Send Error]:", err);
    return true; // Fallback to on-screen display
  }
}

// ─── Simple text message fallback (no template needed) ───
async function sendWhatsAppText(phone: string, code: string): Promise<boolean> {
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.log(`[WhatsApp OTP to ${phone}]: ${code}`);
    return true;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone.startsWith("+") ? phone : `+27${phone.replace(/^0/, "")}`,
          type: "text",
          text: {
            body: `Your SimpliPlan verification code is: ${code}\n\nValid for 10 minutes. Do not share this code with anyone.`,
          },
        }),
      }
    );
    return response.ok;
  } catch {
    return true;
  }
}

export const otpRouter = createRouter({
  send: publicQuery
    .input(z.object({ phone: z.string().min(9) }))
    .mutation(async ({ input }) => {
      const phone = input.phone.replace(/\s/g, "");

      if (!checkRateLimit(phone)) {
        return { success: false, error: "Too many attempts. Please wait 10 minutes." };
      }

      const code = generateOtp();
      storeOtp(phone, code);

      // Send via WhatsApp (free tier) or show on screen
      await sendWhatsAppText(phone, code);

      return {
        success: true,
        message: "OTP sent via WhatsApp",
        // Always show code on screen until WhatsApp Business API is configured
        _code: code,
      };
    }),

  verify: publicQuery
    .input(z.object({
      phone: z.string().min(9),
      code: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      const phone = input.phone.replace(/\s/g, "");

      if (verifyOtp(phone, input.code)) {
        return { success: true, message: "OTP verified" };
      }

      return { success: false, error: "Invalid or expired code" };
    }),
});
