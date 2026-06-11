import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { clients } from "@db/schema";

export const clientRouter = createRouter({
  byPhone: publicQuery
    .input(z.object({ phone: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.clients.findFirst({
        where: eq(clients.phone, input.phone),
      });
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
      const existing = await db.query.clients.findFirst({
        where: eq(clients.phone, input.phone),
      });
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
    const db = getDb();
    return db.query.clients.findMany({
      orderBy: (clients, { desc }) => [desc(clients.createdAt)],
    });
  }),
});
