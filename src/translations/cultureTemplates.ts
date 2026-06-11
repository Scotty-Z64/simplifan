import type { Language } from '@/types/language';

export interface CultureTemplate {
  categoryName: string;
  suggestions: string[];
  venueTypes: string[];
  attireItems: string[];
  foodTraditions: string[];
  culturalNotes: string;
}

// Zulu Heritage templates
const zuluTemplates: CultureTemplate[] = [
  {
    categoryName: 'Venue',
    suggestions: ['Zulu Kraal Venue', 'Community Hall Hire', 'Marquee Tent', 'Traditional Family Homestead', 'Church Hall'],
    venueTypes: ['Royal Kraal', 'Family Kraal', 'Community Hall', 'Church Grounds', 'Outdoor Marquee'],
    attireItems: ['Isidwaba (Leather Skirt)', 'Ingcawa (Headwork)', 'Impendle (Beadwork)', 'Umqhele (Headring)', 'Traditional Blanket'],
    foodTraditions: ['Inyama yenkosi (Beef)', 'Uphuthu & Meat', 'Ujeqe (Steamed Bread)', 'Amasi (Sour Milk)', 'Traditional Beer (Utywala)'],
    culturalNotes: 'Zulu events traditionally take place at the family kraal. Cattle are central to celebrations.',
  },
  {
    categoryName: 'Attire',
    suggestions: ['Traditional Zulu Outfit', 'Isicholo (Hat)', 'Beadwork Accessories', 'Umqhele (Headring)', 'Amabheshu (Apron)'],
    venueTypes: [],
    attireItems: [],
    foodTraditions: [],
    culturalNotes: '',
  },
  {
    categoryName: 'Catering',
    suggestions: ['Beef Carcass', 'Uphuthu & Beef Stew', 'Ujeqe (Steamed Bread)', 'Amasi', 'Traditional Beer', 'Soft Drinks'],
    venueTypes: [],
    attireItems: [],
    foodTraditions: [],
    culturalNotes: '',
  },
  {
    categoryName: 'Traditional Ceremony Items',
    suggestions: ['Impepho (Incense)', 'Snuff (Umyalo)', 'Traditional Beer (Utywala)', 'Goat/Sheep for Ritual', 'White Clay (Isishwala)'],
    venueTypes: [],
    attireItems: [],
    foodTraditions: [],
    culturalNotes: '',
  },
];

// Xhosa Heritage templates
const xhosaTemplates: CultureTemplate[] = [
  {
    categoryName: 'Venue',
    suggestions: ['Family Homestead', 'Community Hall', 'Church Hall', 'Marquee Tent', 'Outdoor Venue'],
    venueTypes: ['Family Kraal', 'Community Centre', 'Church Grounds', 'Open Field', 'Community Hall'],
    attireItems: ['Umbhaco (Traditional Dress)', 'Isicholo (Headgear)', 'Inxili (Beadwork)', 'Doek (Headscarf)', 'Traditional Blanket'],
    foodTraditions: ['Umqombothi (Traditional Beer)', 'Uphuthu & Tripe', 'Roasted Meat', 'Samp & Beans', 'Bread & Tea'],
    culturalNotes: 'Xhosa ceremonies are deeply rooted in umzi (homestead) traditions. Ubuntu and community are central.',
  },
  {
    categoryName: 'Attire',
    suggestions: ['Umbhaco (Traditional Dress)', 'Isicholo (Traditional Hat)', 'Beadwork (Inxili)', 'Doek', 'Traditional Blanket'],
    venueTypes: [],
    attireItems: [],
    foodTraditions: [],
    culturalNotes: '',
  },
  {
    categoryName: 'Catering',
    suggestions: ['Sheep/Goat Carcass', 'Uphuthu & Tripe', 'Roasted Beef', 'Umqombothi (Traditional Beer)', 'Soft Drinks', 'Bread & Tea'],
    venueTypes: [],
    attireItems: [],
    foodTraditions: [],
    culturalNotes: '',
  },
  {
    categoryName: 'Traditional Ceremony Items',
    suggestions: ['Impepho (Incense)', 'Snuff (Intshofolo)', 'Umqombothi (Traditional Beer)', 'Goat for Ritual', 'White Clay'],
    venueTypes: [],
    attireItems: [],
    foodTraditions: [],
    culturalNotes: '',
  },
];

// English (SA General) templates
const englishTemplates: CultureTemplate[] = [
  {
    categoryName: 'Venue',
    suggestions: ['Venue Hire', 'Community Hall', 'Hotel Conference Room', 'Marquee Tent', 'Restaurant Private Room', 'Outdoor Garden Venue'],
    venueTypes: ['Community Hall', 'Hotel', 'Restaurant', 'Garden Venue', 'Marquee', 'Church Hall'],
    attireItems: ['Formal Suit', 'Dress/Suit', 'Traditional Attire', 'Smart Casual', 'Cultural Wear'],
    foodTraditions: ['Catering Service', 'Potluck/Bring & Share', 'Braai/BBQ', 'Buffet Style', 'Formal Plated Meal'],
    culturalNotes: 'South African events often blend Western and African traditions. Choose what suits your family.',
  },
  {
    categoryName: 'Attire',
    suggestions: ['Formal Wear', 'Smart Casual', 'Traditional Attire', 'Cultural Dress', 'Rental Suit/Dress'],
    venueTypes: [],
    attireItems: [],
    foodTraditions: [],
    culturalNotes: '',
  },
  {
    categoryName: 'Catering',
    suggestions: ['Catering Service', 'Braai/BBQ Setup', 'Potluck Style', 'Buffet Service', 'Formal Plated Meal', 'Drinks & Beverages'],
    venueTypes: [],
    attireItems: [],
    foodTraditions: [],
    culturalNotes: '',
  },
  {
    categoryName: 'Ceremony Items',
    suggestions: ['Programmes/Orders of Service', 'Decorations', 'Sound System', 'Photography', 'Flowers'],
    venueTypes: [],
    attireItems: [],
    foodTraditions: [],
    culturalNotes: '',
  },
];

export function getCultureTemplates(culture: Language): CultureTemplate[] {
  switch (culture) {
    case 'zu': return zuluTemplates;
    case 'xh': return xhosaTemplates;
    default: return englishTemplates;
  }
}

export function getSuggestionsForCategory(culture: Language, categoryName: string): string[] {
  const templates = getCultureTemplates(culture);
  const template = templates.find(t =>
    categoryName.toLowerCase().includes(t.categoryName.toLowerCase()) ||
    t.categoryName.toLowerCase().includes(categoryName.toLowerCase())
  );
  return template ? template.suggestions : [];
}

export function getCulturalNote(culture: Language): string {
  const templates = getCultureTemplates(culture);
  const venueTemplate = templates.find(t => t.categoryName === 'Venue');
  return venueTemplate?.culturalNotes || '';
}
