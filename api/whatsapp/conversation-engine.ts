// ─── WhatsApp Conversation Engine ───
// Handles the full event planning flow via WhatsApp chat

import { sendWhatsAppMessage, sendWhatsAppList } from "./send-message";
import { getSession, saveSession, resetSession, WASession } from "./session-store";
import { getPool } from "../queries/connection";

// ─── Static Data ───
const EVENT_TYPES = [
  { id: "wedding", title: "Wedding", desc: "Traditional, white, or cultural" },
  { id: "birthday", title: "Birthday", desc: "Any age celebration" },
  { id: "funeral", title: "Funeral / Memorial", desc: "Dignified send-off" },
  { id: "lobola", title: "Lobola", desc: "Traditional ceremony" },
  { id: "umemulo", title: "uMemulo", desc: "Coming of age (girl)" },
  { id: "umgidi", title: "uMgidi", desc: "Coming of age (boy)" },
  { id: "baby_shower", title: "Baby Shower", desc: "Celebrate new baby" },
  { id: "corporate", title: "Corporate Event", desc: "Business function" },
  { id: "graduation", title: "Graduation", desc: "Celebrate achievement" },
  { id: "anniversary", title: "Anniversary", desc: "Milestone celebration" },
];

const PROVINCES = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape",
  "Free State", "Mpumalanga", "Limpopo", "North West", "Northern Cape",
];

const GUEST_OPTIONS = [
  { id: "under_20", title: "Under 20", desc: "Small gathering" },
  { id: "20_50", title: "20 - 50", desc: "Medium gathering" },
  { id: "50_100", title: "50 - 100", desc: "Large gathering" },
  { id: "100_200", title: "100 - 200", desc: "Big event" },
  { id: "200_500", title: "200 - 500", desc: "Very big event" },
  { id: "500_plus", title: "500+", desc: "Massive celebration" },
];

const BUDGET_OPTIONS = [
  { id: "5000", title: "Under R5,000", desc: "Starter budget" },
  { id: "15000", title: "R5k - R15k", desc: "Standard budget" },
  { id: "30000", title: "R15k - R30k", desc: "Good budget" },
  { id: "60000", title: "R30k - R60k", desc: "Premium budget" },
  { id: "100000", title: "R60k - R100k", desc: "Luxury budget" },
  { id: "150000", title: "R100k+", desc: "Unlimited budget" },
];

// ─── Main Handler ───
export async function handleIncomingMessage(phone: string, message: string, name?: string) {
  const cleanPhone = phone.replace(/\D/g, "");
  const cleanMsg = message.trim().toLowerCase();

  // Check for reset commands
  if (cleanMsg === "hi" || cleanMsg === "hello" || cleanMsg === "start" || cleanMsg === "menu" || cleanMsg === "0") {
    const session = resetSession(cleanPhone, name || "Friend");
    await sendGreeting(cleanPhone, session);
    return;
  }

  // Check for "cancel" or "stop"
  if (cleanMsg === "cancel" || cleanMsg === "stop") {
    await sendWhatsAppMessage(cleanPhone,
      "Your session has been cancelled. Send HI anytime to start planning a new event."
    );
    return;
  }

  // Get existing session
  let session = getSession(cleanPhone);

  if (!session) {
    // New user
    session = resetSession(cleanPhone, name || "Friend");
    await sendGreeting(cleanPhone, session);
    return;
  }

  // Process based on current step
  await processStep(cleanPhone, session, message);
}

// ─── Step Processor ───
async function processStep(phone: string, session: WASession, message: string) {
  const msg = message.trim();

  switch (session.step) {
    case 0: // Greeting → ask name
      session.step = 1;
      saveSession(session);
      await sendWhatsAppMessage(phone,
        `Welcome to SimpliPlan! I'm your event planning assistant.\n\n` +
        `What's your name so I know who I'm planning for?`
      );
      break;

    case 1: // Collect name
      session.name = msg;
      session.data.name = msg;
      session.step = 2;
      saveSession(session);
      await sendEventTypeList(phone);
      break;

    case 2: // Collect event type
      const eventType = findEventType(msg);
      if (eventType) {
        session.data.eventType = eventType.title;
        session.step = 3;
        saveSession(session);
        await sendProvinceList(phone);
      } else {
        await sendWhatsAppMessage(phone,
          `I didn't recognise that event type. Please choose from the list above, or type the number (1-10).`
        );
        await sendEventTypeList(phone);
      }
      break;

    case 3: // Collect province
      const province = findProvince(msg);
      if (province) {
        session.data.province = province;
        session.step = 4;
        saveSession(session);
        await sendWhatsAppMessage(phone,
          `Great! ${province} it is.\n\n` +
          `What date is your ${session.data.eventType}?\n\n` +
          `Please send the date in this format: DD/MM/YYYY (e.g., 15/12/2026)`
        );
      } else {
        await sendWhatsAppMessage(phone,
          `I didn't recognise that province. Please choose from the list or type the province name.`n        );
        await sendProvinceList(phone);
      }
      break;

    case 4: // Collect date
      const date = parseDate(msg);
      if (date) {
        session.data.eventDate = date;
        session.step = 5;
        saveSession(session);
        await sendGuestList(phone);
      } else {
        await sendWhatsAppMessage(phone,
          `I didn't understand that date. Please send it as DD/MM/YYYY (for example: 15/12/2026)`
        );
      }
      break;

    case 5: // Collect guests
      const guestOption = findGuestOption(msg);
      if (guestOption) {
        session.data.guestCount = guestOption.title;
        session.data.guestCountNum = parseGuestCount(guestOption.id);
        session.step = 6;
        saveSession(session);
        await sendBudgetList(phone);
      } else {
        await sendWhatsAppMessage(phone,
          `Please choose from the guest list above, or reply with a number (1-6).`
        );
        await sendGuestList(phone);
      }
      break;

    case 6: // Collect budget
      const budgetOption = findBudgetOption(msg);
      if (budgetOption) {
        session.data.budget = parseInt(budgetOption.id);
        session.step = 7;
        saveSession(session);
        await sendConfirmation(phone, session);
      } else {
        await sendWhatsAppMessage(phone,
          `Please choose from the budget list above, or reply with a number (1-6).`
        );
        await sendBudgetList(phone);
      }
      break;

    case 7: // Confirm
      if (msg === "yes" || msg === "confirm" || msg === "1" || msg === "y") {
        await createEventFromSession(phone, session);
        session.step = 8;
        saveSession(session);
      } else if (msg === "no" || msg === "cancel" || msg === "2" || msg === "n") {
        session.step = 2;
        saveSession(session);
        await sendWhatsAppMessage(phone,
          `No problem! Let's start over. What type of event are you planning?`
        );
        await sendEventTypeList(phone);
      } else {
        await sendWhatsAppMessage(phone,
          `Please reply with:\n*1* for Yes, create my plan\n*2* for No, start over`
        );
      }
      break;

    case 8: // Done
      await sendWhatsAppMessage(phone,
        `You've already created a plan! Send *HI* to plan another event, or visit your dashboard:\n\n` +
        `https://simplifan-production.up.railway.app/#/my-events`
      );
      break;
  }
}

// ─── Send Greeting ───
async function sendGreeting(phone: string, session: WASession) {
  await sendWhatsAppMessage(phone,
    `👋 Hi ${session.name}! Welcome to *SimpliPlan* — your personal event planning assistant.\n\n` +
    `I can help you plan your next celebration in just a few messages.\n\n` +
    `Let's get started! What's your name?`
  );
  session.step = 1;
  saveSession(session);
}

// ─── Send Interactive Lists ───
async function sendEventTypeList(phone: string) {
  await sendWhatsAppList(
    phone,
    "What event are you planning?",
    "Choose your event type:",
    "Choose Event",
    [{
      title: "Event Types",
      rows: EVENT_TYPES.map((et, i) => ({
        id: et.id,
        title: `${i + 1}. ${et.title}`,
        description: et.desc,
      })),
    }]
  );
  // Also send as text for simple phones
  const textList = EVENT_TYPES.map((et, i) => `${i + 1}. ${et.title}`).join("\n");
  await sendWhatsAppMessage(phone, `Reply with a number:\n${textList}`);
}

async function sendProvinceList(phone: string) {
  const sections = [];
  const half = Math.ceil(PROVINCES.length / 2);
  sections.push({
    title: "Provinces (1-5)",
    rows: PROVINCES.slice(0, half).map((p, i) => ({
      id: `prov_${i}`,
      title: p,
    })),
  });
  sections.push({
    title: "Provinces (6-9)",
    rows: PROVINCES.slice(half).map((p, i) => ({
      id: `prov_${i + half}`,
      title: p,
    })),
  });

  await sendWhatsAppList(phone, "Where is your event?", "Choose your province:", "Choose Province", sections);
  await sendWhatsAppMessage(phone, `Or reply with the province name (e.g., "Gauteng").`);
}

async function sendGuestList(phone: string) {
  await sendWhatsAppList(
    phone,
    "How many guests?",
    "Choose your expected guest count:",
    "Choose Guests",
    [{
      title: "Guest Count",
      rows: GUEST_OPTIONS.map((go, i) => ({
        id: go.id,
        title: go.title,
        description: go.desc,
      })),
    }]
  );
  const textList = GUEST_OPTIONS.map((go, i) => `${i + 1}. ${go.title} — ${go.desc}`).join("\n");
  await sendWhatsAppMessage(phone, `Reply with a number:\n${textList}`);
}

async function sendBudgetList(phone: string) {
  await sendWhatsAppList(
    phone,
    "What's your budget?",
    "Choose your budget range:",
    "Choose Budget",
    [{
      title: "Budget Range",
      rows: BUDGET_OPTIONS.map((bo, i) => ({
        id: bo.id,
        title: bo.title,
        description: bo.desc,
      })),
    }]
  );
  const textList = BUDGET_OPTIONS.map((bo, i) => `${i + 1}. ${bo.title}`).join("\n");
  await sendWhatsAppMessage(phone, `Reply with a number:\n${textList}`);
}

// ─── Send Confirmation ───
async function sendConfirmation(phone: string, session: WASession) {
  const d = session.data;
  await sendWhatsAppMessage(phone,
    `📋 *Plan Summary*\n\n` +
    `*Event:* ${d.eventType}\n` +
    `*Date:* ${d.eventDate}\n` +
    `*Location:* ${d.province}\n` +
    `*Guests:* ${d.guestCount}\n` +
    `*Budget:* R${d.budget.toLocaleString('en-ZA')}\n\n` +
    `Does this look correct?\n\n` +
    `Reply *1* for ✅ Yes, create my plan\n` +
    `Reply *2* for ❌ No, start over`
  );
}

// ─── Create Event in Database ───
async function createEventFromSession(phone: string, session: WASession) {
  try {
    const db = getPool();
    const drizzle = (await import("../queries/connection")).getDb;
    const dbInstance = drizzle();

    // Create or get client
    let clientRow = db.prepare("SELECT id FROM clients WHERE phone = ?").get(phone) as any;
    let clientId: number;

    if (!clientRow) {
      const result = db.prepare(
        "INSERT INTO clients (name, phone, avatar) VALUES (?, ?, ?)"
      ).run(session.name || "Client", phone, (session.name || "C").charAt(0).toUpperCase());
      clientId = Number(result.lastInsertRowid);
    } else {
      clientId = clientRow.id;
    }

    // Create event
    const d = session.data;
    const eventResult = db.prepare(
      `INSERT INTO events (clientId, clientName, clientPhone, eventType, eventDate, guestCount, province, budget, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      clientId,
      session.name || "Client",
      phone,
      d.eventType,
      d.eventDate,
      d.guestCountNum || 50,
      d.province,
      d.budget.toString(),
      "planning",
      `Created via WhatsApp bot`
    );

    const eventId = Number(eventResult.lastInsertRowid);

    // Create event items
    const categories = ["Catering", "Venue", "Decor", "Music / DJ"];
    for (const cat of categories) {
      db.prepare(
        `INSERT INTO event_items (eventId, category, price, status) VALUES (?, ?, ?, ?)`
      ).run(eventId, cat, "0", "pending");
    }

    // Send confirmation
    await sendWhatsAppMessage(phone,
      `✅ *Your plan has been created!*\n\n` +
      `Event ID: #${eventId}\n` +
      `*${d.eventType}* on ${d.eventDate}\n\n` +
      `What's next:\n` +
      `• Vendors will review your plan and send quotes\n` +
      `• Track everything on your dashboard\n` +
      `• Chat with vendors directly\n\n` +
      `*Your Dashboard:*\n` +
      `https://simplifan-production.up.railway.app/#/my-events\n\n` +
      `Send *HI* anytime to plan another event!`
    );

    console.log(`[WhatsApp] Created event ${eventId} for ${phone}`);
  } catch (err: any) {
    console.error("[WhatsApp] Event creation failed:", err.message);
    await sendWhatsAppMessage(phone,
      `Sorry, something went wrong creating your plan. Please try again by sending *HI*.`
    );
  }
}

// ─── Helpers ───
function findEventType(input: string): typeof EVENT_TYPES[0] | undefined {
  // Check by ID
  const byId = EVENT_TYPES.find(et => input.includes(et.id));
  if (byId) return byId;

  // Check by number
  const num = parseInt(input);
  if (num >= 1 && num <= EVENT_TYPES.length) return EVENT_TYPES[num - 1];

  // Check by title
  const byTitle = EVENT_TYPES.find(et =>
    et.title.toLowerCase().includes(input) || input.includes(et.title.toLowerCase())
  );
  if (byTitle) return byTitle;

  return undefined;
}

function findProvince(input: string): string | undefined {
  const clean = input.trim();
  // Check by number
  const num = parseInt(clean);
  if (num >= 1 && num <= PROVINCES.length) return PROVINCES[num - 1];
  // Check by name
  return PROVINCES.find(p => p.toLowerCase().includes(clean) || clean.includes(p.toLowerCase()));
}

function parseDate(input: string): string | null {
  // Try DD/MM/YYYY
  const match = input.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  // Try YYYY-MM-DD
  const match2 = input.match(/(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);
  if (match2) {
    const [, year, month, day] = match2;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return null;
}

function findGuestOption(input: string): typeof GUEST_OPTIONS[0] | undefined {
  const num = parseInt(input);
  if (num >= 1 && num <= GUEST_OPTIONS.length) return GUEST_OPTIONS[num - 1];
  return GUEST_OPTIONS.find(go => input.includes(go.id) || go.title.toLowerCase().includes(input));
}

function parseGuestCount(id: string): number {
  const map: Record<string, number> = {
    under_20: 15, 20_50: 35, 50_100: 75,
    100_200: 150, 200_500: 350, 500_plus: 600,
  };
  return map[id] || 50;
}

function findBudgetOption(input: string): typeof BUDGET_OPTIONS[0] | undefined {
  const num = parseInt(input);
  if (num >= 1 && num <= BUDGET_OPTIONS.length) return BUDGET_OPTIONS[num - 1];
  return BUDGET_OPTIONS.find(bo => bo.id === input.replace(/\D/g, ""));
}
