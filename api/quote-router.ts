import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { quotes } from "@db/schema";

export const quoteRouter = createRouter({
  list: publicQuery
    .input(z.object({
      clientId: z.number().optional(),
      vendorId: z.number().optional(),
      status: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const where = [];
      if (input?.clientId) where.push(eq(quotes.clientId, input.clientId));
      if (input?.vendorId) where.push(eq(quotes.vendorId, input.vendorId));
      if (input?.status) where.push(eq(quotes.status, input.status as any));

      return db.query.quotes.findMany({
        where: where.length > 0 ? and(...where) : undefined,
        limit: input?.limit ?? 50,
        orderBy: [desc(quotes.createdAt)],
        with: { vendor: true, client: true },
      });
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.quotes.findFirst({
        where: eq(quotes.id, input.id),
        with: { vendor: true, client: true, event: true },
      });
    }),

  create: publicQuery
    .input(z.object({
      clientId: z.number(),
      clientName: z.string(),
      clientPhone: z.string(),
      eventType: z.string(),
      eventDate: z.string().optional(),
      guestCount: z.string().optional(),
      province: z.string().optional(),
      notes: z.string().optional(),
      vendorId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(quotes).values(input);
      return { id: Number(result.insertId), ...input };
    }),

  respond: publicQuery
    .input(z.object({
      id: z.number(),
      quotedAmount: z.number().positive(),
      vendorMessage: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(quotes).set({
        quotedAmount: input.quotedAmount.toString(),
        vendorMessage: input.vendorMessage ?? null,
        status: "quoted",
        respondedAt: new Date(),
      }).where(eq(quotes.id, input.id));
      return { success: true };
    }),

  updateStatus: publicQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["submitted", "sent", "quoted", "accepted", "declined", "expired"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(quotes).set({ status: input.status }).where(eq(quotes.id, input.id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(quotes).where(eq(quotes.id, input.id));
      return { success: true };
    }),
});
