import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getPool } from "./queries/connection";

function query(sqlStr: string, params?: any[]) {
  const db = getPool();
  const stmt = db.prepare(sqlStr);
  return params ? stmt.all(...params) : stmt.all();
}

function queryOne(sqlStr: string, params?: any[]) {
  const db = getPool();
  const stmt = db.prepare(sqlStr);
  return params ? stmt.get(...params) : stmt.get();
}

export const analyticsRouter = createRouter({
  overview: publicQuery.query(async () => {
    const clientCount = queryOne("SELECT COUNT(*) as count FROM clients") as any;
    const vendorCount = queryOne("SELECT COUNT(*) as count FROM vendors") as any;
    const bookingCount = queryOne("SELECT COUNT(*) as count FROM bookings") as any;
    const eventCount = queryOne("SELECT COUNT(*) as count FROM events") as any;
    const totalRevenue = queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'") as any;
    const monthlyBookings = queryOne("SELECT COUNT(*) as count FROM bookings WHERE createdAt >= unixepoch('now', 'start of month')") as any;

    return {
      clients: Number(clientCount?.count ?? 0),
      vendors: Number(vendorCount?.count ?? 0),
      bookings: Number(bookingCount?.count ?? 0),
      events: Number(eventCount?.count ?? 0),
      totalRevenue: Number(totalRevenue?.total ?? 0),
      monthlyBookings: Number(monthlyBookings?.count ?? 0),
      conversions: [],
    };
  }),

  vendorPerformance: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const bookingData = queryOne(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          COALESCE(SUM(amount), 0) as totalValue
        FROM bookings WHERE vendorId = ?`,
        [input.vendorId]
      ) as any;

      const quoteData = queryOne(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status != 'submitted' THEN 1 ELSE 0 END) as responded
        FROM quotes WHERE vendorId = ?`,
        [input.vendorId]
      ) as any;

      return {
        bookings: bookingData ?? { total: 0, confirmed: 0, completed: 0, totalValue: 0 },
        quotes: quoteData ?? { total: 0, responded: 0 },
        responseRate: quoteData?.total
          ? Math.round((Number(quoteData.responded) / Number(quoteData.total)) * 100)
          : 0,
      };
    }),

  revenueReport: publicQuery
    .input(z.object({
      vendorId: z.number().optional(),
      days: z.number().min(1).max(365).default(30),
    }).optional())
    .query(async ({ input }) => {
      const days = input?.days ?? 30;
      const conditions = ["createdAt >= unixepoch('now', ?)"];
      const params: any[] = [`-${days} days`];

      if (input?.vendorId) {
        conditions.push("vendorId = ?");
        params.push(input.vendorId);
      }

      return query(
        `SELECT type, COALESCE(SUM(amount), 0) as total, COUNT(*) as count 
         FROM payments 
         WHERE ${conditions.join(" AND ")} AND status = 'completed'
         GROUP BY type`,
        params
      );
    }),

  funnel: publicQuery.query(async () => {
    return {
      quote_request: 0,
      booking_created: 0,
      deposit_paid: 0,
      booking_confirmed: 0,
      review_submitted: 0,
    };
  }),

  recentActivity: publicQuery
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit ?? 20;

      const recentBookings = query("SELECT * FROM bookings ORDER BY id DESC LIMIT ?", [limit]);
      const recentQuotes = query("SELECT * FROM quotes ORDER BY id DESC LIMIT ?", [limit]);

      return { bookings: recentBookings, quotes: recentQuotes };
    }),
});
