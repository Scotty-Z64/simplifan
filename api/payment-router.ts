import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb, getPool } from "./queries/connection";
import { eq, and } from "drizzle-orm";
import { payments, bookings } from "@db/schema";

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
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || "10000100";
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a";
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "jt7NOE43FZPn";
const PAYFAST_URL = "https://sandbox.payfast.co.za/eng/process";
const SIMPLIPAN_FEE_PERCENT = 5; // 5% platform fee

export const paymentRouter = createRouter({
  // ─── ESCROW PAYMENTS ───
  // Client pays into SimpliPlan escrow → vendor gets paid after event completes

  // Create escrow payment (client pays deposit)
  createEscrow: publicQuery
    .input(z.object({
      bookingId: z.number(),
      clientId: z.number(),
      vendorId: z.number(),
      amount: z.number().positive(),
      type: z.enum(["deposit", "full_payment", "milestone"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const platformFee = Math.round(input.amount * (SIMPLIPAN_FEE_PERCENT / 100));
      const vendorAmount = input.amount - platformFee;

      const result = await db.insert(payments).values({
        bookingId: input.bookingId,
        vendorId: input.vendorId,
        clientId: input.clientId,
        amount: input.amount.toString(),
        type: input.type,
        status: "escrow", // In escrow until event completes
      });

      return {
        id: Number(result.lastInsertRowid),
        amount: input.amount,
        platformFee,
        vendorAmount,
        status: "escrow",
        message: `R${input.amount} held in escrow. Vendor receives R${vendorAmount} after event (R${platformFee} platform fee).`,
      };
    }),

  // Release escrow to vendor (after event completes)
  releaseEscrow: publicQuery
    .input(z.object({
      paymentId: z.number(),
      releaseType: z.enum(["completed", "partial", "refund"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const payment = queryOne("SELECT * FROM payments WHERE id = ?", [input.paymentId]) as any;
      if (!payment) return { success: false, error: "Payment not found" };

      if (payment.status !== "escrow") {
        return { success: false, error: `Payment already ${payment.status}` };
      }

      const amount = Number(payment.amount);
      const platformFee = Math.round(amount * (SIMPLIPAN_FEE_PERCENT / 100));

      let newStatus: string;
      let vendorReceives: number;

      if (input.releaseType === "completed") {
        newStatus = "released";
        vendorReceives = amount - platformFee;
      } else if (input.releaseType === "partial") {
        newStatus = "partially_released";
        vendorReceives = Math.round((amount - platformFee) / 2);
      } else {
        newStatus = "refunded";
        vendorReceives = 0;
      }

      await db.update(payments).set({
        status: newStatus,
        type: `${payment.type}_${input.releaseType}`,
        completedAt: new Date().toISOString(),
      }).where(eq(payments.id, input.paymentId));

      // Update booking status
      if (input.releaseType === "completed") {
        await db.update(bookings).set({
          status: "completed",
        }).where(eq(bookings.id, payment.bookingId));
      }

      return {
        success: true,
        status: newStatus,
        totalAmount: amount,
        platformFee,
        vendorReceives,
        refundToClient: input.releaseType === "refund" ? amount : 0,
      };
    }),

  // Get escrow status for a booking
  escrowStatus: publicQuery
    .input(z.object({ bookingId: z.number() }))
    .query(async ({ input }) => {
      const payment = queryOne(
        "SELECT * FROM payments WHERE bookingId = ? ORDER BY id DESC LIMIT 1",
        [input.bookingId]
      ) as any;

      if (!payment) return { status: "no_payment", amount: 0 };

      return {
        status: payment.status,
        amount: Number(payment.amount),
        type: payment.type,
        platformFee: Math.round(Number(payment.amount) * 0.05),
        createdAt: payment.createdAt,
        releasedAt: payment.completedAt,
      };
    }),

  // ─── PAYFAST INTEGRATION ───

  initiate: publicQuery
    .input(z.object({
      amount: z.number().positive(),
      itemName: z.string(),
      bookingId: z.string().optional(),
      clientName: z.string().optional(),
      clientEmail: z.string().optional(),
    }))
    .query(({ input }) => {
      const { amount, itemName, bookingId, clientName, clientEmail } = input;

      const fields: Record<string, string> = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: `https://simplifan-production.up.railway.app/#/payment-success`,
        cancel_url: `https://simplifan-production.up.railway.app/#/payment-cancel`,
        notify_url: `https://simplifan-production.up.railway.app/api/payfast-webhook`,
        name_first: clientName || "Client",
        email_address: clientEmail || "client@simplipan.co.za",
        m_payment_id: `sp_${Date.now()}`,
        amount: amount.toFixed(2),
        item_name: itemName,
        ...(bookingId ? { custom_str1: bookingId } : {}),
      };

      return {
        url: PAYFAST_URL,
        fields,
        merchantId: PAYFAST_MERCHANT_ID,
        merchantKey: PAYFAST_MERCHANT_KEY,
      };
    }),

  // Vendor earnings overview
  vendorEarnings: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const vendorPayments = query(
        `SELECT * FROM payments WHERE vendorId = ? AND status IN ('completed', 'released', 'partially_released') ORDER BY id DESC`,
        [input.vendorId]
      ) as any[];

      const escrowed = query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE vendorId = ? AND status = 'escrow'`,
        [input.vendorId]
      ) as any;

      const totalGross = vendorPayments.reduce((s, p) => s + Number(p.amount), 0);
      const totalFees = Math.round(totalGross * (SIMPLIPAN_FEE_PERCENT / 100));

      return {
        payments: vendorPayments,
        totalGross,
        totalFees,
        totalNet: totalGross - totalFees,
        inEscrow: Number(escrowed?.total ?? 0),
        platformFeePercent: SIMPLIPAN_FEE_PERCENT,
      };
    }),
});
