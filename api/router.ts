import { authRouter } from "./auth-router";
import { vendorRouter } from "./vendor-router";
import { clientRouter } from "./client-router";
import { quoteRouter } from "./quote-router";
import { bookingRouter } from "./booking-router";
import { paymentRouter } from "./payment-router";
import { reviewRouter } from "./review-router";
import { eventRouter } from "./event-router";
import { conversationRouter } from "./conversation-router";
import { notificationRouter } from "./notification-router";
import { analyticsRouter } from "./analytics-router";
import { otpRouter } from "./otp-router";
import { vendorTermsRouter } from "./vendor-terms-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  vendor: vendorRouter,
  spClient: clientRouter,
  quote: quoteRouter,
  booking: bookingRouter,
  payment: paymentRouter,
  review: reviewRouter,
  event: eventRouter,
  conversation: conversationRouter,
  notification: notificationRouter,
  analytics: analyticsRouter,
  otp: otpRouter,
  vendorTerms: vendorTermsRouter,
});

export type AppRouter = typeof appRouter;
