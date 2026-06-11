/**
 * SimpliPlan API Hook - Frontend gateway to the tRPC backend
 * Replaces all localStorage usage with real database calls
 */
import { trpc } from "@/providers/trpc";

// ─── Vendors ───
export function useVendors(filters?: { category?: string; province?: string; search?: string }) {
  return trpc.vendor.list.useQuery(filters ?? {});
}

export function useVendor(id: number) {
  return trpc.vendor.byId.useQuery({ id }, { enabled: id > 0 });
}

export function useVendorCategories() {
  return trpc.vendor.categories.useQuery();
}

export function useVendorProvinces() {
  return trpc.vendor.provinces.useQuery();
}

export function useCreateVendor() {
  const utils = trpc.useUtils();
  return trpc.vendor.create.useMutation({
    onSuccess: () => {
      utils.vendor.list.invalidate();
    },
  });
}

// ─── Clients ───
export function useClient(phone: string) {
  return trpc.spClient.byPhone.useQuery({ phone }, { enabled: phone.length > 0 });
}

export function useCreateClient() {
  const utils = trpc.useUtils();
  return trpc.spClient.create.useMutation({
    onSuccess: () => {
      utils.spClient.list.invalidate();
    },
  });
}

// ─── Events ───
export function useEvents(clientId?: number) {
  return trpc.event.list.useQuery({ clientId }, { enabled: clientId !== undefined });
}

export function useEvent(id: number) {
  return trpc.event.byId.useQuery({ id }, { enabled: id > 0 });
}

export function useCreateEvent() {
  const utils = trpc.useUtils();
  return trpc.event.create.useMutation({
    onSuccess: () => {
      utils.event.list.invalidate();
    },
  });
}

// ─── Quotes ───
export function useQuotes(filters?: { clientId?: number; vendorId?: number; status?: string }) {
  return trpc.quote.list.useQuery(filters ?? {});
}

export function useCreateQuote() {
  const utils = trpc.useUtils();
  return trpc.quote.create.useMutation({
    onSuccess: () => {
      utils.quote.list.invalidate();
    },
  });
}

export function useRespondQuote() {
  const utils = trpc.useUtils();
  return trpc.quote.respond.useMutation({
    onSuccess: () => {
      utils.quote.list.invalidate();
    },
  });
}

// ─── Bookings ───
export function useBookings(filters?: { clientId?: number; vendorId?: number }) {
  return trpc.booking.list.useQuery(filters ?? {});
}

export function useBooking(id: number) {
  return trpc.booking.byId.useQuery({ id }, { enabled: id > 0 });
}

export function useCreateBooking() {
  const utils = trpc.useUtils();
  return trpc.booking.create.useMutation({
    onSuccess: () => {
      utils.booking.list.invalidate();
    },
  });
}

export function useConfirmBooking() {
  const utils = trpc.useUtils();
  return trpc.booking.confirm.useMutation({
    onSuccess: () => {
      utils.booking.list.invalidate();
    },
  });
}

// ─── Reviews ───
export function useReviews(vendorId?: number) {
  return trpc.review.list.useQuery({ vendorId }, { enabled: vendorId !== undefined });
}

export function useCreateReview() {
  const utils = trpc.useUtils();
  return trpc.review.create.useMutation({
    onSuccess: () => {
      utils.review.list.invalidate();
    },
  });
}

// ─── Payments ───
export function useInitiatePayment() {
  return trpc.payment.initiate.useQuery;
}

export function useVendorEarnings(vendorId: number) {
  return trpc.payment.vendorEarnings.useQuery({ vendorId }, { enabled: vendorId > 0 });
}

// ─── Analytics ───
export function useAnalyticsOverview() {
  return trpc.analytics.overview.useQuery();
}

// ─── Notifications ───
export function useNotifications(userId: number, userType: "client" | "vendor") {
  return trpc.notification.list.useQuery({ userId, userType }, { enabled: userId > 0 });
}

export function useUnreadCount(userId: number, userType: "client" | "vendor") {
  return trpc.notification.unreadCount.useQuery({ userId, userType }, { enabled: userId > 0 });
}

// ─── Conversations ───
export function useConversations(filters: { clientId?: number; vendorId?: number }) {
  return trpc.conversation.list.useQuery(filters, { enabled: !!(filters.clientId || filters.vendorId) });
}

export function useSendMessage() {
  const utils = trpc.useUtils();
  return trpc.conversation.sendMessage.useMutation({
    onSuccess: () => {
      utils.conversation.list.invalidate();
    },
  });
}
