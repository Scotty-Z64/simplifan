import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { clients } from "@db/schema";

function queryOne(sql: string, params?: any[]) {
  const db = getPool();
  const stmt = db.prepare(sql);
  return params ? stmt.get(...params) : stmt.get();
}

export const clientRouter = createRouter({
  byPhone: publicQuery
    .input(z.object({ phone: z.string() }))
    .query(async ({ input }) => {
      return queryOne("SELECT * FROM clients WHERE phone = ?", [input.phone]);
    }),

  create: publicQuery
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().min(1),
      location: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = queryOne("SELECT * FROM clients WHERE phone = ?", [input.phone]);
      if (existing) return existing;

      const [result] = await db.insert(clients).values({
        ...input,
        avatar: input.name.charAt(0).toUpperCase(),
      });
      return { id: Number(result.insertId), ...input };
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(clients).set(data).where(eq(clients.id, id));
      return { success: true };
    }),

  list: publicQuery.query(async () => {
    const db = getPool();
    return db.prepare("SELECT * FROM clients ORDER BY id DESC").all();
  }),
});
