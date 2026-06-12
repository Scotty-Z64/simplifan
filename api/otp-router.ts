import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getPool } from "./queries/connection";

// Generate a 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in SQLite (valid for 10 minutes)
function storeOtp(phone: string, code: string) {
  const db = getPool();
  // Delete old OTPs for this phone
  db.prepare("DELETE FROM otp_codes WHERE phone = ?").run(phone);
  // Insert new OTP (expires in 10 minutes)
  db.prepare(
    "INSERT INTO otp_codes (phone, code, expiresAt) VALUES (?, ?, ?)"
  ).run(phone, code, Math.floor(Date.now() / 1000) + 600);
}

// Verify OTP
function verifyOtp(phone: string, code: string): boolean {
  const db = getPool();
  const row = db.prepare(
    "SELECT * FROM otp_codes WHERE phone = ? AND code = ? AND expiresAt > ?"
  ).get(phone, code, Math.floor(Date.now() / 1000)) as any;
  if (row) {
    // Delete after successful verification
    db.prepare("DELETE FROM otp_codes WHERE phone = ?").run(phone);
    return true;
  }
  return false;
}

// Check rate limit (max 3 OTPs per 10 minutes)
function checkRateLimit(phone: string): boolean {
  const db = getPool();
  const count = db.prepare(
    "SELECT COUNT(*) as count FROM otp_codes WHERE phone = ? AND createdAt > ?"
  ).get(phone, Math.floor(Date.now() / 1000) - 600) as any;
  return (count?.count ?? 0) < 3;
}

// Send SMS via available provider (placeholder for Clickatell/Twilio)
async function sendSms(phone: string, message: string): Promise<boolean> {
  // === SMS PROVIDER INTEGRATION ===
  // Uncomment and configure ONE of the following providers:

  // --- Option 1: Clickatell (Recommended for SA) ---
  // const API_KEY = process.env.CLICKATELL_API_KEY;
  // await fetch("https://platform.clickatell.com/messages", {
  //   method: "POST",
  //   headers: { "Authorization": API_KEY, "Content-Type": "application/json" },
  //   body: JSON.stringify({ to: [phone], content: message }),
  // });

  // --- Option 2: Africa's Talking (Great for Africa) ---
  // const username = process.env.AT_USERNAME;
  // const apiKey = process.env.AT_API_KEY;
  // await fetch("https://api.africastalking.com/version1/messaging", {
  //   method: "POST",
  //   headers: { "apiKey": apiKey, "Content-Type": "application/x-www-form-urlencoded" },
  //   body: new URLSearchParams({ username, to: phone, message }),
  // });

  // --- Option 3: Twilio ---
  // const accountSid = process.env.TWILIO_ACCOUNT_SID;
  // const authToken = process.env.TWILIO_AUTH_TOKEN;
  // const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  // await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
  //   method: "POST",
  //   headers: { "Authorization": "Basic " + Buffer.from(accountSid + ":" + authToken).toString("base64") },
  //   body: new URLSearchParams({ To: phone, From: fromNumber, Body: message }),
  // });

  // For now, log the code so we can verify the system works
  console.log(`[OTP SMS to ${phone}]: ${message}`);
  return true;
}

export const otpRouter = createRouter({
  // Generate and send OTP
  send: publicQuery
    .input(z.object({ phone: z.string().min(9) }))
    .mutation(async ({ input }) => {
      const phone = input.phone.replace(/\s/g, "");

      if (!checkRateLimit(phone)) {
        return { success: false, error: "Too many attempts. Please wait 10 minutes." };
      }

      const code = generateOtp();
      storeOtp(phone, code);

      const message = `Your SimpliPlan verification code is: ${code}. Valid for 10 minutes.`;
      await sendSms(phone, message);

      // In development/demo mode, return the code so it can be displayed
      return {
        success: true,
        message: "OTP sent successfully",
        // Remove this in production:
        _code: process.env.NODE_ENV === "production" ? undefined : code,
      };
    }),

  // Verify OTP
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
