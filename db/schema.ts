import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  bigint,
  json,
  boolean,
  index,
} from "drizzle-orm/mysql-core";

// ─── OAuth Users (managed by auth system) ───
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── SimpliPlan Clients ───
export const clients = mysqlTable("clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  location: varchar("location", { length: 255 }),
  avatar: varchar("avatar", { length: 10 }).default("C"),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;

// ─── Vendors ───
export const vendors = mysqlTable("vendors", {
  id: serial("id").primaryKey(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  ownerName: varchar("ownerName", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  bio: text("bio"),
  province: varchar("province", { length: 100 }),
  city: varchar("city", { length: 100 }),
  address: varchar("address", { length: 500 }),
  priceRange: varchar("priceRange", { length: 100 }),
  yearsInBusiness: int("yearsInBusiness"),
  avatar: varchar("avatar", { length: 10 }),
  logoUrl: text("logoUrl"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.5").notNull(),
  jobs: int("jobs").default(0).notNull(),
  verified: boolean("verified").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  tier: mysqlEnum("tier", ["starter", "pro", "elite"]).default("starter").notNull(),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "trial", "expired", "cancelled"]).default("trial").notNull(),
  subscriptionEndsAt: timestamp("subscriptionEndsAt"),
  isActive: boolean("isActive").default(true).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("category_idx").on(table.category),
  index("province_idx").on(table.province),
  index("tier_idx").on(table.tier),
]);

export type Vendor = typeof vendors.$inferSelect;

// ─── Vendor Services ───
export const vendorServices = mysqlTable("vendor_services", {
  id: serial("id").primaryKey(),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).notNull().references(() => vendors.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VendorService = typeof vendorServices.$inferSelect;

// ─── Vendor Portfolio Images ───
export const vendorImages = mysqlTable("vendor_images", {
  id: serial("id").primaryKey(),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).notNull().references(() => vendors.id),
  url: text("url").notNull(),
  caption: varchar("caption", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Events (Client Event Plans) ───
export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  clientId: bigint("clientId", { mode: "number", unsigned: true }).notNull().references(() => clients.id),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 20 }).notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  eventDate: varchar("eventDate", { length: 50 }),
  eventTime: varchar("eventTime", { length: 20 }),
  guestCount: int("guestCount"),
  province: varchar("province", { length: 100 }),
  city: varchar("city", { length: 100 }),
  area: varchar("area", { length: 100 }),
  venue: varchar("venue", { length: 255 }),
  budget: decimal("budget", { precision: 12, scale: 2 }).notNull(),
  totalCost: decimal("totalCost", { precision: 12, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["planning", "quoted", "deposit_paid", "confirmed", "ready", "completed", "cancelled"]).default("planning").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Event = typeof events.$inferSelect;

// ─── Event Items (things needed for the event) ───
export const eventItems = mysqlTable("event_items", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).notNull().references(() => events.id),
  category: varchar("category", { length: 100 }).notNull(),
  service: varchar("service", { length: 255 }),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).references(() => vendors.id),
  vendorName: varchar("vendorName", { length: 255 }),
  price: decimal("price", { precision: 12, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["pending", "quoted", "accepted", "booked", "completed", "declined"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventItem = typeof eventItems.$inferSelect;

// ─── Quotes ───
export const quotes = mysqlTable("quotes", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).references(() => events.id),
  clientId: bigint("clientId", { mode: "number", unsigned: true }).notNull().references(() => clients.id),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 20 }).notNull(),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).references(() => vendors.id),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  eventDate: varchar("eventDate", { length: 50 }),
  guestCount: varchar("guestCount", { length: 50 }),
  province: varchar("province", { length: 100 }),
  notes: text("notes"),
  quotedAmount: decimal("quotedAmount", { precision: 12, scale: 2 }),
  vendorMessage: text("vendorMessage"),
  status: mysqlEnum("status", ["submitted", "sent", "quoted", "accepted", "declined", "expired"]).default("submitted").notNull(),
  respondedAt: timestamp("respondedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;

// ─── Bookings ───
export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  eventId: bigint("eventId", { mode: "number", unsigned: true }).references(() => events.id),
  quoteId: bigint("quoteId", { mode: "number", unsigned: true }).references(() => quotes.id),
  clientId: bigint("clientId", { mode: "number", unsigned: true }).notNull().references(() => clients.id),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 20 }).notNull(),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).notNull().references(() => vendors.id),
  vendorName: varchar("vendorName", { length: 255 }).notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  eventDate: varchar("eventDate", { length: 50 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  depositAmount: decimal("depositAmount", { precision: 12, scale: 2 }),
  platformFee: decimal("platformFee", { precision: 12, scale: 2 }),
  clientConfirmed: boolean("clientConfirmed").default(false).notNull(),
  vendorConfirmed: boolean("vendorConfirmed").default(false).notNull(),
  clientConfirmedAt: timestamp("clientConfirmedAt"),
  vendorConfirmedAt: timestamp("vendorConfirmedAt"),
  reviewSubmitted: boolean("reviewSubmitted").default(false).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "deposit_paid", "completed", "disputed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;

// ─── Payments ───
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).references(() => bookings.id),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).references(() => vendors.id),
  clientId: bigint("clientId", { mode: "number", unsigned: true }).references(() => clients.id),
  payfastPaymentId: varchar("payfastPaymentId", { length: 255 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["deposit", "full_payment", "platform_fee", "payout", "refund"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  payfastStatus: varchar("payfastStatus", { length: 50 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Payment = typeof payments.$inferSelect;

// ─── Reviews ───
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).references(() => bookings.id),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).notNull().references(() => vendors.id),
  clientId: bigint("clientId", { mode: "number", unsigned: true }).notNull().references(() => clients.id),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  eventType: varchar("eventType", { length: 100 }),
  verifiedBooking: boolean("verifiedBooking").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;

// ─── Conversations ───
export const conversations = mysqlTable("conversations", {
  id: serial("id").primaryKey(),
  clientId: bigint("clientId", { mode: "number", unsigned: true }).notNull().references(() => clients.id),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).notNull().references(() => vendors.id),
  lastMessage: text("lastMessage"),
  clientUnread: int("clientUnread").default(0).notNull(),
  vendorUnread: int("vendorUnread").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── Messages ───
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: bigint("conversationId", { mode: "number", unsigned: true }).notNull().references(() => conversations.id),
  senderType: mysqlEnum("senderType", ["client", "vendor"]).notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Notifications ───
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  userType: mysqlEnum("userType", ["client", "vendor"]).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  link: varchar("link", { length: 500 }),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Transactions (Vendor Earnings) ───
export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }).notNull().references(() => vendors.id),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).references(() => bookings.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["deposit", "full_payment", "tip", "payout", "platform_fee", "refund"]).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "held"]).default("pending").notNull(),
  clientName: varchar("clientName", { length: 255 }),
  eventName: varchar("eventName", { length: 255 }),
  date: varchar("date", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;

// ─── Analytics / Conversion Tracking ───
export const conversions = mysqlTable("conversions", {
  id: serial("id").primaryKey(),
  stage: varchar("stage", { length: 100 }).notNull(),
  source: varchar("source", { length: 100 }),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }),
  vendorId: bigint("vendorId", { mode: "number", unsigned: true }),
  clientId: bigint("clientId", { mode: "number", unsigned: true }),
  value: decimal("value", { precision: 12, scale: 2 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
