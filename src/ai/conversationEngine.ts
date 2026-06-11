// ═══════════════════════════════════════════════════════════
// SIMPLIPLAN CONVERSATION ENGINE v1.0
// Culturally-Aware Adaptive Questioning System
// ═══════════════════════════════════════════════════════════

import type { EventType } from '@/types';
import { generateSmartPackage } from './smartPlanner';
import type { SmartPackage } from './smartPlanner';

export type ConversationPhase =
  | 'welcome'
  | 'event_select'
  | 'event_questions'
  | 'location'
  | 'guests'
  | 'budget'
  | 'urgency'
  | 'generating'
  | 'tier_select'
  | 'summary'
  | 'confirmed';

export interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  type?: 'text' | 'options' | 'input_number' | 'input_text' | 'input_budget' | 'input_date' | 'tier_cards' | 'summary' | 'event_grid' | 'quick_budget' | 'quick_guests' | 'confirmed';
  options?: ChatOption[];
  phase?: ConversationPhase;
  delay?: number;
}

export interface ChatOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface ConversationState {
  phase: ConversationPhase;
  eventType: EventType | null;
  eventName: string;
  province: string;
  area: string;
  date: string;
  guestCount: number;
  budget: number;
  urgency: 'asap' | 'planned' | 'flexible';
  answers: Record<string, string>;
  messages: ChatMessage[];
  smartPackage: SmartPackage | null;
  selectedTier: 'budget' | 'standard' | 'premium';
  isTyping: boolean;
}

const saAreas: Record<string, string[]> = {
  'Gauteng': ['Soweto', 'Sandton', 'Johannesburg', 'Pretoria', 'Tembisa', 'Alexandra', 'Midrand', 'Randburg', 'Fourways', 'Rosebank', 'Centurion'],
  'KwaZulu-Natal': ['Durban', 'Umlazi', 'Umhlanga', 'KwaMashu', 'Pietermaritzburg', 'Ballito'],
  'Western Cape': ['Cape Town', 'Khayelitsha', 'Stellenbosch', 'Mitchells Plain', 'Gugulethu', 'Langa', 'Paarl'],
  'Eastern Cape': ['East London', 'Port Elizabeth', 'Umtata', 'King Williams Town'],
  'Mpumalanga': ['Mbombela', 'Witbank'],
  'Limpopo': ['Polokwane', 'Thohoyandou'],
  'Free State': ['Bloemfontein', 'Welkom'],
  'North West': ['Rustenburg', 'Mahikeng'],
  'Northern Cape': ['Kimberley', 'Upington'],
};

const saProvinces = Object.keys(saAreas);

const eventOptions: ChatOption[] = [
  { id: 'wedding', label: 'Wedding', value: 'wedding', icon: 'Heart', color: 'from-pink-500 to-rose-500', description: 'Your special day' },
  { id: 'traditional_wedding', label: 'Traditional Wedding', value: 'traditional_wedding', icon: 'Crown', color: 'from-purple-500 to-violet-500', description: 'Cultural celebration' },
  { id: 'lobola', label: 'Lobola Negotiation', value: 'lobola', icon: 'HandHeart', color: 'from-amber-500 to-orange-500', description: 'Family union' },
  { id: 'funeral', label: 'Funeral / Memorial', value: 'funeral', icon: 'Flower2', color: 'from-slate-400 to-gray-500', description: 'Honoring a loved one' },
  { id: 'umgidi', label: 'Umgidi (Homecoming)', value: 'umgidi', icon: 'Mountain', color: 'from-green-600 to-emerald-600', description: 'Welcoming amakrwala' },
  { id: 'umemulo', label: 'Umemulo', value: 'umemulo', icon: 'Sparkles', color: 'from-yellow-500 to-amber-500', description: 'Coming of age' },
  { id: 'twenty_first', label: '21st Birthday', value: 'twenty_first', icon: 'Key', color: 'from-blue-500 to-indigo-500', description: 'Key to adulthood' },
  { id: 'birthday', label: 'Birthday Party', value: 'birthday', icon: 'Cake', color: 'from-fuchsia-500 to-pink-500', description: 'Celebration of life' },
  { id: 'baby_shower', label: 'Baby Shower', value: 'baby_shower', icon: 'Baby', color: 'from-sky-400 to-cyan-400', description: 'Welcoming baby' },
  { id: 'graduation', label: 'Graduation', value: 'graduation', icon: 'GraduationCap', color: 'from-emerald-500 to-teal-500', description: 'Celebrating achievement' },
  { id: 'corporate', label: 'Corporate Event', value: 'corporate', icon: 'Briefcase', color: 'from-blue-600 to-blue-800', description: 'Business function' },
  { id: 'anniversary', label: 'Anniversary', value: 'anniversary', icon: 'CalendarHeart', color: 'from-red-400 to-pink-400', description: 'Milestone of love' },
  { id: 'bridal_shower', label: 'Bridal Shower', value: 'bridal_shower', icon: 'Gift', color: 'from-rose-400 to-pink-400', description: 'Celebrating the bride' },
  { id: 'baptism', label: 'Baptism', value: 'baptism', icon: 'Droplets', color: 'from-cyan-300 to-blue-400', description: 'Spiritual milestone' },
  { id: 'farewell', label: 'Farewell', value: 'farewell', icon: 'Plane', color: 'from-violet-400 to-purple-400', description: 'Goodbye celebration' },
  { id: 'reunion', label: 'Reunion', value: 'reunion', icon: 'Users', color: 'from-teal-400 to-emerald-400', description: 'Coming together' },
];

// Event-specific question flows
interface EventQuestionFlow {
  greeting: string;
  questions: EventQuestion[];
  budgetHint: string;
  guestHint: string;
  urgencyQuestion: string;
}

interface EventQuestion {
  id: string;
  question: string;
  type: 'options' | 'text' | 'number';
  options?: ChatOption[];
  placeholder?: string;
  essential: boolean;
}

const eventQuestionFlows: Record<string, EventQuestionFlow> = {
  funeral: {
    greeting: "I'm so sorry for your loss. Planning a funeral is never easy, and I'm here to take as much of the burden off your shoulders as possible. In South African communities, funerals are deeply important — and the whole community comes together to support the family. Let me help you honour your loved one with dignity.",
    questions: [
      {
        id: 'funeral_relation',
        question: 'What is your relationship to the departed? This helps me understand the scale and tone needed.',
        type: 'options',
        options: [
          { id: 'parent', label: 'Parent', value: 'parent' },
          { id: 'spouse', label: 'Spouse / Partner', value: 'spouse' },
          { id: 'child', label: 'Child', value: 'child' },
          { id: 'sibling', label: 'Sibling', value: 'sibling' },
          { id: 'grandparent', label: 'Grandparent', value: 'grandparent' },
          { id: 'extended', label: 'Extended family', value: 'extended' },
          { id: 'friend', label: 'Close friend', value: 'friend' },
          { id: 'community', label: 'Community member', value: 'community' },
        ],
        essential: true,
      },
      {
        id: 'funeral_tent',
        question: 'Where will the funeral service and gathering take place?',
        type: 'options',
        options: [
          { id: 'home', label: 'Family home (tent setup)', value: 'home', description: 'Most common — community gathers at home' },
          { id: 'church', label: 'Church hall', value: 'church', description: 'Service at church, gathering at home' },
          { id: 'funeral_hall', label: 'Funeral parlour hall', value: 'funeral_hall', description: 'All-in-one service and gathering' },
          { id: 'cemetery', label: 'Directly at cemetery', value: 'cemetery', description: 'Simple, graveside service' },
        ],
        essential: true,
      },
      {
        id: 'funeral_parlour',
        question: 'Have you arranged a funeral parlour yet?',
        type: 'options',
        options: [
          { id: 'yes_booked', label: 'Yes, already booked', value: 'yes_booked' },
          { id: 'yes_considering', label: 'Considering options', value: 'yes_considering' },
          { id: 'no_need_help', label: 'No — need help finding one', value: 'no_need_help' },
          { id: 'no_insurance', label: 'Funeral policy covers it', value: 'no_insurance' },
        ],
        essential: true,
      },
      {
        id: 'funeral_night_vigil',
        question: 'Will you be having a night vigil (imvuselelo) the night before the burial?',
        type: 'options',
        options: [
          { id: 'yes', label: 'Yes, the night before', value: 'yes', description: 'Traditional — community gathers to sing and pray' },
          { id: 'no', label: 'No, just the funeral day', value: 'no' },
          { id: 'unsure', label: 'Not sure yet', value: 'unsure' },
        ],
        essential: true,
      },
    ],
    budgetHint: 'A funeral in your area typically ranges from R15,000 to R80,000 depending on the size. What budget range are you working with?',
    guestHint: 'In our communities, funerals often draw the entire neighbourhood and beyond. Between 50 and 500+ people. How many are you expecting?',
    urgencyQuestion: 'When is the funeral expected to take place?',
  },
  umgidi: {
    greeting: "Umgidi is one of the most sacred and joyous celebrations in Xhosa culture! Welcoming amakrwala back from the mountain is a beautiful tradition that brings the entire community together. I'm excited to help you plan this incredible homecoming. The livestock, the umqombothi, the dancing — let's make it unforgettable!",
    questions: [
      {
        id: 'umgidi_initiates',
        question: 'How many initiates are we celebrating?',
        type: 'options',
        options: [
          { id: '1', label: '1 Initiate', value: '1' },
          { id: '2-3', label: '2-3 Initiates', value: '2-3' },
          { id: '4-6', label: '4-6 Initiates', value: '4-6' },
          { id: 'many', label: 'Many (community celebration)', value: 'many' },
        ],
        essential: true,
      },
      {
        id: 'umgidi_livestock',
        question: 'Have you sourced the cow and sheep yet?',
        type: 'options',
        options: [
          { id: 'yes_all', label: 'Yes, cow and sheep ready', value: 'yes_all' },
          { id: 'cow_only', label: 'Have cow, need sheep', value: 'cow_only' },
          { id: 'sourcing', label: 'Still sourcing', value: 'sourcing' },
          { id: 'need_help', label: 'Need help finding livestock', value: 'need_help' },
          { id: 'family_farm', label: 'Family will provide', value: 'family_farm' },
        ],
        essential: true,
      },
      {
        id: 'umgidi_incibi',
        question: 'Have you arranged the incibi (traditional surgeon) and inkankatha (caretaker) payments?',
        type: 'options',
        options: [
          { id: 'yes_both', label: 'Yes, both paid', value: 'yes_both' },
          { id: 'partial', label: 'Partially / Still arranging', value: 'partial' },
          { id: 'need_help', label: 'Need guidance on this', value: 'need_help' },
          { id: 'not_yet', label: 'Not yet — remind me later', value: 'not_yet' },
        ],
        essential: true,
      },
      {
        id: 'umgidi_umqombothi',
        question: 'Will umqombothi (traditional beer) be brewed or do you need help sourcing it?',
        type: 'options',
        options: [
          { id: 'brewing', label: 'Family is brewing it', value: 'brewing' },
          { id: 'sourcing', label: 'Need to source it', value: 'sourcing' },
          { id: 'both', label: 'Both brewed and bought', value: 'both' },
          { id: 'help', label: 'Need help with this', value: 'help' },
        ],
        essential: true,
      },
    ],
    budgetHint: 'An umgidi celebration typically costs between R30,000 and R150,000 depending on the number of initiates and guests. The livestock alone is a significant portion. What budget range works for your family?',
    guestHint: 'Umgidi draws the whole community — often 200 to 1,000+ people. How many guests are you planning for?',
    urgencyQuestion: 'When do the boys return from the mountain? This is your celebration date.',
  },
  wedding: {
    greeting: "Congratulations on your upcoming wedding! This is one of the most magical days of your life, and I'm here to make sure every detail is perfect. From the venue to the photographer to that show-stopping cake — let's create a day you'll never forget!",
    questions: [
      {
        id: 'wedding_style',
        question: 'What style of wedding are you dreaming of?',
        type: 'options',
        options: [
          { id: 'church', label: 'Church Wedding + Reception', value: 'church' },
          { id: 'outdoor', label: 'Outdoor / Garden Wedding', value: 'outdoor' },
          { id: 'venue', label: 'All-in-One Venue', value: 'venue' },
          { id: 'beach', label: 'Beach Wedding', value: 'beach' },
          { id: 'intimate', label: 'Small & Intimate', value: 'intimate' },
        ],
        essential: true,
      },
      {
        id: 'wedding_theme',
        question: 'Do you have a colour theme or season in mind?',
        type: 'text',
        placeholder: 'e.g. Rose gold & blush, Spring garden, Royal blue & gold...',
        essential: false,
      },
    ],
    budgetHint: 'Weddings in South Africa typically range from R30,000 (intimate) to R300,000+ (luxury). What budget range are you comfortable with?',
    guestHint: 'How many guests are you expecting? Include plus-ones in your count.',
    urgencyQuestion: 'When is your wedding date?',
  },
  lobola: {
    greeting: "Lobola is a beautiful and sacred tradition! This is about two families becoming one, and every detail matters — from the imvulamlomo at the gate to the grocery list. Let me help you navigate this with respect and dignity.",
    questions: [
      {
        id: 'lobola_stage',
        question: 'What stage are you at in the lobola process?',
        type: 'options',
        options: [
          { id: 'first_visit', label: 'First visit (introductory)', value: 'first_visit' },
          { id: 'negotiation', label: 'Negotiation visit', value: 'negotiation' },
          { id: 'final', label: 'Final payment / celebration', value: 'final' },
          { id: 'combined', label: 'Combined negotiation + celebration', value: 'combined' },
        ],
        essential: true,
      },
      {
        id: 'lobola_groceries',
        question: 'Have you received the grocery list from the bride\'s family?',
        type: 'options',
        options: [
          { id: 'yes_bought', label: 'Yes, and everything is bought', value: 'yes_bought' },
          { id: 'yes_pending', label: 'Yes, still buying', value: 'yes_pending' },
          { id: 'waiting', label: 'Waiting to receive it', value: 'waiting' },
          { id: 'not_sure', label: 'Not sure what to expect', value: 'not_sure' },
        ],
        essential: true,
      },
    ],
    budgetHint: 'Lobola celebrations typically cost between R10,000 and R50,000 including the grocery list, venue, catering, and gifts. What budget have you set aside?',
    guestHint: 'How many people from the groom\'s family will be attending? Include elders, uncles, and representatives.',
    urgencyQuestion: 'When is the lobola date?',
  },
  twenty_first: {
    greeting: "A 21st birthday is a HUGE milestone in South Africa — the key to adulthood! This is YOUR night, and we're going to make it legendary. The vibe, the music, the people — let's plan a night you'll never forget!",
    questions: [
      {
        id: '21_theme',
        question: 'What vibe are you going for?',
        type: 'options',
        options: [
          { id: 'all_black', label: 'All-Black / Elegant', value: 'all_black' },
          { id: 'themed', label: 'Themed Party', value: 'themed' },
          { id: 'club', label: 'Club / Night Out', value: 'club' },
          { id: 'backyard', label: 'Backyard Vibes', value: 'backyard' },
          { id: 'family', label: 'Family Celebration', value: 'family' },
        ],
        essential: true,
      },
      {
        id: '21_key',
        question: 'Do you have your symbolic key gift arranged?',
        type: 'options',
        options: [
          { id: 'yes', label: 'Yes! Got it sorted', value: 'yes' },
          { id: 'no', label: 'Not yet — remind me!', value: 'no' },
          { id: 'unsure', label: 'What key?', value: 'unsure' },
        ],
        essential: false,
      },
    ],
    budgetHint: 'A 21st birthday party typically costs between R8,000 and R50,000. What budget are you working with?',
    guestHint: 'How many friends and family are you inviting?',
    urgencyQuestion: 'When is the big day?',
  },
  umemulo: {
    greeting: "Umemulo is one of the most beautiful Zulu traditions — celebrating a young woman\'s coming of age with the ukusina dance and the sacred cow slaughter. This is a deeply spiritual and joyous occasion. Let me help you honour this tradition with reverence and beauty.",
    questions: [
      {
        id: 'umemulo_cow',
        question: 'Have you sourced the cow for the ceremony?',
        type: 'options',
        options: [
          { id: 'yes', label: 'Yes, cow is ready', value: 'yes' },
          { id: 'sourcing', label: 'In the process', value: 'sourcing' },
          { id: 'need_help', label: 'Need help sourcing', value: 'need_help' },
          { id: 'family', label: 'Family will provide', value: 'family' },
        ],
        essential: true,
      },
      {
        id: 'umemulo_attire',
        question: 'Has the isidwaba (leather skirt) and beadwork been arranged?',
        type: 'options',
        options: [
          { id: 'yes', label: 'Yes, all ready', value: 'yes' },
          { id: 'ordering', label: 'Ordering now', value: 'ordering' },
          { id: 'need_help', label: 'Need guidance', value: 'need_help' },
        ],
        essential: true,
      },
    ],
    budgetHint: 'Umemulo celebrations typically range from R20,000 to R80,000. What budget has the family set?',
    guestHint: 'The whole community is invited — how many guests are you expecting?',
    urgencyQuestion: 'When will the ceremony take place?',
  },
  traditional_wedding: {
    greeting: "A traditional wedding is a beautiful celebration of culture, family, and love! The umembeso, the traditional food, the dancing — every element tells a story. Let me help you create a celebration that honours your heritage while creating unforgettable memories.",
    questions: [
      {
        id: 'tw_culture',
        question: 'Which cultural traditions are you incorporating?',
        type: 'options',
        options: [
          { id: 'zulu', label: 'Zulu', value: 'zulu' },
          { id: 'xhosa', label: 'Xhosa', value: 'xhosa' },
          { id: 'ndebele', label: 'Ndebele', value: 'ndebele' },
          { id: 'sotho', label: 'Sotho', value: 'sotho' },
          { id: 'tswana', label: 'Tswana', value: 'tswana' },
          { id: 'venda', label: 'Venda', value: 'venda' },
          { id: 'tsonga', label: 'Tsonga', value: 'tsonga' },
          { id: 'mixed', label: 'Mixed / Modern blend', value: 'mixed' },
        ],
        essential: true,
      },
      {
        id: 'tw_gifts',
        question: 'Have you prepared the gifts (umembeso) for the bride\'s family?',
        type: 'options',
        options: [
          { id: 'yes', label: 'Yes, everything is ready', value: 'yes' },
          { id: 'partial', label: 'Working on it', value: 'partial' },
          { id: 'need_help', label: 'Need a checklist', value: 'need_help' },
        ],
        essential: true,
      },
    ],
    budgetHint: 'Traditional weddings in South Africa typically cost between R25,000 and R150,000 depending on the scale and gifts. What budget range works for your families?',
    guestHint: 'Traditional weddings are community affairs — how many guests from both families?',
    urgencyQuestion: 'When is the celebration?',
  },
};

// Default questions for events without specific flows
const defaultFlow: EventQuestionFlow = {
  greeting: "What an exciting event to plan! I'm here to make it seamless and stress-free. Let's get started!",
  questions: [
    {
      id: 'generic_vibe',
      question: 'What kind of vibe are you going for?',
      type: 'options',
      options: [
        { id: 'elegant', label: 'Elegant & Formal', value: 'elegant' },
        { id: 'casual', label: 'Casual & Relaxed', value: 'casual' },
        { id: 'themed', label: 'Themed Party', value: 'themed' },
        { id: 'outdoor', label: 'Outdoor / Nature', value: 'outdoor' },
        { id: 'indoor', label: 'Indoor Venue', value: 'indoor' },
      ],
      essential: true,
    },
    {
      id: 'generic_size',
      question: 'How big is this celebration?',
      type: 'options',
      options: [
        { id: 'intimate', label: 'Intimate (under 20)', value: 'intimate' },
        { id: 'medium', label: 'Medium (20-50)', value: 'medium' },
        { id: 'large', label: 'Large (50-100)', value: 'large' },
        { id: 'huge', label: 'Huge (100+)', value: 'huge' },
      ],
      essential: true,
    },
  ],
  budgetHint: 'What budget have you set aside for this event?',
  guestHint: 'How many guests are you expecting?',
  urgencyQuestion: 'When is the event date?',
};

let messageIdCounter = 0;
function genId() { return `msg-${++messageIdCounter}`; }

export function createInitialState(): ConversationState {
  return {
    phase: 'welcome',
    eventType: null,
    eventName: '',
    province: '',
    area: '',
    date: '',
    guestCount: 0,
    budget: 0,
    urgency: 'planned',
    answers: {},
    messages: [],
    smartPackage: null,
    selectedTier: 'standard',
    isTyping: false,
  };
}

// Generate welcome message
export function getWelcomeMessage(): ChatMessage[] {
  return [
    {
      id: genId(),
      role: 'ai',
      content: 'Hey there! I\'m your SimpliPlan AI Planner — here to help you plan the perfect event. Think of me as your personal event coordinator who understands South African culture, knows the best vendors in your area, and handles all the heavy lifting.',
      type: 'text',
      phase: 'welcome',
    },
    {
      id: genId(),
      role: 'ai',
      content: 'What event are you planning?',
      type: 'event_grid',
      phase: 'event_select',
      options: eventOptions,
    },
  ];
}

// Get the question flow for an event type
export function getEventFlow(eventType: string): EventQuestionFlow {
  return eventQuestionFlows[eventType] || defaultFlow;
}

// Build the event-specific question messages
export function buildEventQuestions(_eventType: EventType, flow: EventQuestionFlow): ChatMessage[] {
  const messages: ChatMessage[] = [
    {
      id: genId(),
      role: 'ai',
      content: flow.greeting,
      type: 'text',
      phase: 'event_questions',
    },
  ];

  flow.questions.forEach((q) => {
    messages.push({
      id: genId(),
      role: 'ai',
      content: q.question,
      type: q.type as any,
      phase: 'event_questions',
      options: q.options,
    });
  });

  // Add location question
  messages.push({
    id: genId(),
    role: 'ai',
    content: 'Where will this event take place? First, which province?',
    type: 'options',
    phase: 'location',
    options: saProvinces.map(p => ({ id: p, label: p, value: p })),
  });

  return messages;
}

// Build area question for a province
export function buildAreaQuestion(province: string): ChatMessage {
  const areas = saAreas[province] || [];
  return {
    id: genId(),
    role: 'ai',
    content: `And which area or township in ${province}?`,
    type: 'options',
    phase: 'location',
    options: areas.map(a => ({ id: a, label: a, value: a })),
  };
}

// Build guest count question
export function buildGuestQuestion(flow: EventQuestionFlow): ChatMessage {
  return {
    id: genId(),
    role: 'ai',
    content: flow.guestHint,
    type: 'quick_guests',
    phase: 'guests',
    options: [
      { id: '20', label: 'Under 20', value: '20' },
      { id: '50', label: '20-50', value: '50' },
      { id: '100', label: '50-100', value: '100' },
      { id: '200', label: '100-200', value: '200' },
      { id: '300', label: '200-300', value: '300' },
      { id: '500', label: '300-500', value: '500' },
      { id: '1000', label: '500+', value: '1000' },
    ],
  };
}

// Build budget question
export function buildBudgetQuestion(flow: EventQuestionFlow): ChatMessage {
  return {
    id: genId(),
    role: 'ai',
    content: flow.budgetHint,
    type: 'quick_budget',
    phase: 'budget',
    options: [
      { id: '5000', label: 'Under R5k', value: '5000' },
      { id: '15000', label: 'R5k - R15k', value: '15000' },
      { id: '30000', label: 'R15k - R30k', value: '30000' },
      { id: '50000', label: 'R30k - R50k', value: '50000' },
      { id: '100000', label: 'R50k - R100k', value: '100000' },
      { id: '200000', label: 'R100k+', value: '200000' },
    ],
  };
}

// Build urgency question
export function buildUrgencyQuestion(flow: EventQuestionFlow): ChatMessage {
  return {
    id: genId(),
    role: 'ai',
    content: flow.urgencyQuestion,
    type: 'input_date',
    phase: 'urgency',
  };
}

// Build the generating message
export function buildGeneratingMessage(): ChatMessage {
  return {
    id: genId(),
    role: 'ai',
    content: 'Give me a moment... I\'m using everything you\'ve told me to find the best vendors, compare prices, and build your custom event plan.',
    type: 'text',
    phase: 'generating',
  };
}

// Build the tier selection message
export function buildTierMessage(pkg: SmartPackage): ChatMessage {
  return {
    id: genId(),
    role: 'ai',
    content: `I found the perfect vendors for your ${pkg.eventName}! Based on your ${pkg.guestCount} guests in ${pkg.area}, here are three options — like Uber, same destination, different ride quality.`,
    type: 'tier_cards',
    phase: 'tier_select',
  };
}

// Build summary message
export function buildSummaryMessage(pkg: SmartPackage, tier: 'budget' | 'standard' | 'premium'): ChatMessage {
  const tierPkg = pkg.tiers.find(t => t.tier === tier);
  const itemCount = tierPkg?.items.filter(i => i.options.length > 0).length || 0;
  return {
    id: genId(),
    role: 'ai',
    content: `Here's what I've put together for your ${pkg.eventName}:\n\n${pkg.guestCount} guests in ${pkg.area}, ${pkg.province}\n${itemCount} vendor categories covered\nEstimated total: R${tierPkg?.totalCost.toLocaleString('en-ZA') || 0}\n\nOne tap and I'll send quote requests to all ${itemCount} vendors right now.`,
    type: 'summary',
    phase: 'summary',
  };
}

// Generate smart package
export function generatePackage(
  eventType: EventType,
  budget: number,
  guestCount: number,
  province: string,
  area: string,
  date: string
): SmartPackage {
  return generateSmartPackage(eventType, budget, guestCount, province, area, date);
}

// Format currency
export function formatCurrency(amount: number): string {
  return `R${amount.toLocaleString('en-ZA')}`;
}

// Get smart tip for the event
export function getSmartTip(eventType: string): string {
  const tips: Record<string, string> = {
    funeral: 'Remember: in our communities, it is better to have extra food than not enough. Plan for 20-30% more guests than your list.',
    umgidi: 'The cow and sheep are sacred — source them from trusted farmers. Do not leave this to the last minute!',
    wedding: 'Book your venue and photographer FIRST — they get reserved 6-12 months in advance, especially September to April.',
    lobola: 'The grocery list from the bride\'s family must be followed exactly. This is a test of respect — do not substitute items without permission.',
    twenty_first: 'Invest 30-40% of your budget in DJ + sound + venue. People remember the vibe, not the decor!',
    umemulo: 'The isidwaba and beadwork should be sourced at least a month in advance. These are not off-the-shelf items.',
    traditional_wedding: 'Coordinate family attire colours in advance. The umembeso gifts are as important as the ceremony itself.',
  };
  return tips[eventType] || 'Book your key vendors early — the best ones get reserved fast!';
}
