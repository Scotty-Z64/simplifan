import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;
let dbPath = "/tmp/simplifan.db";

export function getDb() {
  if (!instance) {
    console.log("[DB] Using SQLite at:", dbPath);
    
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    
    instance = drizzle(db, { schema: fullSchema });
    
    // Auto-create tables using Drizzle's push
    pushSchema(db);
    
    console.log("[DB] SQLite ready");
  }
  return instance;
}

function pushSchema(db: Database.Database) {
  // Create tables manually with exact column names Drizzle expects
  // Use backtick quoting for column names with mixed case
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      businessName TEXT NOT NULL,
      ownerName TEXT,
      email TEXT,
      phone TEXT,
      category TEXT,
      subcategory TEXT,
      bio TEXT,
      province TEXT,
      city TEXT,
      address TEXT,
      priceRange TEXT,
      yearsInBusiness INTEGER,
      avatar TEXT,
      logoUrl TEXT,
      rating REAL DEFAULT 0,
      jobs INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      tier TEXT DEFAULT 'starter',
      subscriptionStatus TEXT DEFAULT 'trial',
      subscriptionEndsAt TEXT,
      isActive INTEGER DEFAULT 1,
      userId INTEGER,
      createdAt INTEGER NOT NULL DEFAULT (unixepoch()),
      updatedAt INTEGER NOT NULL DEFAULT (unixepoch())
    )`,
    `CREATE TABLE IF NOT EXISTS vendor_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price TEXT,
      category TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS vendor_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER NOT NULL,
      url TEXT NOT NULL,
      caption TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      location TEXT,
      avatar TEXT,
      createdAt INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER,
      clientName TEXT,
      clientPhone TEXT,
      eventType TEXT,
      eventDate TEXT,
      eventTime TEXT,
      guestCount INTEGER,
      province TEXT,
      city TEXT,
      area TEXT,
      venue TEXT,
      budget TEXT,
      totalCost TEXT DEFAULT '0',
      status TEXT DEFAULT 'planning',
      notes TEXT,
      createdAt INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER,
      clientId INTEGER,
      clientName TEXT,
      clientPhone TEXT,
      vendorId INTEGER,
      vendorName TEXT,
      eventType TEXT,
      eventDate TEXT,
      amount TEXT,
      depositAmount TEXT,
      platformFee TEXT,
      status TEXT DEFAULT 'pending',
      clientConfirmed INTEGER DEFAULT 0,
      vendorConfirmed INTEGER DEFAULT 0,
      reviewSubmitted INTEGER DEFAULT 0,
      createdAt INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId INTEGER,
      clientId INTEGER,
      clientName TEXT,
      bookingId INTEGER,
      rating INTEGER,
      comment TEXT,
      eventType TEXT,
      verifiedBooking INTEGER DEFAULT 0,
      createdAt INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER,
      clientId INTEGER,
      clientName TEXT,
      clientPhone TEXT,
      vendorId INTEGER,
      eventType TEXT,
      eventDate TEXT,
      guestCount INTEGER,
      province TEXT,
      notes TEXT,
      quotedAmount TEXT,
      vendorMessage TEXT,
      status TEXT DEFAULT 'submitted',
      createdAt INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientId INTEGER,
      vendorId INTEGER,
      lastMessage TEXT,
      clientUnread INTEGER DEFAULT 0,
      vendorUnread INTEGER DEFAULT 0,
      createdAt INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversationId INTEGER,
      senderType TEXT,
      content TEXT,
      read INTEGER DEFAULT 0,
      createdAt INTEGER
    )`,
  ];

  for (const sql of tables) {
    try {
      db.exec(sql);
    } catch (e: any) {
      console.error("[DB] Table creation error:", e.message.substring(0, 100));
    }
  }

  // Create update triggers for updatedAt
  const triggers = [
    `CREATE TRIGGER IF NOT EXISTS vendors_updatedAt AFTER UPDATE ON vendors BEGIN UPDATE vendors SET updatedAt = unixepoch() WHERE id = NEW.id; END`,
  ];
  for (const t of triggers) {
    try { db.exec(t); } catch (e) {}
  }

  // Seed data if empty
  const count = db.prepare("SELECT COUNT(*) as c FROM vendors").get() as any;
  if (count.c === 0) {
    console.log("[DB] Seeding demo data...");
    seedData(db);
  }
}

function seedData(db: Database.Database) {
  const vendorsData = [
    ['Royal Events SA','John Kekana','royal@example.com','0821112222','Catering','Gauteng','Johannesburg','R150 - R350/person',8,4.8,'Premium catering for weddings, corporate events, and traditional ceremonies.','elite',1,1,'active',1,'RE'],
    ['DJ Maphorisa Sounds','Themba Maphosa','dj@example.com','0833334444','Music / DJ','Gauteng','Pretoria','R3,500 - R8,000',12,4.9,'Professional DJ services with state-of-the-art sound equipment.','pro',1,1,'active',1,'DJ'],
    ['Elegant Moments Photography','Sarah Williams','photo@example.com','0844445555','Photography','Gauteng','Sandton','R5,000 - R15,000',6,4.7,'Capturing your special moments with artistic flair.','pro',1,1,'active',1,'EM'],
    ['Sizakele Decor & Events','Sizakele Ndlovu','decor@example.com','0855556666','Decor','KwaZulu-Natal','Durban','R2,000 - R12,000',10,4.6,'Transform any venue into a dream setting.','pro',0,1,'active',1,'SD'],
    ['Grand Venue Hire','Michael Peters','venue@example.com','0866667777','Venue','Western Cape','Cape Town','R8,000 - R25,000',15,4.5,'Stunning venues for weddings, corporate functions, and private events.','elite',1,1,'active',1,'GV'],
    ['Sweet Creations Cakes','Amanda Botha','cakes@example.com','0877778888','Cake','Gauteng','Midrand','R800 - R5,000',5,4.9,'Award-winning cake designer specialising in wedding cakes.','starter',0,1,'active',1,'SC'],
    ['Braai Masters Catering','David Mofokeng','braai@example.com','0888889999','Catering','Gauteng','Soweto','R80 - R200/person',7,4.4,'Authentic South African braai experience for your event.','starter',0,1,'trial',1,'BM'],
    ['Luxury Ride SA','Charles Mabena','ride@example.com','0899990000','Transport','Gauteng','Johannesburg','R2,500 - R8,000',9,4.3,'Premium transport for weddings and special events.','pro',0,1,'active',1,'LR'],
    ['Glam Squad Hair & Makeup','Patricia Zulu','glam@example.com','0811113333','Hair & Makeup','Gauteng','Rosebank','R1,500 - R5,000',4,4.8,'Mobile hair and makeup artists for weddings and special occasions.','starter',0,1,'active',1,'GS'],
    ['Secure Event Services','Robert Nkosi','security@example.com','0822224444','Security','Gauteng','Pretoria','R1,200 - R4,000',11,4.2,'Licensed security personnel for events of all sizes.','starter',0,0,'trial',1,'SE'],
    ['Tent Kings','William Khumalo','tents@example.com','0833335555','Tent & Equipment','KwaZulu-Natal','Pinetown','R3,000 - R15,000',14,4.5,'Marquee tents, chairs, tables, and event equipment hire.','pro',0,1,'active',1,'TK'],
    ['The Mixology Bar','James Stevens','bar@example.com','0844446666','Drinks / Bar','Western Cape','Stellenbosch','R150 - R400/person',6,4.7,'Mobile bar services with craft cocktails, premium wines, and local spirits.','pro',0,1,'active',1,'MB'],
  ];

  const stmt = db.prepare(`INSERT INTO vendors (businessName, ownerName, email, phone, category, province, city, priceRange, yearsInBusiness, rating, bio, tier, featured, verified, subscriptionStatus, isActive, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const v of vendorsData) {
    stmt.run(v);
  }

  db.prepare(`INSERT INTO vendor_services (vendorId, name, description, price, category) VALUES (?, ?, ?, ?, ?)`).run(1, 'Buffet Catering', 'Full buffet service with setup', '350.00', 'Catering');
  db.prepare(`INSERT INTO vendor_services (vendorId, name, description, price, category) VALUES (?, ?, ?, ?, ?)`).run(2, 'DJ + Sound System', 'Full PA system with DJ', '5500.00', 'Music');
  db.prepare(`INSERT INTO vendor_services (vendorId, name, description, price, category) VALUES (?, ?, ?, ?, ?)`).run(3, 'Photography Package', 'Full day coverage', '8000.00', 'Photography');

  db.prepare(`INSERT INTO vendor_images (vendorId, url, caption) VALUES (?, ?, ?)`).run(1, 'https://picsum.photos/400/300?random=1', 'Catering');
  db.prepare(`INSERT INTO vendor_images (vendorId, url, caption) VALUES (?, ?, ?)`).run(2, 'https://picsum.photos/400/300?random=2', 'DJ');
  db.prepare(`INSERT INTO vendor_images (vendorId, url, caption) VALUES (?, ?, ?)`).run(3, 'https://picsum.photos/400/300?random=3', 'Photo');

  db.prepare(`INSERT INTO events (clientId, clientName, clientPhone, eventType, eventDate, eventTime, guestCount, province, city, area, venue, budget, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(1, 'Thabo Mokoena', '0823456789', 'Wedding', '2026-08-15', '14:00', 120, 'Gauteng', 'Johannesburg', 'Soweto', 'Community Hall', '85000.00', 'planning', 'Traditional wedding');
  db.prepare(`INSERT INTO events (clientId, clientName, clientPhone, eventType, eventDate, eventTime, guestCount, province, city, area, venue, budget, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(2, 'Lerato Khumalo', '0712345678', 'Birthday', '2026-07-22', '18:00', 50, 'Gauteng', 'Sandton', 'Morningside', 'Private Residence', '25000.00', 'planning', '30th birthday');

  db.prepare(`INSERT INTO bookings (eventId, clientId, clientName, clientPhone, vendorId, vendorName, eventType, eventDate, amount, depositAmount, platformFee, status, clientConfirmed, vendorConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(1, 1, 'Thabo Mokoena', '0823456789', 1, 'Royal Events SA', 'Wedding', '2026-08-15', '35000.00', '10000.00', '1750.00', 'pending', 0, 0);
  db.prepare(`INSERT INTO bookings (eventId, clientId, clientName, clientPhone, vendorId, vendorName, eventType, eventDate, amount, depositAmount, platformFee, status, clientConfirmed, vendorConfirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(1, 1, 'Thabo Mokoena', '0823456789', 2, 'DJ Maphorisa Sounds', 'Wedding', '2026-08-15', '5500.00', '2000.00', '275.00', 'confirmed', 1, 1);

  db.prepare(`INSERT INTO reviews (vendorId, clientId, clientName, bookingId, rating, comment, eventType, verifiedBooking) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(1, 1, 'Thabo Mokoena', 1, 5, 'Amazing food! Our guests are still talking about the braai platters.', 'Wedding', 1);
  db.prepare(`INSERT INTO reviews (vendorId, clientId, clientName, bookingId, rating, comment, eventType, verifiedBooking) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(2, 2, 'Lerato Khumalo', 2, 5, 'DJ Maphorisa kept the dance floor packed all night!', 'Wedding', 1);

  db.prepare(`INSERT INTO conversations (clientId, vendorId, lastMessage, clientUnread, vendorUnread) VALUES (?, ?, ?, ?, ?)`).run(1, 1, 'Hi, can you accommodate dietary requirements?', 0, 1);
  db.prepare(`INSERT INTO conversations (clientId, vendorId, lastMessage, clientUnread, vendorUnread) VALUES (?, ?, ?, ?, ?)`).run(1, 2, 'What time should you arrive to set up?', 1, 0);

  db.prepare(`INSERT INTO messages (conversationId, senderType, content, read) VALUES (?, ?, ?, ?)`).run(1, 'client', 'Hi, I am planning my wedding and interested in your catering services.', 1);
  db.prepare(`INSERT INTO messages (conversationId, senderType, content, read) VALUES (?, ?, ?, ?)`).run(1, 'vendor', 'Congratulations! We would love to be part of your special day.', 1);
  db.prepare(`INSERT INTO messages (conversationId, senderType, content, read) VALUES (?, ?, ?, ?)`).run(1, 'client', 'Around 120 guests. Can you accommodate dietary requirements?', 0);

  console.log("[DB] Demo data seeded!");
}

export function getPool() {
  return (getDb() as any).$client;
}
