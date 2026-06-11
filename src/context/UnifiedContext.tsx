import { createContext, useContext, useState, useCallback } from 'react';

export interface ClientUser {
  id: string; name: string; phone: string; email: string; location: string; avatar: string;
}

export interface VendorUser {
  id: string; businessName: string; ownerName: string; phone: string; email: string;
  category: string; priceRange: string; location: string; rating: number; jobs: number;
  verified: boolean; bio: string; services: string[]; avatar: string;
  address?: string; website?: string; yearsInBusiness?: number;
  serviceAreas?: string[]; operatingHours?: string;
}

export interface VendorProduct {
  id: string; vendorId: string; name: string; description: string;
  price: number; category: string; tags: string[];
  available: boolean; popular: boolean; image?: string;
  createdAt: string;
}

export interface Transaction {
  id: string; vendorId: string; eventName: string; clientName: string;
  amount: number; status: 'pending' | 'paid' | 'cancelled';
  type: 'deposit' | 'full' | 'tip'; date: string;
}

export interface Guest {
  id: string; eventId: string; name: string; phone: string;
  status: 'invited' | 'confirmed' | 'declined' | 'attended';
  dietary?: string; plusOne: boolean; table?: string;
}

export interface DigitalInvite {
  id: string; eventId: string; template: string; message: string;
  sentVia: 'whatsapp' | 'sms' | 'email'; sentAt: string;
  recipientCount: number;
}

export interface VendorReview {
  id: string; vendorId: string; clientId: string; clientName: string;
  rating: number; comment: string; eventType: string; date: string;
}

export interface BudgetEntry {
  id: string; eventId: string; category: string; description: string;
  budgeted: number; actual: number; vendorName?: string;
}

export interface EventRequest {
  id: string; clientId: string; clientName: string; clientPhone: string;
  eventType: string; budget: number; guestCount: number; province: string; eventDate: string;
  status: 'planning' | 'quoted' | 'vendor_responded' | 'confirmed' | 'deposit_paid' | 'ready' | 'completed';
  items: QuoteItem[]; totalCost: number; createdAt: string; updatedAt: string;
  vendorResponses: VendorResponse[];
}

export interface QuoteItem {
  id: string; category: string; vendorName: string; vendorId?: string;
  service: string; price: number; rating: number;
  status: 'pending' | 'accepted' | 'rejected' | 'confirmed' | 'alternative';
  notes?: string;
}

export interface VendorResponse {
  vendorId: string; vendorName: string; price: number; message: string;
  status: 'pending' | 'accepted' | 'declined'; timestamp: string;
}

export interface Message {
  id: string; fromId: string; toId: string; fromName: string;
  content: string; timestamp: string; read: boolean;
}

export interface Payment {
  id: string; eventId: string; vendorName: string; amount: number;
  status: 'pending' | 'paid'; type: 'deposit' | 'full'; timestamp: string;
}

const demoClients: ClientUser[] = [
  { id: 'c1', name: 'Lerato Mokoena', phone: '082 345 6789', email: 'lerato@email.com', location: 'Soweto, Gauteng', avatar: 'LM' },
];

const demoVendors: VendorUser[] = [
  { id: 'v1', businessName: 'Royal Events SA', ownerName: 'Thandi Ndlovu', phone: '011 234 5678', email: 'info@royalevents.co.za', category: 'Venue', priceRange: 'R15k - R50k', location: 'Sandton, Gauteng', rating: 4.9, jobs: 89, verified: true, bio: 'Luxury venue with panoramic city views', services: ['Wedding Venue', 'Corporate Events', 'Conferences'], avatar: 'RE' },
  { id: 'v2', businessName: 'Braai Masters', ownerName: 'Sibusiso Khumalo', phone: '073 456 7890', email: 'braai@masters.co.za', category: 'Catering', priceRange: 'R150 - R350/person', location: 'Pretoria, Gauteng', rating: 4.7, jobs: 156, verified: true, bio: 'Premium braai and traditional catering', services: ['Braai Catering', 'Traditional Food', 'Corporate Catering'], avatar: 'BM' },
  { id: 'v3', businessName: 'Maboneng Decor', ownerName: 'Nomsa Dlamini', phone: '084 567 8901', email: 'hello@maboneng.co.za', category: 'Decor', priceRange: 'R3k - R15k', location: 'Maboneng, Gauteng', rating: 4.8, jobs: 203, verified: true, bio: 'Urban chic decor for any event', services: ['Floral Design', 'Stage Setup', 'Table Decor'], avatar: 'MD' },
  { id: 'v4', businessName: 'DJ Maphorisa Ent', ownerName: 'Themba Nkosi', phone: '071 678 9012', email: 'bookings@djm.co.za', category: 'Music', priceRange: 'R4k - R12k', location: 'Johannesburg, Gauteng', rating: 4.6, jobs: 312, verified: true, bio: 'Amapiano, House, Gospel DJ services', services: ['DJ Services', 'Sound System', 'MC Services'], avatar: 'DJ' },
  { id: 'v5', businessName: 'Cakes by Lerato', ownerName: 'Lerato Zulu', phone: '076 789 0123', email: 'cakes@lerato.co.za', category: 'Cakes', priceRange: 'R800 - R3k', location: 'Rosebank, Gauteng', rating: 4.9, jobs: 134, verified: true, bio: 'Custom cakes for all celebrations', services: ['Birthday Cakes', 'Wedding Cakes', 'Cupcakes'], avatar: 'CL' },
  { id: 'v6', businessName: 'Glam Squad SA', ownerName: 'Amahle Mthembu', phone: '079 890 1234', email: 'glam@squad.co.za', category: 'Hair & Makeup', priceRange: 'R1.5k - R5k', location: 'Sandton, Gauteng', rating: 4.8, jobs: 98, verified: false, bio: 'Professional hair and makeup artists', services: ['Bridal Makeup', 'Hair Styling', 'Grooming'], avatar: 'GS' },
];

const demoEvents: EventRequest[] = [
  { id: 'evt1', clientId: 'c1', clientName: 'Lerato Mokoena', clientPhone: '082 345 6789', eventType: '21st Birthday', budget: 15000, guestCount: 40, province: 'Gauteng', eventDate: '2026-08-15', status: 'vendor_responded', totalCost: 13200, createdAt: '2026-06-01', updatedAt: '2026-06-03', items: [
    { id: 'i1', category: 'Venue', vendorName: 'Royal Events SA', vendorId: 'v1', service: 'Garden venue for 40 guests', price: 4500, rating: 4.9, status: 'confirmed' },
    { id: 'i2', category: 'Catering', vendorName: 'Braai Masters', vendorId: 'v2', service: 'Braai for 40 guests', price: 7200, rating: 4.7, status: 'accepted' },
    { id: 'i3', category: 'Cake', vendorName: 'Cakes by Lerato', vendorId: 'v5', service: '21st birthday cake', price: 1500, rating: 4.9, status: 'confirmed' },
  ], vendorResponses: [
    { vendorId: 'v1', vendorName: 'Royal Events SA', price: 4500, message: 'We can do R4,500 for the garden venue. Includes chairs and basic setup.', status: 'accepted', timestamp: '2026-06-02' },
    { vendorId: 'v2', vendorName: 'Braai Masters', price: 7200, message: 'R180 per person x 40 = R7,200. Includes meat, pap, salads, and drinks.', status: 'accepted', timestamp: '2026-06-03' },
  ]},
];

const demoMessages: Message[] = [
  { id: 'm1', fromId: 'v1', toId: 'c1', fromName: 'Royal Events SA', content: 'Hi! We received your request for the 21st birthday. We can offer our garden venue at R4,500. Would you like to come see the space first?', timestamp: '2026-06-02 10:30', read: true },
  { id: 'm2', fromId: 'c1', toId: 'v1', fromName: 'Lerato Mokoena', content: 'That sounds great! Can I come this Saturday at 2pm?', timestamp: '2026-06-02 11:15', read: true },
  { id: 'm3', fromId: 'v1', toId: 'c1', fromName: 'Royal Events SA', content: 'Perfect! Saturday at 2pm works for us. See you at 123 Rivonia Road, Sandton.', timestamp: '2026-06-02 11:45', read: false },
];

const demoPayments: Payment[] = [
  { id: 'pay1', eventId: 'evt1', vendorName: 'Royal Events SA', amount: 2250, status: 'paid', type: 'deposit', timestamp: '2026-06-04' },
  { id: 'pay2', eventId: 'evt1', vendorName: 'Braai Masters', amount: 3600, status: 'pending', type: 'deposit', timestamp: '2026-06-05' },
];

const demoProducts: VendorProduct[] = [
  { id: 'p1', vendorId: 'v1', name: 'Garden Venue Package', description: 'Beautiful outdoor garden venue with seating for up to 100 guests. Includes tables, chairs, and basic decor.', price: 8000, category: 'Venue', tags: ['outdoor','garden','popular'], available: true, popular: true, createdAt: '2026-01-15' },
  { id: 'p2', vendorId: 'v1', name: 'Ballroom Reception', description: 'Elegant indoor ballroom with crystal lighting, dance floor, and full setup for 200+ guests.', price: 15000, category: 'Venue', tags: ['indoor','luxury','premium'], available: true, popular: false, createdAt: '2026-01-20' },
  { id: 'p3', vendorId: 'v1', name: 'Intimate Chapel Package', description: 'Small chapel setup perfect for ceremonies up to 50 guests. Includes aisle decor and arch.', price: 4500, category: 'Venue', tags: ['chapel','intimate','wedding'], available: true, popular: true, createdAt: '2026-02-10' },
  { id: 'p4', vendorId: 'v2', name: 'Traditional Braai Feast', description: 'Full braai setup with pap, salads, meat selection. Per person pricing. Minimum 20 guests.', price: 180, category: 'Catering', tags: ['braai','traditional','meat'], available: true, popular: true, createdAt: '2026-01-10' },
  { id: 'p5', vendorId: 'v2', name: 'Buffet Spread Deluxe', description: 'Self-serve buffet with 8 hot dishes, 4 salads, and dessert table. Per person pricing.', price: 250, category: 'Catering', tags: ['buffet','variety','deluxe'], available: true, popular: true, createdAt: '2026-02-01' },
  { id: 'p6', vendorId: 'v2', name: 'Finger Food & Canapes', description: 'Elegant finger foods, spring rolls, mini sandwiches, and canapes. Great for cocktail events.', price: 120, category: 'Catering', tags: ['snacks','elegant','cocktail'], available: true, popular: false, createdAt: '2026-03-05' },
];

const demoGuests: Guest[] = [
  { id: 'g1', eventId: 'evt1', name: 'Thabo Mokoena', phone: '0823456789', status: 'confirmed', dietary: 'None', plusOne: true, table: 'Table 1' },
  { id: 'g2', eventId: 'evt1', name: 'Nomsa Dlamini', phone: '0834567890', status: 'confirmed', dietary: 'Vegetarian', plusOne: false, table: 'Table 1' },
  { id: 'g3', eventId: 'evt1', name: 'Sipho Khumalo', phone: '0845678901', status: 'invited', dietary: 'None', plusOne: true },
  { id: 'g4', eventId: 'evt1', name: 'Busi Ndlovu', phone: '0856789012', status: 'declined', dietary: 'None', plusOne: false },
  { id: 'g5', eventId: 'evt1', name: 'Peter Zulu', phone: '0867890123', status: 'confirmed', dietary: 'Halaal', plusOne: false, table: 'Table 2' },
  { id: 'g6', eventId: 'evt1', name: 'Mary Sithole', phone: '0878901234', status: 'invited', dietary: 'None', plusOne: true },
];

const demoInvites: DigitalInvite[] = [
  { id: 'i1', eventId: 'evt1', template: 'traditional', message: 'You are invited to Lerato\'s 21st Birthday! Save the date: 15 July 2026.', sentVia: 'whatsapp', sentAt: '2026-06-01', recipientCount: 45 },
];

const demoReviews: VendorReview[] = [
  { id: 'r1', vendorId: 'v1', clientId: 'c1', clientName: 'Lerato Mokoena', rating: 5, comment: 'Royal Events was amazing! The venue was perfect and the staff went above and beyond.', eventType: '21st Birthday', date: '2026-05-20' },
  { id: 'r2', vendorId: 'c2', clientId: 'c1', clientName: 'Lerato Mokoena', rating: 4, comment: 'Great braai, everyone loved the food. Only issue was slight delay in serving.', eventType: '21st Birthday', date: '2026-05-20' },
  { id: 'r3', vendorId: 'p1', clientId: 'c2', clientName: 'Thandi Ndlovu', rating: 5, comment: 'Stunning photos! Captured every moment beautifully.', eventType: 'Wedding', date: '2026-04-15' },
];

const demoBudget: BudgetEntry[] = [
  { id: 'b1', eventId: 'evt1', category: 'Venue', description: 'Royal Events SA', budgeted: 15000, actual: 15000, vendorName: 'Royal Events SA' },
  { id: 'b2', eventId: 'evt1', category: 'Catering', description: 'Braai Masters SA', budgeted: 7200, actual: 7200, vendorName: 'Braai Masters SA' },
  { id: 'b3', eventId: 'evt1', category: 'Music', description: 'DJ Maphorisa Ent', budgeted: 8000, actual: 8000, vendorName: 'DJ Maphorisa Ent' },
  { id: 'b4', eventId: 'evt1', category: 'Decor', description: 'Balloon & Setup Co', budgeted: 3000, actual: 3500, vendorName: 'Balloon & Setup Co' },
  { id: 'b5', eventId: 'evt1', category: 'Cake', description: 'Cakes by Lerato', budgeted: 1500, actual: 1500, vendorName: 'Cakes by Lerato' },
  { id: 'b6', eventId: 'evt1', category: 'Drinks', description: 'Cooler Box Kings', budgeted: 2000, actual: 2200, vendorName: 'Cooler Box Kings' },
];

const demoTransactions: Transaction[] = [
  { id: 't1', vendorId: 'v1', eventName: 'Mokoena Wedding', clientName: 'Lerato Mokoena', amount: 4500, status: 'paid', type: 'deposit', date: '2026-06-01' },
  { id: 't2', vendorId: 'v1', eventName: 'Khoza 21st Birthday', clientName: ' Sipho Khoza', amount: 8000, status: 'paid', type: 'full', date: '2026-06-03' },
  { id: 't3', vendorId: 'v1', eventName: 'Ndlovu Baby Shower', clientName: 'Thandi Ndlovu', amount: 3500, status: 'paid', type: 'full', date: '2026-06-05' },
  { id: 't4', vendorId: 'v1', eventName: 'Zulu Traditional Wedding', clientName: 'Nomsa Zulu', amount: 7500, status: 'pending', type: 'deposit', date: '2026-06-10' },
  { id: 't5', vendorId: 'v1', eventName: 'Mahlangu Corporate', clientName: 'James Mahlangu', amount: 15000, status: 'pending', type: 'full', date: '2026-06-15' },
  { id: 't6', vendorId: 'v1', eventName: 'Mokoena Wedding', clientName: 'Lerato Mokoena', amount: 500, status: 'paid', type: 'tip', date: '2026-06-02' },
  { id: 't7', vendorId: 'v1', eventName: 'April Birthday Party', clientName: 'Busi Dlamini', amount: 6000, status: 'paid', type: 'full', date: '2026-05-20' },
  { id: 't8', vendorId: 'v1', eventName: 'May Lobola Ceremony', clientName: 'Peter Molefe', amount: 5000, status: 'paid', type: 'full', date: '2026-05-12' },
];

interface UnifiedContextType {
  // Auth
  clientUser: ClientUser | null; vendorUser: VendorUser | null;
  loginClient: (phone: string) => void; loginVendor: (email: string, password: string) => void;
  logout: () => void;
  // Data
  vendors: VendorUser[]; events: EventRequest[]; messages: Message[]; payments: Payment[];
  products: VendorProduct[]; transactions: Transaction[];
  guests: Guest[]; invites: DigitalInvite[]; reviews: VendorReview[]; budgetEntries: BudgetEntry[];
  // Actions
  createEvent: (event: Omit<EventRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'vendorResponses'>) => EventRequest;
  updateEventStatus: (eventId: string, status: EventRequest['status']) => void;
  acceptQuoteItem: (eventId: string, itemId: string) => void;
  vendorRespond: (eventId: string, response: VendorResponse) => void;
  sendMessage: (fromId: string, toId: string, fromName: string, content: string) => void;
  markRead: (messageId: string) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'timestamp'>) => void;
  getMessages: (userId: string) => Message[];
  getUnreadCount: (userId: string) => number;
  // Vendor Product CRUD
  addProduct: (product: Omit<VendorProduct, 'id' | 'createdAt'>) => void;
  updateProduct: (product: VendorProduct) => void;
  deleteProduct: (productId: string) => void;
  getVendorProducts: (vendorId: string) => VendorProduct[];
  toggleProductAvailable: (productId: string) => void;
  // Vendor Transactions
  getVendorTransactions: (vendorId: string) => Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  // Profile
  updateVendorProfile: (updates: Partial<VendorUser>) => void;
  // Guest List
  getEventGuests: (eventId: string) => Guest[];
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (guest: Guest) => void;
  removeGuest: (guestId: string) => void;
  getGuestStats: (eventId: string) => { total: number; confirmed: number; declined: number; pending: number };
  // Budget
  getEventBudget: (eventId: string) => BudgetEntry[];
  getBudgetSummary: (eventId: string) => { totalBudgeted: number; totalActual: number; remaining: number };
  // Reviews
  getVendorReviews: (vendorId: string) => VendorReview[];
  getVendorAverageRating: (vendorId: string) => number;
  // Invites
  getEventInvites: (eventId: string) => DigitalInvite[];
}

const UnifiedContext = createContext<UnifiedContextType | undefined>(undefined);

export function UnifiedProvider({ children }: { children: React.ReactNode }) {
  const [clientUser, setClientUser] = useState<ClientUser | null>(demoClients[0]);
  const [vendorUser, setVendorUser] = useState<VendorUser | null>(null);
  const [events, setEvents] = useState<EventRequest[]>(demoEvents);
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [payments, setPayments] = useState<Payment[]>(demoPayments);
  const [vendors, setVendors] = useState<VendorUser[]>(demoVendors);
  const [products, setProducts] = useState<VendorProduct[]>(demoProducts);
  const [transactions] = useState<Transaction[]>(demoTransactions);
  const [guests, setGuests] = useState<Guest[]>(demoGuests);
  const [invites] = useState<DigitalInvite[]>(demoInvites);
  const [reviews] = useState<VendorReview[]>(demoReviews);
  const [budgetEntries] = useState<BudgetEntry[]>(demoBudget);

  const loginClient = useCallback((phone: string) => {
    const found = demoClients.find(c => c.phone === phone);
    setClientUser(found || demoClients[0]);
  }, []);

  const loginVendor = useCallback((email: string, _password: string) => {
    const found = vendors.find(v => v.email === email);
    setVendorUser(found || vendors[0]);
  }, [vendors]);

  const logout = useCallback(() => { setClientUser(null); setVendorUser(null); }, []);

  const createEvent = useCallback((eventData: Omit<EventRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'vendorResponses'>) => {
    const newEvent: EventRequest = {
      ...eventData, id: `evt-${Date.now()}`,
      status: 'planning', createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0], vendorResponses: [],
    };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  }, []);

  const updateEventStatus = useCallback((eventId: string, status: EventRequest['status']) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status, updatedAt: new Date().toISOString().split('T')[0] } : e));
  }, []);

  const acceptQuoteItem = useCallback((eventId: string, itemId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? {
      ...e, items: e.items.map(i => i.id === itemId ? { ...i, status: 'confirmed' as const } : i)
    } : e));
  }, []);

  const vendorRespond = useCallback((eventId: string, response: VendorResponse) => {
    setEvents(prev => prev.map(e => e.id === eventId ? {
      ...e, vendorResponses: [...e.vendorResponses, response],
      status: 'vendor_responded' as const, updatedAt: new Date().toISOString().split('T')[0]
    } : e));
  }, []);

  const sendMessage = useCallback((fromId: string, toId: string, fromName: string, content: string) => {
    setMessages(prev => [...prev, { id: `m-${Date.now()}`, fromId, toId, fromName, content, timestamp: new Date().toLocaleString('en-ZA'), read: false }]);
  }, []);

  const markRead = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, read: true } : m));
  }, []);

  const addPayment = useCallback((payment: Omit<Payment, 'id' | 'timestamp'>) => {
    setPayments(prev => [...prev, { ...payment, id: `pay-${Date.now()}`, timestamp: new Date().toISOString().split('T')[0] }]);
  }, []);

  const getMessages = useCallback((userId: string) => {
    return messages.filter(m => m.fromId === userId || m.toId === userId);
  }, [messages]);

  const getUnreadCount = useCallback((userId: string) => {
    return messages.filter(m => m.toId === userId && !m.read).length;
  }, [messages]);

  // Vendor Product CRUD
  const addProduct = useCallback((product: Omit<VendorProduct, 'id' | 'createdAt'>) => {
    setProducts(prev => [...prev, { ...product, id: `p-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }]);
  }, []);

  const updateProduct = useCallback((product: VendorProduct) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const getVendorProducts = useCallback((vendorId: string) => {
    return products.filter(p => p.vendorId === vendorId);
  }, [products]);

  const toggleProductAvailable = useCallback((productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, available: !p.available } : p));
  }, []);

  // Vendor Transactions
  const getVendorTransactions = useCallback((vendorId: string) => {
    return transactions.filter(t => t.vendorId === vendorId);
  }, [transactions]);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'>) => {
    // In a real app this would add to transactions array
    console.log('Transaction added:', tx);
  }, []);

  // Profile
  const updateVendorProfile = useCallback((updates: Partial<VendorUser>) => {
    setVendorUser(prev => prev ? { ...prev, ...updates } : null);
    setVendors(prev => prev.map(v => vendorUser && v.id === vendorUser.id ? { ...v, ...updates } : v));
  }, [vendorUser]);

  // Guest List
  const getEventGuests = useCallback((eventId: string) => guests.filter(g => g.eventId === eventId), [guests]);
  const addGuest = useCallback((guest: Omit<Guest, 'id'>) => {
    setGuests(prev => [...prev, { ...guest, id: `g-${Date.now()}` }]);
  }, []);
  const updateGuest = useCallback((guest: Guest) => {
    setGuests(prev => prev.map(g => g.id === guest.id ? guest : g));
  }, []);
  const removeGuest = useCallback((guestId: string) => {
    setGuests(prev => prev.filter(g => g.id !== guestId));
  }, []);
  const getGuestStats = useCallback((eventId: string) => {
    const eventGuests = guests.filter(g => g.eventId === eventId);
    return {
      total: eventGuests.length,
      confirmed: eventGuests.filter(g => g.status === 'confirmed').length,
      declined: eventGuests.filter(g => g.status === 'declined').length,
      pending: eventGuests.filter(g => g.status === 'invited').length,
    };
  }, [guests]);

  // Budget
  const getEventBudget = useCallback((eventId: string) => budgetEntries.filter(b => b.eventId === eventId), [budgetEntries]);
  const getBudgetSummary = useCallback((eventId: string) => {
    const entries = budgetEntries.filter(b => b.eventId === eventId);
    const totalBudgeted = entries.reduce((s, e) => s + e.budgeted, 0);
    const totalActual = entries.reduce((s, e) => s + e.actual, 0);
    return { totalBudgeted, totalActual, remaining: totalBudgeted - totalActual };
  }, [budgetEntries]);

  // Reviews
  const getVendorReviews = useCallback((vendorId: string) => reviews.filter(r => r.vendorId === vendorId), [reviews]);
  const getVendorAverageRating = useCallback((vendorId: string) => {
    const vendorReviews = reviews.filter(r => r.vendorId === vendorId);
    return vendorReviews.length > 0 ? Math.round((vendorReviews.reduce((s, r) => s + r.rating, 0) / vendorReviews.length) * 10) / 10 : 0;
  }, [reviews]);

  // Invites
  const getEventInvites = useCallback((eventId: string) => invites.filter(i => i.eventId === eventId), [invites]);

  return (
    <UnifiedContext.Provider value={{
      clientUser, vendorUser, loginClient, loginVendor, logout,
      vendors, events, messages, payments, products, transactions,
      guests, invites, reviews, budgetEntries,
      createEvent, updateEventStatus, acceptQuoteItem, vendorRespond,
      sendMessage, markRead, addPayment, getMessages, getUnreadCount,
      addProduct, updateProduct, deleteProduct, getVendorProducts, toggleProductAvailable,
      getVendorTransactions, addTransaction, updateVendorProfile,
      getEventGuests, addGuest, updateGuest, removeGuest, getGuestStats,
      getEventBudget, getBudgetSummary,
      getVendorReviews, getVendorAverageRating,
      getEventInvites,
    }}>
      {children}
    </UnifiedContext.Provider>
  );
}

export function useUnified() {
  const ctx = useContext(UnifiedContext);
  if (!ctx) throw new Error('useUnified must be used within UnifiedProvider');
  return ctx;
}
