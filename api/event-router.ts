import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { events, eventItems } from "@db/schema";

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

export const eventRouter = createRouter({
  list: publicQuery
    .input(z.object({
      clientId: z.number().optional(),
      status: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const conditions: string[] = [];
      const params: any[] = [];

      if (input?.clientId) { conditions.push("clientId = ?"); params.push(input.clientId); }
      if (input?.status) { conditions.push("status = ?"); params.push(input.status); }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const limit = input?.limit ?? 50;

      return query(`SELECT * FROM events ${where} ORDER BY id DESC LIMIT ?`, [...params, limit]);
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const event = queryOne("SELECT * FROM events WHERE id = ?", [input.id]);
      if (!event) return null;

      const items = query("SELECT * FROM event_items WHERE eventId = ?", [input.id]);
      return { ...event, items };
    }),

  create: publicQuery
    .input(z.object({
      clientId: z.number(),
      clientName: z.string(),
      clientPhone: z.string(),
      eventType: z.string(),
      eventDate: z.string().optional(),
      eventTime: z.string().optional(),
      guestCount: z.number().optional(),
      province: z.string().optional(),
      city: z.string().optional(),
      area: z.string().optional(),
      venue: z.string().optional(),
      budget: z.number().positive(),
      notes: z.string().optional(),
      items: z.array(z.object({
        category: z.string(),
        service: z.string().optional(),
        price: z.number().optional(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { items, budget, ...eventData } = input;

      const [result] = await db.insert(events).values({
        ...eventData,
        budget: budget.toString(),
        totalCost: "0",
        status: "planning",
      });

      const eventId = Number(result.insertId);

      if (items && items.length > 0) {
        await db.insert(eventItems).values(
          items.map(item => ({
            eventId,
            category: item.category,
            service: item.service ?? null,
            price: item.price ? item.price.toString() : "0",
            status: "pending" as const,
          }))
        );
      }

      return { id: eventId, ...eventData };
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      eventType: z.string().optional(),
      eventDate: z.string().optional(),
      guestCount: z.number().optional(),
      budget: z.number().optional(),
      status: z.enum(["planning", "quoted", "deposit_paid", "confirmed", "ready", "completed", "cancelled"]).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, budget, ...data } = input;
      const updates: any = { ...data };
      if (budget !== undefined) updates.budget = budget.toString();
      await db.update(events).set(updates).where(eq(events.id, id));
      return { success: true };
    }),

  addItem: publicQuery
    .input(z.object({
      eventId: z.number(),
      category: z.string(),
      service: z.string().optional(),
      vendorId: z.number().optional(),
      vendorName: z.string().optional(),
      price: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { eventId, price, ...itemData } = input;
      await db.insert(eventItems).values({
        eventId,
        ...itemData,
        price: price ? price.toString() : "0",
      });
      return { success: true };
    }),

  updateItemStatus: publicQuery
    .input(z.object({
      itemId: z.number(),
      status: z.enum(["pending", "quoted", "accepted", "booked", "completed", "declined"]),
      vendorId: z.number().optional(),
      vendorName: z.string().optional(),
      price: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { itemId, price, ...data } = input;
      const updates: any = { ...data };
      if (price !== undefined) updates.price = price.toString();
      await db.update(eventItems).set(updates).where(eq(eventItems.id, itemId));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(eventItems).where(eq(eventItems.eventId, input.id));
      await db.delete(events).where(eq(events.id, input.id));
      return { success: true };
    }),
});
