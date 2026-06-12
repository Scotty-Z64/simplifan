import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { reviews, bookings } from "@db/schema";

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

export const reviewRouter = createRouter({
  list: publicQuery
    .input(z.object({
      vendorId: z.number().optional(),
      clientId: z.number().optional(),
      verified: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const conditions: string[] = [];
      const params: any[] = [];

      if (input?.vendorId) { conditions.push("vendorId = ?"); params.push(input.vendorId); }
      if (input?.clientId) { conditions.push("clientId = ?"); params.push(input.clientId); }
      if (input?.verified !== undefined) { conditions.push("verifiedBooking = ?"); params.push(input.verified ? 1 : 0); }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const limit = input?.limit ?? 50;

      return query(`SELECT * FROM reviews ${where} ORDER BY id DESC LIMIT ?`, [...params, limit]);
    }),

  create: publicQuery
    .input(z.object({
      bookingId: z.number().optional(),
      vendorId: z.number(),
      clientId: z.number(),
      clientName: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
      eventType: z.string().optional(),
      verifiedBooking: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Mark booking as reviewed
      if (input.bookingId) {
        await db.update(bookings).set({ reviewSubmitted: true })
          .where(eq(bookings.id, input.bookingId));
      }

      const result = await db.insert(reviews).values(input);

      // Recalculate vendor average rating
      const { vendors } = await import("@db/schema");
      const avgResult = queryOne(
        "SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE vendorId = ?",
        [input.vendorId]
      ) as any;

      await db.update(vendors).set({
        rating: String(avgResult?.avgRating ?? 4.5),
        jobs: Number(avgResult?.count ?? 0),
      }).where(eq(vendors.id, input.vendorId));

      return { id: Number(result.lastInsertRowid), ...input };
    }),

  vendorSummary: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const result = queryOne(
        `SELECT 
          COALESCE(AVG(rating), 0) as avgRating,
          COUNT(*) as totalReviews,
          SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as fiveStar,
          SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as fourStar,
          SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as threeStar,
          SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as twoStar,
          SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as oneStar
        FROM reviews WHERE vendorId = ?`,
        [input.vendorId]
      ) as any;

      return result ?? { avgRating: 0, totalReviews: 0, fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 };
    }),
});
