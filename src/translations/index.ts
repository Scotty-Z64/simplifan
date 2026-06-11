import type { Language } from '@/types/language';

const translations: Record<string, Record<Language, string>> = {
  'nav.home': { en: 'Home', zu: 'Home', xh: 'Home' },
  'nav.pricing': { en: 'Pricing', zu: 'Pricing', xh: 'Pricing' },
  'nav.about': { en: 'About', zu: 'About', xh: 'About' },
  'nav.myPlans': { en: 'My Plans', zu: 'My Plans', xh: 'My Plans' },
  'nav.login': { en: 'Login', zu: 'Login', xh: 'Login' },
  'nav.register': { en: 'Register', zu: 'Register', xh: 'Register' },
  'nav.logout': { en: 'Logout', zu: 'Logout', xh: 'Logout' },
  'lang.select': { en: 'Select Culture', zu: 'Select Culture', xh: 'Select Culture' },

  'hero.title': { en: 'Plan Your Perfect South African Event', zu: 'Plan Your Perfect South African Event', xh: 'Plan Your Perfect South African Event' },
  'hero.cta': { en: 'Start Planning Free', zu: 'Start Planning Free', xh: 'Start Planning Free' },
  'hero.subcta': { en: 'No credit card required', zu: 'No credit card required', xh: 'No credit card required' },

  'planner.greeting': { en: 'Good Morning', zu: 'Sawubona', xh: 'Molo' },
  'planner.greeting.afternoon': { en: 'Good Afternoon', zu: 'Sanibonani', xh: 'Mholo' },
  'planner.greeting.evening': { en: 'Good Evening', zu: 'Ulale kahle', xh: 'Ulale kakuhle' },
  'planner.subtitle': { en: "Let's get your planning done.", zu: 'Ake sihlele.', xh: 'Masenze ulungiselelo.' },

  'planner.planName': { en: 'My-Plan Name', zu: 'My-Plan Name', xh: 'My-Plan Name' },
  'planner.location': { en: 'Precise Location', zu: 'Precise Location', xh: 'Precise Location' },
  'planner.eventDate': { en: 'Event Date', zu: 'Event Date', xh: 'Event Date' },
  'planner.eventTime': { en: 'Event Time', zu: 'Event Time', xh: 'Event Time' },
  'planner.guests': { en: 'Number of Guests', zu: 'Number of Guests', xh: 'Number of Guests' },
  'planner.dashboard': { en: 'Dashboard', zu: 'Dashboard', xh: 'Dashboard' },
  'planner.grandTotal': { en: 'Grand Total', zu: 'Grand Total', xh: 'Grand Total' },
  'planner.contributions': { en: 'Contributions', zu: 'Contributions', xh: 'Contributions' },
  'planner.remaining': { en: 'Remaining', zu: 'Remaining', xh: 'Remaining' },
  'planner.daysLeft': { en: 'Days Left', zu: 'Days Left', xh: 'Days Left' },
  'planner.mustDos': { en: "Must-Do's", zu: "Must-Do's", xh: "Must-Do's" },
  'planner.guestsCount': { en: 'Guests', zu: 'Guests', xh: 'Guests' },
  'planner.savePlan': { en: 'Save Plan', zu: 'Save Plan', xh: 'Save Plan' },
  'planner.finalize': { en: 'Finalize Plan', zu: 'Finalize Plan', xh: 'Finalize Plan' },
  'planner.signUpToSave': { en: 'Sign Up to Save', zu: 'Sign Up to Save', xh: 'Sign Up to Save' },

  'tab.budget': { en: 'Budget', zu: 'Budget', xh: 'Budget' },
  'tab.contributions': { en: 'Contributions', zu: 'Contributions', xh: 'Contributions' },
  'tab.tasks': { en: 'Tasks', zu: 'Tasks', xh: 'Tasks' },
  'tab.vendors': { en: 'Vendors', zu: 'Vendors', xh: 'Vendors' },
  'tab.guests': { en: 'Guests', zu: 'Guests', xh: 'Guests' },
  'tab.priceGuide': { en: 'Price Guide', zu: 'Price Guide', xh: 'Price Guide' },
  'tab.invite': { en: 'Invite', zu: 'Invite', xh: 'Invite' },
  'tab.checklist': { en: 'Checklist', zu: 'Checklist', xh: 'Checklist' },
  'tab.payments': { en: 'Payments', zu: 'Payments', xh: 'Payments' },
  'tab.seating': { en: 'Seating', zu: 'Seating', xh: 'Seating' },
  'tab.thankYou': { en: 'Thank You', zu: 'Thank You', xh: 'Thank You' },

  'budget.overview': { en: 'Budget Overview', zu: 'Budget Overview', xh: 'Budget Overview' },
  'budget.search': { en: 'Search categories or items...', zu: 'Search categories or items...', xh: 'Search categories or items...' },
  'budget.noItems': { en: 'No items yet. Tap + to add.', zu: 'No items yet. Tap + to add.', xh: 'No items yet. Tap + to add.' },
  'budget.addItem': { en: 'Add New Item', zu: 'Add New Item', xh: 'Add New Item' },
  'budget.addTo': { en: 'Add Item to', zu: 'Add Item to', xh: 'Add Item to' },
  'budget.itemName': { en: 'Item Name', zu: 'Item Name', xh: 'Item Name' },
  'budget.itemName.placeholder': { en: 'e.g., Venue Deposit', zu: 'e.g., Venue Deposit', xh: 'e.g., Venue Deposit' },
  'budget.quantity': { en: 'Quantity', zu: 'Quantity', xh: 'Quantity' },
  'budget.priceR': { en: 'Price (R)', zu: 'Price (R)', xh: 'Price (R)' },
  'budget.quickAdd': { en: 'Quick Add', zu: 'Quick Add', xh: 'Quick Add' },
  'budget.editItem': { en: 'Edit Item', zu: 'Edit Item', xh: 'Edit Item' },
  'budget.saveChanges': { en: 'Save Changes', zu: 'Save Changes', xh: 'Save Changes' },

  'stats.events': { en: 'Events Planned', zu: 'Events Planned', xh: 'Events Planned' },
  'stats.users': { en: 'Active Users', zu: 'Active Users', xh: 'Active Users' },
  'stats.vendors': { en: 'SA Vendors', zu: 'SA Vendors', xh: 'SA Vendors' },
  'stats.saved': { en: 'Budget Saved', zu: 'Budget Saved', xh: 'Budget Saved' },

  'feature.budget': { en: 'Smart Budgeting', zu: 'Smart Budgeting', xh: 'Smart Budgeting' },
  'feature.budget.desc': { en: 'Track every Rand with our intelligent budget management system designed for South African events.', zu: 'Track every Rand with our intelligent budget management system designed for South African events.', xh: 'Track every Rand with our intelligent budget management system designed for South African events.' },
  'feature.contributions': { en: 'Stokvel & Contributions', zu: 'Stokvel & Contributions', xh: 'Stokvel & Contributions' },
  'feature.contributions.desc': { en: 'Manage family contributions and stokvel payments with built-in tracking for traditional fundraising.', zu: 'Manage family contributions and stokvel payments with built-in tracking for traditional fundraising.', xh: 'Manage family contributions and stokvel payments with built-in tracking for traditional fundraising.' },
  'feature.vendors': { en: 'SA Vendor Directory', zu: 'SA Vendor Directory', xh: 'SA Vendor Directory' },
  'feature.vendors.desc': { en: 'Access 500+ verified South African vendors across all 9 provinces with transparent pricing.', zu: 'Access 500+ verified South African vendors across all 9 provinces with transparent pricing.', xh: 'Access 500+ verified South African vendors across all 9 provinces with transparent pricing.' },
  'feature.invitations': { en: 'Digital Invitations', zu: 'Digital Invitations', xh: 'Digital Invitations' },
  'feature.invitations.desc': { en: 'Create and share beautiful digital invitations via WhatsApp, email, or download.', zu: 'Create and share beautiful digital invitations via WhatsApp, email, or download.', xh: 'Create and share beautiful digital invitations via WhatsApp, email, or download.' },

  'planner.eventTimeLabel': { en: 'Event Time', zu: 'Event Time', xh: 'Event Time' },
  'planner.locationLabel': { en: 'Location', zu: 'Location', xh: 'Location' },
  'planner.planName.placeholder': { en: 'Enter plan name...', zu: 'Enter plan name...', xh: 'Enter plan name...' },
};

export function t(key: string, lang: Language): string {
  const tr = translations[key];
  return tr ? (tr[lang] || tr.en || key) : key;
}
