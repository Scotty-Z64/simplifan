import { z } from "zod";
import { eq, and, like, sql, desc } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
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
      // Use raw SQL to bypass Drizzle prepared statement issue
      const pool = getPool();
      
      let sql = "SELECT * FROM vendors";
      const conditions: string[] = [];
      if (input?.category) conditions.push(`category = '${input.category}'`);
      if (input?.province) conditions.push(`province = '${input.province}'`);
      if (input?.tier) conditions.push(`tier = '${input.tier}'`);
      if (input?.featured) conditions.push("featured = 1");
      if (input?.search) conditions.push(`businessName LIKE '%${input.search}%'`);
      
      if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
      sql += " ORDER BY featured DESC, rating DESC";
      sql += ` LIMIT ${input?.limit ?? 20}`;
      if (input?.offset) sql += ` OFFSET ${input.offset}`;
      
      console.log("[VENDOR] Raw SQL:", sql.substring(0, 100));
      
      let result;
      try {
        if (pool) {
          const [rows] = await pool.execute(sql);
          result = rows;
        } else {
          result = await db.select().from(vendors).limit(input?.limit ?? 20);
        }
        console.log("[VENDOR] Success, rows:", result.length);
      } catch (e: any) {
        console.error("[VENDOR] FAILED:", e.message);
        throw e;
      }

      // Fetch services and images
      const vendorIds = result.map((v: any) => v.id);
      let services: any[] = [];
      let images: any[] = [];
      
      if (vendorIds.length > 0 && pool) {
        const idList = vendorIds.join(',');
        const [svcRows] = await pool.execute(`SELECT * FROM vendor_services WHERE vendorId IN (${idList})`);
        const [imgRows] = await pool.execute(`SELECT * FROM vendor_images WHERE vendorId IN (${idList})`);
        services = svcRows as any[];
        images = imgRows as any[];
      }

      return result.map((v: any) => ({
        ...v,
        services: services.filter((s: any) => s.vendorId === v.id),
        images: images.filter((i: any) => i.vendorId === v.id),
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
      const [result] = await db.insert(vendors).values({
        ...vendorData,
        avatar,
        subscriptionEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
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
      const [vendor] = await db.select().from(vendors)
        .where(eq(vendors.id, input.vendorId))
        .limit(1);
      if (!vendor) return null;

      const services = await db.select().from(vendorServices)
        .where(eq(vendorServices.vendorId, input.vendorId));

      const reviewData = await db.select({
        avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
        count: sql<number>`COUNT(*)`,
      }).from(reviews).where(eq(reviews.vendorId, input.vendorId));

      return {
        ...vendor,
        services,
        avgRating: Number(reviewData[0]?.avgRating ?? 0),
        reviewCount: Number(reviewData[0]?.count ?? 0),
      };
    }),
});
