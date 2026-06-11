import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { payments } from "@db/schema";

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
      const db = getDb();
      const where = [];
      if (input?.bookingId) where.push(eq(payments.bookingId, input.bookingId));
      if (input?.vendorId) where.push(eq(payments.vendorId, input.vendorId));
      if (input?.clientId) where.push(eq(payments.clientId, input.clientId));
      if (input?.status) where.push(eq(payments.status, input.status as any));

      return db.query.payments.findMany({
        where: where.length > 0 ? and(...where) : undefined,
        limit: input?.limit ?? 50,
        orderBy: [desc(payments.createdAt)],
      });
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
      const [result] = await db.insert(payments).values({
        ...input,
        amount: input.amount.toString(),
        status: "pending",
      });
      return { id: Number(result.insertId), ...input };
    }),

  verify: publicQuery
    .input(z.object({
      payfastPaymentId: z.string(),
      status: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const payment = await db.query.payments.findFirst({
        where: eq(payments.payfastPaymentId, input.payfastPaymentId),
      });
      if (!payment) return { success: false, error: "Payment not found" };

      const isComplete = input.status === "COMPLETE";
      await db.update(payments).set({
        status: isComplete ? "completed" : "failed",
        payfastStatus: input.status,
        completedAt: isComplete ? new Date() : null,
      }).where(eq(payments.id, payment.id));

      return { success: true, paymentId: payment.id };
    }),

  // Initiate PayFast payment - returns form fields for client-side submission
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

      // Generate signature
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

      // Build signature string
      const sortedKeys = Object.keys(data).sort();
      let sigStr = "";
      for (const key of sortedKeys) {
        sigStr += `${key}=${encodeURIComponent(data[key] ?? "")}&`;
      }
      sigStr = sigStr.slice(0, -1);
      if (PAYFAST_PASSPHRASE) {
        sigStr += `&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE)}`;
      }

      // MD5 hash would be computed server-side with crypto module
      // const signature = crypto.createHash('md5').update(sigStr).digest('hex');

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
      const db = getDb();
      const vendorPayments = await db.query.payments.findMany({
        where: and(
          eq(payments.vendorId, input.vendorId),
          eq(payments.status, "completed")
        ),
        orderBy: [desc(payments.createdAt)],
      });

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
