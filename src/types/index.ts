export interface User {
  id: string;
  email: string;
  knownAs: string;
  surname: string;
  cellphone?: string;
  subscription?: 'free' | 'basic' | 'premium' | 'annual';
  subscriptionExpiry?: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  completed?: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  items: BudgetItem[];
  expanded?: boolean;
}

export interface PreciseLocation {
  venueName: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode?: string;
  additionalDetails?: string;
  fullAddress: string;
}

export interface Contribution {
  id: string;
  contributorName: string;
  amount: number;
  paymentMethod: 'cash' | 'eft' | 'mobile';
  date: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeName: string;
  assigneeContact?: string;
  completed: boolean;
  dueDate?: string;
  notes?: string;
  categoryId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  province: string;
  priceRange: 'budget' | 'mid' | 'premium';
  rating: number;
  reviewCount: number;
  description: string;
  services: string[];
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
}

export interface VendorQuote {
  id: string;
  vendorId: string;
  planId: string;
  itemName: string;
  quotedPrice: number;
  notes?: string;
  status: 'pending' | 'accepted' | 'declined';
  dateRequested: string;
}

export interface Guest {
  id: string;
  name: string;
  contact?: string;
  status: 'pending' | 'attending' | 'not-attending' | 'maybe';
  plusOnes: number;
  children: number;
  dietaryRequirements?: string;
  notes?: string;
  inviteSent: boolean;
}

export interface ChecklistItem {
  id: string;
  task: string;
  deadline: string;
  completed: boolean;
  category: string;
}

export interface Payment {
  id: string;
  vendorName: string;
  itemDescription: string;
  totalAmount: number;
  amountPaid: number;
  dueDate?: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  notes?: string;
}

export interface Table {
  id: string;
  name: string;
  seats: number;
  guests: string[];
}

export type EventType = 
  | 'wedding' 
  | 'white_wedding'
  | 'traditional_wedding' 
  | 'lobola'
  | 'funeral' 
  | 'umemulo' 
  | 'umgidi'
  | 'imbeleko'
  | 'birthday'
  | 'twenty_first'
  | 'graduation'
  | 'housewarming'
  | 'anniversary'
  | 'memorial'
  | 'baby_shower'
  | 'church_event';

export interface EventPlan {
  id: string;
  userId?: string;
  name: string;
  eventType: EventType;
  location?: string;
  preciseLocation?: PreciseLocation;
  eventDate?: string;
  eventTime?: string;
  numberOfGuests?: number;
  categories: BudgetCategory[];
  contributions: Contribution[];
  tasks: Task[];
  vendorQuotes: VendorQuote[];
  guests: Guest[];
  checklist?: ChecklistItem[];
  payments?: Payment[];
  tables?: Table[];
  createdAt: string;
  updatedAt: string;
  finalized?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  badge?: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  knownAs: string;
  surname: string;
  email: string;
  cellphone: string;
  password: string;
  agreeToTerms: boolean;
}
