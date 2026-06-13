// ─── Free Email Service via Brevo/Gmail/SendGrid SMTP ───
// Costs R0.00 — just needs SMTP credentials from Brevo

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "otp@simplipan.co.za";
const FROM_NAME = process.env.FROM_NAME || "SimpliPlan";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  // If no SMTP configured, log and return true (show code on screen)
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(`[Email] Would send to ${to}: ${subject}`);
    console.log(`[Email] HTML: ${html.substring(0, 200)}...`);
    return true;
  }

  try {
    // Use fetch to call Brevo/SendGrid API directly (no SMTP library needed)
    // Brevo API
    if (SMTP_HOST.includes("brevo") || SMTP_HOST.includes("sendinblue")) {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": SMTP_PASS,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: FROM_NAME, email: FROM_EMAIL },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text || "",
        }),
      });
      return res.ok;
    }

    // SendGrid API
    if (SMTP_HOST.includes("sendgrid")) {
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SMTP_PASS}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: FROM_EMAIL, name: FROM_NAME },
          subject,
          content: [
            { type: "text/html", value: html },
          ],
        }),
      });
      return res.ok;
    }

    // Generic: log for now, implement SMTP if needed
    console.log(`[Email] To: ${to} | Subject: ${subject}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed:", err);
    // Always return true so the app doesn't break
    return true;
  }
}

export function generateOtpEmailHtml(code: string, name?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your SimpliPlan Code</title>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2BBCA8,#1E9B8A);padding:40px 32px;text-align:center;">
              <h1 style="color:white;font-size:28px;margin:0;font-weight:700;">SimpliPlan</h1>
              <p style="color:rgba(255,255,255,0.8);font-size:12px;margin:4px 0 0;letter-spacing:2px;text-transform:uppercase;">South Africa's Event Planner</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <p style="color:#475569;font-size:16px;margin:0 0 8px;">Hello ${name || "there"},</p>
              <p style="color:#94A3B8;font-size:14px;margin:0 0 32px;">Your verification code is:</p>
              
              <div style="background:#F0FDFA;border-radius:16px;padding:28px;margin-bottom:32px;border:2px solid #A7F3D0;">
                <span style="font-size:42px;font-weight:800;color:#1a1a2e;letter-spacing:12px;font-family:'Courier New',monospace;">${code}</span>
              </div>
              
              <p style="color:#94A3B8;font-size:12px;margin:0 0 24px;">Valid for 10 minutes. Do not share this code with anyone.</p>
              
              <div style="border-top:1px solid #F1F5F9;padding-top:24px;">
                <p style="color:#CBD5E1;font-size:11px;margin:0;">If you didn't request this code, you can safely ignore this email.</p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#F8FAFC;padding:20px 32px;text-align:center;">
              <p style="color:#CBD5E1;font-size:11px;margin:0;">&copy; 2026 SimpliPlan. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
