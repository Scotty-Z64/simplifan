import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { quotes } from "@db/schema";

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

export const quoteRouter = createRouter({
  list: publicQuery
    .input(z.object({
      clientId: z.number().optional(),
      vendorId: z.number().optional(),
      status: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const conditions: string[] = [];
      const params: any[] = [];

      if (input?.clientId) { conditions.push("clientId = ?"); params.push(input.clientId); }
      if (input?.vendorId) { conditions.push("vendorId = ?"); params.push(input.vendorId); }
      if (input?.status) { conditions.push("status = ?"); params.push(input.status); }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const limit = input?.limit ?? 50;

      return query(`SELECT * FROM quotes ${where} ORDER BY id DESC LIMIT ?`, [...params, limit]);
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return queryOne("SELECT * FROM quotes WHERE id = ?", [input.id]);
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
      const result = await db.insert(quotes).values(input);
      return { id: Number(result.lastInsertRowid), ...input };
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
