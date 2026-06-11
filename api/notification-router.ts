import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { notifications } from "@db/schema";

export const notificationRouter = createRouter({
  list: publicQuery
    .input(z.object({
      userId: z.number(),
      userType: z.enum(["client", "vendor"]),
      unreadOnly: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const where = [
        eq(notifications.userId, input.userId),
        eq(notifications.userType, input.userType),
      ];
      if (input.unreadOnly) where.push(eq(notifications.read, false));

      return db.query.notifications.findMany({
        where: and(...where),
        limit: input.limit,
        orderBy: [desc(notifications.createdAt)],
      });
    }),

  create: publicQuery
    .input(z.object({
      userId: z.number(),
      userType: z.enum(["client", "vendor"]),
      type: z.string(),
      title: z.string(),
      message: z.string(),
      link: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(notifications).values(input);
      return { id: Number(result.insertId), ...input };
    }),

  markRead: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(notifications).set({ read: true }).where(eq(notifications.id, input.id));
      return { success: true };
    }),

  markAllRead: publicQuery
    .input(z.object({
      userId: z.number(),
      userType: z.enum(["client", "vendor"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(notifications).set({ read: true })
        .where(and(
          eq(notifications.userId, input.userId),
          eq(notifications.userType, input.userType)
        ));
      return { success: true };
    }),

  unreadCount: publicQuery
    .input(z.object({
      userId: z.number(),
      userType: z.enum(["client", "vendor"]),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select({
        count: sql<number>`COUNT(*)`,
      }).from(notifications).where(and(
        eq(notifications.userId, input.userId),
        eq(notifications.userType, input.userType),
        eq(notifications.read, false)
      ));
      return Number(result[0]?.count ?? 0);
    }),
});
