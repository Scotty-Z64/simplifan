// ─── Vendor Terms & Conditions ───
// Every vendor must accept these before they can receive bookings

export const VENDOR_TERMS = {
  version: "1.0",
  lastUpdated: "2026-06-13",

  sections: [
    {
      title: "Platform Commission",
      content: "SimpliPlan charges a 5% commission on all bookings made through the platform. This fee is automatically deducted from your payment. By accepting bookings through SimpliPlan, you agree to this commission structure.",
    },
    {
      title: "No Direct Contact Policy",
      content: "You agree NOT to share your personal contact details (phone number, email, WhatsApp) with clients directly. All communication must go through SimpliPlan's proxy system. Violation of this policy will result in account suspension and forfeiture of pending payments.",
    },
    {
      title: "All Bookings Through Platform",
      content: "You agree that all bookings resulting from leads received through SimpliPlan will be processed through the platform. Taking clients off-platform ('back-dooring') is a violation that will result in immediate termination and a penalty fee.",
    },
    {
      title: "Escrow Payment Terms",
      content: "Client payments are held in escrow by SimpliPlan until the event is completed. You will receive your payment (minus 5% commission) within 48 hours of event completion. For deposits, 50% is released on confirmation, 50% after event.",
    },
    {
      title: "Response Time",
      content: "You agree to respond to quote requests within 24 hours. Failure to respond consistently may result in reduced visibility on the platform.",
    },
    {
      title: "Service Quality",
      content: "You agree to provide the services as described in your profile. Misrepresentation of services will result in account review and potential removal from the platform.",
    },
    {
      title: "Cancellation Policy",
      content: "If you cancel a confirmed booking, the client receives a full refund. Repeated cancellations may result in account suspension.",
    },
    {
      title: "Review System",
      content: "Clients can leave reviews after events. You agree that all reviews (positive and negative) will remain visible. You may respond to reviews professionally.",
    },
  ],

  // Acceptance required fields
  acceptanceRequired: [
    "I agree to the 5% platform commission",
    "I will not share my contact details with clients directly",
    "I will process all bookings through SimpliPlan",
    "I understand payments are held in escrow until event completion",
  ],
};

// Penalty for going behind platform's back
export const OFF_PLATFORM_PENALTY = {
  firstOffense: "Warning + account review",
  secondOffense: "30-day suspension",
  thirdOffense: "Permanent ban + forfeiture of pending payments",
  penaltyFee: 5000, // R5,000 penalty fee
};
