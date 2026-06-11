import { createContext, useContext, useState, useCallback } from 'react';
import type { VendorUser, VendorProduct, VendorPackage, VendorBooking, VendorQuoteRequest, VendorNotification, VendorAnalytics } from '@/types/vendor';

interface VendorAuthContextType {
  vendor: VendorUser | null;
  isVendorLoggedIn: boolean;
  products: VendorProduct[];
  packages: VendorPackage[];
  bookings: VendorBooking[];
  quotes: VendorQuoteRequest[];
  notifications: VendorNotification[];
  analytics: VendorAnalytics;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addProduct: (product: Omit<VendorProduct, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<VendorProduct>) => void;
  deleteProduct: (id: string) => void;
  addPackage: (pkg: Omit<VendorPackage, 'id'>) => void;
  updatePackage: (id: string, updates: Partial<VendorPackage>) => void;
  deletePackage: (id: string) => void;
  updateBookingStatus: (id: string, status: VendorBooking['status']) => void;
  respondToQuote: (id: string, price: number, response: string) => void;
  markNotificationRead: (id: string) => void;
  updateProfile: (updates: Partial<VendorUser>) => void;
  unreadCount: number;
}

const demoAnalytics: VendorAnalytics = {
  views: 1247, clicks: 342, bookings: 18, revenue: 87500, leads: 56, conversionRate: 32.1,
  monthlyViews: [
    { month: 'Jan', value: 420 }, { month: 'Feb', value: 580 },
    { month: 'Mar', value: 890 }, { month: 'Apr', value: 1247 },
  ],
  monthlyRevenue: [
    { month: 'Jan', value: 15000 }, { month: 'Feb', value: 22000 },
    { month: 'Mar', value: 35000 }, { month: 'Apr', value: 87500 },
  ],
};

const demoNotifications: VendorNotification[] = [
  { id: 'n1', type: 'quote', title: 'New quote request', message: 'Lerato M. requested a quote for a wedding venue', read: false, createdAt: '2026-04-22' },
  { id: 'n2', type: 'booking', title: 'Booking confirmed', message: 'Thabo N. confirmed their booking for 15 May 2026', read: false, createdAt: '2026-04-21' },
  { id: 'n3', type: 'review', title: 'New review', message: 'You received a 5-star review from Sarah K.', read: true, createdAt: '2026-04-20' },
];

const demoVendor: VendorUser = {
  id: 'vendor-1', businessName: 'Royal Events SA', ownerName: 'Thandi Mokoena',
  email: 'thandi@royalevents.co.za', phone: '011 234 5678',
  province: 'Gauteng', city: 'Sandton', address: '123 Rivonia Road, Sandton',
  website: 'https://royalevents.co.za', facebook: 'RoyalEventsSA', instagram: '@royalevents_sa',
  categories: ['Venue', 'Catering'],
  description: 'Luxury venue in the heart of Sandton with panoramic city views.',
  priceRange: 'premium', yearsExperience: '10+', staffCount: '16-50',
  verified: true, premium: true, rating: 4.9, reviews: 127, status: 'active',
};

const demoProducts: VendorProduct[] = [
  { id: 'p1', name: 'Wedding Venue - Full Day', description: 'Exclusive use of our luxury ballroom', price: 35000, category: 'Venue', active: true, createdAt: '2026-01-15' },
  { id: 'p2', name: 'Conference Room Package', description: 'Professional conference setup', price: 12000, category: 'Venue', active: true, createdAt: '2026-02-01' },
  { id: 'p3', name: 'Garden Event Space', description: 'Beautiful outdoor garden venue', price: 15000, category: 'Venue', active: true, createdAt: '2026-02-20' },
  { id: 'p4', name: 'Buffet Catering (per person)', description: 'Full buffet spread', price: 350, category: 'Catering', active: true, createdAt: '2026-03-01' },
  { id: 'p5', name: 'Plated Dinner Service', description: 'Elegant 3-course plated dinner', price: 450, category: 'Catering', active: false, createdAt: '2026-03-10' },
];

const demoPackages: VendorPackage[] = [
  { id: 'pkg1', name: 'Wedding Gold Package', description: 'Everything for your dream wedding', price: 85000, originalPrice: 95000, includes: ['Full day venue', 'Catering 150 guests', 'Basic decor', 'Event coordinator', 'Sound system'], category: 'Wedding', active: true, popular: true },
  { id: 'pkg2', name: 'Corporate Event Package', description: 'Professional business events', price: 25000, originalPrice: 30000, includes: ['Conference room', 'AV equipment', 'Tea & lunch', 'Delegate packs', 'Parking'], category: 'Corporate', active: true },
  { id: 'pkg3', name: 'Birthday Celebration', description: 'For 21st and milestones', price: 18000, includes: ['Venue 6 hours', 'DJ and sound', 'Decor', 'Catering 80 guests', 'Photo booth'], category: 'Birthday', active: true },
];

const demoBookings: VendorBooking[] = [
  { id: 'b1', customerName: 'Sibusiso Ndlovu', customerPhone: '073 456 7890', customerEmail: 'sibu@email.com', eventType: 'Wedding', eventDate: '2026-05-15', eventLocation: 'Sandton, Gauteng', services: ['Wedding Venue', 'Catering'], totalAmount: 87500, status: 'confirmed', notes: 'VIP client', createdAt: '2026-04-01' },
  { id: 'b2', customerName: 'Nomsa Dlamini', customerPhone: '084 567 8901', customerEmail: 'nomsa@email.com', eventType: 'Baby Shower', eventDate: '2026-06-20', eventLocation: 'Rosebank, Gauteng', services: ['Garden Event Space'], totalAmount: 15000, status: 'pending', notes: 'Pink theme', createdAt: '2026-04-10' },
  { id: 'b3', customerName: 'Bongani Zulu', customerPhone: '071 678 9012', customerEmail: 'bongani@email.com', eventType: 'Corporate', eventDate: '2026-07-01', eventLocation: 'Midrand, Gauteng', services: ['Conference Room'], totalAmount: 12000, status: 'completed', notes: 'Year-end function', createdAt: '2026-03-15' },
  { id: 'b4', customerName: 'Lerato Khumalo', customerPhone: '076 789 0123', customerEmail: 'lerato@email.com', eventType: '21st Birthday', eventDate: '2026-08-12', eventLocation: 'Bryanston, Gauteng', services: ['Garden Space', 'Catering'], totalAmount: 28000, status: 'pending', notes: 'Amapiano theme', createdAt: '2026-04-18' },
];

const demoQuotes: VendorQuoteRequest[] = [
  { id: 'q1', customerName: 'Precious Molefe', customerPhone: '082 123 4567', customerEmail: 'precious@email.com', eventType: 'Wedding', eventDate: '2026-10-10', guestCount: 200, budget: 'R50,000 - R80,000', requirements: 'Venue for 200 guests with catering and outdoor space.', status: 'new', createdAt: '2026-04-22' },
  { id: 'q2', customerName: 'David Petersen', customerPhone: '083 234 5678', customerEmail: 'david@email.com', eventType: 'Corporate Gala', eventDate: '2026-11-15', guestCount: 150, budget: 'R30,000 - R50,000', requirements: 'Year-end function with AV, stage, catering.', status: 'quoted', vendorResponse: 'Corporate Package at R45,000', vendorPrice: 45000, createdAt: '2026-04-20' },
  { id: 'q3', customerName: 'Amahle Zuma', customerPhone: '084 345 6789', customerEmail: 'amahle@email.com', eventType: 'Umemulo', eventDate: '2026-12-01', guestCount: 300, budget: 'R40,000 - R60,000', requirements: 'Traditional ceremony, Zulu performances, 300 guests.', status: 'new', createdAt: '2026-04-19' },
];

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

export function VendorAuthProvider({ children }: { children: React.ReactNode }) {
  const [vendor, setVendor] = useState<VendorUser | null>(null);
  const [products, setProducts] = useState<VendorProduct[]>(demoProducts);
  const [packages, setPackages] = useState<VendorPackage[]>(demoPackages);
  const [bookings, setBookings] = useState<VendorBooking[]>(demoBookings);
  const [quotes, setQuotes] = useState<VendorQuoteRequest[]>(demoQuotes);
  const [notifications, setNotifications] = useState<VendorNotification[]>(demoNotifications);
  const [analytics] = useState<VendorAnalytics>(demoAnalytics);

  const isVendorLoggedIn = !!vendor;
  const unreadCount = notifications.filter(n => !n.read).length;

  const login = useCallback((email: string, password: string) => {
    if (email && password) {
      setVendor(demoVendor);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setVendor(null), []);

  const addProduct = useCallback((product: Omit<VendorProduct, 'id' | 'createdAt'>) => {
    setProducts(prev => [...prev, { ...product, id: `p-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<VendorProduct>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addPackage = useCallback((pkg: Omit<VendorPackage, 'id'>) => {
    setPackages(prev => [...prev, { ...pkg, id: `pkg-${Date.now()}` }]);
  }, []);

  const updatePackage = useCallback((id: string, updates: Partial<VendorPackage>) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deletePackage = useCallback((id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateBookingStatus = useCallback((id: string, status: VendorBooking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }, []);

  const respondToQuote = useCallback((id: string, price: number, response: string) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: 'quoted' as const, vendorPrice: price, vendorResponse: response } : q));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const updateProfile = useCallback((updates: Partial<VendorUser>) => {
    setVendor(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <VendorAuthContext.Provider value={{
      vendor, isVendorLoggedIn, products, packages, bookings, quotes, notifications, analytics,
      login, logout, addProduct, updateProduct, deleteProduct, addPackage, updatePackage, deletePackage,
      updateBookingStatus, respondToQuote, markNotificationRead, updateProfile, unreadCount,
    }}>
      {children}
    </VendorAuthContext.Provider>
  );
}

export function useVendorAuth() {
  const ctx = useContext(VendorAuthContext);
  if (!ctx) throw new Error('useVendorAuth must be used within VendorAuthProvider');
  return ctx;
}
