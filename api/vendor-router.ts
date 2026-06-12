import { z } from "zod";
import { eq, and, like, desc } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { vendors, vendorServices, vendorImages, reviews } from "@db/schema";

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
      const conditions = [];
      
      if (input?.category) conditions.push(eq(vendors.category, input.category));
      if (input?.province) conditions.push(eq(vendors.province, input.province));
      if (input?.tier) conditions.push(eq(vendors.tier, input.tier));
      if (input?.featured) conditions.push(eq(vendors.featured, 1));
      if (input?.search) conditions.push(like(vendors.businessName, `%${input.search}%`));

      const result = await db.select().from(vendors)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(input?.limit ?? 20)
        .offset(input?.offset ?? 0)
        .orderBy(desc(vendors.featured), desc(vendors.rating));

      // Fetch services and images separately
      const vendorIds = result.map(v => v.id);
      let services: any[] = [];
      let images: any[] = [];
      
      if (vendorIds.length > 0) {
        services = await db.select().from(vendorServices)
          .where(vendorIds.length === 1 
            ? eq(vendorServices.vendorId, vendorIds[0])
            : undefined);
        images = await db.select().from(vendorImages)
          .where(vendorIds.length === 1
            ? eq(vendorImages.vendorId, vendorIds[0])
            : undefined);
      }

      // Merge
      return result.map(v => ({
        ...v,
        services: services.filter(s => s.vendorId === v.id),
        images: images.filter(i => i.vendorId === v.id),
      }));
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [vendor] = await db.select().from(vendors)
        .where(eq(vendors.id, input.id))
        .limit(1);
      if (!vendor) return null;

      const services = await db.select().from(vendorServices)
        .where(eq(vendorServices.vendorId, input.id));
      const imgs = await db.select().from(vendorImages)
        .where(eq(vendorImages.vendorId, input.id));
      const vendorReviews = await db.select().from(reviews)
        .where(eq(reviews.vendorId, input.id))
        .orderBy(desc(reviews.createdAt))
        .limit(20);

      return { ...vendor, services, images: imgs, reviews: vendorReviews };
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
      const result = await db.insert(vendors).values({
        ...vendorData,
        avatar,
        subscriptionEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      });

      const vendorId = Number(result.lastInsertRowid);

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
    const result = await db.selectDistinct({ category: vendors.category }).from(vendors).where(eq(vendors.isActive, 1));
    return result.map(r => r.category).filter(Boolean);
  }),

  provinces: publicQuery.query(async () => {
    const db = getDb();
    const result = await db.selectDistinct({ province: vendors.province }).from(vendors).where(eq(vendors.isActive, 1));
    return result.map(r => r.province).filter(Boolean);
  }),

  stats: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [vendor] = await db.select().from(vendors)
        .where(eq(vendors.id, input.vendorId))
        .limit(1);
      if (!vendor) return null;

      const services = await db.select().from(vendorServices)
        .where(eq(vendorServices.vendorId, input.vendorId));

      const reviewData = await db.select().from(reviews)
        .where(eq(reviews.vendorId, input.vendorId));

      const avgRating = reviewData.length > 0 
        ? reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length 
        : 0;

      return {
        ...vendor,
        services,
        avgRating: avgRating.toFixed(1),
        reviewCount: reviewData.length,
      };
    }),
});
