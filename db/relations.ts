import { relations } from "drizzle-orm";
import {
  users, clients, vendors, vendorServices, vendorImages,
  events, eventItems, quotes, bookings, payments,
  reviews, conversations, messages, transactions,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  vendors: many(vendors),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  events: many(events),
  quotes: many(quotes),
  bookings: many(bookings),
  reviews: many(reviews),
  conversations: many(conversations),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  user: one(users, { fields: [vendors.userId], references: [users.id] }),
  services: many(vendorServices),
  images: many(vendorImages),
  quotes: many(quotes),
  bookings: many(bookings),
  reviews: many(reviews),
  transactions: many(transactions),
  conversations: many(conversations),
}));

export const vendorServicesRelations = relations(vendorServices, ({ one }) => ({
  vendor: one(vendors, { fields: [vendorServices.vendorId], references: [vendors.id] }),
}));

export const vendorImagesRelations = relations(vendorImages, ({ one }) => ({
  vendor: one(vendors, { fields: [vendorImages.vendorId], references: [vendors.id] }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  client: one(clients, { fields: [events.clientId], references: [clients.id] }),
  items: many(eventItems),
  quotes: many(quotes),
}));

export const eventItemsRelations = relations(eventItems, ({ one }) => ({
  event: one(events, { fields: [eventItems.eventId], references: [events.id] }),
  vendor: one(vendors, { fields: [eventItems.vendorId], references: [vendors.id] }),
}));

export const quotesRelations = relations(quotes, ({ one }) => ({
  client: one(clients, { fields: [quotes.clientId], references: [clients.id] }),
  vendor: one(vendors, { fields: [quotes.vendorId], references: [vendors.id] }),
  event: one(events, { fields: [quotes.eventId], references: [events.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  client: one(clients, { fields: [bookings.clientId], references: [clients.id] }),
  vendor: one(vendors, { fields: [bookings.vendorId], references: [vendors.id] }),
  event: one(events, { fields: [bookings.eventId], references: [events.id] }),
  payments: many(payments),
  reviews: many(reviews),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, { fields: [payments.bookingId], references: [bookings.id] }),
  vendor: one(vendors, { fields: [payments.vendorId], references: [vendors.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  vendor: one(vendors, { fields: [reviews.vendorId], references: [vendors.id] }),
  client: one(clients, { fields: [reviews.clientId], references: [clients.id] }),
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  client: one(clients, { fields: [conversations.clientId], references: [clients.id] }),
  vendor: one(vendors, { fields: [conversations.vendorId], references: [vendors.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  vendor: one(vendors, { fields: [transactions.vendorId], references: [vendors.id] }),
}));
