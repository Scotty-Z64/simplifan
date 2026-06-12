import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { notifications } from "@db/schema";

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

export const notificationRouter = createRouter({
  list: publicQuery
    .input(z.object({
      userId: z.number(),
      userType: z.enum(["client", "vendor"]),
      unreadOnly: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const conditions = ["userId = ?", "userType = ?"];
      const params: any[] = [input.userId, input.userType];
      if (input.unreadOnly) { conditions.push("read = 0"); }

      const where = conditions.join(" AND ");
      return query(`SELECT * FROM notifications WHERE ${where} ORDER BY id DESC LIMIT ?`, [...params, input.limit]);
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
      const result = await db.insert(notifications).values(input);
      return { id: Number(result.lastInsertRowid), ...input };
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
      const result = queryOne(
        "SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND userType = ? AND read = 0",
        [input.userId, input.userType]
      ) as any;
      return Number(result?.count ?? 0);
    }),
});
