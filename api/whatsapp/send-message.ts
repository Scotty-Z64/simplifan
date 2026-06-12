// ─── Send WhatsApp Messages via Meta Cloud API ───

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "";

export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  // If no credentials, log to console (development mode)
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.log(`[WhatsApp → ${to}]: ${message.substring(0, 100)}...`);
    return true;
  }

  try {
    const formattedPhone = to.startsWith("+") ? to : `+27${to.replace(/^0/, "")}`;

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
          to: formattedPhone,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[WhatsApp Send Error]:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[WhatsApp Send Failed]:", err);
    return false;
  }
}

// Send interactive list message (for selections)
export async function sendWhatsAppList(to: string, header: string, body: string, buttonText: string, sections: { title: string; rows: { id: string; title: string; description?: string }[] }[]): Promise<boolean> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.log(`[WhatsApp List → ${to}]: ${header} - ${body}`);
    return true;
  }

  try {
    const formattedPhone = to.startsWith("+") ? to : `+27${to.replace(/^0/, "")}`;

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
          to: formattedPhone,
          type: "interactive",
          interactive: {
            type: "list",
            header: { type: "text", text: header },
            body: { text: body },
            footer: { text: "SimpliPlan - Celebrating People" },
            action: {
              button: buttonText,
              sections: sections.map(s => ({
                title: s.title,
                rows: s.rows.map(r => ({
                  id: r.id,
                  title: r.title.substring(0, 24),
                  description: r.description?.substring(0, 72) || undefined,
                })),
              })),
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[WhatsApp List Error]:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[WhatsApp List Failed]:", err);
    return false;
  }
}
