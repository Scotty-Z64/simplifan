import { z } from "zod";
import { eq, and, like, desc } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { vendors, vendorServices, vendorImages, reviews } from "@db/schema";

// Helper to run raw SQL queries
function query(sql: string, params?: any[]) {
  const db = getPool();
  const stmt = db.prepare(sql);
  return params ? stmt.all(...params) : stmt.all();
}

function queryOne(sql: string, params?: any[]) {
  const db = getPool();
  const stmt = db.prepare(sql);
  return params ? stmt.get(...params) : stmt.get();
}

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
      const conditions: string[] = ["isActive = 1"];
      const params: any[] = [];

      if (input?.category) { conditions.push("category = ?"); params.push(input.category); }
      if (input?.province) { conditions.push("province = ?"); params.push(input.province); }
      if (input?.tier) { conditions.push("tier = ?"); params.push(input.tier); }
      if (input?.featured) { conditions.push("featured = 1"); }
      if (input?.search) { conditions.push("businessName LIKE ?"); params.push(`%${input.search}%`); }

      const where = conditions.join(" AND ");
      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;

      // Fetch vendors
      const result = query(
        `SELECT * FROM vendors WHERE ${where} ORDER BY featured DESC, rating DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      ) as any[];

      // Fetch services and images for these vendors
      const vendorIds = result.map((v: any) => v.id);
      let services: any[] = [];
      let images: any[] = [];

      if (vendorIds.length > 0) {
        const placeholders = vendorIds.map(() => "?").join(",");
        services = query(
          `SELECT id, vendorId, name, description, price, category FROM vendor_services WHERE vendorId IN (${placeholders})`,
          vendorIds
        ) as any[];
        images = query(
          `SELECT id, vendorId, url, caption FROM vendor_images WHERE vendorId IN (${placeholders})`,
          vendorIds
        ) as any[];
      }

      return result.map(v => ({
        ...v,
        services: services.filter((s: any) => s.vendorId === v.id),
        images: images.filter((i: any) => i.vendorId === v.id),
      }));
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const vendor = queryOne("SELECT * FROM vendors WHERE id = ?", [input.id]) as any;
      if (!vendor) return null;

      const services = query("SELECT id, vendorId, name, description, price, category FROM vendor_services WHERE vendorId = ?", [input.id]) as any[];
      const imgs = query("SELECT id, vendorId, url, caption FROM vendor_images WHERE vendorId = ?", [input.id]) as any[];
      const vendorReviews = query("SELECT * FROM reviews WHERE vendorId = ? ORDER BY id DESC LIMIT 20", [input.id]) as any[];

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
    const result = query("SELECT DISTINCT category FROM vendors WHERE isActive = 1") as any[];
    return result.map((r: any) => r.category).filter(Boolean);
  }),

  provinces: publicQuery.query(async () => {
    const result = query("SELECT DISTINCT province FROM vendors WHERE isActive = 1") as any[];
    return result.map((r: any) => r.province).filter(Boolean);
  }),

  stats: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const vendor = queryOne("SELECT * FROM vendors WHERE id = ?", [input.vendorId]) as any;
      if (!vendor) return null;

      const services = query("SELECT id, vendorId, name, description, price, category FROM vendor_services WHERE vendorId = ?", [input.vendorId]) as any[];
      const reviewData = query("SELECT * FROM reviews WHERE vendorId = ?", [input.vendorId]) as any[];

      const avgRating = reviewData.length > 0
        ? reviewData.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviewData.length
        : 0;

      return {
        ...vendor,
        services,
        avgRating: avgRating.toFixed(1),
        reviewCount: reviewData.length,
      };
    }),
});
