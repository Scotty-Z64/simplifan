// Static demo data - no backend required
// All data stored in localStorage

export const DEMO_VENDORS = [
  { id: 1, businessName: "Royal Events SA", ownerName: "John Kekana", email: "royal@example.com", phone: "0821112222", category: "Catering", province: "Gauteng", city: "Johannesburg", priceRange: "R150 - R350/person", yearsInBusiness: 8, rating: "4.8", bio: "Premium catering for weddings, corporate events, and traditional ceremonies.", tier: "elite", featured: 1, verified: 1, isActive: 1, avatar: "RE" },
  { id: 2, businessName: "DJ Maphorisa Sounds", ownerName: "Themba Maphosa", email: "dj@example.com", phone: "0833334444", category: "Music / DJ", province: "Gauteng", city: "Pretoria", priceRange: "R3,500 - R8,000", yearsInBusiness: 12, rating: "4.9", bio: "Professional DJ services with state-of-the-art sound equipment.", tier: "pro", featured: 1, verified: 1, isActive: 1, avatar: "DJ" },
  { id: 3, businessName: "Elegant Moments Photography", ownerName: "Sarah Williams", email: "photo@example.com", phone: "0844445555", category: "Photography", province: "Gauteng", city: "Sandton", priceRange: "R5,000 - R15,000", yearsInBusiness: 6, rating: "4.7", bio: "Capturing your special moments with artistic flair.", tier: "pro", featured: 1, verified: 1, isActive: 1, avatar: "EM" },
  { id: 4, businessName: "Sizakele Decor & Events", ownerName: "Sizakele Ndlovu", email: "decor@example.com", phone: "0855556666", category: "Decor", province: "KwaZulu-Natal", city: "Durban", priceRange: "R2,000 - R12,000", yearsInBusiness: 10, rating: "4.6", bio: "Transform any venue into a dream setting.", tier: "pro", featured: 0, verified: 1, isActive: 1, avatar: "SD" },
  { id: 5, businessName: "Grand Venue Hire", ownerName: "Michael Peters", email: "venue@example.com", phone: "0866667777", category: "Venue", province: "Western Cape", city: "Cape Town", priceRange: "R8,000 - R25,000", yearsInBusiness: 15, rating: "4.5", bio: "Stunning venues for weddings, corporate functions, and private events.", tier: "elite", featured: 1, verified: 1, isActive: 1, avatar: "GV" },
  { id: 6, businessName: "Sweet Creations Cakes", ownerName: "Amanda Botha", email: "cakes@example.com", phone: "0877778888", category: "Cake", province: "Gauteng", city: "Midrand", priceRange: "R800 - R5,000", yearsInBusiness: 5, rating: "4.9", bio: "Award-winning cake designer specialising in wedding cakes.", tier: "starter", featured: 0, verified: 1, isActive: 1, avatar: "SC" },
  { id: 7, businessName: "Braai Masters Catering", ownerName: "David Mofokeng", email: "braai@example.com", phone: "0888889999", category: "Catering", province: "Gauteng", city: "Soweto", priceRange: "R80 - R200/person", yearsInBusiness: 7, rating: "4.4", bio: "Authentic South African braai experience for your event.", tier: "starter", featured: 0, verified: 1, isActive: 1, avatar: "BM" },
  { id: 8, businessName: "Luxury Ride SA", ownerName: "Charles Mabena", email: "ride@example.com", phone: "0899990000", category: "Transport", province: "Gauteng", city: "Johannesburg", priceRange: "R2,500 - R8,000", yearsInBusiness: 9, rating: "4.3", bio: "Premium transport for weddings and special events.", tier: "pro", featured: 0, verified: 1, isActive: 1, avatar: "LR" },
  { id: 9, businessName: "Glam Squad Hair & Makeup", ownerName: "Patricia Zulu", email: "glam@example.com", phone: "0811113333", category: "Hair & Makeup", province: "Gauteng", city: "Rosebank", priceRange: "R1,500 - R5,000", yearsInBusiness: 4, rating: "4.8", bio: "Mobile hair and makeup artists for weddings and special occasions.", tier: "starter", featured: 0, verified: 1, isActive: 1, avatar: "GS" },
  { id: 10, businessName: "Secure Event Services", ownerName: "Robert Nkosi", email: "security@example.com", phone: "0822224444", category: "Security", province: "Gauteng", city: "Pretoria", priceRange: "R1,200 - R4,000", yearsInBusiness: 11, rating: "4.2", bio: "Licensed security personnel for events of all sizes.", tier: "starter", featured: 0, verified: 0, isActive: 1, avatar: "SE" },
  { id: 11, businessName: "Tent Kings", ownerName: "William Khumalo", email: "tents@example.com", phone: "0833335555", category: "Tent & Equipment", province: "KwaZulu-Natal", city: "Pinetown", priceRange: "R3,000 - R15,000", yearsInBusiness: 14, rating: "4.5", bio: "Marquee tents, chairs, tables, and event equipment hire.", tier: "pro", featured: 0, verified: 1, isActive: 1, avatar: "TK" },
  { id: 12, businessName: "The Mixology Bar", ownerName: "James Stevens", email: "bar@example.com", phone: "0844446666", category: "Drinks / Bar", province: "Western Cape", city: "Stellenbosch", priceRange: "R150 - R400/person", yearsInBusiness: 6, rating: "4.7", bio: "Mobile bar services with craft cocktails, premium wines, and local spirits.", tier: "pro", featured: 0, verified: 1, isActive: 1, avatar: "MB" },
];

export const DEMO_EVENTS = [
  { id: 1, clientId: 1, clientName: "Thabo Mokoena", clientPhone: "0823456789", eventType: "Wedding", eventDate: "2026-08-15", eventTime: "14:00", guestCount: 120, province: "Gauteng", city: "Johannesburg", area: "Soweto", venue: "Community Hall", budget: "85000.00", totalCost: "0.00", status: "planning", notes: "Traditional wedding with white wedding ceremony" },
  { id: 2, clientId: 2, clientName: "Lerato Khumalo", clientPhone: "0712345678", eventType: "Birthday", eventDate: "2026-07-22", eventTime: "18:00", guestCount: 50, province: "Gauteng", city: "Sandton", area: "Morningside", venue: "Private Residence", budget: "25000.00", totalCost: "0.00", status: "planning", notes: "30th birthday celebration" },
  { id: 3, clientId: 3, clientName: "Sipho Ndlovu", clientPhone: "0834567890", eventType: "Umgidi/Traditional", eventDate: "2026-09-10", eventTime: "10:00", guestCount: 200, province: "KwaZulu-Natal", city: "Durban", area: "Umlazi", venue: "Family Home", budget: "60000.00", totalCost: "0.00", status: "planning", notes: "Umgidi ceremony for son" },
  { id: 4, clientId: 4, clientName: "Mary van Wyk", clientPhone: "0845678901", eventType: "Baby Shower", eventDate: "2026-07-30", eventTime: "11:00", guestCount: 30, province: "Western Cape", city: "Cape Town", area: "Claremont", venue: "Garden Venue", budget: "15000.00", totalCost: "0.00", status: "confirmed", notes: "Intimate baby shower" },
];

export const DEMO_BOOKINGS = [
  { id: 1, eventId: 1, clientId: 1, clientName: "Thabo Mokoena", clientPhone: "0823456789", vendorId: 1, vendorName: "Royal Events SA", eventType: "Wedding", eventDate: "2026-08-15", amount: "35000.00", depositAmount: "10000.00", platformFee: "1750.00", status: "pending", clientConfirmed: 0, vendorConfirmed: 0, reviewSubmitted: 0 },
  { id: 2, eventId: 1, clientId: 1, clientName: "Thabo Mokoena", clientPhone: "0823456789", vendorId: 2, vendorName: "DJ Maphorisa Sounds", eventType: "Wedding", eventDate: "2026-08-15", amount: "5500.00", depositAmount: "2000.00", platformFee: "275.00", status: "confirmed", clientConfirmed: 1, vendorConfirmed: 1, reviewSubmitted: 0 },
  { id: 3, eventId: 2, clientId: 2, clientName: "Lerato Khumalo", clientPhone: "0712345678", vendorId: 3, vendorName: "Elegant Moments Photography", eventType: "Birthday", eventDate: "2026-07-22", amount: "8000.00", depositAmount: "3000.00", platformFee: "400.00", status: "pending", clientConfirmed: 0, vendorConfirmed: 0, reviewSubmitted: 0 },
  { id: 4, eventId: 3, clientId: 3, clientName: "Sipho Ndlovu", clientPhone: "0834567890", vendorId: 4, vendorName: "Sizakele Decor & Events", eventType: "Umgidi/Traditional", eventDate: "2026-09-10", amount: "15000.00", depositAmount: "5000.00", platformFee: "750.00", status: "confirmed", clientConfirmed: 1, vendorConfirmed: 1, reviewSubmitted: 0 },
  { id: 5, eventId: 4, clientId: 4, clientName: "Mary van Wyk", clientPhone: "0845678901", vendorId: 6, vendorName: "Sweet Creations Cakes", eventType: "Baby Shower", eventDate: "2026-07-30", amount: "2500.00", depositAmount: "1000.00", platformFee: "125.00", status: "completed", clientConfirmed: 1, vendorConfirmed: 1, reviewSubmitted: 1 },
];

export const DEMO_REVIEWS = [
  { id: 1, vendorId: 1, clientId: 1, clientName: "Thabo Mokoena", bookingId: 1, rating: 5, comment: "Amazing food! Our guests are still talking about the braai platters.", eventType: "Wedding", verifiedBooking: 1 },
  { id: 2, vendorId: 2, clientId: 2, clientName: "Lerato Khumalo", bookingId: 2, rating: 5, comment: "DJ Maphorisa kept the dance floor packed all night. Highly recommend!", eventType: "Wedding", verifiedBooking: 1 },
  { id: 3, vendorId: 3, clientId: 3, clientName: "Sipho Ndlovu", bookingId: 3, rating: 4, comment: "Beautiful photos. Captured every moment perfectly.", eventType: "Umgidi/Traditional", verifiedBooking: 1 },
  { id: 4, vendorId: 5, clientId: 1, clientName: "Thabo Mokoena", bookingId: 1, rating: 5, comment: "The venue was stunning. Perfect for our wedding.", eventType: "Wedding", verifiedBooking: 1 },
  { id: 5, vendorId: 6, clientId: 4, clientName: "Mary van Wyk", bookingId: 5, rating: 5, comment: "The cake was absolutely gorgeous and delicious!", eventType: "Baby Shower", verifiedBooking: 1 },
];

export const DEMO_QUOTES = [
  { id: 1, eventId: 1, clientId: 1, clientName: "Thabo Mokoena", clientPhone: "0823456789", vendorId: 1, eventType: "Wedding", eventDate: "2026-08-15", guestCount: 120, province: "Gauteng", notes: "Need catering for 120 guests. Traditional and continental options.", quotedAmount: "35000.00", vendorMessage: "We can do a buffet with traditional and continental options for R350/person.", status: "quoted" },
  { id: 2, eventId: 1, clientId: 1, clientName: "Thabo Mokoena", clientPhone: "0823456789", vendorId: 2, eventType: "Wedding", eventDate: "2026-08-15", guestCount: 120, province: "Gauteng", notes: "Looking for a DJ with sound system for 5 hours.", quotedAmount: "5500.00", vendorMessage: "Full sound system + DJ for 5 hours at R5,500.", status: "accepted" },
  { id: 3, eventId: 2, clientId: 2, clientName: "Lerato Khumalo", clientPhone: "0712345678", vendorId: 3, eventType: "Birthday", eventDate: "2026-07-22", guestCount: 50, province: "Gauteng", notes: "Need a photographer for 4 hours at a 30th birthday party.", quotedAmount: "8000.00", vendorMessage: "4-hour coverage with edited digital gallery. R8,000.", status: "submitted" },
];

export const DEMO_CONVERSATIONS = [
  { id: 1, clientId: 1, vendorId: 1, clientName: "Thabo Mokoena", vendorName: "Royal Events SA", lastMessage: "Hi, can you accommodate dietary requirements?", clientUnread: 0, vendorUnread: 1 },
  { id: 2, clientId: 1, vendorId: 2, clientName: "Thabo Mokoena", vendorName: "DJ Maphorisa Sounds", lastMessage: "What time should you arrive to set up?", clientUnread: 1, vendorUnread: 0 },
  { id: 3, clientId: 2, vendorId: 3, clientName: "Lerato Khumalo", vendorName: "Elegant Moments Photography", lastMessage: "Do you offer photo booth services too?", clientUnread: 0, vendorUnread: 1 },
];

export const DEMO_MESSAGES = [
  { id: 1, conversationId: 1, senderType: "client", content: "Hi, I am planning my wedding and interested in your catering services.", read: 1 },
  { id: 2, conversationId: 1, senderType: "vendor", content: "Congratulations! We would love to be part of your special day. How many guests are you expecting?", read: 1 },
  { id: 3, conversationId: 1, senderType: "client", content: "Around 120 guests. Can you accommodate dietary requirements?", read: 0 },
  { id: 4, conversationId: 2, senderType: "vendor", content: "Hi Thabo, confirmed for your wedding DJ. What time should we arrive?", read: 0 },
  { id: 5, conversationId: 2, senderType: "client", content: "Please arrive by 2pm to set up. Ceremony starts at 3pm.", read: 1 },
  { id: 6, conversationId: 3, senderType: "client", content: "Hi, do you offer photo booth services as well?", read: 0 },
];

// ─── Seed localStorage on first load ───
export function seedLocalStorage() {
  if (localStorage.getItem("sp_seeded")) return;

  localStorage.setItem("sp_vendors", JSON.stringify(DEMO_VENDORS));
  localStorage.setItem("sp_events", JSON.stringify(DEMO_EVENTS));
  localStorage.setItem("sp_bookings", JSON.stringify(DEMO_BOOKINGS));
  localStorage.setItem("sp_reviews", JSON.stringify(DEMO_REVIEWS));
  localStorage.setItem("sp_quotes", JSON.stringify(DEMO_QUOTES));
  localStorage.setItem("sp_conversations", JSON.stringify(DEMO_CONVERSATIONS));
  localStorage.setItem("sp_messages", JSON.stringify(DEMO_MESSAGES));
  localStorage.setItem("sp_seeded", "true");
  console.log("[STATIC] Demo data seeded to localStorage");
}
