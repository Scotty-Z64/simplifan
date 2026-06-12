import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { bookings } from "@db/schema";

function query(sql: string, params?: any[]) {
  const db = getPool();
  const stmt = db.prepare(sql);
  return params ? stmt.all(...params) : stmt.all();
}

function queryOne(sql: string, params?: any[]) {
  const db = getPool();
  const stmt = db.prepare(sql);
  return params ? stmt.get(...params) : stmt.get();
}

export const bookingRouter = createRouter({
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

      return query(`SELECT * FROM bookings ${where} ORDER BY id DESC LIMIT ?`, [...params, limit]);
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return queryOne("SELECT * FROM bookings WHERE id = ?", [input.id]);
    }),

  create: publicQuery
    .input(z.object({
      clientId: z.number(),
      clientName: z.string(),
      clientPhone: z.string(),
      vendorId: z.number(),
      vendorName: z.string(),
      eventType: z.string(),
      eventDate: z.string().optional(),
      amount: z.number().positive(),
      depositAmount: z.number().optional(),
      platformFee: z.number().optional(),
      quoteId: z.number().optional(),
      eventId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const deposit = input.depositAmount ?? Math.round(input.amount * 0.5);
      const fee = input.platformFee ?? Math.round(input.amount * 0.05);
      const { amount, depositAmount, platformFee, ...rest } = input;
      const result = await db.insert(bookings).values({
        ...rest,
        amount: amount.toString(),
        depositAmount: deposit.toString(),
        platformFee: fee.toString(),
        status: "pending",
      });
      return { id: Number(result.lastInsertRowid), ...input, depositAmount: deposit, platformFee: fee };
    }),

  confirm: publicQuery
    .input(z.object({
      id: z.number(),
      role: z.enum(["client", "vendor"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const booking = queryOne("SELECT * FROM bookings WHERE id = ?", [input.id]) as any;
      if (!booking) throw new Error("Booking not found");

      const updates: any = {};
      if (input.role === "client") {
        updates.clientConfirmed = true;
      } else {
        updates.vendorConfirmed = true;
      }

      if ((input.role === "client" && booking.vendorConfirmed) ||
          (input.role === "vendor" && booking.clientConfirmed)) {
        updates.status = "confirmed";
      }

      await db.update(bookings).set(updates).where(eq(bookings.id, input.id));
      return { success: true, status: updates.status ?? booking.status };
    }),

  dispute: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(bookings).set({ status: "disputed" }).where(eq(bookings.id, input.id));
      return { success: true };
    }),

  complete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(bookings).set({ status: "completed" }).where(eq(bookings.id, input.id));
      return { success: true };
    }),
});
