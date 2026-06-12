import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { conversations, messages } from "@db/schema";

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

export const conversationRouter = createRouter({
  list: publicQuery
    .input(z.object({
      clientId: z.number().optional(),
      vendorId: z.number().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const conditions: string[] = [];
      const params: any[] = [];

      if (input.clientId) { conditions.push("clientId = ?"); params.push(input.clientId); }
      if (input.vendorId) { conditions.push("vendorId = ?"); params.push(input.vendorId); }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      return query(`SELECT * FROM conversations ${where} ORDER BY id DESC LIMIT ?`, [...params, input.limit]);
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const conv = queryOne("SELECT * FROM conversations WHERE id = ?", [input.id]);
      if (!conv) return null;

      const msgs = query("SELECT * FROM messages WHERE conversationId = ? ORDER BY id ASC", [input.id]);
      return { ...conv, messages: msgs };
    }),

  findOrCreate: publicQuery
    .input(z.object({
      clientId: z.number(),
      vendorId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = queryOne(
        "SELECT * FROM conversations WHERE clientId = ? AND vendorId = ?",
        [input.clientId, input.vendorId]
      );
      if (existing) return existing;

      const result = await db.insert(conversations).values(input);
      return { id: Number(result.lastInsertRowid), ...input, clientUnread: 0, vendorUnread: 0 };
    }),

  sendMessage: publicQuery
    .input(z.object({
      conversationId: z.number(),
      senderType: z.enum(["client", "vendor"]),
      content: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [msgResult] = await db.insert(messages).values({
        conversationId: input.conversationId,
        senderType: input.senderType,
        content: input.content,
      });

      // Update conversation
      const unreadField = input.senderType === "client" ? "vendorUnread" : "clientUnread";
      const current = queryOne(`SELECT ${unreadField} as unread FROM conversations WHERE id = ?`, [input.conversationId]) as any;

      await db.update(conversations).set({
        lastMessage: input.content,
        [unreadField]: (current?.unread ?? 0) + 1,
      }).where(eq(conversations.id, input.conversationId));

      return { id: Number(msgResult.insertId), ...input };
    }),

  markRead: publicQuery
    .input(z.object({
      conversationId: z.number(),
      userType: z.enum(["client", "vendor"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const unreadField = input.userType === "client" ? "clientUnread" : "vendorUnread";

      // Mark messages as read
      await db.update(messages).set({ read: true })
        .where(and(
          eq(messages.conversationId, input.conversationId),
          eq(messages.senderType, input.userType === "client" ? "vendor" : "client")
        ));

      // Reset unread count
      await db.update(conversations).set({
        [unreadField]: 0,
      }).where(eq(conversations.id, input.conversationId));

      return { success: true };
    }),
});
