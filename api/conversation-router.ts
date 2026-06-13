import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { eq, and, desc } from "drizzle-orm";
import { conversations, messages, bookings } from "@db/schema";

// ─── Proxy/Masked Number Generator ───
// Each conversation gets a unique proxy number
// Neither party sees the other's real contact details
const PROXY_PREFIX = "081-PLAN-";

function generateProxyNumber(conversationId: number, party: "client" | "vendor"): string {
  const suffix = conversationId.toString().padStart(3, "0");
  return `${PROXY_PREFIX}${party === "client" ? "1" : "2"}${suffix}`;
}

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
  // Get all conversations for a client
  listByClient: publicQuery
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      const result = query(
        `SELECT c.*, v.businessName as vendorName, v.avatar as vendorAvatar, v.rating as vendorRating,
                (SELECT COUNT(*) FROM messages WHERE conversationId = c.id AND read = 0 AND senderType != 'client') as unreadCount
         FROM conversations c
         JOIN vendors v ON c.vendorId = v.id
         WHERE c.clientId = ?
         ORDER BY c.updatedAt DESC`,
        [input.clientId]
      );
      return result.map((r: any) => ({
        ...r,
        proxyClientNumber: generateProxyNumber(r.id, "client"),
        proxyVendorNumber: generateProxyNumber(r.id, "vendor"),
      }));
    }),

  // Get all conversations for a vendor
  listByVendor: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const result = query(
        `SELECT c.*, cl.name as clientName, cl.avatar as clientAvatar,
                (SELECT COUNT(*) FROM messages WHERE conversationId = c.id AND read = 0 AND senderType != 'vendor') as unreadCount
         FROM conversations c
         JOIN clients cl ON c.clientId = cl.id
         WHERE c.vendorId = ?
         ORDER BY c.updatedAt DESC`,
        [input.vendorId]
      );
      return result.map((r: any) => ({
        ...r,
        proxyClientNumber: generateProxyNumber(r.id, "client"),
        proxyVendorNumber: generateProxyNumber(r.id, "vendor"),
      }));
    }),

  // Start a conversation (client initiates)
  start: publicQuery
    .input(z.object({
      clientId: z.number(),
      clientName: z.string(),
      vendorId: z.number(),
      eventId: z.number().optional(),
      initialMessage: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if conversation already exists
      const existing = queryOne(
        "SELECT * FROM conversations WHERE clientId = ? AND vendorId = ?",
        [input.clientId, input.vendorId]
      );

      if (existing) {
        // Add message to existing conversation
        await db.insert(messages).values({
          conversationId: (existing as any).id,
          senderType: "client",
          content: input.initialMessage,
        });

        // Update conversation
        await db.update(conversations).set({
          lastMessage: input.initialMessage,
          clientUnread: 0,
          vendorUnread: (existing as any).vendorUnread + 1,
          updatedAt: new Date().toISOString(),
        }).where(eq(conversations.id, (existing as any).id));

        return {
          id: (existing as any).id,
          proxyClientNumber: generateProxyNumber((existing as any).id, "client"),
          proxyVendorNumber: generateProxyNumber((existing as any).id, "vendor"),
          message: "Message added to existing conversation",
        };
      }

      // Create new conversation
      const result = await db.insert(conversations).values({
        clientId: input.clientId,
        vendorId: input.vendorId,
        lastMessage: input.initialMessage,
        clientUnread: 0,
        vendorUnread: 1,
      });

      const convId = Number(result.lastInsertRowid);

      // Add initial message
      await db.insert(messages).values({
        conversationId: convId,
        senderType: "client",
        content: input.initialMessage,
      });

      return {
        id: convId,
        proxyClientNumber: generateProxyNumber(convId, "client"),
        proxyVendorNumber: generateProxyNumber(convId, "vendor"),
        message: "Conversation started",
      };
    }),

  // Get conversation with messages
  get: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const conv = queryOne("SELECT * FROM conversations WHERE id = ?", [input.id]);
      if (!conv) return null;

      const msgs = query(
        "SELECT * FROM messages WHERE conversationId = ? ORDER BY createdAt ASC",
        [input.id]
      );

      return {
        ...conv,
        messages: msgs,
        proxyClientNumber: generateProxyNumber(input.id, "client"),
        proxyVendorNumber: generateProxyNumber(input.id, "vendor"),
      };
    }),

  // Send a message
  sendMessage: publicQuery
    .input(z.object({
      conversationId: z.number(),
      senderType: z.enum(["client", "vendor"]),
      content: z.string().min(1).max(1000),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Insert message
      await db.insert(messages).values({
        conversationId: input.conversationId,
        senderType: input.senderType,
        content: input.content,
      });

      // Update conversation
      const unreadField = input.senderType === "client" ? "vendorUnread" : "clientUnread";
      const current = queryOne(
        `SELECT ${unreadField} as unread FROM conversations WHERE id = ?`,
        [input.conversationId]
      ) as any;

      await db.update(conversations).set({
        lastMessage: input.content,
        [unreadField]: (current?.unread ?? 0) + 1,
        updatedAt: new Date().toISOString(),
      }).where(eq(conversations.id, input.conversationId));

      return { success: true };
    }),

  // Mark messages as read
  markRead: publicQuery
    .input(z.object({
      conversationId: z.number(),
      readerType: z.enum(["client", "vendor"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Mark messages as read
      await db.update(messages).set({ read: true })
        .where(and(
          eq(messages.conversationId, input.conversationId),
          eq(messages.senderType, input.readerType === "client" ? "vendor" : "client")
        ));

      // Reset unread count
      const unreadField = input.readerType === "client" ? "clientUnread" : "vendorUnread";
      await db.update(conversations).set({
        [unreadField]: 0,
      }).where(eq(conversations.id, input.conversationId));

      return { success: true };
    }),

  // Get unread count
  unreadCount: publicQuery
    .input(z.object({
      userId: z.number(),
      userType: z.enum(["client", "vendor"]),
    }))
    .query(async ({ input }) => {
      const field = input.userType === "client" ? "clientId" : "vendorId";
      const unreadField = input.userType === "client" ? "clientUnread" : "vendorUnread";

      const result = queryOne(
        `SELECT SUM(${unreadField}) as total FROM conversations WHERE ${field} = ?`,
        [input.userId]
      ) as any;

      return Number(result?.total ?? 0);
    }),
});
