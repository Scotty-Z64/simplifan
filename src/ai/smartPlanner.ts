import type { EventType } from '@/types';

// ═══════════════════════════════════════════════════════════
// SIMPLIPLAN SMART PLANNER v3.0
// Deep Cultural Intelligence + Per-Person Pricing + Province-Aware
// ═══════════════════════════════════════════════════════════

export interface VendorDef {
  id: string; name: string; category: string;
  price: number; rating: number; province: string;
  description: string; tier: 'budget' | 'standard' | 'premium';
  areas: string[]; perPerson?: boolean;
}

export interface EventCategoryDef {
  key: string; label: string; essential: boolean;
  perPerson: boolean; minGuests?: number;
  budgetAlloc: number; standardAlloc: number; premiumAlloc: number;
  why: string;
}

export interface VendorOption {
  vendor: VendorDef; price: number; why: string;
}

export interface TierPackage {
  tier: 'budget' | 'standard' | 'premium';
  label: string; tagline: string;
  items: CategoryItem[];
  totalCost: number; overBudget: boolean;
  selectedOptions: Map<string, number>;
}

export interface CategoryItem {
  category: string; label: string;
  options: VendorOption[]; essential: boolean;
  perPerson: boolean;
}

export interface GroceryItem {
  item: string; quantity: string; estPrice: number; essential: boolean;
}

export interface CulturalNote {
  title: string; content: string; priority: 'essential' | 'recommended' | 'tip';
}

export interface SmartPackage {
  eventType: string; eventName: string;
  budget: number; guestCount: number;
  province: string; area: string; date: string;
  tiers: TierPackage[];
  essentials: string[]; extras: string[];
  plannerNote: string;
  culturalNotes: CulturalNote[];
  groceryList: GroceryItem[];
  timeline: TimelineItem[];
  smartSaves: SmartSave[];
}

export interface TimelineItem {
  time: string; label: string; description: string;
  essential: boolean;
}

export interface SmartSave {
  id: string; question: string; saving: number;
  category: string;
}

// ─── VENDOR DATABASE ─── 50+ vendors across 15 categories
export const vendorDB: VendorDef[] = [
  // VENUE
  {id:'v1',name:'Royal Events SA',category:'venue',price:15000,rating:4.9,province:'Gauteng',description:'Luxury Sandton ballroom, seated 200',tier:'premium',areas:['Sandton','Rosebank','Midrand']},
  {id:'v2',name:'Garden Estate JHB',category:'venue',price:8000,rating:4.7,province:'Gauteng',description:'Beautiful garden venue, outdoor events',tier:'standard',areas:['Randburg','Fourways','Sandton']},
  {id:'v3',name:'Soweto Community Hall',category:'venue',price:2500,rating:4.3,province:'Gauteng',description:'Spacious community hall, 200 capacity',tier:'budget',areas:['Soweto','Johannesburg','Tembisa']},
  {id:'v4',name:'Backyard Setup Pros',category:'venue',price:1800,rating:4.4,province:'Gauteng',description:'Transform your home into a beautiful venue',tier:'budget',areas:['Soweto','Johannesburg','Alexandra','Tembisa']},
  {id:'v5',name:'Durban Beachfront Venue',category:'venue',price:12000,rating:4.8,province:'KwaZulu-Natal',description:'Stunning ocean-view venue',tier:'premium',areas:['Durban','Umhlanga','Ballito']},
  {id:'v6',name:'Umlazi Community Centre',category:'venue',price:2000,rating:4.2,province:'KwaZulu-Natal',description:'Community centre with kitchen and hall',tier:'budget',areas:['Umlazi','Durban','KwaMashu']},
  {id:'v7',name:'Cape Town Vineyards',category:'venue',price:18000,rating:4.9,province:'Western Cape',description:'Wine estate with mountain views',tier:'premium',areas:['Stellenbosch','Cape Town','Paarl']},
  {id:'v8',name:'Khayelitsha Hall Hire',category:'venue',price:1500,rating:4.1,province:'Western Cape',description:'Large hall with basic facilities',tier:'budget',areas:['Khayelitsha','Cape Town','Mitchells Plain']},
  {id:'v9',name:'East London Country Club',category:'venue',price:9000,rating:4.6,province:'Eastern Cape',description:'Scenic grounds, perfect for large events',tier:'standard',areas:['East London','King Williams Town']},

  // TENT & CHAIRS
  {id:'t1',name:'Premier Tent Hire',category:'tent_chairs',price:8000,rating:4.7,province:'Gauteng',description:'Marquee, chairs, tables, flooring',tier:'premium',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'t2',name:'Affordable Tent & Chairs',category:'tent_chairs',price:3500,rating:4.4,province:'Gauteng',description:'Stretch tent, plastic chairs, tables',tier:'standard',areas:['Soweto','Johannesburg','Tembisa']},
  {id:'t3',name:'Community Tent Co-op',category:'tent_chairs',price:1500,rating:4.1,province:'Gauteng',description:'Basic tent and chairs for community events',tier:'budget',areas:['Soweto','Alexandra','Tembisa']},
  {id:'t4',name:'KZN Stretch Tents',category:'tent_chairs',price:4000,rating:4.5,province:'KwaZulu-Natal',description:'Beautiful stretch tents for any weather',tier:'standard',areas:['Durban','Umlazi','KwaMashu']},
  {id:'t5',name:'Cape Tent Masters',category:'tent_chairs',price:2800,rating:4.3,province:'Western Cape',description:'Tent, chairs, table hire',tier:'budget',areas:['Cape Town','Khayelitsha']},

  // CATERING
  {id:'c1',name:'Zulu Traditional Caterers',category:'catering',price:220,rating:4.8,province:'KwaZulu-Natal',description:'Authentic Zulu cuisine, uqombothi, inhloko',tier:'premium',areas:['Durban','Umlazi','KwaMashu'],perPerson:true},
  {id:'c2',name:'Braai Masters SA',category:'catering',price:180,rating:4.5,province:'Gauteng',description:'Premium braai, pap, salads per person',tier:'standard',areas:['Johannesburg','Pretoria','Soweto'],perPerson:true},
  {id:'c3',name:'Xhosa Kitchen Co',category:'catering',price:200,rating:4.6,province:'Eastern Cape',description:'Xhosa traditional dishes, umngqusho',tier:'standard',areas:['East London','Port Elizabeth'],perPerson:true},
  {id:'c4',name:'Buffet Kings JHB',category:'catering',price:250,rating:4.7,province:'Gauteng',description:'Full buffet with variety of dishes',tier:'premium',areas:['Sandton','Rosebank','Johannesburg'],perPerson:true},
  {id:'c5',name:'Soweto Home Cooking',category:'catering',price:120,rating:4.3,province:'Gauteng',description:'Home-style cooking, generous portions',tier:'budget',areas:['Soweto','Johannesburg','Tembisa'],perPerson:true},
  {id:'c6',name:'Funeral Catering Specialists',category:'catering',price:150,rating:4.5,province:'Gauteng',description:'Respectful, efficient catering for memorials',tier:'standard',areas:['Soweto','Johannesburg','Pretoria','Tembisa'],perPerson:true},
  {id:'c7',name:'Durban Bunny Chow Co',category:'catering',price:130,rating:4.4,province:'KwaZulu-Natal',description:'Durban-style catering, bunny chow, curry',tier:'budget',areas:['Durban','Umlazi','KwaMashu'],perPerson:true},
  {id:'c8',name:'Cape Malay Kitchen',category:'catering',price:180,rating:4.6,province:'Western Cape',description:'Cape Malay cuisine, bobotie, koeksisters',tier:'standard',areas:['Cape Town','Stellenbosch'],perPerson:true},
  {id:'c9',name:'Lobola Feast Caterers',category:'catering',price:180,rating:4.7,province:'Gauteng',description:'Traditional feast for lobola and family events',tier:'standard',areas:['Soweto','Tembisa','Johannesburg'],perPerson:true},
  {id:'c10',name:'Finger Food Express',category:'catering',price:100,rating:4.2,province:'Gauteng',description:'Snacks, platters, sandwiches',tier:'budget',areas:['Johannesburg','Pretoria','Soweto'],perPerson:true},

  // PHOTOGRAPHY
  {id:'p1',name:'Memories Studio JHB',category:'photography',price:8000,rating:4.9,province:'Gauteng',description:'Full day, edited album, video, drone',tier:'premium',areas:['Sandton','Rosebank','Johannesburg']},
  {id:'p2',name:'Candid Shots Co',category:'photography',price:4500,rating:4.6,province:'Gauteng',description:'Natural style, 200 edited photos',tier:'standard',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'p3',name:'Soweto Lens',category:'photography',price:2500,rating:4.4,province:'Gauteng',description:'Talented local photographer, 100 photos',tier:'budget',areas:['Soweto','Johannesburg','Tembisa']},
  {id:'p4',name:'Durban Waves Photo',category:'photography',price:5000,rating:4.7,province:'KwaZulu-Natal',description:'Beach and event photography specialists',tier:'standard',areas:['Durban','Umhlanga','Ballito']},

  // MUSIC / DJ
  {id:'m1',name:'DJ Maphorisa Ent',category:'music',price:8000,rating:4.8,province:'Gauteng',description:'Amapiano, Afrobeat, full sound + lights',tier:'premium',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'m2',name:'Gospel Harmony DJs',category:'music',price:4000,rating:4.6,province:'Gauteng',description:'Gospel, worship, suitable for all ages',tier:'standard',areas:['Johannesburg','Soweto','Tembisa']},
  {id:'m3',name:'Classic Vibes DJ',category:'music',price:2500,rating:4.4,province:'Gauteng',description:'Old school, jazz, R&B, soul',tier:'budget',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'m4',name:'Sound System Hire',category:'music',price:1200,rating:4.2,province:'Gauteng',description:'Speakers, mic, basic playlist setup',tier:'budget',areas:['Johannesburg','Soweto','Tembisa']},
  {id:'m5',name:'Maskandi Live Band',category:'music',price:6000,rating:4.7,province:'KwaZulu-Natal',description:'Traditional Zulu maskandi band',tier:'premium',areas:['Durban','Umlazi','KwaMashu']},

  // DECOR
  {id:'d1',name:'Maboneng Decor Studio',category:'decor',price:8000,rating:4.8,province:'Gauteng',description:'Full decor, floral, draping, uplighting',tier:'premium',areas:['Johannesburg','Sandton','Rosebank']},
  {id:'d2',name:'Balloon & Setup Co',category:'decor',price:3000,rating:4.4,province:'Gauteng',description:'Balloons, banners, table setup',tier:'standard',areas:['Johannesburg','Soweto','Pretoria']},
  {id:'d3',name:'DIY Decor Kit Delivery',category:'decor',price:800,rating:4.0,province:'Gauteng',description:'Decor kit delivered to your door',tier:'budget',areas:['Johannesburg','Soweto','Tembisa']},
  {id:'d4',name:'Traditional Zulu Decor',category:'decor',price:5000,rating:4.7,province:'KwaZulu-Natal',description:'Impepho, grass mats, traditional colors',tier:'premium',areas:['Durban','Umlazi','KwaMashu']},

  // CAKE
  {id:'k1',name:'Cakes by Lerato',category:'cake',price:2500,rating:4.9,province:'Gauteng',description:'Custom designer cakes, any theme',tier:'premium',areas:['Rosebank','Sandton','Johannesburg']},
  {id:'k2',name:'Sweet Celebrations',category:'cake',price:1200,rating:4.5,province:'Gauteng',description:'Beautiful cakes, great taste',tier:'standard',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'k3',name:'Home Baker Network',category:'cake',price:600,rating:4.2,province:'Gauteng',description:'Home-baked with love',tier:'budget',areas:['Soweto','Johannesburg','Tembisa']},

  // DRINKS
  {id:'dr1',name:'Bartending Bros',category:'drinks',price:3500,rating:4.5,province:'Gauteng',description:'Mobile bar, cocktails, trained staff',tier:'premium',areas:['Johannesburg','Sandton','Pretoria']},
  {id:'dr2',name:'Cooler Box Kings',category:'drinks',price:1500,rating:4.3,province:'Gauteng',description:'Ice, coolers, soft drinks setup',tier:'standard',areas:['Johannesburg','Soweto','Pretoria']},
  {id:'dr3',name:'BYO Setup Only',category:'drinks',price:500,rating:4.0,province:'Gauteng',description:'Cups, ice, basic setup (you bring drinks)',tier:'budget',areas:['Johannesburg','Soweto','Tembisa']},

  // TRANSPORT
  {id:'tr1',name:'VIP Shuttle Service',category:'transport',price:4000,rating:4.6,province:'Gauteng',description:'Luxury shuttle for family, 12-seater',tier:'premium',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'tr2',name:'Family Transport Co',category:'transport',price:2000,rating:4.3,province:'Gauteng',description:'Kombi hire for 15 people',tier:'standard',areas:['Johannesburg','Soweto','Tembisa']},
  {id:'tr3',name:'Uber Vouchers',category:'transport',price:800,rating:4.1,province:'Gauteng',description:'Digital Uber vouchers for key guests',tier:'budget',areas:['Johannesburg','Pretoria','Durban','Cape Town']},

  // SOUND / PA
  {id:'s1',name:'Pro Audio Hire',category:'sound',price:3000,rating:4.5,province:'Gauteng',description:'Mic, speakers, for speeches and announcements',tier:'standard',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'s2',name:'Basic PA System',category:'sound',price:1000,rating:4.2,province:'Gauteng',description:'Single mic and speaker for speeches',tier:'budget',areas:['Johannesburg','Soweto','Tembisa']},

  // SECURITY
  {id:'sec1',name:'Secure Events',category:'security',price:2500,rating:4.4,province:'Gauteng',description:'2 guards, full event coverage',tier:'standard',areas:['Johannesburg','Soweto','Pretoria']},
  {id:'sec2',name:'Community Peacekeepers',category:'security',price:1000,rating:4.0,province:'Gauteng',description:'Community volunteers for crowd management',tier:'budget',areas:['Soweto','Alexandra','Tembisa']},

  // PROGRAM / PRINTING
  {id:'pr1',name:'Memorial Print Co',category:'program',price:800,rating:4.4,province:'Gauteng',description:'Order of service, prayer cards, bookmarks',tier:'standard',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'pr2',name:'Digital Memorial',category:'program',price:300,rating:4.1,province:'Gauteng',description:'Digital programme shared via WhatsApp',tier:'budget',areas:['Johannesburg','Soweto','Durban','Cape Town']},

  // FUNERAL PARLOUR
  {id:'fp1',name:'Doves Funeral Services',category:'funeral_parlour',price:18000,rating:4.7,province:'Gauteng',description:'Full funeral package: coffin, hearse, mortuary, body prep, death cert',tier:'premium',areas:['Johannesburg','Soweto','Pretoria']},
  {id:'fp2',name:'Avbob Funeral Services',category:'funeral_parlour',price:12000,rating:4.6,province:'Gauteng',description:'Coffin, hearse, mortuary, programmes, grave preparation',tier:'standard',areas:['Johannesburg','Soweto','Tembisa','Alexandra']},
  {id:'fp3',name:'Martin’s Funeral Parlour',category:'funeral_parlour',price:8000,rating:4.3,province:'Gauteng',description:'Budget-friendly: coffin, hearse, basic body preparation',tier:'budget',areas:['Soweto','Johannesburg','Tembisa']},
  {id:'fp4',name:'KZN Funeral Directors',category:'funeral_parlour',price:10000,rating:4.5,province:'KwaZulu-Natal',description:'Full service funeral parlour in Durban area',tier:'standard',areas:['Durban','Umlazi','KwaMashu']},
  {id:'fp5',name:'EC Funeral Services',category:'funeral_parlour',price:7500,rating:4.2,province:'Eastern Cape',description:'Respectful, affordable funeral services',tier:'budget',areas:['East London','Port Elizabeth','Umtata']},

  // INFRASTRUCTURE (tent, chairs, tables, generator, toilets, lighting)
  {id:'inf1',name:'Premier Funeral Setup',category:'infrastructure',price:15000,rating:4.8,province:'Gauteng',description:'Large marquee, chairs, tables, generator, VIP toilets, full lighting',tier:'premium',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'inf2',name:'Soweto Funeral Hire',category:'infrastructure',price:6000,rating:4.4,province:'Gauteng',description:'Stretch tent, 100 plastic chairs, tables, generator, portable toilet',tier:'standard',areas:['Soweto','Johannesburg','Tembisa','Alexandra']},
  {id:'inf3',name:'Community Setup Co-op',category:'infrastructure',price:3500,rating:4.1,province:'Gauteng',description:'Basic tent, chairs, basic lighting. Community-based affordable.',tier:'budget',areas:['Soweto','Alexandra','Tembisa']},
  {id:'inf4',name:'KZN Tent & Toilet Hire',category:'infrastructure',price:8000,rating:4.5,province:'KwaZulu-Natal',description:'Stretch tent, chairs, tables, mobile toilets, generator',tier:'standard',areas:['Durban','Umlazi','KwaMashu']},

  // CEREMONY (flowers, grave, tombstone)
  {id:'cer1',name:'Forever Tombstones',category:'ceremony',price:8000,rating:4.6,province:'Gauteng',description:'Tombstone, grave marker, grave preparation',tier:'standard',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'cer2',name:'Funeral Florist JHB',category:'ceremony',price:2500,rating:4.5,province:'Gauteng',description:'Wreaths, floral arrangements, casket flowers',tier:'standard',areas:['Johannesburg','Soweto','Tembisa']},
  {id:'cer3',name:'Budget Grave Services',category:'ceremony',price:3000,rating:4.2,province:'Gauteng',description:'Basic grave preparation and temporary marker',tier:'budget',areas:['Soweto','Johannesburg','Alexandra']},

  // PROFESSIONAL SERVICES (pastor, choir, photographer)
  {id:'pro1',name:'Pastor Khumalo Ministries',category:'professionals',price:2500,rating:4.8,province:'Gauteng',description:'Pastoral services, prayer, counselling for the family',tier:'standard',areas:['Soweto','Johannesburg','Tembisa']},
  {id:'pro2',name:'Gospel Comfort Choir',category:'professionals',price:2000,rating:4.6,province:'Gauteng',description:'Gospel choir for the funeral service',tier:'standard',areas:['Johannesburg','Soweto','Pretoria']},
  {id:'pro3',name:'Funeral Programme Director',category:'professionals',price:1500,rating:4.4,province:'Gauteng',description:'Keeps the funeral programme running smoothly',tier:'budget',areas:['Johannesburg','Soweto','Tembisa']},
  {id:'pro4',name:'Memorial Photography',category:'professionals',price:3500,rating:4.5,province:'Gauteng',description:'Respectful funeral photography and video',tier:'standard',areas:['Johannesburg','Soweto','Pretoria']},

  // SUPPORT (security, cleaning, waste)
  {id:'sup1',name:'Secure Events',category:'support',price:2500,rating:4.4,province:'Gauteng',description:'2 guards, crowd management for large funerals',tier:'standard',areas:['Johannesburg','Soweto','Pretoria']},
  {id:'sup2',name:'Community Peacekeepers',category:'support',price:1000,rating:4.0,province:'Gauteng',description:'Community volunteers for crowd management',tier:'budget',areas:['Soweto','Alexandra','Tembisa']},
  {id:'sup3',name:'Clean-Up Crew',category:'support',price:1500,rating:4.3,province:'Gauteng',description:'Post-funeral cleaning and waste removal',tier:'standard',areas:['Johannesburg','Soweto','Tembisa']},

  // FAMILY SUPPORT (accommodation, transport, shuttle)
  {id:'fs1',name:'Family Transport Co',category:'family_support',price:3000,rating:4.3,province:'Gauteng',description:'Kombi and shuttle for out-of-town relatives',tier:'standard',areas:['Johannesburg','Soweto','Pretoria']},
  {id:'fs2',name:'Guest Accommodation Help',category:'family_support',price:2000,rating:4.1,province:'Gauteng',description:'Helps arrange nearby accommodation for relatives',tier:'budget',areas:['Johannesburg','Pretoria','Soweto']},

  // COMMUNICATION (programmes, obituary, WhatsApp, livestream)
  {id:'com1',name:'Memorial Print Co',category:'communication',price:800,rating:4.4,province:'Gauteng',description:'Funeral programmes, obituary printing, prayer cards',tier:'standard',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'com2',name:'Digital Funeral Services',category:'communication',price:1500,rating:4.5,province:'Gauteng',description:'WhatsApp invite design, livestreaming setup, digital programme',tier:'standard',areas:['Johannesburg','Soweto','Durban','Cape Town']},
  {id:'com3',name:'Budget Print & Design',category:'communication',price:400,rating:4.1,province:'Gauteng',description:'Simple funeral programmes and prayer cards',tier:'budget',areas:['Soweto','Johannesburg','Tembisa']},

  // UMGIDI — LIVESTOCK
  {id:'ul1',name:'EC Cattle Farmers Co-op',category:'catering',price:10000,rating:4.8,province:'Eastern Cape',description:'Healthy cows for umgidi ceremonies. Delivery included.',tier:'standard',areas:['East London','Umtata','Port Elizabeth']},
  {id:'ul2',name:'Gauteng Livestock Suppliers',category:'catering',price:12000,rating:4.6,province:'Gauteng',description:'Cows and sheep for traditional ceremonies',tier:'standard',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'ul3',name:'KZN Rural Farmers',category:'catering',price:9000,rating:4.5,province:'KwaZulu-Natal',description:'Cattle and goats from rural KZN farms',tier:'budget',areas:['Durban','Umlazi','KwaMashu']},

  // UMGIDI — TRADITIONAL SERVICES
  {id:'ut1',name:'Xhosa Cultural Services',category:'traditional',price:3500,rating:4.9,province:'Eastern Cape',description:'Full traditional package: incibi referral, inkankatha gift, cultural guidance, umqombothi sourcing',tier:'premium',areas:['East London','Umtata','Port Elizabeth']},
  {id:'ut2',name:'Traditional Attire & Gifts',category:'traditional',price:2500,rating:4.6,province:'Eastern Cape',description:'Initiate attire, family blankets, elder gifts, traditional items',tier:'standard',areas:['East London','Umtata']},
  {id:'ut3',name:'Cultural Speaker Network',category:'traditional',price:1500,rating:4.5,province:'Eastern Cape',description:'Elders and cultural speakers for umgidi ceremony',tier:'standard',areas:['East London','Port Elizabeth']},

  // UMGIDI — INFRASTRUCTURE
  {id:'ui1',name:'Umgidi Setup Specialists',category:'infrastructure',price:12000,rating:4.7,province:'Eastern Cape',description:'Large marquee, VIP seating, mobile toilets, generator, full lighting, parking attendants',tier:'premium',areas:['East London','Umtata']},
  {id:'ui2',name:'EC Tent & Chair Hire',category:'infrastructure',price:6000,rating:4.4,province:'Eastern Cape',description:'Stretch tent, tables, chairs, basic generator',tier:'standard',areas:['East London','Port Elizabeth']},

  // UMGIDI — ABAXHELI (meat preparation)
  {id:'ua1',name:'Traditional Meat Preparers',category:'catering',price:3500,rating:4.7,province:'Eastern Cape',description:'Abaxheli — expert traditional meat cutters and braai masters for umgidi',tier:'standard',areas:['East London','Umtata','Port Elizabeth']},

  // HAIR & MAKEUP
  {id:'h1',name:'Glam Squad Pro',category:'hair_makeup',price:3500,rating:4.8,province:'Gauteng',description:'Full glam, lashes, hair styling',tier:'premium',areas:['Sandton','Rosebank','Johannesburg']},
  {id:'h2',name:'Beauty on Budget',category:'hair_makeup',price:1500,rating:4.4,province:'Gauteng',description:'Hair and makeup, simple elegant',tier:'budget',areas:['Johannesburg','Soweto','Pretoria']},

  // LIVESTOCK
  {id:'live1',name:'KZN Cattle Suppliers',category:'livestock',price:12000,rating:4.7,province:'KwaZulu-Natal',description:'Healthy cows for umemulo/lobola ceremonies',tier:'premium',areas:['Durban','Umlazi','KwaMashu']},
  {id:'live2',name:'Gauteng Goat & Cow',category:'livestock',price:8000,rating:4.5,province:'Gauteng',description:'Cattle and goats for traditional ceremonies',tier:'standard',areas:['Johannesburg','Pretoria','Soweto']},
  {id:'live3',name:'EC Livestock Co',category:'livestock',price:2500,rating:4.3,province:'Eastern Cape',description:'Goats for imbeleko and small ceremonies',tier:'budget',areas:['East London','Port Elizabeth','Umtata']},
];

// ─── EVENT CONFIGURATIONS (Deep Cultural Intelligence) ───
const eventConfigs: Record<string, { categories: EventCategoryDef[]; plannerNote: string; culturalNotes: CulturalNote[]; groceryList: GroceryItem[]; timeline: TimelineItem[]; smartSaves: SmartSave[] }> = {
  wedding: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:30, standardAlloc:30, premiumAlloc:25, why:'The venue sets the tone for your entire wedding day' },
      { key:'catering', label:'Food & Catering', essential:true, perPerson:true, budgetAlloc:25, standardAlloc:25, premiumAlloc:25, why:'Guests always remember great food' },
      { key:'photography', label:'Photography & Video', essential:true, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:20, why:'These memories last a lifetime — book early' },
      { key:'cake', label:'Wedding Cake', essential:true, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'The centerpiece of your reception' },
      { key:'decor', label:'Decor & Flowers', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:12, why:'Transforms any space into something magical' },
      { key:'music', label:'Music & DJ', essential:false, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'Sets the vibe for the reception' },
      { key:'hair_makeup', label:'Hair & Makeup', essential:false, perPerson:false, budgetAlloc:4, standardAlloc:4, premiumAlloc:3, why:'Look your best on your special day' },
      { key:'drinks', label:'Drinks & Bar', essential:false, perPerson:true, budgetAlloc:3, standardAlloc:3, premiumAlloc:2, why:'Keep guests refreshed' },
    ],
    plannerNote: 'Your wedding day should be unforgettable. The venue and photographer should be your top priorities as they get booked months in advance. Book these first, then fill in the rest.',
    culturalNotes: [
      { title:'Book Early', content:'Wedding venues and photographers get booked 6-12 months in advance, especially September-April (wedding season).', priority:'essential' },
      { title:'Rain Plan', content:'If outdoor venue, always have a tent backup plan — especially in summer thunderstorm season.', priority:'recommended' },
      { title:'Plus One Policy', content:'Be clear on your invitations about plus ones to avoid budget surprises.', priority:'tip' },
    ],
    groceryList: [],
    timeline: [
      { time:'6 months before', label:'Book venue & photographer', description:'These are the first things to lock in', essential:true },
      { time:'4 months before', label:'Book caterer, DJ, decor', description:'Get your core team in place', essential:true },
      { time:'2 months before', label:'Invitations & dress', description:'Send invites, final dress fitting', essential:true },
      { time:'2 weeks before', label:'Final confirmations', description:'Confirm all vendor bookings and guest count', essential:true },
      { time:'Day before', label:'Rehearsal & setup', description:'Walk through the ceremony, decor setup', essential:false },
    ],
    smartSaves: [
      { id:'ws1', question:'Can the reception be at a community hall instead of a commercial venue?', saving:5000, category:'venue' },
      { id:'ws2', question:'Can a family member with a good camera handle photography?', saving:3000, category:'photography' },
      { id:'ws3', question:'Can you use a Spotify playlist instead of a DJ?', saving:2000, category:'music' },
      { id:'ws4', question:'Can family contribute dishes for the catering?', saving:4000, category:'catering' },
    ],
  },

  traditional_wedding: {
    categories: [
      { key:'venue', label:'Venue (Home or Hall)', essential:true, perPerson:false, budgetAlloc:20, standardAlloc:20, premiumAlloc:15, why:'A welcoming space for both families' },
      { key:'catering', label:'Traditional Feast', essential:true, perPerson:true, budgetAlloc:30, standardAlloc:30, premiumAlloc:30, why:'Traditional food is the heart of the celebration' },
      { key:'decor', label:'Traditional Decor', essential:true, perPerson:false, budgetAlloc:20, standardAlloc:20, premiumAlloc:20, why:'Cultural decor honors the tradition' },
      { key:'photography', label:'Photography', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:15, why:'Capture the cultural moments' },
      { key:'music', label:'Music & Entertainment', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Traditional music adds atmosphere' },
      { key:'cake', label:'Celebration Cake', essential:false, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'Modern addition to the celebration' },
      { key:'drinks', label:'Drinks', essential:false, perPerson:true, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'Refreshments for guests' },
    ],
    plannerNote: 'A traditional wedding celebrates culture and family unity. The food and decor set the atmosphere that guests will remember. Focus on authentic traditional elements and generous hospitality.',
    culturalNotes: [
      { title:'Gifts for Bride\'s Family', content:'The groom\'s family brings blankets, groceries, and household items (umembeso). Budget R5,000-20,000 for gifts depending on family status.', priority:'essential' },
      { title:'Traditional Attire', content:'Both families wear traditional clothing. Coordinate colors in advance.', priority:'essential' },
      { title:'Elder Blessings', content:'Reserve time for elder speeches and ancestral blessings — this is the spiritual core of the event.', priority:'essential' },
    ],
    groceryList: [
      { item:'Rice', quantity:'10kg', estPrice:250, essential:true },
      { item:'Maize meal', quantity:'10kg', estPrice:180, essential:true },
      { item:'Cooking oil', quantity:'5L', estPrice:180, essential:true },
      { item:'Meat (beef/lamb)', quantity:'10kg', estPrice:1200, essential:true },
      { item:'Soft drinks', quantity:'5 crates', estPrice:600, essential:true },
      { item:'Blankets for in-laws', quantity:'4-6', estPrice:2000, essential:true },
      { item:'Washing soap', quantity:'5 bars', estPrice:100, essential:true },
      { item:'Tissues', quantity:'10 packs', estPrice:150, essential:true },
    ],
    timeline: [
      { time:'2 months before', label:'Lobola agreement', description:'Ensure lobola negotiations are complete', essential:true },
      { time:'1 month before', label:'Grocery shopping', description:'Buy all gifts and groceries for bride\'s family', essential:true },
      { time:'2 weeks before', label:'Catering & decor', description:'Book traditional caterer and decor specialist', essential:true },
      { time:'1 week before', label:'Confirm guest list', description:'Coordinate both families\' attendance', essential:true },
      { time:'Day of', label:'Setup & gifts', description:'Arrive early with gifts, set up venue', essential:true },
    ],
    smartSaves: [
      { id:'tws1', question:'Can the event be at a family home instead of hiring a hall?', saving:3000, category:'venue' },
      { id:'tws2', question:'Can family members help with cooking instead of a caterer?', saving:5000, category:'catering' },
      { id:'tws3', question:'Can you do simple traditional decor yourself?', saving:2000, category:'decor' },
    ],
  },

  lobola: {
    categories: [
      { key:'venue', label:'Venue Setup', essential:true, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:8, why:'A dignified setting for the families' },
      { key:'catering', label:'Family Feast', essential:true, perPerson:true, budgetAlloc:30, standardAlloc:30, premiumAlloc:30, why:'Feeding both families is essential' },
      { key:'decor', label:'Traditional Setup', essential:true, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'Creates the right atmosphere' },
      { key:'drinks', label:'Refreshments', essential:false, perPerson:true, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Soft drinks and traditional beer' },
      { key:'photography', label:'Photography', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:12, why:'Document this milestone' },
      { key:'cake', label:'Cake', essential:false, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'Optional celebration element' },
      { key:'sound', label:'Sound System', essential:false, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'For speeches and announcements' },
    ],
    plannerNote: 'Lobola is a sacred family ceremony. The focus is on respectful hosting, traditional food, and a dignified setting. The entrance fee (imvulamlomo) and grocery list are as important as the venue.',
    culturalNotes: [
      { title:'Imvulamlomo (Entrance Fee)', content:'The groom\'s family must pay a fee to enter the gate. This is non-negotiable. Budget R500-2,000.', priority:'essential' },
      { title:'The Grocery List', content:'The bride\'s family provides a list of groceries that must be brought exactly as specified. This is a test of respect.', priority:'essential' },
      { title:'The Negotiation', content:'The groom himself does NOT speak during negotiations. His uncle or appointed spokesperson (idombo) handles everything.', priority:'essential' },
      { title:'Blankets for In-Laws', content:'Bring 4-6 quality blankets as gifts for the bride\'s parents and elders.', priority:'essential' },
      { title:'Installments OK', content:'Lobola can be paid in installments. It is common to agree on a payment plan over months or even years.', priority:'tip' },
    ],
    groceryList: [
      { item:'Rice', quantity:'10kg', estPrice:250, essential:true },
      { item:'Maize meal', quantity:'10kg', estPrice:180, essential:true },
      { item:'Cooking oil', quantity:'5L', estPrice:180, essential:true },
      { item:'Beef/Goat meat', quantity:'10kg', estPrice:1200, essential:true },
      { item:'Soft drinks', quantity:'5 crates', estPrice:600, essential:true },
      { item:'Washing soap', quantity:'5 bars', estPrice:100, essential:true },
      { item:'Tissues', quantity:'10 packs', estPrice:150, essential:true },
      { item:'Sugar', quantity:'5kg', estPrice:120, essential:true },
      { item:'Tea/coffee', quantity:'2 packs', estPrice:150, essential:true },
      { item:'Blankets for elders', quantity:'4-6', estPrice:2000, essential:true },
      { item:'Impepho (incense)', quantity:'1 pack', estPrice:100, essential:false },
    ],
    timeline: [
      { time:'2 weeks before', label:'Get grocery list', description:'Ask bride\'s family for the exact grocery list', essential:true },
      { time:'1 week before', label:'Buy groceries', description:'Purchase everything on the list exactly as specified', essential:true },
      { time:'3 days before', label:'Catering prep', description:'Arrange food for the day — home-cooked or caterer', essential:true },
      { time:'Day before', label:'Prepare delegates', description:'Brief your spokesperson (idombo) on the plan', essential:true },
      { time:'Day of', label:'Arrive with respect', description:'Stand at the gate, shout clan names, wait to be received', essential:true },
    ],
    smartSaves: [
      { id:'ls1', question:'Can the ceremony be at the bride\'s family home?', saving:2000, category:'venue' },
      { id:'ls2', question:'Can family members cook instead of hiring a caterer?', saving:4000, category:'catering' },
      { id:'ls3', question:'Can you use WhatsApp invites instead of printed ones?', saving:500, category:'program' },
    ],
  },

  funeral: {
    categories: [
      { key:'funeral_parlour', label:'Funeral Parlour', essential:true, perPerson:false, budgetAlloc:18, standardAlloc:18, premiumAlloc:18, why:'Coffin, hearse, mortuary services, body preparation, death certificate assistance' },
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'Church, community hall, or home tent for the service' },
      { key:'tent_chairs', label:'Infrastructure', essential:true, perPerson:false, budgetAlloc:20, standardAlloc:20, premiumAlloc:18, why:'Tent, chairs, tables, generator, toilets, lighting' },
      { key:'catering', label:'Funeral Catering', essential:true, perPerson:true, budgetAlloc:25, standardAlloc:25, premiumAlloc:25, why:'It is cultural duty to feed every attendee' },
      { key:'communication', label:'Communication', essential:true, perPerson:false, budgetAlloc:4, standardAlloc:4, premiumAlloc:4, why:'Funeral programmes, obituary printing, WhatsApp invitations, livestreaming' },
      { key:'ceremony', label:'Ceremony Requirements', essential:true, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'Flowers, grave preparation, tombstone, grave marker, family transport' },
      { key:'professionals', label:'Professional Services', essential:true, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'Pastor, programme director, choir, photographer' },
      { key:'support', label:'Event Support', essential:false, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'Security, cleaning services, waste management' },
      { key:'family_support', label:'Family Support', essential:false, perPerson:false, budgetAlloc:4, standardAlloc:4, premiumAlloc:4, why:'Accommodation for relatives, transport arrangements, shuttle services' },
      { key:'sound', label:'Sound System', essential:false, perPerson:false, budgetAlloc:3, standardAlloc:3, premiumAlloc:3, why:'For the service and speeches' },
    ],
    plannerNote: 'A funeral is one of the most emotionally difficult events to plan, and time is never on your side. In South African communities, funerals are communal — the entire neighbourhood will come. We have organised the planning by priority: funeral parlour first, then infrastructure (tent, chairs, toilets), then food, then the ceremony details. Plan for 20-30% MORE guests than your list.',
    culturalNotes: [
      { title:'Night Vigil (Imvuselelo)', content:'The night before burial, the community gathers to sing, pray, and keep vigil. This requires its own seating, basic food, and lighting. Budget separately for this.', priority:'essential' },
      { title:'Plan for MORE Guests', content:'In Black South African communities, the ENTIRE community attends funerals. Always plan for 20-30% more guests than your list. It is better to have extra food than not enough.', priority:'essential' },
      { title:'No Alcohol Policy', content:'Traditional funerals do NOT serve alcohol. Soft drinks, water, juice, and tea are appropriate. Some families may serve traditional beer (umqombothi) after the burial only.', priority:'essential' },
      { title:'Time is CRITICAL', content:'Funerals are arranged within 2-7 days. The funeral parlour, tent hire, and catering are the FIRST calls. Everything else follows.', priority:'essential' },
      { title:'Load Shedding', content:'Always check the Eskom load shedding schedule for the funeral date. A generator is non-negotiable if Stage 3+ is expected.', priority:'essential' },
      { title:'Grave Preparation', content:'The family is responsible for grave digging and tombstone/marker. Some cemeteries require advance booking for the grave site.', priority:'recommended' },
      { title:'Livestreaming', content:'Many families now livestream the service for relatives who cannot attend. A stable internet connection or mobile data is needed.', priority:'recommended' },
    ],
    groceryList: [
      { item:'Water (500ml bottles)', quantity:'10 crates', estPrice:1000, essential:true },
      { item:'Soft drinks (2L)', quantity:'10 crates', estPrice:1200, essential:true },
      { item:'Tea, coffee & sugar', quantity:'bulk', estPrice:300, essential:true },
      { item:'Meat (beef/lamb) for catering', quantity:'20kg', estPrice:2400, essential:true },
      { item:'Maize meal (pap)', quantity:'15kg', estPrice:270, essential:true },
      { item:'Paper cups, plates & serviettes', quantity:'bulk for 150+', estPrice:500, essential:true },
      { item:'Tissues', quantity:'20 packs', estPrice:300, essential:true },
      { item:'Bread rolls', quantity:'100', estPrice:400, essential:true },
      { item:'Ice', quantity:'10 bags', estPrice:300, essential:true },
    ],
    timeline: [
      { time:'Day 1 (Death)', label:'Contact funeral parlour & tent/chair hire', description:'These are THE most urgent. Book immediately.', essential:true },
      { time:'Day 1-2', label:'Confirm venue & catering', description:'Church, community hall, or home tent. Confirm caterer numbers.', essential:true },
      { time:'Day 2-3', label:'Order of service & obituary', description:'Print programmes and prayer cards. Design WhatsApp invite.', essential:true },
      { time:'Day 3-4', label:'Grave site & tombstone', description:'Confirm grave preparation at cemetery. Order temporary grave marker.', essential:true },
      { time:'Night before', label:'Imvuselelo (Night Vigil)', description:'Setup seating, basic refreshments, lighting for the vigil.', essential:true },
      { time:'Funeral day morning', label:'Final setup', description:'Tent up, chairs out, sound tested, catering ready, flowers delivered.', essential:true },
    ],
    smartSaves: [
      { id:'fs1', question:'Can the church or community hall provide chairs and reduce tent hire?', saving:2500, category:'tent_chairs' },
      { id:'fs2', question:'Can community members / neighbours help with cooking and serving?', saving:6000, category:'catering' },
      { id:'fs3', question:'Can the church provide their sound system and microphone?', saving:1500, category:'sound' },
      { id:'fs4', question:'Use WhatsApp invitations and a digital funeral programme instead of printing?', saving:800, category:'communication' },
      { id:'fs5', question:'Can family transport relatives in their own cars instead of hiring a shuttle?', saving:2000, category:'family_support' },
      { id:'fs6', question:'Ask community volunteers for security and cleaning instead of hiring?', saving:1500, category:'support' },
    ],
  },

  umgidi: {
    categories: [
      { key:'infrastructure', label:'Venue & Infrastructure', essential:true, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:12, why:'Tent/marquee, tables, chairs, VIP seating, mobile toilets, generator, extension cables, lighting, parking attendants' },
      { key:'catering', label:'Catering', essential:true, perPerson:true, budgetAlloc:30, standardAlloc:30, premiumAlloc:30, why:'Cow, sheep, chicken, meat preparation (abaxheli), braai equipment, firewood, catering team, serving staff' },
      { key:'beverages', label:'Beverages', essential:true, perPerson:true, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Alcohol (Makro/Prestons/Ultra City), cooldrinks, water, ice' },
      { key:'traditional', label:'Traditional Requirements', essential:true, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:18, why:'Incibi (surgical operator), Inkankatha (ongoing caretaker), traditional attire, family gifts, cultural speakers, umqombothi' },
      { key:'decor', label:'Decor', essential:false, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'Table cloths, chair covers, backdrop, stage decor, welcome sign' },
      { key:'professionals', label:'Professional Services', essential:false, perPerson:false, budgetAlloc:7, standardAlloc:7, premiumAlloc:7, why:'Pastor/cultural speaker, programme director, choir/traditional music, photographer, videographer' },
      { key:'music', label:'Music & Sound', essential:false, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'DJ or live band, PA system, microphones' },
      { key:'transport', label:'Transport', essential:false, perPerson:false, budgetAlloc:4, standardAlloc:4, premiumAlloc:4, why:'Family transport, parking attendants' },
    ],
    plannerNote: 'Umgidi is a sacred and joyous Xhosa celebration that welcomes initiates (amakrwala) back home after ulwaluko — the traditional rite of passage into manhood. This is one of the most significant cultural events in Xhosa tradition. The celebration is massive — often hundreds of guests — and the food (especially the slaughtered livestock) is the heart of the event. Planning starts weeks before the boys even enter the mountain.',
    culturalNotes: [
      { title:'Livestock is Sacred', content:'The cow (and often sheep) slaughtered at umgidi is not just food — it is a sacred offering. The initiate must be present when the animal is slaughtered. Source livestock from trusted farmers weeks in advance.', priority:'essential' },
      { title:'Incibi (Surgical Operator)', content:'The traditional surgeon who performs the circumcision. He must be paid and honoured. Budget R2,000-5,000 plus a gift (blanket, suit, or cash).', priority:'essential' },
      { title:'Inkankatha (Caretaker)', content:'The adult male who stays with the boys throughout their time in the mountains, teaching them tradition. He must be honoured with gifts and a seat of honour at the celebration.', priority:'essential' },
      { title:'Traditional Attire', content:'The initiate wears a specific blanket (ingcawa), a suit or traditional wear, and carries a stick. Family members also wear traditional colours. Budget for attire for the initiate and immediate family.', priority:'essential' },
      { title:'Umqombothi', content:'Traditional African beer that MUST be present at the celebration. It is culturally required. Arrange for someone to brew it or source it in advance.', priority:'essential' },
      { title:'Cultural Speakers', content:'Elders and cultural leaders will speak to welcome the initiate into manhood. The programme director coordinates this. Budget for tokens of appreciation.', priority:'essential' },
      { title:'Family Gifts (Izibizo)', content:'Guests bring gifts for the initiate — money, clothes, blankets. The family also distributes gifts. Budget for thank-you gifts for key elders.', priority:'recommended' },
      { title:'The Programme', content:'Umgidi follows a specific order: prayer, speeches by elders, slaughtering ritual, feasting, music/dancing, gift-giving. A programme director keeps everything flowing.', priority:'recommended' },
    ],
    groceryList: [
      { item:'Cow (for slaughter)', quantity:'1 (large)', estPrice:12000, essential:true },
      { item:'Sheep (for slaughter)', quantity:'2-3', estPrice:4500, essential:true },
      { item:'Chicken (for pre-celebration meals)', quantity:'10', estPrice:800, essential:true },
      { item:'Firewood (for braai and cooking)', quantity:'large pile', estPrice:500, essential:true },
      { item:'Cooldrinks (2L bottles)', quantity:'20 crates', estPrice:2400, essential:true },
      { item:'Water (500ml bottles)', quantity:'15 crates', estPrice:1500, essential:true },
      { item:'Ice', quantity:'20 bags', estPrice:600, essential:true },
      { item:'Maize meal (pap)', quantity:'25kg', estPrice:450, essential:true },
      { item:'Umqombothi (traditional beer)', quantity:'2 x 20L drums', estPrice:600, essential:true },
      { item:'Alcohol (whisky, brandy, beer)', quantity:'various', estPrice:3000, essential:true },
      { item:'Traditional attire (initiate)', quantity:'1 set', estPrice:2500, essential:true },
      { item:'Blankets for elders', quantity:'6-10', estPrice:3000, essential:true },
      { item:'Gift for Incibi', quantity:'1', estPrice:2000, essential:true },
      { item:'Gift for Inkankatha', quantity:'1', estPrice:1500, essential:true },
      { item:'Paper cups, plates, serviettes', quantity:'bulk for 200+', estPrice:800, essential:true },
    ],
    timeline: [
      { time:'2-3 months before', label:'Source livestock', description:'Find and reserve cow and sheep from trusted farmers. Book incibi.', essential:true },
      { time:'1 month before', label:'Book tent, chairs & infrastructure', description:'Umgidi draws large crowds — book early. Confirm generator and toilets.', essential:true },
      { time:'3 weeks before', label:'Arrange catering team & beverages', description:'Hire abaxheli (meat preparers), serving staff. Order alcohol, cooldrinks, water from Makro/Prestons.', essential:true },
      { time:'2 weeks before', label:'Traditional attire & gifts', description:'Buy initiate\'s attire, blankets for elders, gifts for incibi and inkankatha.', essential:true },
      { time:'1 week before', label:'Confirm programme & speakers', description:'Brief the programme director. Confirm cultural speakers and their transport.', essential:true },
      { time:'2-3 days before', label:'Brew umqombothi & prep food', description:'Start brewing traditional beer. Prep meat, buy perishables.', essential:true },
      { time:'Day before', label:'Setup infrastructure', description:'Erect tent, arrange chairs, test generator and sound.', essential:true },
      { time:'Morning of', label:'Slaughter & cook', description:'Early morning cow and sheep slaughter. Meat prep and braai begins.', essential:true },
      { time:'Ceremony', label:'Welcome home', description:'Prayer, speeches, ritual, feasting, music, dancing, gift-giving.', essential:true },
    ],
    smartSaves: [
      { id:'us1', question:'Can the cow and sheep be sourced from a family member\'s farm at a reduced price?', saving:3000, category:'catering' },
      { id:'us2', question:'Can community women help with cooking and serving instead of hiring staff?', saving:3000, category:'catering' },
      { id:'us3', question:'Can you use a family member\'s bakkie for transport instead of hiring?', saving:1500, category:'transport' },
      { id:'us4', question:'Can a family member DJ with their own sound system?', saving:2500, category:'music' },
    ],
  },

  twenty_first: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:25, standardAlloc:25, premiumAlloc:22, why:'The space sets the party tone' },
      { key:'music', label:'DJ & Sound', essential:true, perPerson:false, budgetAlloc:20, standardAlloc:20, premiumAlloc:22, why:'The vibe IS the party' },
      { key:'catering', label:'Food', essential:true, perPerson:true, budgetAlloc:20, standardAlloc:20, premiumAlloc:20, why:'Keep the energy up' },
      { key:'drinks', label:'Drinks & Bar', essential:true, perPerson:true, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'This is a drinking celebration' },
      { key:'cake', label:'21st Cake', essential:false, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'Show-stopping centerpiece' },
      { key:'decor', label:'Decor & Lighting', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Create the atmosphere' },
      { key:'photography', label:'Photographer', essential:false, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:6, why:'Capture the memories' },
    ],
    plannerNote: 'A 21st birthday is a once-in-a-lifetime celebration in South Africa. The music and vibe are everything — invest in a good DJ. The KEY tradition symbolizes adulthood. Do not forget the symbolic key gift!',
    culturalNotes: [
      { title:'The Key Tradition', content:'Present the birthday person with a symbolic key — it represents they are now a trusted adult and "key holder" to the family home.', priority:'essential' },
      { title:'All-Black Theme', content:'The classic 21st birthday dress code is all-black/elegant. Make sure guests know!', priority:'recommended' },
      { title:'Vibe is Everything', content:'Invest 30-40% of your budget in DJ + sound + venue. People remember the vibe, not the decor.', priority:'tip' },
      { title:'Guest Transport', content:'Arrange Uber vouchers or a shuttle — people will be drinking.', priority:'recommended' },
    ],
    groceryList: [],
    timeline: [
      { time:'1 month before', label:'Book venue & DJ', description:'These get booked fast — especially in December', essential:true },
      { time:'2 weeks before', label:'Catering & drinks', description:'Confirm numbers with caterer', essential:true },
      { time:'1 week before', label:'Decor & cake', description:'Finalize theme, order cake', essential:true },
      { time:'3 days before', label:'Send reminders', description:'WhatsApp all guests the details', essential:true },
      { time:'Day of', label:'Setup & sound check', description:'Arrive early for decor and DJ setup', essential:true },
    ],
    smartSaves: [
      { id:'21s1', question:'Can you host at home instead of a venue?', saving:5000, category:'venue' },
      { id:'21s2', question:'Can a friend DJ with their equipment?', saving:3000, category:'music' },
      { id:'21s3', question:'Can guests bring their own drinks (BYOB)?', saving:3000, category:'drinks' },
    ],
  },

  birthday: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:25, standardAlloc:25, premiumAlloc:22, why:'Where the celebration happens' },
      { key:'catering', label:'Food & Snacks', essential:true, perPerson:true, budgetAlloc:30, standardAlloc:30, premiumAlloc:30, why:'Feed your guests well' },
      { key:'cake', label:'Birthday Cake', essential:true, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'The birthday centerpiece' },
      { key:'decor', label:'Decor & Theme', essential:false, perPerson:false, budgetAlloc:12, standardAlloc:12, premiumAlloc:12, why:'Set the mood' },
      { key:'drinks', label:'Drinks', essential:false, perPerson:true, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Keep guests refreshed' },
      { key:'music', label:'Music & DJ', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:13, why:'Entertainment' },
      { key:'photography', label:'Photographer', essential:false, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'Capture moments', },
    ],
    plannerNote: 'Birthdays are about celebrating life with loved ones. Focus on good food, a great cake, and an atmosphere that makes everyone feel special.',
    culturalNotes: [
      { title:'Theme Matters', content:'A themed party (superhero, color, decade) makes planning decor and activities much easier.', priority:'recommended' },
      { title:'Party Packs', content:'For kids\' parties, party packs are expected. Budget R30-50 per child.', priority:'tip' },
    ],
    groceryList: [],
    timeline: [
      { time:'3 weeks before', label:'Book venue', description:'Secure your preferred date', essential:true },
      { time:'2 weeks before', label:'Catering & cake', description:'Order cake, confirm catering', essential:true },
      { time:'1 week before', label:'Decor & invites', description:'Buy decor, send WhatsApp invites', essential:true },
      { time:'Day before', label:'Prep food', description:'Prepare what you can in advance', essential:false },
    ],
    smartSaves: [
      { id:'bs1', question:'Can the party be at home?', saving:3000, category:'venue' },
      { id:'bs2', question:'Can family help with food?', saving:2000, category:'catering' },
      { id:'bs3', question:'Can you use a speaker playlist instead of a DJ?', saving:1500, category:'music' },
    ],
  },

  baby_shower: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:18, standardAlloc:18, premiumAlloc:15, why:'A warm, welcoming space' },
      { key:'catering', label:'Food & Treats', essential:true, perPerson:true, budgetAlloc:25, standardAlloc:25, premiumAlloc:25, why:'Finger foods, snacks, and treats' },
      { key:'decor', label:'Decor & Setup', essential:true, perPerson:false, budgetAlloc:25, standardAlloc:25, premiumAlloc:28, why:'The decor IS the experience' },
      { key:'cake', label:'Cake & Desserts', essential:true, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'Centerpiece of the shower' },
      { key:'drinks', label:'Drinks', essential:false, perPerson:true, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'Mocktails, juice, tea' },
      { key:'photography', label:'Photographer', essential:false, perPerson:false, budgetAlloc:9, standardAlloc:9, premiumAlloc:9, why:'Beautiful memories' },
    ],
    plannerNote: 'A baby shower is all about celebrating new life and motherhood. The decor creates the atmosphere — invest here. Soft colors, flowers, and personal touches make it special.',
    culturalNotes: [
      { title:'Gender Reveal', content:'Consider combining the shower with a gender reveal moment for extra excitement.', priority:'recommended' },
      { title:'Gift Registry', content:'Set up a gift registry so guests know what the mom-to-be needs.', priority:'recommended' },
      { title:'Games', content:'Plan 2-3 games (guess the baby food, diaper changing race) for entertainment.', priority:'tip' },
    ],
    groceryList: [],
    timeline: [
      { time:'1 month before', label:'Set date & venue', description:'Usually 4-6 weeks before due date', essential:true },
      { time:'2 weeks before', label:'Decor & catering', description:'Order decor, confirm catering', essential:true },
      { time:'1 week before', label:'Games & invites', description:'Plan games, send WhatsApp invites', essential:true },
    ],
    smartSaves: [
      { id:'bbs1', question:'Can the shower be at someone\'s home?', saving:2000, category:'venue' },
      { id:'bbs2', question:'Can guests each bring a dish?', saving:1500, category:'catering' },
    ],
  },

  umemulo: {
    categories: [
      { key:'livestock', label:'Cow for Slaughter', essential:true, perPerson:false, budgetAlloc:30, standardAlloc:30, premiumAlloc:25, why:'The cow is sacred — it honors the ancestors' },
      { key:'catering', label:'Communal Feast', essential:true, perPerson:true, budgetAlloc:25, standardAlloc:25, premiumAlloc:25, why:'Feed the entire community' },
      { key:'decor', label:'Traditional Decor & Setup', essential:true, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'Traditional mats, impepho, colors' },
      { key:'venue', label:'Home Setup', essential:true, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'Yard and rondavel preparation' },
      { key:'music', label:'Traditional Music & Dance', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Hire dancers to teach ukusina' },
      { key:'photography', label:'Photographer', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:15, why:'Document this sacred rite' },
      { key:'drinks', label:'Drinks', essential:false, perPerson:true, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'For guests' },
    ],
    plannerNote: 'Umemulo is one of the most significant Zulu ceremonies. The cow slaughter is non-negotiable — it is a sacred offering to the ancestors. The ukusina dance with the spear is the emotional peak of the ceremony.',
    culturalNotes: [
      { title:'The Cow is Essential', content:'A cow MUST be slaughtered during umemulo. This is a sacred ancestral offering, not optional. Budget R8,000-15,000.', priority:'essential' },
      { title:'7 Days of Preparation', content:'The girl spends a week in seclusion with her izimpelesi (maidens), practicing songs and dances.', priority:'essential' },
      { title:'Traditional Attire', content:'The isidwaba (leather skirt), beadwork, and umhlwehlwe (cow stomach fat) are essential. Source these early.', priority:'essential' },
      { title:'River Cleansing', content:'On the morning of the ceremony, the girls go to the river to bathe — a purification ritual.', priority:'essential' },
      { title:'The Spear (Umkhonto)', content:'The father presents his daughter with a spear. She performs the ukusina dance with it.', priority:'essential' },
      { title:'Money Pinning', content:'Guests pin money onto the girl\'s hair and headdress. This is a blessing and financial foundation.', priority:'recommended' },
    ],
    groceryList: [
      { item:'Cow for slaughter', quantity:'1', estPrice:12000, essential:true },
      { item:'Maize meal (pap)', quantity:'15kg', estPrice:270, essential:true },
      { item:'Soft drinks', quantity:'10 crates', estPrice:1200, essential:true },
      { item:'Isidwaba (leather skirt)', quantity:'1', estPrice:1500, essential:true },
      { item:'Beadwork', quantity:'set', estPrice:1000, essential:true },
      { item:'Impepho (incense)', quantity:'5 packs', estPrice:200, essential:true },
    ],
    timeline: [
      { time:'2 months before', label:'Source the cow', description:'Find and reserve a healthy cow', essential:true },
      { time:'1 month before', label:'Attire & izimpelesi', description:'Buy isidwaba, beadwork. Invite maidens.', essential:true },
      { time:'7 days before', label:'Begin seclusion', description:'Girl enters rondavel with izimpelesi', essential:true },
      { time:'Day before', label:'Slaughter cow', description:'Men slaughter the cow, prepare meat', essential:true },
      { time:'Morning of', label:'River cleansing', description:'Girls go to the river to bathe', essential:true },
      { time:'Ceremony', label:'Ukusina dance & celebration', description:'The main ceremony with spear, dance, gifts', essential:true },
    ],
    smartSaves: [
      { id:'us1', question:'Can the cow be sourced from a family member\'s herd?', saving:3000, category:'livestock' },
      { id:'us2', question:'Can community members help with cooking the feast?', saving:4000, category:'catering' },
    ],
  },

  corporate: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:25, standardAlloc:25, premiumAlloc:20, why:'Professional setting for your brand' },
      { key:'catering', label:'Catering', essential:true, perPerson:true, budgetAlloc:30, standardAlloc:30, premiumAlloc:30, why:'Quality food reflects on the company' },
      { key:'sound', label:'AV & Sound', essential:true, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'Presentations need reliable AV' },
      { key:'decor', label:'Branding & Setup', essential:false, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:20, why:'Brand the space' },
      { key:'transport', label:'Guest Transport', essential:false, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'Shuttle for key guests' },
      { key:'security', label:'Security', essential:false, perPerson:false, budgetAlloc:7, standardAlloc:7, premiumAlloc:7, why:'For high-profile events' },
    ],
    plannerNote: 'Corporate events need to be professional, efficient, and on-brand. The venue and catering set the tone, while reliable AV ensures your presentations run smoothly.',
    culturalNotes: [
      { title:'Brand Everything', content:'From napkins to backdrop, ensure your company branding is visible.', priority:'recommended' },
      { title:'Dietary Requirements', content:'Collect dietary requirements in advance — halal, kosher, vegan, allergies.', priority:'essential' },
    ],
    groceryList: [],
    timeline: [
      { time:'2 months before', label:'Book venue & AV', description:'Secure the space and audio-visual equipment', essential:true },
      { time:'1 month before', label:'Catering & branding', description:'Confirm catering, order branded materials', essential:true },
      { time:'1 week before', label:'Final headcount', description:'Confirm guest numbers with caterer', essential:true },
    ],
    smartSaves: [
      { id:'cs1', question:'Can you use the company office instead of an external venue?', saving:5000, category:'venue' },
    ],
  },

  graduation: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:25, standardAlloc:25, premiumAlloc:22, why:'Celebrate the achievement' },
      { key:'catering', label:'Food & Platters', essential:true, perPerson:true, budgetAlloc:30, standardAlloc:30, premiumAlloc:30, why:'Feed the well-wishers' },
      { key:'decor', label:'Decor & Setup', essential:false, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'Graduation colors and theme' },
      { key:'drinks', label:'Drinks', essential:false, perPerson:true, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Toast to success' },
      { key:'cake', label:'Graduation Cake', essential:false, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'Celebrate with a themed cake' },
      { key:'photography', label:'Photographer', essential:false, perPerson:false, budgetAlloc:12, standardAlloc:12, premiumAlloc:15, why:'Capture this milestone' },
    ],
    plannerNote: 'Graduation is a milestone worth celebrating. Whether it is a small family gathering or a big party, the food and atmosphere matter. Consider a joint celebration with fellow graduates to split costs.',
    culturalNotes: [
      { title:'Joint Celebration', content:'Consider celebrating with a fellow graduate born around the same time to split costs.', priority:'tip' },
    ],
    groceryList: [],
    timeline: [
      { time:'1 month before', label:'Set date & venue', description:'Plan around the graduation ceremony date', essential:true },
      { time:'2 weeks before', label:'Catering & decor', description:'Order cake, confirm catering', essential:true },
    ],
    smartSaves: [
      { id:'gs1', question:'Can you celebrate at home?', saving:3000, category:'venue' },
    ],
  },

  anniversary: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:25, standardAlloc:25, premiumAlloc:22, why:'A lovely setting for the celebration' },
      { key:'catering', label:'Catering', essential:true, perPerson:true, budgetAlloc:30, standardAlloc:30, premiumAlloc:30, why:'Good food for loved ones' },
      { key:'decor', label:'Decor', essential:false, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'Set the romantic mood' },
      { key:'music', label:'Music', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Ambient background music' },
      { key:'cake', label:'Anniversary Cake', essential:false, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'Sweet celebration' },
      { key:'photography', label:'Photographer', essential:false, perPerson:false, budgetAlloc:12, standardAlloc:12, premiumAlloc:15, why:'Capture the memories' },
    ],
    plannerNote: 'An anniversary celebration honors years of love and commitment. A lovely venue, great food, and perhaps some music create the perfect atmosphere for family and friends to celebrate with you.',
    culturalNotes: [],
    groceryList: [],
    timeline: [
      { time:'1 month before', label:'Book venue', description:'Secure your preferred date', essential:true },
      { time:'2 weeks before', label:'Catering & decor', description:'Confirm catering, plan decor', essential:true },
    ],
    smartSaves: [
      { id:'as1', question:'Can you celebrate at home with family?', saving:3000, category:'venue' },
    ],
  },

  baptism: {
    categories: [
      { key:'venue', label:'Church Hall / Venue', essential:true, perPerson:false, budgetAlloc:20, standardAlloc:20, premiumAlloc:18, why:'After the church service' },
      { key:'catering', label:'Catering', essential:true, perPerson:true, budgetAlloc:35, standardAlloc:35, premiumAlloc:35, why:'Feed the congregation and family' },
      { key:'cake', label:'Cake', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Christening cake' },
      { key:'decor', label:'Decor', essential:false, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'Soft, welcoming decorations' },
      { key:'program', label:'Order of Service', essential:false, perPerson:false, budgetAlloc:5, standardAlloc:5, premiumAlloc:5, why:'Printed program for guests' },
    ],
    plannerNote: 'A baptism is a blessed occasion. A welcoming venue, good food for guests, and simple but meaningful decor create the right atmosphere to celebrate this spiritual milestone.',
    culturalNotes: [
      { title:'Godparents', content:'Ensure godparents are confirmed and know their responsibilities.', priority:'essential' },
    ],
    groceryList: [],
    timeline: [
      { time:'1 month before', label:'Book church & hall', description:'Confirm date with church and reception venue', essential:true },
      { time:'2 weeks before', label:'Catering & cake', description:'Order cake, confirm catering numbers', essential:true },
    ],
    smartSaves: [
      { id:'baps1', question:'Can the church hall be used for free?', saving:1500, category:'venue' },
    ],
  },

  farewell: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:25, standardAlloc:25, premiumAlloc:22, why:'A space to say goodbye' },
      { key:'catering', label:'Food & Drinks', essential:true, perPerson:true, budgetAlloc:35, standardAlloc:35, premiumAlloc:35, why:'Comfort food for emotional goodbyes' },
      { key:'decor', label:'Decor', essential:false, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'Personal touches' },
      { key:'music', label:'Music', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Background music' },
      { key:'drinks', label:'Drinks', essential:false, perPerson:true, budgetAlloc:15, standardAlloc:15, premiumAlloc:18, why:'A toast to new beginnings' },
    ],
    plannerNote: 'A farewell is about showing love and appreciation. Good food, a comfortable venue, and perhaps some music to set the mood make for a memorable send-off.',
    culturalNotes: [],
    groceryList: [],
    timeline: [
      { time:'2 weeks before', label:'Set date & venue', description:'Plan around the person\'s departure', essential:true },
      { time:'1 week before', label:'Catering & invites', description:'Confirm catering, invite guests', essential:true },
    ],
    smartSaves: [
      { id:'fws1', question:'Can you host at the office or a home?', saving:2000, category:'venue' },
    ],
  },

  reunion: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:25, standardAlloc:25, premiumAlloc:22, why:'Space for everyone to reconnect' },
      { key:'catering', label:'Catering', essential:true, perPerson:true, budgetAlloc:30, standardAlloc:30, premiumAlloc:30, why:'Food brings people together' },
      { key:'music', label:'Music & DJ', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:12, why:'Get everyone dancing' },
      { key:'decor', label:'Decor', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Memory wall, photos' },
      { key:'photography', label:'Photographer', essential:false, perPerson:false, budgetAlloc:10, standardAlloc:10, premiumAlloc:10, why:'Capture the reunion' },
      { key:'sound', label:'Sound System', essential:false, perPerson:false, budgetAlloc:8, standardAlloc:8, premiumAlloc:8, why:'For speeches and music' },
    ],
    plannerNote: 'A reunion brings people together after years apart. A spacious venue, plenty of food, and some music to get everyone dancing create the perfect atmosphere for reconnecting.',
    culturalNotes: [
      { title:'Memory Display', content:'Create a photo/memory wall showing pictures from the past. It is a great conversation starter.', priority:'recommended' },
    ],
    groceryList: [],
    timeline: [
      { time:'2 months before', label:'Set date & venue', description:'Reunions need advance planning for travel', essential:true },
      { time:'1 month before', label:'Catering & decor', description:'Confirm catering, plan memory display', essential:true },
    ],
    smartSaves: [
      { id:'rs1', question:'Can you use a community hall or park?', saving:3000, category:'venue' },
    ],
  },

  bridal_shower: {
    categories: [
      { key:'venue', label:'Venue', essential:true, perPerson:false, budgetAlloc:20, standardAlloc:20, premiumAlloc:18, why:'Intimate space for the bride and friends' },
      { key:'catering', label:'Food & Snacks', essential:true, perPerson:true, budgetAlloc:30, standardAlloc:30, premiumAlloc:30, why:'Treats and finger foods' },
      { key:'decor', label:'Decor & Theme', essential:true, perPerson:false, budgetAlloc:25, standardAlloc:25, premiumAlloc:28, why:'The decor creates the mood' },
      { key:'cake', label:'Cake & Desserts', essential:true, perPerson:false, budgetAlloc:15, standardAlloc:15, premiumAlloc:15, why:'Sweet centerpiece' },
      { key:'drinks', label:'Drinks', essential:false, perPerson:true, budgetAlloc:10, standardAlloc:10, premiumAlloc:9, why:'Mocktails, tea, champagne' },
    ],
    plannerNote: 'A bridal shower is all about celebrating the bride-to-be with her closest friends and family. The decor sets the mood, the food and treats keep everyone happy, and games create lasting memories.',
    culturalNotes: [
      { title:'Games', content:'Plan 2-3 fun games (toilet paper wedding dress, how well do you know the bride).', priority:'recommended' },
      { title:'Gift Opening', content:'Set aside time for the bride to open gifts — it is the highlight of the shower.', priority:'recommended' },
    ],
    groceryList: [],
    timeline: [
      { time:'1 month before', label:'Set date & venue', description:'Usually 1-2 months before the wedding', essential:true },
      { time:'2 weeks before', label:'Decor & catering', description:'Plan theme, order cake, confirm catering', essential:true },
    ],
    smartSaves: [
      { id:'brs1', question:'Can you host at someone\'s home?', saving:1500, category:'venue' },
    ],
  },
};

// ─── CORE ENGINE ───

function getVendorsForCategory(
  catKey: string, province: string, area: string, tier: 'budget' | 'standard' | 'premium', guestCount: number
): VendorOption[] {
  const tierFilter = tier === 'budget' ? (v: VendorDef) => v.tier === 'budget' || v.tier === 'standard'
    : tier === 'standard' ? (v: VendorDef) => v.tier === 'standard' || v.tier === 'budget'
    : (v: VendorDef) => v.tier === 'premium' || v.tier === 'standard';

  let candidates = vendorDB.filter(v => v.category === catKey && tierFilter(v) && (v.province === province || v.province === 'Gauteng'));
  
  // If no province match, fallback to all
  if (candidates.length === 0) {
    candidates = vendorDB.filter(v => v.category === catKey && tierFilter(v));
  }

  const scored = candidates.map(v => {
    const areaMatch = v.areas.some(a => a.toLowerCase().includes(area.toLowerCase())) ? 3 : 0;
    const basePrice = v.perPerson ? v.price * Math.max(guestCount, 20) : v.price;
    // Province adjustment
    const provinceMult = province === 'Gauteng' ? 1.1 : province === 'Western Cape' ? 1.05 : 0.95;
    const price = Math.round(basePrice * provinceMult);
    const why = `${areaMatch >= 3 ? 'In your area · ' : ''}${v.rating >= 4.7 ? v.rating + ' stars · ' : ''}${v.tier === tier ? tier + ' tier · ' : ''}${v.perPerson ? 'Per person · ' : ''}Reliable & trusted`;
    return { vendor: v, price, why, score: areaMatch * 10 + v.rating * 3 + (v.tier === tier ? 5 : 0) };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(s => ({ vendor: s.vendor, price: s.price, why: s.why }));
}

export function generateSmartPackage(
  eventType: EventType,
  budget: number,
  guestCount: number,
  province: string,
  area: string,
  date: string
): SmartPackage {
  const config = eventConfigs[eventType] || eventConfigs['birthday'];
  const eventNameMap: Record<string, string> = {
    wedding:'Wedding', traditional_wedding:'Traditional Wedding', lobola:'Lobola Negotiation',
    funeral:'Funeral / Memorial', birthday:'Birthday Party', twenty_first:'21st Birthday',
    baby_shower:'Baby Shower', umemulo:'Umemulo', umgidi:'Umgidi (Homecoming)',
    corporate:'Corporate Event', graduation:'Graduation', anniversary:'Anniversary',
    baptism:'Baptism', farewell:'Farewell', reunion:'Reunion', bridal_shower:'Bridal Shower',
  };

  const tiers: TierPackage[] = (['budget', 'standard', 'premium'] as const).map(tierName => {
    const items: CategoryItem[] = config.categories.map(cat => {
      const options = getVendorsForCategory(cat.key, province, area, tierName, guestCount);
      return { category: cat.key, label: cat.label, options, essential: cat.essential, perPerson: cat.perPerson };
    });

    // Calculate total
    let totalCost = 0;
    const selectedOptions = new Map<string, number>();
    items.forEach(item => {
      if (item.options.length > 0) {
        selectedOptions.set(item.category, 0);
        totalCost += item.options[0].price;
      }
    });

    // Add grocery estimate if applicable
    if (config.groceryList.length > 0) {
      const groceryTotal = config.groceryList.reduce((s, g) => s + g.estPrice, 0);
      totalCost += groceryTotal;
    }

    return { tier: tierName, label: tierName.charAt(0).toUpperCase() + tierName.slice(1), tagline: getTagline(tierName), items, totalCost, overBudget: totalCost > budget, selectedOptions };
  });

  return {
    eventType, eventName: eventNameMap[eventType] || eventType,
    budget, guestCount, province, area, date, tiers,
    essentials: config.categories.filter(c => c.essential).map(c => c.label),
    extras: config.categories.filter(c => !c.essential).map(c => c.label),
    plannerNote: config.plannerNote,
    culturalNotes: config.culturalNotes,
    groceryList: config.groceryList,
    timeline: config.timeline,
    smartSaves: config.smartSaves,
  };
}

function getTagline(tier: string): string {
  return tier === 'budget' ? 'All the essentials, done right' : tier === 'standard' ? 'Great quality, great value' : 'The best of the best';
}

// Legacy exports for compatibility
export function generateEventPackage(eventType: EventType, budget: number, guestCount: number, province: string) {
  return generateSmartPackage(eventType, budget, guestCount, province, 'Johannesburg', '');
}

export function getSmartQuestions(_overBudgetBy: number, _eventType: EventType): string[] { return []; }
export function applySaving(pkg: any, _questionId: string): any { return pkg; }

// Types re-export for compatibility
export interface QuoteItem { id: string; category: string; vendorName: string; vendorId?: string; service: string; price: number; rating: number; status: string; notes?: string; why?: string; }
export interface EventPackage { eventType: EventType; budget: number; guestCount: number; items: QuoteItem[]; totalCost: number; remaining: number; overBudget: boolean; fallbackQuestions: any[]; savingsApplied: string[]; plannerNotes?: string[]; }
