import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getPool } from "./queries/connection";
import { VENDOR_TERMS, OFF_PLATFORM_PENALTY } from "./vendor-terms";

function queryOne(sqlStr: string, params?: any[]) {
  const db = getPool();
  const stmt = db.prepare(sqlStr);
  return params ? stmt.get(...params) : stmt.get();
}

export const vendorTermsRouter = createRouter({
  // Get terms content
  getTerms: publicQuery.query(() => {
    return {
      ...VENDOR_TERMS,
      penalties: OFF_PLATFORM_PENALTY,
    };
  }),

  // Accept terms (vendor must call this before receiving bookings)
  accept: publicQuery
    .input(z.object({
      vendorId: z.number(),
      acceptedItems: z.array(z.string()).min(4),
    }))
    .mutation(async ({ input }) => {
      const db = getPool();

      // Store acceptance in vendor record
      db.prepare(
        `UPDATE vendors SET
         termsAccepted = 1,
         termsAcceptedAt = ?,
         termsVersion = ?
         WHERE id = ?`
      ).run(
        new Date().toISOString(),
        VENDOR_TERMS.version,
        input.vendorId
      );

      return {
        success: true,
        message: "Terms accepted. You can now receive bookings.",
        version: VENDOR_TERMS.version,
      };
    }),

  // Check if vendor has accepted terms
  checkStatus: publicQuery
    .input(z.object({ vendorId: z.number() }))
    .query(async ({ input }) => {
      const vendor = queryOne(
        "SELECT termsAccepted, termsAcceptedAt, termsVersion FROM vendors WHERE id = ?",
        [input.vendorId]
      ) as any;

      return {
        accepted: vendor?.termsAccepted === 1,
        acceptedAt: vendor?.termsAcceptedAt || null,
        version: vendor?.termsVersion || null,
        currentVersion: VENDOR_TERMS.version,
        needsReacceptance: vendor?.termsVersion !== VENDOR_TERMS.version,
      };
    }),

  // Report off-platform activity (client reports vendor trying to go direct)
  reportOffPlatform: publicQuery
    .input(z.object({
      vendorId: z.number(),
      clientId: z.number(),
      conversationId: z.number(),
      evidence: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getPool();

      // Log the report
      db.prepare(
        `INSERT INTO vendor_violations (vendorId, clientId, conversationId, type, evidence, createdAt)
         VALUES (?, ?, ?, 'off_platform', ?, ?)`
      ).run(
        input.vendorId,
        input.clientId,
        input.conversationId,
        input.evidence || null,
        new Date().toISOString()
      );

      // Increment violation count on vendor
      db.prepare(
        `UPDATE vendors SET violationCount = COALESCE(violationCount, 0) + 1 WHERE id = ?`
      ).run(input.vendorId);

      // Get current violation count
      const vendor = queryOne(
        "SELECT violationCount FROM vendors WHERE id = ?",
        [input.vendorId]
      ) as any;

      const count = vendor?.violationCount || 1;
      let action = OFF_PLATFORM_PENALTY.firstOffense;
      if (count >= 3) action = OFF_PLATFORM_PENALTY.thirdOffense;
      else if (count >= 2) action = OFF_PLATFORM_PENALTY.secondOffense;

      return {
        success: true,
        violationCount: count,
        action,
        message: `Report logged. Vendor has ${count} violation(s). Action: ${action}`,
      };
    }),
});
