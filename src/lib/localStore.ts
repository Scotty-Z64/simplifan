// LocalStorage-based data store - replaces API calls
import { seedLocalStorage } from "./staticData";

seedLocalStorage();

function get<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function set<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Vendors ───
export const lsVendor = {
  list: (params?: { limit?: number; category?: string; province?: string; featured?: boolean; search?: string }) => {
    let vendors = get<any>("sp_vendors");
    if (params?.category) vendors = vendors.filter((v: any) => v.category === params.category);
    if (params?.province) vendors = vendors.filter((v: any) => v.province === params.province);
    if (params?.featured) vendors = vendors.filter((v: any) => v.featured === 1);
    if (params?.search) {
      const s = params.search.toLowerCase();
      vendors = vendors.filter((v: any) =>
        v.businessName?.toLowerCase().includes(s) || v.category?.toLowerCase().includes(s)
      );
    }
    return { vendors: params?.limit ? vendors.slice(0, params.limit) : vendors };
  },
  byId: (id: number) => {
    return get<any>("sp_vendors").find((v: any) => v.id === id) || null;
  },
  byCategory: (category: string) => {
    return get<any>("sp_vendors").filter((v: any) => v.category === category);
  },
  categories: () => {
    const vendors = get<any>("sp_vendors");
    const cats = [...new Set(vendors.map((v: any) => v.category))];
    return { categories: cats.map((c) => ({ name: c, count: vendors.filter((v: any) => v.category === c).length })) };
  },
  stats: () => {
    const vendors = get<any>("sp_vendors");
    return {
      totalVendors: vendors.length,
      activeVendors: vendors.filter((v: any) => v.isActive).length,
      avgRating: (vendors.reduce((sum: number, v: any) => sum + parseFloat(v.rating || 0), 0) / vendors.length).toFixed(1),
      totalRevenue: "0",
      pendingVerifications: vendors.filter((v: any) => !v.verified).length,
    };
  },
};

// ─── Events ───
export const lsEvent = {
  list: (params?: { clientId?: number; limit?: number; status?: string }) => {
    let events = get<any>("sp_events");
    if (params?.clientId) events = events.filter((e: any) => e.clientId === params.clientId);
    if (params?.status) events = events.filter((e: any) => e.status === params.status);
    return { events: params?.limit ? events.slice(0, params.limit) : events };
  },
  create: (data: any) => {
    const events = get<any>("sp_events");
    const newEvent = { ...data, id: events.length + 1, createdAt: new Date().toISOString() };
    events.push(newEvent);
    set("sp_events", events);
    return newEvent;
  },
};

// ─── Bookings ───
export const lsBooking = {
  list: (params?: { clientId?: number; vendorId?: number; limit?: number; status?: string }) => {
    let bookings = get<any>("sp_bookings");
    if (params?.clientId) bookings = bookings.filter((b: any) => b.clientId === params.clientId);
    if (params?.vendorId) bookings = bookings.filter((b: any) => b.vendorId === params.vendorId);
    if (params?.status) bookings = bookings.filter((b: any) => b.status === params.status);
    return { bookings: params?.limit ? bookings.slice(0, params.limit) : bookings };
  },
  byId: (id: number) => {
    return get<any>("sp_bookings").find((b: any) => b.id === id) || null;
  },
  confirm: (id: number, _type: string) => {
    const bookings = get<any>("sp_bookings");
    const idx = bookings.findIndex((b: any) => b.id === id);
    if (idx >= 0) {
      bookings[idx].status = "confirmed";
      bookings[idx].clientConfirmed = 1;
      bookings[idx].vendorConfirmed = 1;
      set("sp_bookings", bookings);
    }
    return { success: true };
  },
};

// ─── Reviews ───
export const lsReview = {
  list: (params?: { vendorId?: number; limit?: number }) => {
    let reviews = get<any>("sp_reviews");
    if (params?.vendorId) reviews = reviews.filter((r: any) => r.vendorId === params.vendorId);
    return { reviews: params?.limit ? reviews.slice(0, params.limit) : reviews };
  },
  create: (data: any) => {
    const reviews = get<any>("sp_reviews");
    const newReview = { ...data, id: reviews.length + 1, verifiedBooking: 1, createdAt: new Date().toISOString() };
    reviews.push(newReview);
    set("sp_reviews", reviews);
    return newReview;
  },
};

// ─── Quotes ───
export const lsQuote = {
  list: (params?: { clientId?: number; vendorId?: number; status?: string }) => {
    let quotes = get<any>("sp_quotes");
    if (params?.clientId) quotes = quotes.filter((q: any) => q.clientId === params.clientId);
    if (params?.vendorId) quotes = quotes.filter((q: any) => q.vendorId === params.vendorId);
    if (params?.status) quotes = quotes.filter((q: any) => q.status === params.status);
    return { quotes };
  },
  respond: (id: number, data: { quotedAmount: string; vendorMessage: string }) => {
    const quotes = get<any>("sp_quotes");
    const idx = quotes.findIndex((q: any) => q.id === id);
    if (idx >= 0) {
      quotes[idx].quotedAmount = data.quotedAmount;
      quotes[idx].vendorMessage = data.vendorMessage;
      quotes[idx].status = "quoted";
      set("sp_quotes", quotes);
    }
    return { success: true };
  },
  updateStatus: (id: number, status: string) => {
    const quotes = get<any>("sp_quotes");
    const idx = quotes.findIndex((q: any) => q.id === id);
    if (idx >= 0) {
      quotes[idx].status = status;
      set("sp_quotes", quotes);
    }
    return { success: true };
  },
};

// ─── Conversations / Messages ───
export const lsConversation = {
  list: (params?: { clientId?: number; vendorId?: number }) => {
    let convs = get<any>("sp_conversations");
    if (params?.clientId) convs = convs.filter((c: any) => c.clientId === params.clientId);
    if (params?.vendorId) convs = convs.filter((c: any) => c.vendorId === params.vendorId);
    // Attach messages
    const messages = get<any>("sp_messages");
    convs = convs.map((c: any) => ({
      ...c,
      messages: messages.filter((m: any) => m.conversationId === c.id),
    }));
    return { conversations: convs };
  },
  byId: (id: number) => {
    const conv = get<any>("sp_conversations").find((c: any) => c.id === id);
    if (!conv) return null;
    const messages = get<any>("sp_messages").filter((m: any) => m.conversationId === id);
    return { ...conv, messages };
  },
  sendMessage: (data: { conversationId: number; senderType: string; content: string }) => {
    const messages = get<any>("sp_messages");
    const newMsg = {
      id: messages.length + 1,
      conversationId: data.conversationId,
      senderType: data.senderType,
      content: data.content,
      read: 0,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMsg);
    set("sp_messages", messages);

    // Update conversation lastMessage
    const convs = get<any>("sp_conversations");
    const idx = convs.findIndex((c: any) => c.id === data.conversationId);
    if (idx >= 0) {
      convs[idx].lastMessage = data.content;
      if (data.senderType === "client") {
        convs[idx].vendorUnread = (convs[idx].vendorUnread || 0) + 1;
      } else {
        convs[idx].clientUnread = (convs[idx].clientUnread || 0) + 1;
      }
      set("sp_conversations", convs);
    }
    return newMsg;
  },
};

// ─── Client ───
export const lsClient = {
  create: (data: { name: string; phone: string; email?: string }) => {
    const clients = get<any>("sp_clients");
    const newClient = {
      id: clients.length + 1,
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      location: "",
      avatar: data.name.charAt(0).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    clients.push(newClient);
    set("sp_clients", clients);
    return newClient;
  },
  byPhone: (phone: string) => {
    return get<any>("sp_clients").find((c: any) => c.phone === phone) || null;
  },
};

// ─── Analytics ───
export const lsAnalytics = {
  overview: () => {
    const vendors = get<any>("sp_vendors");
    const bookings = get<any>("sp_bookings");
    const reviews = get<any>("sp_reviews");
    const revenue = bookings.reduce((sum: number, b: any) => sum + parseFloat(b.amount || 0), 0);
    return {
      totalVendors: vendors.length,
      totalClients: get<any>("sp_clients").length + 5, // + seeded clients
      totalBookings: bookings.length,
      totalRevenue: revenue.toFixed(2),
      avgRating: (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1),
      pendingVerifications: vendors.filter((v: any) => !v.verified).length,
      recentSignups: [],
    };
  },
};
