import { z } from "zod";
import { eq, sql, desc, and, gte } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  clients, vendors, events, bookings, payments,
  quotes, conversions,
} from "@db/schema";

export const analyticsRouter = createRouter({
  overview: publicQuery.query(async () => {
    const db = getDb();

    const clientCount = await db.select({ count: sql<number>`COUNT(*)` }).from(clients);
    const vendorCount = await db.select({ count: sql<number>`COUNT(*)` }).from(vendors);
    const bookingCount = await db.select({ count: sql<number>`COUNT(*)` }).from(bookings);
    const eventCount = await db.select({ count: sql<number>`COUNT(*)` }).from(events);
    const totalRevenue = await db.select({
      total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
    }).from(payments).where(eq(payments.status, "completed"));

    // Active bookings this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyBookings = await db.select({ count: sql<number>`COUNT(*)` })
      .from(bookings)
      .where(gte(bookings.createdAt, monthStart));

    // Conversion stages
    const convStages = await db.select({
      stage: conversions.stage,
      count: sql<number>`COUNT(*)`,
    }).from(conversions).groupBy(conversions.stage);

    return {
      clients: Number(clientCount[0]?.count ?? 0),
      vendors: Number(vendorCount[0]?.count ?? 0),
      bookings: Number(bookingCount[0]?.count ?? 0),
      events: Number(eventCount[0]?.count ?? 0),
      totalRevenue: Number(totalRevenue[0]?.total ?? 0),
      monthlyBookings: Number(monthlyBookings[0]?.count ?? 0),
      conversions: convStages,
    };
  }),

  vendorPerformance: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();

      const bookingData = await db.select({
        total: sql<number>`COUNT(*)`,
        confirmed: sql<number>`SUM(CASE WHEN ${bookings.status} = 'confirmed' THEN 1 ELSE 0 END)`,
        completed: sql<number>`SUM(CASE WHEN ${bookings.status} = 'completed' THEN 1 ELSE 0 END)`,
        totalValue: sql<number>`COALESCE(SUM(${bookings.amount}), 0)`,
      }).from(bookings).where(eq(bookings.vendorId, input.vendorId));

      const quoteData = await db.select({
        total: sql<number>`COUNT(*)`,
        responded: sql<number>`SUM(CASE WHEN ${quotes.status} != 'submitted' THEN 1 ELSE 0 END)`,
      }).from(quotes).where(eq(quotes.vendorId, input.vendorId));

      return {
        bookings: bookingData[0] ?? { total: 0, confirmed: 0, completed: 0, totalValue: 0 },
        quotes: quoteData[0] ?? { total: 0, responded: 0 },
        responseRate: quoteData[0]?.total
          ? Math.round((Number(quoteData[0].responded) / Number(quoteData[0].total)) * 100)
          : 0,
      };
    }),

  revenueReport: publicQuery
    .input(z.object({
      vendorId: z.number().optional(),
      days: z.number().min(1).max(365).default(30),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - (input?.days ?? 30));

      const where = [gte(payments.createdAt, daysAgo), eq(payments.status, "completed")];
      if (input?.vendorId) where.push(eq(payments.vendorId, input.vendorId));

      const result = await db.select({
        total: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
        count: sql<number>`COUNT(*)`,
        byType: sql<string>`${payments.type}`,
      }).from(payments)
        .where(and(...where))
        .groupBy(payments.type);

      return result;
    }),

  funnel: publicQuery.query(async () => {
    const db = getDb();

    // Get conversion counts by stage
    const stages = ["quote_request", "booking_created", "deposit_paid", "booking_confirmed", "review_submitted"];
    const funnel: Record<string, number> = {};

    for (const stage of stages) {
      const result = await db.select({ count: sql<number>`COUNT(*)` })
        .from(conversions)
        .where(eq(conversions.stage, stage));
      funnel[stage] = Number(result[0]?.count ?? 0);
    }

    return funnel;
  }),

  recentActivity: publicQuery
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 20;

      const recentBookings = await db.query.bookings.findMany({
        limit,
        orderBy: [desc(bookings.createdAt)],
        with: { vendor: true, client: true },
      });

      const recentQuotes = await db.query.quotes.findMany({
        limit,
        orderBy: [desc(quotes.createdAt)],
        with: { vendor: true },
      });

      return { bookings: recentBookings, quotes: recentQuotes };
    }),
});
