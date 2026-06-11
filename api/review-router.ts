import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reviews, bookings } from "@db/schema";

export const reviewRouter = createRouter({
  list: publicQuery
    .input(z.object({
      vendorId: z.number().optional(),
      clientId: z.number().optional(),
      verified: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const where = [];
      if (input?.vendorId) where.push(eq(reviews.vendorId, input.vendorId));
      if (input?.clientId) where.push(eq(reviews.clientId, input.clientId));
      if (input?.verified !== undefined) where.push(eq(reviews.verifiedBooking, input.verified));

      return db.query.reviews.findMany({
        where: where.length > 0 ? and(...where) : undefined,
        limit: input?.limit ?? 50,
        orderBy: [desc(reviews.createdAt)],
        with: { vendor: true, client: true },
      });
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

      // Update vendor rating
      const [result] = await db.insert(reviews).values(input);

      // Recalculate vendor average rating
      const reviewData = await db.select({
        avgRating: sql<number>`AVG(${reviews.rating})`,
        count: sql<number>`COUNT(*)`,
      }).from(reviews).where(eq(reviews.vendorId, input.vendorId));

      const { vendors } = await import("@db/schema");
      await db.update(vendors).set({
        rating: String(reviewData[0]?.avgRating ?? 4.5),
        jobs: Number(reviewData[0]?.count ?? 0),
      }).where(eq(vendors.id, input.vendorId));

      return { id: Number(result.insertId), ...input };
    }),

  vendorSummary: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select({
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        totalReviews: sql<number>`COUNT(*)`,
        fiveStar: sql<number>`SUM(CASE WHEN ${reviews.rating} = 5 THEN 1 ELSE 0 END)`,
        fourStar: sql<number>`SUM(CASE WHEN ${reviews.rating} = 4 THEN 1 ELSE 0 END)`,
        threeStar: sql<number>`SUM(CASE WHEN ${reviews.rating} = 3 THEN 1 ELSE 0 END)`,
        twoStar: sql<number>`SUM(CASE WHEN ${reviews.rating} = 2 THEN 1 ELSE 0 END)`,
        oneStar: sql<number>`SUM(CASE WHEN ${reviews.rating} = 1 THEN 1 ELSE 0 END)`,
      }).from(reviews).where(eq(reviews.vendorId, input.vendorId));

      return result[0] ?? { avgRating: 0, totalReviews: 0, fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 };
    }),
});
