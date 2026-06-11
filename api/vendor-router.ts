import { z } from "zod";
import { eq, and, like, sql, desc } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { vendors, vendorServices, reviews } from "@db/schema";

export const vendorRouter = createRouter({
  list: publicQuery
    .input(z.object({
      category: z.string().optional(),
      province: z.string().optional(),
      search: z.string().optional(),
      tier: z.enum(["starter", "pro", "elite"]).optional(),
      featured: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const where = [];
      if (input?.category) where.push(eq(vendors.category, input.category));
      if (input?.province) where.push(eq(vendors.province, input.province));
      if (input?.tier) where.push(eq(vendors.tier, input.tier));
      if (input?.featured) where.push(eq(vendors.featured, true));
      if (input?.search) where.push(like(vendors.businessName, `%${input.search}%`));

      const result = await db.query.vendors.findMany({
        where: where.length > 0 ? and(...where) : undefined,
        limit: input?.limit ?? 20,
        offset: input?.offset ?? 0,
        orderBy: [desc(vendors.featured), desc(vendors.rating)],
        with: { services: true, images: true },
      });
      return result;
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const vendor = await db.query.vendors.findFirst({
        where: eq(vendors.id, input.id),
        with: { services: true, images: true },
      });
      if (!vendor) return null;

      const vendorReviews = await db.query.reviews.findMany({
        where: eq(reviews.vendorId, input.id),
        limit: 20,
        orderBy: [desc(reviews.createdAt)],
      });

      return { ...vendor, reviews: vendorReviews };
    }),

  create: publicQuery
    .input(z.object({
      businessName: z.string().min(2),
      ownerName: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
      category: z.string(),
      subcategory: z.string().optional(),
      bio: z.string().optional(),
      province: z.string().optional(),
      city: z.string().optional(),
      address: z.string().optional(),
      priceRange: z.string().optional(),
      yearsInBusiness: z.number().optional(),
      services: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.string().optional(),
        category: z.string().optional(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { services, ...vendorData } = input;

      const avatar = vendorData.businessName.charAt(0).toUpperCase();
      const [result] = await db.insert(vendors).values({
        ...vendorData,
        avatar,
        subscriptionEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 day trial
      });

      const vendorId = Number(result.insertId);

      if (services && services.length > 0) {
        await db.insert(vendorServices).values(
          services.map(s => ({
            vendorId,
            name: s.name,
            description: s.description ?? null,
            price: s.price ? s.price : null,
            category: s.category ?? vendorData.category,
          }))
        );
      }

      return { id: vendorId, ...vendorData, avatar };
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      businessName: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      category: z.string().optional(),
      bio: z.string().optional(),
      province: z.string().optional(),
      city: z.string().optional(),
      address: z.string().optional(),
      priceRange: z.string().optional(),
      yearsInBusiness: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(vendors).set(data).where(eq(vendors.id, id));
      return { success: true };
    }),

  categories: publicQuery.query(async () => {
    const db = getDb();
    const result = await db.selectDistinct({ category: vendors.category }).from(vendors).where(eq(vendors.isActive, true));
    return result.map(r => r.category).filter(Boolean);
  }),

  provinces: publicQuery.query(async () => {
    const db = getDb();
    const result = await db.selectDistinct({ province: vendors.province }).from(vendors).where(eq(vendors.isActive, true));
    return result.map(r => r.province).filter(Boolean);
  }),

  stats: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const vendor = await db.query.vendors.findFirst({
        where: eq(vendors.id, input.vendorId),
        with: { services: true },
      });
      if (!vendor) return null;

      const reviewData = await db.select({
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        count: sql<number>`COUNT(*)`,
      }).from(reviews).where(eq(reviews.vendorId, input.vendorId));

      return {
        ...vendor,
        avgRating: Number(reviewData[0]?.avgRating ?? 0),
        reviewCount: Number(reviewData[0]?.count ?? 0),
      };
    }),
});
