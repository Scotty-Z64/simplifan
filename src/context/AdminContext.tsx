import { createContext, useContext, useState, useCallback } from 'react';

export type AdminRole = 'superadmin' | 'admin' | 'marketing' | 'support' | 'finance';

export interface TeamMember {
  id: string; name: string; email: string; role: AdminRole;
  avatar: string; lastActive: string; online: boolean;
}

export interface LiveStat {
  label: string; value: string | number; change: number; icon: string;
  color: string;
}

export interface MapEvent {
  id: string; eventType: string; province: string; area: string;
  lat: number; lng: number; budget: number; status: string;
  clientName: string; eventDate: string; tier: string;
}

export interface VendorPerformance {
  vendorId: string; vendorName: string; category: string;
  totalBookings: number; totalRevenue: number; responseRate: number;
  avgRating: number; acceptanceRate: number; area: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Campaign {
  id: string; name: string; type: string; status: 'active' | 'paused' | 'ended';
  reach: number; clicks: number; conversions: number; budget: number; spent: number;
  startDate: string; endDate: string;
}

export interface FinancialRecord {
  id: string; date: string; type: 'platform_fee' | 'vendor_sub' | 'featured_listing' | 'payout';
  description: string; amount: number; eventType?: string;
}

const demoTeam: TeamMember[] = [
  { id: 'tm1', name: 'Singa', email: 'singa@simpliplan.co.za', role: 'superadmin', avatar: 'SN', lastActive: '2026-06-07 14:30', online: true },
  { id: 'tm2', name: 'Lunga', email: 'lunga@simpliplan.co.za', role: 'admin', avatar: 'LG', lastActive: '2026-06-07 13:45', online: true },
  { id: 'tm3', name: 'You', email: 'admin@simpliplan.co.za', role: 'superadmin', avatar: 'AD', lastActive: '2026-06-07 12:20', online: true },
  { id: 'tm4', name: 'James Pillay', email: 'james@simpliplan.co.za', role: 'support', avatar: 'JP', lastActive: '2026-06-07 14:15', online: false },
  { id: 'tm5', name: 'Anna Coetzee', email: 'anna@simpliplan.co.za', role: 'finance', avatar: 'AC', lastActive: '2026-06-06 17:00', online: false },
];

const demoMapEvents: MapEvent[] = [
  { id: 'me1', eventType: 'Wedding', province: 'Gauteng', area: 'Sandton', lat: -26.11, lng: 28.05, budget: 85000, status: 'planning', clientName: 'Thandi Mokoena', eventDate: '2026-07-15', tier: 'premium' },
  { id: 'me2', eventType: 'Funeral', province: 'Gauteng', area: 'Soweto', lat: -26.25, lng: 27.86, budget: 25000, status: 'quoted', clientName: 'Peter Zulu', eventDate: '2026-06-10', tier: 'standard' },
  { id: 'me3', eventType: '21st Birthday', province: 'Gauteng', area: 'Johannesburg', lat: -26.20, lng: 28.04, budget: 35000, status: 'booked', clientName: 'Lerato Khumalo', eventDate: '2026-06-20', tier: 'standard' },
  { id: 'me4', eventType: 'Lobola', province: 'KwaZulu-Natal', area: 'Durban', lat: -29.85, lng: 31.02, budget: 45000, status: 'planning', clientName: 'Sipho Dlamini', eventDate: '2026-08-01', tier: 'standard' },
  { id: 'me5', eventType: 'Baby Shower', province: 'Western Cape', area: 'Cape Town', lat: -33.93, lng: 18.42, budget: 12000, status: 'quoted', clientName: 'Mary Adams', eventDate: '2026-06-25', tier: 'budget' },
  { id: 'me6', eventType: 'Umemulo', province: 'KwaZulu-Natal', area: 'Umlazi', lat: -29.97, lng: 30.88, budget: 55000, status: 'planning', clientName: 'Nomsa Zulu', eventDate: '2026-09-15', tier: 'premium' },
  { id: 'me7', eventType: 'Traditional Wedding', province: 'Eastern Cape', area: 'East London', lat: -33.02, lng: 27.91, budget: 60000, status: 'booked', clientName: 'Busi Mahlangu', eventDate: '2026-07-22', tier: 'standard' },
  { id: 'me8', eventType: 'Funeral', province: 'Gauteng', area: 'Tembisa', lat: -26.00, lng: 28.21, budget: 18000, status: 'planning', clientName: 'John Molefe', eventDate: '2026-06-09', tier: 'budget' },
  { id: 'me9', eventType: 'Corporate', province: 'Gauteng', area: 'Midrand', lat: -25.99, lng: 28.13, budget: 120000, status: 'quoted', clientName: 'FNB Sandton', eventDate: '2026-11-30', tier: 'premium' },
  { id: 'me10', eventType: 'Wedding', province: 'Western Cape', area: 'Stellenbosch', lat: -33.94, lng: 18.86, budget: 150000, status: 'planning', clientName: 'Emma van der Merwe', eventDate: '2026-10-12', tier: 'premium' },
  { id: 'me11', eventType: 'Graduation', province: 'Gauteng', area: 'Pretoria', lat: -25.75, lng: 28.23, budget: 8000, status: 'booked', clientName: 'Thabo Ndlovu', eventDate: '2026-06-18', tier: 'budget' },
  { id: 'me12', eventType: '21st Birthday', province: 'KwaZulu-Natal', area: 'Umhlanga', lat: -29.72, lng: 31.07, budget: 42000, status: 'planning', clientName: 'Zanele Khumalo', eventDate: '2026-08-28', tier: 'standard' },
  { id: 'me13', eventType: 'Anniversary', province: 'Gauteng', area: 'Rosebank', lat: -26.14, lng: 28.04, budget: 25000, status: 'quoted', clientName: 'Michael & Grace', eventDate: '2026-07-30', tier: 'standard' },
  { id: 'me14', eventType: 'Funeral', province: 'North West', area: 'Rustenburg', lat: -25.67, lng: 27.24, budget: 22000, status: 'planning', clientName: 'Elizabeth Sithole', eventDate: '2026-06-11', tier: 'budget' },
  { id: 'me15', eventType: 'Baby Shower', province: 'Gauteng', area: 'Fourways', lat: -26.02, lng: 28.01, budget: 15000, status: 'booked', clientName: 'Precious Mokoena', eventDate: '2026-07-05', tier: 'standard' },
];

const demoVendorPerf: VendorPerformance[] = [
  { vendorId: 'v1', vendorName: 'Royal Events SA', category: 'Venue', totalBookings: 45, totalRevenue: 675000, responseRate: 98, avgRating: 4.9, acceptanceRate: 85, area: 'Sandton', trend: 'up' },
  { vendorId: 'c2', vendorName: 'Braai Masters SA', category: 'Catering', totalBookings: 128, totalRevenue: 230400, responseRate: 95, avgRating: 4.5, acceptanceRate: 92, area: 'Johannesburg', trend: 'up' },
  { vendorId: 'm1', vendorName: 'DJ Maphorisa Ent', category: 'Music', totalBookings: 89, totalRevenue: 712000, responseRate: 88, avgRating: 4.8, acceptanceRate: 78, area: 'Johannesburg', trend: 'stable' },
  { vendorId: 'p1', vendorName: 'Memories Studio JHB', category: 'Photography', totalBookings: 67, totalRevenue: 536000, responseRate: 92, avgRating: 4.9, acceptanceRate: 72, area: 'Sandton', trend: 'up' },
  { vendorId: 'd1', vendorName: 'Maboneng Decor Studio', category: 'Decor', totalBookings: 54, totalRevenue: 432000, responseRate: 85, avgRating: 4.8, acceptanceRate: 68, area: 'Johannesburg', trend: 'stable' },
  { vendorId: 't2', vendorName: 'Affordable Tent & Chairs', category: 'Tent & Chairs', totalBookings: 156, totalRevenue: 546000, responseRate: 99, avgRating: 4.4, acceptanceRate: 95, area: 'Soweto', trend: 'up' },
  { vendorId: 'c6', vendorName: 'Funeral Catering Specialists', category: 'Catering', totalBookings: 203, totalRevenue: 304500, responseRate: 97, avgRating: 4.5, acceptanceRate: 91, area: 'Soweto', trend: 'up' },
  { vendorId: 'c5', vendorName: 'Soweto Home Cooking', category: 'Catering', totalBookings: 178, totalRevenue: 213600, responseRate: 94, avgRating: 4.3, acceptanceRate: 88, area: 'Soweto', trend: 'down' },
  { vendorId: 'k1', vendorName: 'Cakes by Lerato', category: 'Cake', totalBookings: 92, totalRevenue: 230000, responseRate: 90, avgRating: 4.9, acceptanceRate: 80, area: 'Rosebank', trend: 'up' },
  { vendorId: 'dr2', vendorName: 'Cooler Box Kings', category: 'Drinks', totalBookings: 134, totalRevenue: 201000, responseRate: 96, avgRating: 4.3, acceptanceRate: 90, area: 'Johannesburg', trend: 'stable' },
];

const demoCampaigns: Campaign[] = [
  { id: 'camp1', name: 'Summer Wedding Rush', type: 'seasonal', status: 'active', reach: 45000, clicks: 3200, conversions: 180, budget: 25000, spent: 18000, startDate: '2026-09-01', endDate: '2026-11-30' },
  { id: 'camp2', name: 'Soweto Vendor Drive', type: 'vendor_acquisition', status: 'active', reach: 12000, clicks: 890, conversions: 45, budget: 15000, spent: 8000, startDate: '2026-05-01', endDate: '2026-07-31' },
  { id: 'camp3', name: 'Referral Program Launch', type: 'referral', status: 'active', reach: 28000, clicks: 2100, conversions: 320, budget: 10000, spent: 6000, startDate: '2026-06-01', endDate: '2026-08-31' },
  { id: 'camp4', name: 'Lobola Awareness', type: 'cultural', status: 'paused', reach: 8000, clicks: 450, conversions: 28, budget: 8000, spent: 3200, startDate: '2026-04-01', endDate: '2026-06-30' },
  { id: 'camp5', name: 'Year-End Corporate', type: 'b2b', status: 'active', reach: 15000, clicks: 1200, conversions: 65, budget: 20000, spent: 12000, startDate: '2026-10-01', endDate: '2026-12-15' },
];

const demoFinancials: FinancialRecord[] = [
  { id: 'f1', date: '2026-06-01', type: 'platform_fee', description: 'Platform fees - May events', amount: 45000 },
  { id: 'f2', date: '2026-06-01', type: 'vendor_sub', description: 'Vendor subscriptions - May', amount: 22400 },
  { id: 'f3', date: '2026-06-01', type: 'featured_listing', description: 'Featured listings - May', amount: 8500 },
  { id: 'f4', date: '2026-06-05', type: 'payout', description: 'Vendor payouts - batch 1', amount: -320000 },
  { id: 'f5', date: '2026-06-07', type: 'platform_fee', description: 'Platform fees - daily', amount: 2800 },
  { id: 'f6', date: '2026-06-06', type: 'platform_fee', description: 'Platform fees - daily', amount: 3200 },
  { id: 'f7', date: '2026-06-05', type: 'platform_fee', description: 'Platform fees - daily', amount: 4100 },
  { id: 'f8', date: '2026-06-04', type: 'vendor_sub', description: 'New vendor subscriptions', amount: 3800 },
];

// Monthly revenue data for charts
const monthlyRevenue = [
  { month: 'Jan', gmv: 450000, platform: 22500, vendors: 15000 },
  { month: 'Feb', gmv: 520000, platform: 26000, vendors: 18200 },
  { month: 'Mar', gmv: 680000, platform: 34000, vendors: 22400 },
  { month: 'Apr', gmv: 810000, platform: 40500, vendors: 26800 },
  { month: 'May', gmv: 950000, platform: 47500, vendors: 31500 },
  { month: 'Jun', gmv: 780000, platform: 39000, vendors: 25800 },
];

const weeklySignups = [
  { day: 'Mon', clients: 45, vendors: 12 },
  { day: 'Tue', clients: 52, vendors: 8 },
  { day: 'Wed', clients: 38, vendors: 15 },
  { day: 'Thu', clients: 61, vendors: 10 },
  { day: 'Fri', clients: 48, vendors: 14 },
  { day: 'Sat', clients: 72, vendors: 6 },
  { day: 'Sun', clients: 35, vendors: 4 },
];

const provinceBreakdown = [
  { name: 'Gauteng', events: 45, revenue: 520000 },
  { name: 'KwaZulu-Natal', events: 22, revenue: 210000 },
  { name: 'Western Cape', events: 18, revenue: 185000 },
  { name: 'Eastern Cape', events: 12, revenue: 95000 },
  { name: 'Mpumalanga', events: 6, revenue: 42000 },
  { name: 'Other', events: 5, revenue: 38000 },
];

const eventTypeBreakdown = [
  { type: 'Wedding', count: 28, pct: 28 },
  { type: 'Funeral', count: 22, pct: 22 },
  { type: '21st Birthday', count: 18, pct: 18 },
  { type: 'Traditional Wedding', count: 12, pct: 12 },
  { type: 'Baby Shower', count: 8, pct: 8 },
  { type: 'Lobola', count: 5, pct: 5 },
  { type: 'Other', count: 7, pct: 7 },
];

interface AdminContextType {
  adminUser: TeamMember | null;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  hasPermission: (permission: string) => boolean;
  team: TeamMember[];
  liveStats: LiveStat[];
  mapEvents: MapEvent[];
  vendorPerformance: VendorPerformance[];
  campaigns: Campaign[];
  financials: FinancialRecord[];
  monthlyRevenue: typeof monthlyRevenue;
  weeklySignups: typeof weeklySignups;
  provinceBreakdown: typeof provinceBreakdown;
  eventTypeBreakdown: typeof eventTypeBreakdown;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
}

const rolePermissions: Record<AdminRole, string[]> = {
  superadmin: ['*'],
  admin: ['dashboard', 'map', 'vendors', 'clients', 'reports', 'analytics', 'health'],
  marketing: ['dashboard', 'map', 'clients', 'marketing', 'analytics'],
  support: ['dashboard', 'map', 'vendors', 'clients', 'analytics', 'health'],
  finance: ['dashboard', 'finance', 'reports', 'analytics'],
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<TeamMember | null>(null);

  const loginAdmin = useCallback((email: string, _password: string) => {
    const member = demoTeam.find(t => t.email === email);
    if (member) {
      setAdminUser({ ...member, online: true, lastActive: new Date().toISOString() });
      return true;
    }
    // Allow any @simpliplan.co.za email for demo
    if (email.endsWith('@simpliplan.co.za')) {
      const newMember: TeamMember = { id: `tm-${Date.now()}`, name: email.split('@')[0], email, role: 'admin', avatar: email[0].toUpperCase() + email[1].toUpperCase(), lastActive: new Date().toISOString(), online: true };
      setAdminUser(newMember);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => setAdminUser(null), []);

  const hasPermission = useCallback((permission: string) => {
    if (!adminUser) return false;
    const perms = rolePermissions[adminUser.role];
    return perms.includes('*') || perms.includes(permission);
  }, [adminUser]);

  const liveStats: LiveStat[] = [
    { label: 'Clients Online', value: 1247, change: 12, icon: 'Users', color: 'text-teal-400' },
    { label: 'Vendors Online', value: 89, change: 5, icon: 'Store', color: 'text-amber-400' },
    { label: 'Active Events', value: 108, change: 8, icon: 'Calendar', color: 'text-blue-400' },
    { label: 'Quotes Sent Today', value: 342, change: 23, icon: 'Send', color: 'text-purple-400' },
    { label: 'Revenue Today', value: 'R 45,200', change: 15, icon: 'DollarSign', color: 'text-emerald-400' },
    { label: 'New Signups', value: 57, change: 18, icon: 'UserPlus', color: 'text-rose-400' },
  ];

  return (
    <AdminContext.Provider value={{
      adminUser, loginAdmin, logoutAdmin, hasPermission,
      team: demoTeam, liveStats, mapEvents: demoMapEvents,
      vendorPerformance: demoVendorPerf, campaigns: demoCampaigns,
      financials: demoFinancials, monthlyRevenue, weeklySignups,
      provinceBreakdown, eventTypeBreakdown,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
