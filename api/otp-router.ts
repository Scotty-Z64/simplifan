import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getPool } from "./queries/connection";
import { sendEmail, generateOtpEmailHtml } from "./lib/email";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOtp(id: string, code: string) {
  const db = getPool();
  db.prepare("DELETE FROM otp_codes WHERE phone = ?").run(id);
  db.prepare("INSERT INTO otp_codes (phone, code, expiresAt) VALUES (?, ?, ?)")
    .run(id, code, Math.floor(Date.now() / 1000) + 600);
}

function verifyOtp(id: string, code: string): boolean {
  const db = getPool();
  const row = db.prepare(
    "SELECT * FROM otp_codes WHERE phone = ? AND code = ? AND expiresAt > ?"
  ).get(id, code, Math.floor(Date.now() / 1000)) as any;
  if (row) {
    db.prepare("DELETE FROM otp_codes WHERE phone = ?").run(id);
    return true;
  }
  return false;
}

function checkRateLimit(id: string): boolean {
  const db = getPool();
  const count = db.prepare(
    "SELECT COUNT(*) as count FROM otp_codes WHERE phone = ? AND createdAt > ?"
  ).get(id, Math.floor(Date.now() / 1000) - 600) as any;
  return (count?.count ?? 0) < 5;
}

export const otpRouter = createRouter({
  // Send OTP via email (FREE with Brevo/SendGrid/Gmail)
  send: publicQuery
    .input(z.object({
      phone: z.string().min(9),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = input.email || input.phone;

      if (!checkRateLimit(id)) {
        return { success: false, error: "Too many attempts. Wait 10 minutes." };
      }

      const code = generateOtp();
      storeOtp(id, code);

      // Send via email if provided (completely FREE)
      if (input.email) {
        await sendEmail({
          to: input.email,
          subject: "Your SimpliPlan Verification Code",
          html: generateOtpEmailHtml(code, input.email.split("@")[0]),
        });
      }

      return {
        success: true,
        message: input.email ? `Code sent to ${input.email}` : "Code ready",
        _code: code, // Show on screen until Brevo is configured
      };
    }),

  verify: publicQuery
    .input(z.object({
      phone: z.string().min(9),
      code: z.string().length(6),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = input.email || input.phone;
      if (verifyOtp(id, input.code)) {
        return { success: true, message: "Verified" };
      }
      return { success: false, error: "Invalid or expired code" };
    }),
});
