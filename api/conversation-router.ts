import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { conversations, messages } from "@db/schema";

export const conversationRouter = createRouter({
  list: publicQuery
    .input(z.object({
      clientId: z.number().optional(),
      vendorId: z.number().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const where = [];
      if (input.clientId) where.push(eq(conversations.clientId, input.clientId));
      if (input.vendorId) where.push(eq(conversations.vendorId, input.vendorId));

      return db.query.conversations.findMany({
        where: where.length > 0 ? and(...where) : undefined,
        limit: input.limit,
        orderBy: [desc(conversations.updatedAt)],
        with: { client: true, vendor: true },
      });
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const conv = await db.query.conversations.findFirst({
        where: eq(conversations.id, input.id),
        with: { client: true, vendor: true },
      });
      if (!conv) return null;

      const msgs = await db.query.messages.findMany({
        where: eq(messages.conversationId, input.id),
        orderBy: [messages.createdAt],
      });

      return { ...conv, messages: msgs };
    }),

  findOrCreate: publicQuery
    .input(z.object({
      clientId: z.number(),
      vendorId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.query.conversations.findFirst({
        where: and(
          eq(conversations.clientId, input.clientId),
          eq(conversations.vendorId, input.vendorId)
        ),
      });
      if (existing) return existing;

      const [result] = await db.insert(conversations).values(input);
      return { id: Number(result.insertId), ...input, clientUnread: 0, vendorUnread: 0 };
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
      await db.update(conversations).set({
        lastMessage: input.content,
        [unreadField]: sql`${conversations[unreadField as keyof typeof conversations]} + 1`,
        updatedAt: new Date(),
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
