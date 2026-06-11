/**
 * SimpliPlan WhatsApp Service
 * 
 * Phase 1 (Current): Uses wa.me links (click-to-chat)
 * Phase 2 (Production): WhatsApp Business API via Twilio or Meta
 * 
 * To activate the Business API:
 * 1. Register at business.facebook.com
 * 2. Create a WhatsApp Business account
 * 3. Get your Phone Number ID and Access Token
 * 4. Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID env vars
 * 5. Set WHATSAPP_ENABLED=true
 */

import { env } from "./lib/env";

const WHATSAPP_ENABLED = env.whatsappEnabled === "true";
const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";
const WHATSAPP_TOKEN = env.whatsappToken ?? "";
const WHATSAPP_PHONE_ID = env.whatsappPhoneId ?? "";

// Template messages (must be pre-approved by Meta)
const TEMPLATES = {
  quoteRequest: "simpliplan_quote_request",
  quoteResponse: "simpliplan_quote_response",
  bookingConfirmed: "simpliplan_booking_confirmed",
  paymentReceived: "simpliplan_payment_received",
  eventReminder: "simpliplan_event_reminder",
  reviewRequest: "simpliplan_review_request",
} as const;

/**
 * Send a WhatsApp message via the Business API
 */
export async function sendWhatsAppMessage(
  to: string,
  templateName: string,
  variables: Record<string, string>,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WHATSAPP_ENABLED || !WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    return { success: false, error: "WhatsApp Business API not configured" };
  }

  try {
    // Format phone number (remove + and spaces)
    const formattedPhone = to.replace(/\+|\s/g, "");

    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedPhone,
          type: "template",
          template: {
            name: templateName,
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: Object.entries(variables).map(([_, value]) => ({
                  type: "text",
                  text: value,
                })),
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("WhatsApp API error:", error);
      return { success: false, error };
    }

    const data = await response.json() as { messages?: Array<{ id: string }> };
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (err) {
    console.error("WhatsApp send error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Send a free-form WhatsApp text message
 * (Only works within 24h of user initiation)
 */
export async function sendWhatsAppText(
  to: string,
  message: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WHATSAPP_ENABLED || !WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    return { success: false, error: "WhatsApp Business API not configured" };
  }

  try {
    const formattedPhone = to.replace(/\+|\s/g, "");

    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedPhone,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    const data = await response.json() as { messages?: Array<{ id: string }> };
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Generate a wa.me click-to-chat link
 * Works without any API setup
 */
export function generateWaMeLink(
  phone: string,
  message?: string,
): string {
  const formattedPhone = phone.replace(/\+|\s/g, "");
  let url = `https://wa.me/${formattedPhone}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  return url;
}

/**
 * Notify vendor about a new quote request
 */
export async function notifyVendorQuoteRequest(
  vendorPhone: string,
  clientName: string,
  eventType: string,
  eventDate: string,
): Promise<{ success: boolean; waMeLink?: string; error?: string }> {
  const message = `Hi! You have a new quote request on SimpliPlan.

From: ${clientName}
Event: ${eventType}
Date: ${eventDate}

Log in to your vendor dashboard to respond: https://simpliplan.co.za/vendor`;

  // Always return wa.me link as fallback
  const waMeLink = generateWaMeLink(vendorPhone, message);

  // Try API if enabled
  if (WHATSAPP_ENABLED) {
    const result = await sendWhatsAppMessage(vendorPhone, TEMPLATES.quoteRequest, {
      client_name: clientName,
      event_type: eventType,
      event_date: eventDate,
    });
    if (result.success) return { success: true, waMeLink };
  }

  return { success: false, waMeLink, error: "API not configured, use wa.me link" };
}

/**
 * Notify client about a quote response
 */
export async function notifyClientQuoteResponse(
  clientPhone: string,
  vendorName: string,
  eventType: string,
  amount: number,
): Promise<{ success: boolean; waMeLink?: string; error?: string }> {
  const message = `Hi! ${vendorName} has sent you a quote for your ${eventType}.

Amount: R${amount.toLocaleString()}

View and accept: https://simpliplan.co.za/client`;

  const waMeLink = generateWaMeLink(clientPhone, message);

  if (WHATSAPP_ENABLED) {
    const result = await sendWhatsAppMessage(clientPhone, TEMPLATES.quoteResponse, {
      vendor_name: vendorName,
      event_type: eventType,
      amount: `R${amount.toLocaleString()}`,
    });
    if (result.success) return { success: true, waMeLink };
  }

  return { success: false, waMeLink, error: "API not configured, use wa.me link" };
}

/**
 * Notify about booking confirmation
 */
export async function notifyBookingConfirmed(
  phone: string,
  eventType: string,
  vendorName: string,
  eventDate: string,
): Promise<{ success: boolean; waMeLink?: string; error?: string }> {
  const message = `Great news! Your ${eventType} booking with ${vendorName} on ${eventDate} is confirmed.

Your vendor will contact you with next steps.

View details: https://simpliplan.co.za/client`;

  const waMeLink = generateWaMeLink(phone, message);

  if (WHATSAPP_ENABLED) {
    const result = await sendWhatsAppMessage(phone, TEMPLATES.bookingConfirmed, {
      event_type: eventType,
      vendor_name: vendorName,
      event_date: eventDate,
    });
    if (result.success) return { success: true, waMeLink };
  }

  return { success: false, waMeLink, error: "API not configured, use wa.me link" };
}

/**
 * Request a review after event completion
 */
export async function requestReview(
  clientPhone: string,
  vendorName: string,
  eventType: string,
): Promise<{ success: boolean; waMeLink?: string; error?: string }> {
  const message = `Hi! How was your ${eventType} with ${vendorName}?

Please leave a review to help other clients find great vendors.

Leave review: https://simpliplan.co.za/review`;

  const waMeLink = generateWaMeLink(clientPhone, message);

  if (WHATSAPP_ENABLED) {
    const result = await sendWhatsAppMessage(clientPhone, TEMPLATES.reviewRequest, {
      vendor_name: vendorName,
      event_type: eventType,
    });
    if (result.success) return { success: true, waMeLink };
  }

  return { success: false, waMeLink, error: "API not configured, use wa.me link" };
}
