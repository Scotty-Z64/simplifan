import type { EventPlan, EventType } from '@/types';
import type { Language } from '@/types/language';

// ============ AI BUDGET OPTIMIZER ============

export interface BudgetAllocation {
  category: string;
  recommendedPercentage: number;
  recommendedAmount: number;
  reasoning: string;
  saAverage: number;
}

const eventTypeBudgetRules: Record<string, Record<string, number>> = {
  wedding: { venue: 25, catering: 30, attire: 15, photography: 10, music: 8, decor: 7, transport: 3, gifts: 2 },
  lobola: { venue: 15, catering: 25, attire: 10, dowry: 30, music: 8, decor: 5, transport: 5, gifts: 2 },
  funeral: { venue: 20, catering: 30, coffin: 20, transport: 10, service: 10, tombstone: 5, decor: 3, music: 2 },
  birthday: { venue: 20, catering: 35, entertainment: 20, decor: 10, cake: 8, gifts: 5, transport: 2 },
  umemulo: { venue: 15, catering: 25, attire: 20, ceremony: 20, music: 10, decor: 7, transport: 3 },
  graduation: { venue: 15, catering: 30, attire: 10, decor: 15, photography: 15, transport: 10, gifts: 5 },
  traditional_wedding: { venue: 20, catering: 25, attire: 20, dowry: 10, music: 10, decor: 8, transport: 5, gifts: 2 },
  default: { venue: 20, catering: 30, attire: 15, entertainment: 10, decor: 10, transport: 8, photography: 5, gifts: 2 },
};

export function optimizeBudget(eventType: EventType, totalBudget: number, guestCount: number, culture: Language): BudgetAllocation[] {
  const rules = eventTypeBudgetRules[eventType] || eventTypeBudgetRules.default;
  const perPerson = totalBudget / Math.max(guestCount, 1);

  // Culture adjustments
  const cultureMultiplier = culture === 'zu' || culture === 'xh' ? { catering: 1.1, attire: 1.2, ceremony: 1.3 } : {};

  return Object.entries(rules).map(([category, percentage]) => {
    const mult = (cultureMultiplier as Record<string, number>)?.[category] || 1;
    const adjustedPercentage = percentage * mult;
    const recommendedAmount = (totalBudget * adjustedPercentage) / 100;

    let reasoning = '';
    if (category === 'catering') reasoning = `R${Math.round(perPerson)} per person for food and drinks`;
    else if (category === 'venue') reasoning = guestCount > 100 ? 'Large venue needed for guest count' : 'Standard venue suitable';
    else if (category === 'dowry') reasoning = culture === 'zu' ? 'Includes ilobolo (bride price) and gifts' : culture === 'xh' ? 'Includes lobola and family gifts' : 'Traditional dowry and gifts';
    else if (category === 'attire') reasoning = culture === 'zu' ? 'Includes isidwaba, beadwork and traditional attire' : culture === 'xh' ? 'Includes umbhaco, isicholo and traditional wear' : 'Includes formal and traditional wear';
    else reasoning = `Standard allocation for ${category}`;

    return { category: category.charAt(0).toUpperCase() + category.slice(1), recommendedPercentage: Math.round(adjustedPercentage), recommendedAmount, reasoning, saAverage: Math.round(recommendedAmount * 0.85) };
  }).sort((a, b) => b.recommendedPercentage - a.recommendedPercentage);
}

// ============ AI COST PREDICTOR ============

export interface CostPrediction {
  estimatedTotal: number;
  range: { min: number; max: number };
  breakdown: Record<string, number>;
  confidence: number;
}

const saCostBase: Record<string, Record<string, number>> = {
  wedding: { venue: 15000, catering: 25000, attire: 12000, photography: 8000, music: 6000, decor: 5000, transport: 3000 },
  lobola: { venue: 8000, catering: 20000, attire: 6000, dowry: 50000, music: 5000, decor: 3000, transport: 4000 },
  funeral: { venue: 5000, catering: 15000, coffin: 8000, transport: 3000, service: 3000, tombstone: 5000, decor: 2000 },
  birthday: { venue: 3000, catering: 8000, entertainment: 4000, decor: 2000, cake: 1500, transport: 1000 },
  umemulo: { venue: 6000, catering: 15000, attire: 10000, ceremony: 15000, music: 5000, decor: 3000, transport: 2000 },
  graduation: { venue: 3000, catering: 10000, attire: 3000, decor: 2000, photography: 3000, transport: 2000 },
  default: { venue: 5000, catering: 10000, attire: 5000, entertainment: 3000, decor: 2000, transport: 2000, photography: 2000 },
};

export function predictCosts(eventType: EventType, guestCount: number, province: string): CostPrediction {
  const base = saCostBase[eventType] || saCostBase.default;
  const provinceMultiplier = province === 'Gauteng' ? 1.3 : province === 'Western Cape' ? 1.2 : 0.9;
  const guestScale = Math.sqrt(guestCount / 50);

  const breakdown: Record<string, number> = {};
  let total = 0;
  Object.entries(base).forEach(([cat, cost]) => {
    const adjusted = Math.round(cost * provinceMultiplier * guestScale);
    breakdown[cat] = adjusted;
    total += adjusted;
  });

  return {
    estimatedTotal: total,
    range: { min: Math.round(total * 0.75), max: Math.round(total * 1.4) },
    breakdown,
    confidence: guestCount > 20 ? 0.85 : 0.6,
  };
}

// ============ AI SMART TIPS ============

export interface SmartTip {
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export function generateSmartTips(plan: EventPlan, culture: Language): SmartTip[] {
  const tips: SmartTip[] = [];
  const totalBudget = plan.categories.reduce((s, c) => s + c.items.reduce((sum, i) => sum + i.price * i.quantity, 0), 0);
  const daysLeft = plan.eventDate ? Math.ceil((new Date(plan.eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  // Budget tips
  if (totalBudget < 5000) {
    tips.push({ title: 'Budget Alert', message: 'Your budget is below R5,000. Consider a smaller venue or potluck-style catering to keep costs manageable.', priority: 'high', category: 'budget' });
  }
  if (totalBudget > 50000) {
    tips.push({ title: 'Large Budget', message: 'With a budget over R50,000, consider hiring a professional event planner for the best value.', priority: 'medium', category: 'budget' });
  }

  // Timeline tips
  if (daysLeft !== null) {
    if (daysLeft < 0) tips.push({ title: 'Past Due', message: 'Your event date has passed. Update your event date to continue planning.', priority: 'high', category: 'timeline' });
    else if (daysLeft < 7) tips.push({ title: 'Final Week!', message: 'Only ' + daysLeft + ' days left! Confirm all vendors, finalize guest numbers, and prepare payment.', priority: 'high', category: 'timeline' });
    else if (daysLeft < 30) tips.push({ title: 'One Month Out', message: daysLeft + ' days to go. Send final reminders, confirm RSVPs, and review the budget.', priority: 'medium', category: 'timeline' });
    else if (daysLeft < 90) tips.push({ title: 'Planning Phase', message: daysLeft + ' days left. Book major vendors (venue, catering) and send save-the-dates.', priority: 'low', category: 'timeline' });
  }

  // Guest count tips
  if ((plan.numberOfGuests || 0) > 200) {
    tips.push({ title: 'Large Guest List', message: '200+ guests requires careful logistics. Consider hiring additional security and transport.', priority: 'medium', category: 'guests' });
  }
  if ((plan.numberOfGuests || 0) > 0 && totalBudget > 0) {
    const perPerson = totalBudget / (plan.numberOfGuests || 1);
    if (perPerson < 100) tips.push({ title: 'Low Per-Person Budget', message: `R${Math.round(perPerson)} per person is tight. Consider a braai/potluck or reducing guest count.`, priority: 'medium', category: 'budget' });
  }

  // Culture-specific tips
  if (culture === 'zu') {
    tips.push({ title: 'Zulu Tradition', message: 'Remember to include impepho for ceremonies and arrange for traditional beer (utywala) if appropriate.', priority: 'medium', category: 'culture' });
    if (plan.eventType === 'lobola') tips.push({ title: 'Lobola Preparation', message: 'Consult with elders about the appropriate ilobolo amount. Cash, cattle, and blankets are traditional offerings.', priority: 'high', category: 'culture' });
  }
  if (culture === 'xh') {
    tips.push({ title: 'Xhosa Tradition', message: 'Consider umqombothi for traditional celebrations. Ubuntu and community sharing are central to Xhosa events.', priority: 'medium', category: 'culture' });
    if (plan.eventType === 'umemulo') tips.push({ title: 'uMemulo Planning', message: 'Ensure traditional beads, snuff, and ceremonial items are prepared well in advance.', priority: 'high', category: 'culture' });
  }

  // Vendor tips
  const completedItems = plan.categories.reduce((s, c) => s + c.items.filter(i => i.completed).length, 0);
  const totalItems = plan.categories.reduce((s, c) => s + c.items.length, 0);
  if (totalItems > 0 && completedItems / totalItems < 0.3) {
    tips.push({ title: 'Budget Tracking', message: `You've only checked off ${completedItems} of ${totalItems} items. Mark completed items to track progress.`, priority: 'low', category: 'budget' });
  }

  // Location tips
  if (!plan.preciseLocation?.city) {
    tips.push({ title: 'Add Location', message: 'Add your event location to get accurate vendor recommendations and cost estimates.', priority: 'medium', category: 'location' });
  }

  return tips;
}

// ============ AI CHAT RESPONSES ============

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const saEventKnowledge: Record<string, string[]> = {
  lobola: [
    'Lobola negotiations typically involve the groom\'s family visiting the bride\'s family home.',
    'The groom\'s family should bring a delegation including elders and family representatives.',
    'Traditional gifts include cash (imali), cattle (inkomo), blankets (imisebe), and groceries.',
    'It is customary to bring snuff (umyalo) and traditional beer (utywala) for the elders.',
    'The negotiations are led by the groom\'s uncle (malume) and the bride\'s uncle.',
  ],
  umemulo: [
    'uMemulo is a Zulu coming-of-age ceremony for young women.',
    'The ceremony involves the girl transitioning from childhood to womanhood.',
    'Traditional attire includes isidwaba (leather skirt) and elaborate beadwork.',
    'A goat or cow is traditionally slaughtered for the ceremony.',
    'The community gathers to celebrate and the girl performs traditional dances.',
  ],
  umgidi: [
    'uMgidi is a homecoming ceremony, often for someone returning from initiation school.',
    'The community welcomes the initiate back with celebrations.',
    'Traditional food, singing, and dancing are central to the ceremony.',
    'The family prepares a feast for the community.',
  ],
  wedding: [
    'South African weddings often blend Western and African traditions.',
    'The white wedding is typically held at a church, followed by a traditional celebration.',
    'Budget for venue, catering, photography, attire, music, and decor.',
    'Consider booking vendors 6-12 months in advance.',
  ],
  funeral: [
    'Funeral arrangements in South Africa typically follow cultural and religious traditions.',
    'The night vigil (umkhumbi) is held the night before the funeral.',
    'Community support is essential - neighbors often help with cooking and arrangements.',
    'Transport for the deceased and family members should be arranged early.',
  ],
  budget: [
    'For a budget wedding, consider a community hall (R2,000-5,000) and DIY decor.',
    'Catering is usually the biggest expense - expect R150-300 per person for a full meal.',
    'Braai/BBQ style catering can reduce costs to R80-150 per person.',
    'Photography packages range from R3,000 for basic to R15,000+ for full coverage.',
    'DJ services typically cost R2,000-5,000 for a full day.',
  ],
  vendor: [
    'Always get 3 quotes from different vendors before making a decision.',
    'Check vendor reviews and ask for references from previous clients.',
    'Book popular vendors at least 3-6 months in advance.',
    'Make sure to get a written contract with all details and cancellation terms.',
  ],
  timeline: [
    '12+ months before: Set date, book venue, start budget planning.',
    '6-9 months before: Book major vendors (catering, photography, music).',
    '3-6 months before: Send invitations, finalize guest list, order attire.',
    '1-3 months before: Confirm RSVPs, finalize details with vendors.',
    '1 week before: Final headcount, payments, last-minute preparations.',
  ],
};

export function getAIResponse(userMessage: string, plan: EventPlan | null, culture: Language): string {
  const msg = userMessage.toLowerCase();

  // Check for event type questions
  if (msg.includes('lobola') || msg.includes('bride price') || msg.includes('ilobolo')) {
    return saEventKnowledge.lobola[Math.floor(Math.random() * saEventKnowledge.lobola.length)];
  }
  if (msg.includes('umemulo') || msg.includes('coming of age')) {
    return saEventKnowledge.umemulo[Math.floor(Math.random() * saEventKnowledge.umemulo.length)];
  }
  if (msg.includes('umgidi') || msg.includes('homecoming')) {
    return saEventKnowledge.umgidi[Math.floor(Math.random() * saEventKnowledge.umgidi.length)];
  }
  if (msg.includes('wedding') || msg.includes('marriage')) {
    return saEventKnowledge.wedding[Math.floor(Math.random() * saEventKnowledge.wedding.length)];
  }
  if (msg.includes('funeral') || msg.includes('burial') || msg.includes('memorial')) {
    return saEventKnowledge.funeral[Math.floor(Math.random() * saEventKnowledge.funeral.length)];
  }

  // Budget questions
  if (msg.includes('budget') || msg.includes('cost') || msg.includes('price') || msg.includes('how much') || msg.includes('r') && msg.includes('?')) {
    if (plan) {
      const total = plan.categories.reduce((s, c) => s + c.items.reduce((sum, i) => sum + i.price * i.quantity, 0), 0);
      const guests = plan.numberOfGuests || 1;
      return `Your current total budget is R${total.toLocaleString('en-ZA')} for ${plan.numberOfGuests || 'unknown'} guests. That's about R${Math.round(total / guests)} per person. ${saEventKnowledge.budget[Math.floor(Math.random() * saEventKnowledge.budget.length)]}`;
    }
    return saEventKnowledge.budget[Math.floor(Math.random() * saEventKnowledge.budget.length)];
  }

  // Vendor questions
  if (msg.includes('vendor') || msg.includes('supplier') || msg.includes('caterer') || msg.includes('dj') || msg.includes('photographer')) {
    return saEventKnowledge.vendor[Math.floor(Math.random() * saEventKnowledge.vendor.length)];
  }

  // Timeline questions
  if (msg.includes('when') || msg.includes('timeline') || msg.includes('schedule') || msg.includes('planning') || msg.includes('how long') || msg.includes('before')) {
    return saEventKnowledge.timeline[Math.floor(Math.random() * saEventKnowledge.timeline.length)];
  }

  // Greeting
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('sawubona') || msg.includes('molo')) {
    const name = plan?.name ? ` for "${plan.name}"` : '';
    const cultureGreeting = culture === 'zu' ? 'Sawubona! ' : culture === 'xh' ? 'Molo! ' : 'Hello! ';
    return `${cultureGreeting}I'm your SimpliPlan AI Assistant${name}. I can help you with budget planning, vendor recommendations, cultural advice, and timeline management. What would you like to know?`;
  }

  // Help
  if (msg.includes('help') || msg.includes('what can you do') || msg.includes('assist')) {
    return `I can help you with:\n- Budget planning and cost estimates\n- Vendor recommendations\n- Cultural advice for Zulu, Xhosa, and general SA events\n- Timeline and scheduling\n- Event-specific guidance (lobola, uMemulo, weddings, etc.)\n\nWhat would you like help with?`;
  }

  // Cultural questions
  if (msg.includes('culture') || msg.includes('traditional') || msg.includes('zulu') || msg.includes('xhosa') || msg.includes('custom')) {
    if (culture === 'zu') return 'In Zulu culture, family and community are central to celebrations. Elders play an important role in ceremonies, and it\'s important to consult with them when planning traditional events like lobola or uMemulo.';
    if (culture === 'xh') return 'In Xhosa culture, ubuntu (community spirit) is fundamental. Events are communal affairs where neighbors and extended family come together. Respect for elders and ancestors is paramount in all ceremonies.';
    return 'South African events beautifully blend diverse cultural traditions. Whether it\'s a Zulu lobola, Xhosa uMemulo, or a modern celebration, respecting cultural traditions while making it your own is key.';
  }

  // Fallback
  const fallbacks = [
    `I'm here to help with your event planning. You can ask me about budgets, vendors, timelines, or cultural traditions for your ${plan?.eventType?.replace(/_/g, ' ') || 'event'}.`,
    `That's a great question! For your ${plan?.eventType?.replace(/_/g, ' ') || 'event'}, I'd recommend focusing on the key elements: venue, catering, and guest experience. What specific area would you like help with?`,
    `Let me help you with that. Based on South African event planning best practices, I suggest breaking your planning into phases: budget first, then venue, then vendors. How can I assist further?`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ============ AI TIMELINE GENERATOR ============

export interface TimelineEvent {
  title: string;
  description: string;
  dueDate: string;
  category: string;
  isOverdue: boolean;
}

export function generateTimeline(plan: EventPlan): TimelineEvent[] {
  if (!plan.eventDate) return [];

  const eventDate = new Date(plan.eventDate);
  const now = new Date();
  const events: TimelineEvent[] = [];

  const addEvent = (title: string, description: string, daysBefore: number, category: string) => {
    const due = new Date(eventDate);
    due.setDate(due.getDate() - daysBefore);
    events.push({ title, description, dueDate: due.toISOString().split('T')[0], category, isOverdue: due < now });
  };

  // Generate timeline based on event type
  addEvent('Set Final Date', 'Confirm and lock in your event date with key family members', 365, 'planning');
  addEvent('Create Budget', 'Set your total budget and start allocating to categories', 300, 'budget');
  addEvent('Book Venue', 'Secure your venue - popular venues book up fast!', 270, 'venue');
  addEvent('Book Catering', 'Confirm your caterer and menu selection', 240, 'catering');
  addEvent('Book Photographer', 'Book your photographer/videographer', 210, 'vendors');
  addEvent('Book DJ/Music', 'Secure your entertainment', 180, 'vendors');
  addEvent('Send Invitations', 'Send out digital or printed invitations', 150, 'guests');
  addEvent('Order Attire', 'Purchase or order traditional/ceremonial attire', 120, 'attire');
  addEvent('Confirm RSVPs', 'Follow up on outstanding RSVPs', 60, 'guests');
  addEvent('Finalize Vendor Details', 'Confirm all details with each vendor', 45, 'vendors');
  addEvent('Final Guest Count', 'Provide final numbers to venue and caterer', 30, 'guests');
  addEvent('Make Final Payments', 'Pay any outstanding vendor deposits', 14, 'budget');
  addEvent('Event Day', 'Enjoy your celebration!', 0, 'event');

  // Culture-specific events
  if (plan.eventType === 'lobola') {
    addEvent('Consult Elders', 'Meet with family elders to discuss lobola negotiations', 200, 'culture');
    addEvent('Prepare Gifts', 'Purchase traditional gifts (blankets, groceries, etc.)', 60, 'culture');
    addEvent('Negotiation Day', 'The lobola negotiation ceremony', 0, 'culture');
  }

  return events.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

// ============ AI INVITATION GENERATOR ============

export function generateInvitation(plan: EventPlan, culture: Language): string {
  const eventName = plan.name || 'Our Special Event';
  const date = plan.eventDate ? new Date(plan.eventDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '[Date]';
  const time = plan.eventTime || '[Time]';
  const location = plan.preciseLocation?.venueName || plan.location || '[Location]';
  const guestCount = plan.numberOfGuests || '[Number]';

  if (culture === 'zu') {
    return `Sawubona!\n\nYou are cordially invited to:\n${eventName}\n\nSiyakumema ukuze uze nomndeni wakho ukuzoba nathi ngaleli langa elibalulekile.\n\nDate: ${date}\nTime: ${time}\nVenue: ${location}\n\nPlease RSVP by ${date}.\n\nNgiyabonga!`;
  }

  if (culture === 'xh') {
    return `Molo!\n\nYou are warmly invited to:\n${eventName}\n\nSiyanibona nenzwanekayo ukuba nibe ngakuthi kwale mini intle.\n\nDate: ${date}\nTime: ${time}\nVenue: ${location}\n\nPlease RSVP by ${date}.\n\nEnkosi!`;
  }

  return `You're Invited!\n\n${eventName}\n\nWe would be honoured by your presence as we celebrate this special occasion together with family and friends.\n\nDate: ${date}\nTime: ${time}\nVenue: ${location}\nGuests: ${guestCount}\n\nPlease RSVP by ${date}.\n\nWe can't wait to celebrate with you!`;
}
