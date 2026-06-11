export interface VendorProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  active: boolean;
  createdAt: string;
}

export interface VendorPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  includes: string[];
  category: string;
  active: boolean;
  popular?: boolean;
}

export interface VendorBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  services: string[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
}

export interface VendorQuoteRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  budget: string;
  requirements: string;
  status: 'new' | 'quoted' | 'accepted' | 'declined';
  createdAt: string;
  vendorResponse?: string;
  vendorPrice?: number;
}

export interface VendorAnalytics {
  views: number;
  clicks: number;
  bookings: number;
  revenue: number;
  leads: number;
  conversionRate: number;
  monthlyViews: { month: string; value: number }[];
  monthlyRevenue: { month: string; value: number }[];
}

export interface VendorUser {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  categories: string[];
  description: string;
  priceRange: string;
  yearsExperience: string;
  staffCount: string;
  verified: boolean;
  premium: boolean;
  rating: number;
  reviews: number;
  avatar?: string;
  banner?: string;
  status: 'pending' | 'active' | 'suspended';
}

export interface VendorNotification {
  id: string;
  type: 'booking' | 'quote' | 'review' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
