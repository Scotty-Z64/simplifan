import { createContext, useContext, useState, useCallback } from 'react';
import { trpc } from "@/providers/trpc";

// ─── User Types ───
export interface ClientUser {
  id: string; name: string; phone: string; email?: string;
  location?: string; avatar: string;
}

export interface VendorUser {
  id: string; businessName: string; ownerName?: string;
  phone?: string; email?: string; category: string;
  priceRange?: string; location?: string; rating: number;
  jobs: number; verified: boolean; bio?: string;
  avatar: string; services?: string[];
  address?: string; website?: string; yearsInBusiness?: number;
  tier?: string; province?: string;
}

// ─── Legacy interfaces ───
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

export interface EventItem {
  id: string; category: string; vendorName: string; vendorId?: string;
  service: string; price: number; rating: number;
  status: 'pending' | 'accepted' | 'rejected' | 'confirmed' | 'alternative';
  notes?: string;
}

export interface Transaction {
  id: string; vendorId: string; eventName: string; clientName: string;
  amount: number; status: 'pending' | 'paid' | 'cancelled';
  type: 'deposit' | 'full' | 'tip'; date: string;
}

export interface Message {
  id: string; fromId: string; toId: string; fromName: string;
  content: string; timestamp: string; read: boolean;
}

export interface VendorReview {
  id: string; vendorId: string; clientId: string; clientName: string;
  rating: number; comment: string; eventType: string; date: string;
}

export interface Payment {
  id: string; eventId: string; vendorName: string; amount: number;
  status: 'pending' | 'paid'; type: 'deposit' | 'full'; timestamp: string;
}

export interface EventRequest {
  id: string; clientId: string; clientName: string; clientPhone: string;
  eventType: string; budget: number; guestCount: number;
  province: string; eventDate: string;
  status: 'planning' | 'quoted' | 'vendor_responded' | 'confirmed' | 'deposit_paid' | 'ready' | 'completed';
  items: EventItem[]; totalCost: number;
  createdAt: string; updatedAt: string;
  vendorResponses: VendorResponse[];
}

export interface Guest {
  id: string; eventId: string; name: string; phone: string;
  status: 'invited' | 'confirmed' | 'declined' | 'attended';
  dietary?: string; plusOne: boolean; table?: string;
}

export interface BudgetEntry {
  id: string; eventId: string; category: string; description: string;
  budgeted: number; actual: number; vendorName?: string;
}

// ─── Unified Context Type ───
interface UnifiedContextType {
  clientUser: ClientUser | null;
  vendorUser: VendorUser | null;
  isLoggedIn: boolean;
  loginClient: (phone: string) => void;
  loginVendor: (id: string) => void;
  logout: () => void;
  vendorRespond: (eventId: string, response: VendorResponse) => void;
  addMessage: (msg: Message) => void;
  messages: Message[];
  vendors: VendorUser[];
  events: EventRequest[];
  transactions: Transaction[];
  payments: Payment[];
  getVendor: (id: string) => VendorUser | undefined;
  getVendorTransactions: (vendorId: string) => Transaction[];
  // Backward-compatible stubs
  getUnreadCount: (...args: any[]) => number;
  createEvent: (data: any) => any;
  getEventBudget: (eventId: string) => BudgetEntry[];
  getBudgetSummary: (eventId: string) => any;
  getEventGuests: (eventId: string) => Guest[];
  addGuest: (...args: any[]) => void;
  updateGuest: (...args: any[]) => void;
  removeGuest: (...args: any[]) => void;
  getGuestStats: (eventId: string) => any;
  getVendorReviews: (vendorId: string) => VendorReview[];
  getVendorAverageRating: (vendorId: string) => number;
}

const UnifiedContext = createContext<UnifiedContextType | null>(null);

export function UnifiedProvider({ children }: { children: React.ReactNode }) {
  const [clientUser, setClientUser] = useState<ClientUser | null>(() => {
    const saved = localStorage.getItem('sp_client_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [vendorUser, setVendorUser] = useState<VendorUser | null>(() => {
    const saved = localStorage.getItem('sp_vendor_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: apiVendors } = trpc.vendor.list.useQuery({ limit: 100 });

  const legacyVendors: VendorUser[] = [
    { id: '1', businessName: 'Royal Events SA', ownerName: 'John Kekana', email: 'royal@example.com', category: 'Catering', location: 'Johannesburg, Gauteng', rating: 4.8, jobs: 89, verified: true, bio: 'Premium catering for weddings and events', avatar: 'RE', province: 'Gauteng', tier: 'elite' },
    { id: '2', businessName: 'DJ Maphorisa Sounds', ownerName: 'Themba Maphosa', email: 'djmaphorisa@example.com', category: 'Music / DJ', location: 'Pretoria, Gauteng', rating: 4.9, jobs: 312, verified: true, bio: 'Professional DJ services', avatar: 'DJ', province: 'Gauteng', tier: 'pro' },
    { id: '3', businessName: 'Elegant Moments Photography', ownerName: 'Sarah Williams', email: 'elegant@example.com', category: 'Photography', location: 'Sandton, Gauteng', rating: 4.7, jobs: 67, verified: true, bio: 'Capturing your special moments', avatar: 'EP', province: 'Gauteng', tier: 'pro' },
    { id: '4', businessName: 'Sizakele Decor & Events', ownerName: 'Sizakele Ndlovu', email: 'sizakele@example.com', category: 'Decor', location: 'Durban, KZN', rating: 4.6, jobs: 203, verified: true, bio: 'Transform any venue into a dream', avatar: 'SD', province: 'KwaZulu-Natal', tier: 'pro' },
    { id: '5', businessName: 'Grand Venue Hire', ownerName: 'Michael Peters', email: 'grandvenue@example.com', category: 'Venue', location: 'Cape Town, Western Cape', rating: 4.5, jobs: 45, verified: true, bio: 'Stunning venues for all events', avatar: 'GV', province: 'Western Cape', tier: 'elite' },
    { id: '6', businessName: 'Sweet Creations Cakes', ownerName: 'Amanda Botha', email: 'sweet@example.com', category: 'Cake', location: 'Midrand, Gauteng', rating: 4.9, jobs: 134, verified: true, bio: 'Award-winning cake designer', avatar: 'SC', province: 'Gauteng', tier: 'starter' },
  ];

  const vendors: VendorUser[] = apiVendors && apiVendors.length > 0
    ? apiVendors.map(v => ({
        id: String(v.id), businessName: v.businessName,
        ownerName: v.ownerName ?? undefined, email: v.email ?? undefined,
        phone: v.phone ?? undefined, category: v.category,
        priceRange: v.priceRange ?? undefined,
        location: v.city ? `${v.city}, ${v.province}` : v.province ?? undefined,
        rating: Number(v.rating), jobs: v.jobs, verified: v.verified,
        bio: v.bio ?? undefined, avatar: v.avatar ?? v.businessName.charAt(0),
        services: v.services?.map((s: any) => typeof s === 'string' ? s : s.name),
        province: v.province ?? undefined,
        tier: v.tier ?? undefined,
        yearsInBusiness: v.yearsInBusiness ?? undefined,
      }))
    : legacyVendors;

  const loginClient = useCallback((phone: string) => {
    const user: ClientUser = { id: 'c_' + Date.now(), name: 'Client User', phone, avatar: 'C' };
    setClientUser(user);
    localStorage.setItem('sp_client_user', JSON.stringify(user));
  }, []);

  const loginVendor = useCallback((id: string) => {
    const found = vendors.find(v => v.id === id);
    if (found) { setVendorUser(found); localStorage.setItem('sp_vendor_user', JSON.stringify(found)); }
  }, [vendors]);

  const logout = useCallback(() => {
    setClientUser(null); setVendorUser(null);
    localStorage.removeItem('sp_client_user');
    localStorage.removeItem('sp_vendor_user');
  }, []);

  const vendorRespond = useCallback((eventId: string, response: VendorResponse) => {
    console.log('Vendor responded to event', eventId, response);
  }, []);

  const addMessage = useCallback((msg: Message) => { setMessages(prev => [...prev, msg]); }, []);
  const getVendor = useCallback((id: string) => vendors.find(v => v.id === id), [vendors]);
  const getVendorTransactions = useCallback(() => [], []);
  const getUnreadCount = useCallback((..._args: any[]) => 0, []);
  const createEvent = useCallback((data: any) => { console.log('createEvent', data); return data; }, []);
  const getEventBudget = useCallback(() => [] as BudgetEntry[], []);
  const getBudgetSummary = useCallback(() => ({ totalBudgeted: 0, totalActual: 0, byCategory: [] }), []);
  const getEventGuests = useCallback(() => [] as Guest[], []);
  const addGuest = useCallback((..._args: any[]) => {}, []);
  const updateGuest = useCallback((..._args: any[]) => {}, []);
  const removeGuest = useCallback((..._args: any[]) => {}, []);
  const getGuestStats = useCallback(() => ({ total: 0, confirmed: 0, declined: 0, invited: 0 }), []);
  const getVendorReviews = useCallback(() => [] as VendorReview[], []);
  const getVendorAverageRating = useCallback(() => 4.5, []);

  return (
    <UnifiedContext.Provider value={{
      clientUser, vendorUser, isLoggedIn: !!(clientUser || vendorUser),
      loginClient, loginVendor, logout,
      vendorRespond, addMessage, messages,
      vendors, events: [], transactions: [], payments: [],
      getVendor, getVendorTransactions,
      getUnreadCount, createEvent,
      getEventBudget, getBudgetSummary,
      getEventGuests, addGuest, updateGuest, removeGuest, getGuestStats,
      getVendorReviews, getVendorAverageRating,
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
