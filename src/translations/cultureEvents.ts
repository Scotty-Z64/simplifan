import type { EventType } from '@/types';
import type { Language } from '@/types/language';
import {
  Heart, Church, Crown, Cross, Star, Sparkles, Baby,
  GraduationCap, Home as HomeIcon, PartyPopper, CalendarHeart,
  BookOpen, Music, HandCoins, Gift,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CultureEvent {
  type: EventType;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isTraditional?: boolean;
}

// English (SA General) - Standard modern naming with all events
const englishEvents: CultureEvent[] = [
  { type: 'wedding', name: 'Wedding', description: 'Plan your perfect day with your partner', icon: Heart, color: 'from-rose-500 to-pink-600' },
  { type: 'white_wedding', name: 'White Wedding', description: 'Church ceremony & reception', icon: Church, color: 'from-blue-400 to-indigo-500' },
  { type: 'traditional_wedding', name: 'Traditional Wedding', description: 'Cultural celebration with customs', icon: Crown, color: 'from-amber-500 to-orange-600' },
  { type: 'lobola', name: 'Lobola / Bride Price', description: 'Negotiations & family union ceremony', icon: HandCoins, color: 'from-emerald-500 to-teal-600' },
  { type: 'birthday', name: 'Birthday Party', description: 'Celebrate another year of life', icon: PartyPopper, color: 'from-teal-400 to-cyan-500' },
  { type: 'twenty_first', name: '21st Birthday', description: 'Key milestone celebration', icon: PartyPopper, color: 'from-yellow-400 to-amber-500' },
  { type: 'baby_shower', name: 'Baby Shower', description: 'Welcome the new baby', icon: Gift, color: 'from-pink-400 to-rose-500' },
  { type: 'funeral', name: 'Funeral / Memorial', description: 'Honour their memory with dignity', icon: Cross, color: 'from-slate-400 to-slate-600' },
  { type: 'memorial', name: 'Memorial Service', description: 'Remember and celebrate their life', icon: BookOpen, color: 'from-gray-400 to-gray-600' },
  { type: 'umemulo', name: 'Umemulo / Coming of Age', description: 'Young woman\'s coming of age ceremony', icon: Star, color: 'from-purple-500 to-violet-600' },
  { type: 'umgidi', name: 'Umgidi / Homecoming', description: 'Homecoming ceremony for initiates', icon: Sparkles, color: 'from-cyan-400 to-blue-500' },
  { type: 'imbeleko', name: 'Imbeleko / Introduction', description: 'Introduction of baby to ancestors', icon: Baby, color: 'from-green-400 to-emerald-500' },
  { type: 'graduation', name: 'Graduation Party', description: 'Celebrate academic success', icon: GraduationCap, color: 'from-sky-400 to-blue-600' },
  { type: 'housewarming', name: 'Housewarming', description: 'Bless your new home', icon: HomeIcon, color: 'from-orange-400 to-red-500' },
  { type: 'anniversary', name: 'Anniversary', description: 'Years of love and commitment', icon: CalendarHeart, color: 'from-red-400 to-pink-500' },
  { type: 'church_event', name: 'Church Event', description: 'Crusade, fundraiser or special service', icon: Music, color: 'from-indigo-400 to-purple-500' },
];

// Zulu Heritage - Zulu traditional naming with Zulu-specific events
const zuluEvents: CultureEvent[] = [
  { type: 'lobola', name: 'Lobola', description: 'Ilobolo - The bride price negotiation and family union, central to Zulu marriage', icon: HandCoins, color: 'from-emerald-500 to-teal-600', isTraditional: true },
  { type: 'traditional_wedding', name: 'Umembeso', description: 'Gift-giving ceremony where the groom\'s family presents gifts to the bride\'s family', icon: Crown, color: 'from-amber-500 to-orange-600', isTraditional: true },
  { type: 'wedding', name: 'Umabo / Wedding', description: 'The main wedding day where the bride is formally handed over to the groom\'s family', icon: Heart, color: 'from-rose-500 to-pink-600', isTraditional: true },
  { type: 'umemulo', name: 'Umemulo', description: 'Coming of age ceremony for a Zulu girl (intombi), usually at 21, involving reed dancing', icon: Star, color: 'from-purple-500 to-violet-600', isTraditional: true },
  { type: 'umgidi', name: 'Umgidi / Umgidi Wesoka', description: 'Homecoming celebration for young men returning from initiation school (Ukwaluka)', icon: Sparkles, color: 'from-cyan-400 to-blue-500', isTraditional: true },
  { type: 'imbeleko', name: 'Imbeleko', description: 'Ceremony introducing a new baby to the ancestors, asking for protection and blessing', icon: Baby, color: 'from-green-400 to-emerald-500', isTraditional: true },
  { type: 'white_wedding', name: 'White Wedding', description: 'Church ceremony with white dress and reception', icon: Church, color: 'from-blue-400 to-indigo-500' },
  { type: 'birthday', name: 'Usuku Lokuzalwa', description: 'Birthday celebration with family and friends', icon: PartyPopper, color: 'from-teal-400 to-cyan-500' },
  { type: 'twenty_first', name: 'Umkhosi Wama-21', description: '21st birthday - a major milestone in Zulu culture', icon: PartyPopper, color: 'from-yellow-400 to-amber-500' },
  { type: 'funeral', name: 'Ingquko / Funeral', description: 'Umngcwabo - funeral rites to honour the deceased and guide their spirit', icon: Cross, color: 'from-slate-400 to-slate-600', isTraditional: true },
  { type: 'memorial', name: 'Umkhumbulo / Memorial', description: 'Annual remembrance service for loved ones who have passed', icon: BookOpen, color: 'from-gray-400 to-gray-600', isTraditional: true },
  { type: 'graduation', name: 'Umkhosi Wokuphothula', description: 'Graduation celebration - honouring educational achievement', icon: GraduationCap, color: 'from-sky-400 to-blue-600' },
  { type: 'housewarming', name: 'Ukungena Endlini Entsha', description: 'Housewarming ceremony to bless the new home', icon: HomeIcon, color: 'from-orange-400 to-red-500' },
  { type: 'baby_shower', name: 'Umkhosi Wengane', description: 'Celebration welcoming the expected baby', icon: Gift, color: 'from-pink-400 to-rose-500' },
  { type: 'anniversary', name: 'Usuku Lomshado', description: 'Wedding anniversary celebration', icon: CalendarHeart, color: 'from-red-400 to-pink-500' },
  { type: 'church_event', name: 'Umcimbi Webandla', description: 'Church crusade, fundraiser, or special service', icon: Music, color: 'from-indigo-400 to-purple-500' },
];

// Xhosa Heritage - Xhosa traditional naming with Xhosa-specific events
const xhosaEvents: CultureEvent[] = [
  { type: 'lobola', name: 'Ibhongo / Lobola', description: 'Bride price negotiations between families, a sacred Xhosa tradition', icon: HandCoins, color: 'from-emerald-500 to-teal-600', isTraditional: true },
  { type: 'traditional_wedding', name: 'Ukuthwala', description: 'The bride\'s ceremony where she is escorted to her new family with song and dance', icon: Crown, color: 'from-amber-500 to-orange-600', isTraditional: true },
  { type: 'wedding', name: 'Umdudo / Wedding', description: 'The wedding celebration with traditional Xhosa dance and customs', icon: Heart, color: 'from-rose-500 to-pink-600', isTraditional: true },
  { type: 'umemulo', name: 'Umtsimbo', description: 'Coming of age ceremony for Xhosa girls, involving seclusion and ritual', icon: Star, color: 'from-purple-500 to-violet-600', isTraditional: true },
  { type: 'umgidi', name: 'Umgidi Wesoka', description: 'Homecoming celebration for initiates returning from Ulwaluko circumcision school', icon: Sparkles, color: 'from-cyan-400 to-blue-500', isTraditional: true },
  { type: 'imbeleko', name: 'Imbeleko', description: 'Ritual introducing the child to ancestors, asking for protection and a good future', icon: Baby, color: 'from-green-400 to-emerald-500', isTraditional: true },
  { type: 'white_wedding', name: 'White Wedding', description: 'Church wedding ceremony with white dress and reception', icon: Church, color: 'from-blue-400 to-indigo-500' },
  { type: 'birthday', name: 'Usuku Lokuzalwa', description: 'Birthday celebration with family, friends, and traditional food', icon: PartyPopper, color: 'from-teal-400 to-cyan-500' },
  { type: 'twenty_first', name: 'Umkhosi Wama-21', description: '21st birthday milestone - a significant celebration in Xhosa culture', icon: PartyPopper, color: 'from-yellow-400 to-amber-500' },
  { type: 'funeral', name: 'Ingqungquthela / Funeral', description: 'Traditional Xhosa funeral rites with overnight vigil (uxolelo) and burial customs', icon: Cross, color: 'from-slate-400 to-slate-600', isTraditional: true },
  { type: 'memorial', name: 'Umsimiwo / Memorial', description: 'Annual remembrance gathering to honour ancestors and loved ones', icon: BookOpen, color: 'from-gray-400 to-gray-600', isTraditional: true },
  { type: 'graduation', name: 'Umkhosi Wokuphothula', description: 'Celebrating educational success and achievement', icon: GraduationCap, color: 'from-sky-400 to-blue-600' },
  { type: 'housewarming', name: 'Ukungena Endlini Entsha', description: 'Blessing ceremony for a new home', icon: HomeIcon, color: 'from-orange-400 to-red-500' },
  { type: 'baby_shower', name: 'Umkhosi Wengane', description: 'Celebration welcoming the new baby', icon: Gift, color: 'from-pink-400 to-rose-500' },
  { type: 'anniversary', name: 'Usuku Lomshado', description: 'Wedding anniversary celebration', icon: CalendarHeart, color: 'from-red-400 to-pink-500' },
  { type: 'church_event', name: 'Umcimbi Webandla', description: 'Church crusade, fundraiser, or special service', icon: Music, color: 'from-indigo-400 to-purple-500' },
];

const cultureEventMap: Record<Language, CultureEvent[]> = {
  en: englishEvents,
  zu: zuluEvents,
  xh: xhosaEvents,
};

export function getCultureEvents(language: Language): CultureEvent[] {
  return cultureEventMap[language] || englishEvents;
}

export function getCultureEventName(language: Language, eventType: EventType): string {
  const events = getCultureEvents(language);
  const event = events.find(e => e.type === eventType);
  return event?.name || eventType;
}

export function getCultureEventDescription(language: Language, eventType: EventType): string {
  const events = getCultureEvents(language);
  const event = events.find(e => e.type === eventType);
  return event?.description || '';
}

// Traditional event type indicators per culture
export function isTraditionalEvent(language: Language, eventType: EventType): boolean {
  const events = getCultureEvents(language);
  const event = events.find(e => e.type === eventType);
  return event?.isTraditional || false;
}

// Get event icon and color for a given culture
export function getCultureEventStyle(language: Language, eventType: EventType): { icon: LucideIcon; color: string } {
  const events = getCultureEvents(language);
  const event = events.find(e => e.type === eventType);
  return {
    icon: event?.icon || Heart,
    color: event?.color || 'from-gray-500 to-gray-600',
  };
}
