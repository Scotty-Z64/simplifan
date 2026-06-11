import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { bookings } from "@db/schema";

export const bookingRouter = createRouter({
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
      if (input?.clientId) where.push(eq(bookings.clientId, input.clientId));
      if (input?.vendorId) where.push(eq(bookings.vendorId, input.vendorId));
      if (input?.status) where.push(eq(bookings.status, input.status as any));

      return db.query.bookings.findMany({
        where: where.length > 0 ? and(...where) : undefined,
        limit: input?.limit ?? 50,
        orderBy: [desc(bookings.createdAt)],
        with: { vendor: true, client: true },
      });
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.bookings.findFirst({
        where: eq(bookings.id, input.id),
        with: { vendor: true, client: true, payments: true },
      });
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
      const [result] = await db.insert(bookings).values({
        ...rest,
        amount: amount.toString(),
        depositAmount: deposit.toString(),
        platformFee: fee.toString(),
        status: "pending",
      });
      return { id: Number(result.insertId), ...input, depositAmount: deposit, platformFee: fee };
    }),

  confirm: publicQuery
    .input(z.object({
      id: z.number(),
      role: z.enum(["client", "vendor"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const booking = await db.query.bookings.findFirst({
        where: eq(bookings.id, input.id),
      });
      if (!booking) throw new Error("Booking not found");

      const updates: any = {};
      if (input.role === "client") {
        updates.clientConfirmed = true;
        updates.clientConfirmedAt = new Date();
      } else {
        updates.vendorConfirmed = true;
        updates.vendorConfirmedAt = new Date();
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
