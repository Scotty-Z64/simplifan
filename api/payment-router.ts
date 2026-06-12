import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { payments } from "@db/schema";

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

// PayFast sandbox config
const PAYFAST_MERCHANT_ID = "10000100";
const PAYFAST_MERCHANT_KEY = "46f0cd694581a";
const PAYFAST_PASSPHRASE = "jt7NOE43FZPn";
const PAYFAST_URL = "https://sandbox.payfast.co.za/eng/process";

export const paymentRouter = createRouter({
  list: publicQuery
    .input(z.object({
      bookingId: z.number().optional(),
      vendorId: z.number().optional(),
      clientId: z.number().optional(),
      status: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }).optional())
    .query(async ({ input }) => {
      const conditions: string[] = [];
      const params: any[] = [];

      if (input?.bookingId) { conditions.push("bookingId = ?"); params.push(input.bookingId); }
      if (input?.vendorId) { conditions.push("vendorId = ?"); params.push(input.vendorId); }
      if (input?.clientId) { conditions.push("clientId = ?"); params.push(input.clientId); }
      if (input?.status) { conditions.push("status = ?"); params.push(input.status); }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
      const limit = input?.limit ?? 50;

      return query(`SELECT * FROM payments ${where} ORDER BY id DESC LIMIT ?`, [...params, limit]);
    }),

  create: publicQuery
    .input(z.object({
      bookingId: z.number().optional(),
      vendorId: z.number().optional(),
      clientId: z.number().optional(),
      amount: z.number().positive(),
      type: z.enum(["deposit", "full_payment", "platform_fee", "payout", "refund"]),
      payfastPaymentId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(payments).values({
        ...input,
        amount: input.amount.toString(),
        status: "pending",
      });
      return { id: Number(result.lastInsertRowid), ...input };
    }),

  verify: publicQuery
    .input(z.object({
      payfastPaymentId: z.string(),
      status: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const payment = queryOne("SELECT * FROM payments WHERE payfastPaymentId = ?", [input.payfastPaymentId]);
      if (!payment) return { success: false, error: "Payment not found" };

      const isComplete = input.status === "COMPLETE";
      await db.update(payments).set({
        status: isComplete ? "completed" : "failed",
        payfastStatus: input.status,
      }).where(eq(payments.id, (payment as any).id));

      return { success: true, paymentId: (payment as any).id };
    }),

  initiate: publicQuery
    .input(z.object({
      amount: z.number().positive(),
      itemName: z.string(),
      itemDescription: z.string().optional(),
      returnUrl: z.string().url(),
      cancelUrl: z.string().url(),
      notifyUrl: z.string().url(),
      bookingId: z.string().optional(),
      vendorId: z.string().optional(),
      clientName: z.string().optional(),
      clientEmail: z.string().optional(),
    }))
    .query(({ input }) => {
      const { amount, itemName, itemDescription, returnUrl, cancelUrl, notifyUrl, bookingId, vendorId, clientName, clientEmail } = input;

      const data: Record<string, string> = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: notifyUrl,
        name_first: clientName || "Client",
        email_address: clientEmail || "client@example.com",
        m_payment_id: `sp_${Date.now()}`,
        amount: amount.toFixed(2),
        item_name: itemName,
        ...(itemDescription ? { item_description: itemDescription } : {}),
        ...(bookingId ? { custom_str1: bookingId } : {}),
        ...(vendorId ? { custom_str2: vendorId } : {}),
      };

      return {
        url: PAYFAST_URL,
        fields: data,
        merchantId: PAYFAST_MERCHANT_ID,
        merchantKey: PAYFAST_MERCHANT_KEY,
      };
    }),

  vendorEarnings: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const vendorPayments = query(
        "SELECT * FROM payments WHERE vendorId = ? AND status = 'completed' ORDER BY id DESC",
        [input.vendorId]
      ) as any[];

      const totalGross = vendorPayments.reduce((s, p) => s + Number(p.amount), 0);
      const platformFees = vendorPayments.filter(p => p.type === "platform_fee").reduce((s, p) => s + Number(p.amount), 0);

      return {
        payments: vendorPayments,
        totalGross,
        totalFees: platformFees,
        totalNet: totalGross - platformFees,
      };
    }),
});
