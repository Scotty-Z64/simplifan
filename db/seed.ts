import { getDb } from "../api/queries/connection";
import {
  clients, vendors, vendorServices, vendorImages,
  events, eventItems, bookings, reviews, quotes,
} from "./schema";

const SA_PROVINCES = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Mpumalanga", "Limpopo", "North West", "Northern Cape"];
const EVENT_TYPES = ["Wedding", "Funeral", "Birthday", "Umgidi/Traditional", "Baby Shower", "Lobola", "Corporate Event", "Graduation"];
const CATEGORIES = ["Catering", "Venue", "Photography", "Music / DJ", "Decor", "Cake", "Drinks / Bar", "Hair & Makeup", "Transport", "Security", "Tent & Equipment"];

async function seed() {
  console.log("Seeding SimpliPlan database...");
  const db = getDb();

  // ─── Clients ───
  console.log("Seeding clients...");
  const clientData = [
    { name: "Thabo Mokoena", email: "thabo@example.com", phone: "0823456789", location: "Soweto, Gauteng" },
    { name: "Lerato Khumalo", email: "lerato@example.com", phone: "0712345678", location: "Sandton, Gauteng" },
    { name: "Sipho Ndlovu", email: "sipho@example.com", phone: "0834567890", location: "Durban, KZN" },
    { name: "Mary van Wyk", email: "mary@example.com", phone: "0845678901", location: "Cape Town, Western Cape" },
    { name: "Nomsa Dlamini", email: "nomsa@example.com", phone: "0723456789", location: "Pretoria, Gauteng" },
    { name: "Peter Johnson", email: "peter@example.com", phone: "0765432109", location: "Midrand, Gauteng" },
    { name: "Zanele Mbatha", email: "zanele@example.com", phone: "0798765432", location: "Johannesburg, Gauteng" },
    { name: "Andile Ngcobo", email: "andile@example.com", phone: "0812345678", location: "Germiston, Gauteng" },
  ];
  for (const c of clientData) {
    await db.insert(clients).values({ ...c, avatar: c.name.charAt(0) });
  }

  // ─── Vendors ───
  console.log("Seeding vendors...");
  const vendorData = [
    { businessName: "Royal Events SA", ownerName: "John Kekana", email: "royal@example.com", phone: "0821112222", category: "Catering", province: "Gauteng", city: "Johannesburg", priceRange: "R150 - R350/person", yearsInBusiness: 8, rating: "4.8", bio: "Premium catering for weddings, corporate events, and traditional ceremonies. Specializing in South African cuisine with a modern twist. We bring the flavours of home to your celebration.", tier: "elite" as const, featured: true, verified: true, subscriptionStatus: "active" as const },
    { businessName: "DJ Maphorisa Sounds", ownerName: "Themba Maphosa", email: "djmaphorisa@example.com", phone: "0833334444", category: "Music / DJ", province: "Gauteng", city: "Pretoria", priceRange: "R3,500 - R8,000", yearsInBusiness: 12, rating: "4.9", bio: "Professional DJ services with state-of-the-art sound equipment. From amapiano to gospel, house to hip hop — we keep the dance floor packed all night long.", tier: "pro" as const, featured: true, verified: true, subscriptionStatus: "active" as const },
    { businessName: "Elegant Moments Photography", ownerName: "Sarah Williams", email: "elegant@example.com", phone: "0844445555", category: "Photography", province: "Gauteng", city: "Sandton", priceRange: "R5,000 - R15,000", yearsInBusiness: 6, rating: "4.7", bio: "Capturing your special moments with artistic flair. Wedding photography, event coverage, and portrait sessions. Professional editing and same-day previews available.", tier: "pro" as const, featured: true, verified: true, subscriptionStatus: "active" as const },
    { businessName: "Sizakele Decor & Events", ownerName: "Sizakele Ndlovu", email: "sizakele@example.com", phone: "0855556666", category: "Decor", province: "KwaZulu-Natal", city: "Durban", priceRange: "R2,000 - R12,000", yearsInBusiness: 10, rating: "4.6", bio: "Transform any venue into a dream setting. Traditional and modern decor for all events. We specialise in Zulu, Xhosa, and Sotho themed decorations.", tier: "pro" as const, featured: false, verified: true, subscriptionStatus: "active" as const },
    { businessName: "Grand Venue Hire", ownerName: "Michael Peters", email: "grandvenue@example.com", phone: "0866667777", category: "Venue", province: "Western Cape", city: "Cape Town", priceRange: "R8,000 - R25,000", yearsInBusiness: 15, rating: "4.5", bio: "Stunning venues for weddings, corporate functions, and private events. Indoor and outdoor options with catering partnerships and full event coordination.", tier: "elite" as const, featured: true, verified: true, subscriptionStatus: "active" as const },
    { businessName: "Sweet Creations Cakes", ownerName: "Amanda Botha", email: "sweet@example.com", phone: "0877778888", category: "Cake", province: "Gauteng", city: "Midrand", priceRange: "R800 - R5,000", yearsInBusiness: 5, rating: "4.9", bio: "Award-winning cake designer specialising in wedding cakes, birthday cakes, and custom creations. Eggless and vegan options available. Free tasting consultation.", tier: "starter" as const, featured: false, verified: true, subscriptionStatus: "active" as const },
    { businessName: "Braai Masters Catering", ownerName: "David Mofokeng", email: "braai@example.com", phone: "0888889999", category: "Catering", province: "Gauteng", city: "Soweto", priceRange: "R80 - R200/person", yearsInBusiness: 7, rating: "4.4", bio: "Authentic South African braai experience for your event. From shisa nyama to gourmet braai platters. We bring the fire, the flavour, and the fun.", tier: "starter" as const, featured: false, verified: true, subscriptionStatus: "trial" as const },
    { businessName: "Luxury Ride SA", ownerName: "Charles Mabena", email: "luxuryride@example.com", phone: "0899990000", category: "Transport", province: "Gauteng", city: "Johannesburg", priceRange: "R2,500 - R8,000", yearsInBusiness: 9, rating: "4.3", bio: "Premium transport for weddings and special events. Stretch limousines, vintage cars, and luxury sedans. Professional chauffeurs in full uniform.", tier: "pro" as const, featured: false, verified: true, subscriptionStatus: "active" as const },
    { businessName: "Glam Squad Hair & Makeup", ownerName: "Patricia Zulu", email: "glam@example.com", phone: "0811113333", category: "Hair & Makeup", province: "Gauteng", city: "Rosebank", priceRange: "R1,500 - R5,000", yearsInBusiness: 4, rating: "4.8", bio: "Mobile hair and makeup artists for weddings, matric dances, and special occasions. Bridal packages include trial sessions. We come to your venue.", tier: "starter" as const, featured: false, verified: true, subscriptionStatus: "active" as const },
    { businessName: "Secure Event Services", ownerName: "Robert Nkosi", email: "secure@example.com", phone: "0822224444", category: "Security", province: "Gauteng", city: "Pretoria", priceRange: "R1,200 - R4,000", yearsInBusiness: 11, rating: "4.2", bio: "Licensed security personnel for events of all sizes. Access control, crowd management, and VIP protection. PSIRA registered guards.", tier: "starter" as const, featured: false, verified: false, subscriptionStatus: "trial" as const },
    { businessName: "Tent Kings", ownerName: "William Khumalo", email: "tentkings@example.com", phone: "0833335555", category: "Tent & Equipment", province: "KwaZulu-Natal", city: "Pinetown", priceRange: "R3,000 - R15,000", yearsInBusiness: 14, rating: "4.5", bio: "Marquee tents, chairs, tables, and event equipment hire. Any size event, any location. Weather-proof options available. Delivery and setup included.", tier: "pro" as const, featured: false, verified: true, subscriptionStatus: "active" as const },
    { businessName: "The Mixology Bar", ownerName: "James Stevens", email: "mixology@example.com", phone: "0844446666", category: "Drinks / Bar", province: "Western Cape", city: "Stellenbosch", priceRange: "R150 - R400/person", yearsInBusiness: 6, rating: "4.7", bio: "Mobile bar services with craft cocktails, premium wines, and local spirits. Certified bartenders, full liquor license. Cash or open bar options.", tier: "pro" as const, featured: false, verified: true, subscriptionStatus: "active" as const },
  ];

  for (const v of vendorData) {
    const avatar = v.businessName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const [result] = await db.insert(vendors).values({ ...v, avatar });
    const vendorId = Number(result.insertId);

    // Add services
    const serviceNames = v.category === "Catering" ? ["Buffet Service", "Plated Meals", "Braai/Pap & Meat", "Traditional Dishes", "Dessert Table"]
      : v.category === "Music / DJ" ? ["DJ with Sound System", "MC Services", "Live Band Coordination", "Karaoke Setup"]
      : v.category === "Photography" ? ["Event Photography", "Photo Booth", "Video Coverage", "Drone Shots"]
      : v.category === "Decor" ? ["Venue Styling", "Floral Arrangements", "Lighting Design", "Table Setup"]
      : v.category === "Venue" ? ["Indoor Hall", "Garden Venue", "Rooftop Space", "Parking Included"]
      : v.category === "Cake" ? ["Wedding Cakes", "Cupcakes", "Custom Design", "Tasting Session"]
      : v.category === "Transport" ? ["Wedding Car Hire", "Guest Shuttle", "Chauffeur Service"]
      : v.category === "Hair & Makeup" ? ["Bridal Package", "Bridal Party", "Touch-up Service"]
      : v.category === "Security" ? ["Access Control", "Crowd Management", "VIP Protection"]
      : v.category === "Tent & Equipment" ? ["Marquee Tents", "Chair Hire", "Table Hire", "Dance Floor"]
      : v.category === "Drinks / Bar" ? ["Open Bar", "Cash Bar", "Cocktail Menu", "Wine Selection"]
      : ["Full Service Package"];

    for (const name of serviceNames) {
      await db.insert(vendorServices).values({
        vendorId,
        name,
        description: `${name} by ${v.businessName}`,
        category: v.category,
      });
    }
  }

  // ─── Events ───
  console.log("Seeding events...");
  const eventData = [
    { clientId: 1, clientName: "Thabo Mokoena", clientPhone: "0823456789", eventType: "Wedding", eventDate: "2026-09-15", guestCount: 150, province: "Gauteng", city: "Johannesburg", budget: "85000", status: "planning" as const, notes: "Traditional wedding with white wedding ceremony" },
    { clientId: 2, clientName: "Lerato Khumalo", clientPhone: "0712345678", eventType: "Funeral", eventDate: "2026-06-20", guestCount: 200, province: "Gauteng", city: "Soweto", budget: "45000", status: "quoted" as const, notes: "Memorial service for grandmother" },
    { clientId: 3, clientName: "Sipho Ndlovu", clientPhone: "0834567890", eventType: "Birthday", eventDate: "2026-07-10", guestCount: 80, province: "KwaZulu-Natal", city: "Durban", budget: "25000", status: "planning" as const, notes: "21st birthday celebration" },
    { clientId: 4, clientName: "Mary van Wyk", clientPhone: "0845678901", eventType: "Baby Shower", eventDate: "2026-08-05", guestCount: 40, province: "Western Cape", city: "Cape Town", budget: "15000", status: "confirmed" as const, notes: "Pastel colours, afternoon tea theme" },
    { clientId: 5, clientName: "Nomsa Dlamini", clientPhone: "0723456789", eventType: "Umgidi/Traditional", eventDate: "2026-11-20", guestCount: 300, province: "Gauteng", city: "Pretoria", budget: "120000", status: "planning" as const, notes: "Coming of age ceremony" },
  ];
  for (const e of eventData) {
    const [result] = await db.insert(events).values(e);
    const eventId = Number(result.insertId);

    // Add event items
    const items = e.eventType === "Wedding" ? [
      { category: "Catering", service: "Buffet for 150 guests" },
      { category: "Venue", service: "Indoor hall + garden" },
      { category: "Photography", service: "Full day coverage" },
      { category: "Music / DJ", service: "DJ + MC" },
      { category: "Decor", service: "Full venue styling" },
      { category: "Cake", service: "3-tier wedding cake" },
      { category: "Hair & Makeup", service: "Bridal + 5 bridesmaids" },
      { category: "Transport", service: "Bride + groom cars" },
    ] : e.eventType === "Funeral" ? [
      { category: "Catering", service: "Tea + snacks for 200" },
      { category: "Tent & Equipment", service: "200 chairs + tent" },
      { category: "Transport", service: "Family transport" },
    ] : e.eventType === "Birthday" ? [
      { category: "Catering", service: "Cocktail snacks for 80" },
      { category: "Music / DJ", service: "DJ + sound system" },
      { category: "Drinks / Bar", service: "Open bar" },
      { category: "Decor", service: "Birthday theme decor" },
    ] : e.eventType === "Baby Shower" ? [
      { category: "Catering", service: "High tea for 40" },
      { category: "Decor", service: "Pastel theme decor" },
      { category: "Cake", service: "Baby shower cake" },
    ] : [
      { category: "Catering", service: "Traditional feast for 300" },
      { category: "Venue", service: "Large outdoor venue" },
      { category: "Tent & Equipment", service: "Tent + chairs for 300" },
      { category: "Music / DJ", service: "Sound system + DJ" },
      { category: "Security", service: "Event security" },
    ];

    for (const item of items) {
      await db.insert(eventItems).values({ eventId, ...item, price: "0" });
    }
  }

  // ─── Bookings ───
  console.log("Seeding bookings...");
  const bookingData = [
    { clientId: 1, clientName: "Thabo Mokoena", clientPhone: "0823456789", vendorId: 1, vendorName: "Royal Events SA", eventType: "Wedding", eventDate: "2026-09-15", amount: "25000", depositAmount: "12500", platformFee: "1250", status: "confirmed" as const, clientConfirmed: true, vendorConfirmed: true },
    { clientId: 2, clientName: "Lerato Khumalo", clientPhone: "0712345678", vendorId: 2, vendorName: "DJ Maphorisa Sounds", eventType: "Funeral", eventDate: "2026-06-20", amount: "15000", depositAmount: "7500", platformFee: "750", status: "confirmed" as const, clientConfirmed: true, vendorConfirmed: true },
    { clientId: 3, clientName: "Sipho Ndlovu", clientPhone: "0834567890", vendorId: 3, vendorName: "Elegant Moments Photography", eventType: "Birthday", eventDate: "2026-07-10", amount: "8000", depositAmount: "4000", platformFee: "400", status: "pending" as const, clientConfirmed: false, vendorConfirmed: false },
    { clientId: 4, clientName: "Mary van Wyk", clientPhone: "0845678901", vendorId: 5, vendorName: "Grand Venue Hire", eventType: "Baby Shower", eventDate: "2026-08-05", amount: "4500", depositAmount: "2250", platformFee: "0", status: "confirmed" as const, clientConfirmed: true, vendorConfirmed: true },
  ];
  for (const b of bookingData) {
    await db.insert(bookings).values(b);
  }

  // ─── Reviews ───
  console.log("Seeding reviews...");
  const reviewData = [
    { bookingId: 1, vendorId: 1, clientId: 1, clientName: "Thabo Mokoena", rating: 5, comment: "Royal Events made our wedding day absolutely perfect! The food was incredible and the service was top-notch. Highly recommend!", eventType: "Wedding" },
    { bookingId: 2, vendorId: 2, clientId: 2, clientName: "Lerato Khumalo", rating: 5, comment: "DJ Maphorisa kept the dance floor full the entire night. Professional setup, great music selection. Will book again!", eventType: "Funeral" },
    { bookingId: 4, vendorId: 5, clientId: 4, clientName: "Mary van Wyk", rating: 4, comment: "Beautiful venue with amazing views. The staff were helpful and the space was perfect for our baby shower.", eventType: "Baby Shower" },
    { bookingId: 1, vendorId: 1, clientId: 1, clientName: "Thabo Mokoena", rating: 5, comment: "The braai platter was the highlight of the reception. Everyone is still talking about it!", eventType: "Wedding" },
    { bookingId: 2, vendorId: 2, clientId: 2, clientName: "Lerato Khumalo", rating: 4, comment: "Very professional and respectful during a difficult time. Thank you for your sensitivity.", eventType: "Funeral" },
  ];
  for (const r of reviewData) {
    await db.insert(reviews).values(r);
  }

  // ─── Quotes ───
  console.log("Seeding quotes...");
  const quoteData = [
    { clientId: 3, clientName: "Sipho Ndlovu", clientPhone: "0834567890", vendorId: 6, eventType: "Birthday", eventDate: "2026-07-10", guestCount: "80", province: "KwaZulu-Natal", notes: "Need a birthday cake for 80 people. Chocolate and vanilla layers.", quotedAmount: "3500", vendorMessage: "Hi! We can do a 2-tier chocolate & vanilla cake with custom design for R3,500. Includes delivery in Durban area.", status: "quoted" as const },
    { clientId: 5, clientName: "Nomsa Dlamini", clientPhone: "0723456789", vendorId: 8, eventType: "Umgidi/Traditional", eventDate: "2026-11-20", guestCount: "300", province: "Gauteng", notes: "Need transport for family members from airport to venue.", status: "submitted" as const },
  ];
  for (const q of quoteData) {
    await db.insert(quotes).values(q);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
