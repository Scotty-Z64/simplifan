import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { EventPlan, BudgetCategory, BudgetItem, Contribution, Task, VendorQuote, Guest, EventType } from '@/types';
import { useAuth } from './AuthContext';

interface PlansContextType {
  plans: EventPlan[];
  currentPlan: EventPlan | null;
  createPlan: (eventType: EventType) => EventPlan;
  savePlan: (plan: EventPlan) => void;
  deletePlan: (planId: string) => void;
  loadPlan: (planId: string) => EventPlan | null;
  updatePlan: (plan: EventPlan) => void;
  addCategory: (planId: string, category: Omit<BudgetCategory, 'id' | 'items'>) => void;
  addItem: (planId: string, categoryId: string, item: Omit<BudgetItem, 'id'>) => void;
  updateItem: (planId: string, categoryId: string, itemId: string, updates: Partial<BudgetItem>) => void;
  deleteItem: (planId: string, categoryId: string, itemId: string) => void;
  toggleItemComplete: (planId: string, categoryId: string, itemId: string) => void;
  toggleCategoryExpand: (planId: string, categoryId: string) => void;
  calculateTotal: (plan: EventPlan) => number;
  calculateContributions: (plan: EventPlan) => number;
  finalizePlan: (planId: string) => void;
  addContribution: (planId: string, contribution: Omit<Contribution, 'id'>) => void;
  deleteContribution: (planId: string, contributionId: string) => void;
  addTask: (planId: string, task: Omit<Task, 'id'>) => void;
  updateTask: (planId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (planId: string, taskId: string) => void;
  toggleTaskComplete: (planId: string, taskId: string) => void;
  addVendorQuote: (planId: string, quote: Omit<VendorQuote, 'id'>) => void;
  deleteVendorQuote: (planId: string, quoteId: string) => void;
  addGuest: (planId: string, guest: Omit<Guest, 'id'>) => void;
  updateGuest: (planId: string, guestId: string, updates: Partial<Guest>) => void;
  deleteGuest: (planId: string, guestId: string) => void;
}

const defaultCategories: Record<EventType, Omit<BudgetCategory, 'id' | 'items'>[]> = {
  wedding: [
    { name: 'Venue', icon: 'building' },
    { name: 'Attire', icon: 'shirt' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Music & Entertainment', icon: 'music' },
    { name: 'Decor & Flowers', icon: 'flower' },
    { name: 'Transport', icon: 'truck' },
    { name: 'Gifts & Favours', icon: 'gift' },
  ],
  white_wedding: [
    { name: 'Church Venue', icon: 'building' },
    { name: 'Reception Venue', icon: 'building' },
    { name: 'Bridal Attire', icon: 'shirt' },
    { name: 'Groom Attire', icon: 'shirt' },
    { name: 'Catering & Cake', icon: 'utensils' },
    { name: 'Photography & Video', icon: 'camera' },
    { name: 'Music & DJ', icon: 'music' },
    { name: 'Decor & Flowers', icon: 'flower' },
    { name: 'Transport', icon: 'truck' },
  ],
  traditional_wedding: [
    { name: 'Venue', icon: 'building' },
    { name: 'Traditional Attire', icon: 'shirt' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Dowry & Gifts', icon: 'gift' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Traditional Entertainment', icon: 'music' },
    { name: 'Decor', icon: 'flower' },
    { name: 'Transport', icon: 'truck' },
  ],
  lobola: [
    { name: 'Venue', icon: 'building' },
    { name: 'Dowry (Lobola)', icon: 'gift' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Traditional Attire', icon: 'shirt' },
    { name: 'Gifts for Elders', icon: 'gift' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Transport', icon: 'truck' },
  ],
  funeral: [
    { name: 'Venue', icon: 'building' },
    { name: 'Coffin & Transport', icon: 'truck' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Service', icon: 'cross' },
    { name: 'Flowers & Decor', icon: 'flower' },
    { name: 'Tombstone', icon: 'star' },
    { name: 'Programs', icon: 'file' },
  ],
  umemulo: [
    { name: 'Venue', icon: 'building' },
    { name: 'Traditional Attire & Beads', icon: 'shirt' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Ceremony Items', icon: 'star' },
    { name: 'Entertainment', icon: 'music' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Gifts', icon: 'gift' },
  ],
  umgidi: [
    { name: 'Venue', icon: 'building' },
    { name: 'Traditional Attire', icon: 'shirt' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Ritual Items', icon: 'star' },
    { name: 'Gifts & Presents', icon: 'gift' },
    { name: 'Entertainment', icon: 'music' },
  ],
  imbeleko: [
    { name: 'Venue', icon: 'building' },
    { name: 'Traditional Items', icon: 'star' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Baby Clothes & Gifts', icon: 'gift' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Decor', icon: 'flower' },
  ],
  birthday: [
    { name: 'Venue', icon: 'building' },
    { name: 'Catering & Cake', icon: 'utensils' },
    { name: 'Decorations', icon: 'flower' },
    { name: 'Entertainment', icon: 'music' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Party Favours', icon: 'gift' },
  ],
  twenty_first: [
    { name: 'Venue', icon: 'building' },
    { name: 'Catering & Cake', icon: 'utensils' },
    { name: 'Key Ceremony', icon: 'star' },
    { name: 'Decorations', icon: 'flower' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Entertainment', icon: 'music' },
    { name: 'Gifts', icon: 'gift' },
  ],
  graduation: [
    { name: 'Venue', icon: 'building' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Decorations', icon: 'flower' },
    { name: 'Gifts', icon: 'gift' },
    { name: 'Transport', icon: 'truck' },
  ],
  housewarming: [
    { name: 'Venue (Home)', icon: 'building' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Blessing Ceremony', icon: 'star' },
    { name: 'Decorations', icon: 'flower' },
    { name: 'Gifts', icon: 'gift' },
  ],
  anniversary: [
    { name: 'Venue', icon: 'building' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Decor', icon: 'flower' },
    { name: 'Entertainment', icon: 'music' },
    { name: 'Gifts', icon: 'gift' },
  ],
  memorial: [
    { name: 'Venue', icon: 'building' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Flowers & Decor', icon: 'flower' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Programs', icon: 'file' },
  ],
  baby_shower: [
    { name: 'Venue', icon: 'building' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Decorations', icon: 'flower' },
    { name: 'Gifts', icon: 'gift' },
    { name: 'Photography', icon: 'camera' },
    { name: 'Games & Entertainment', icon: 'music' },
  ],
  church_event: [
    { name: 'Venue', icon: 'building' },
    { name: 'Catering', icon: 'utensils' },
    { name: 'Sound System', icon: 'music' },
    { name: 'Decorations', icon: 'flower' },
    { name: 'Transport', icon: 'truck' },
    { name: 'Programs', icon: 'file' },
  ],
};

const defaultItems: Record<string, Omit<BudgetItem, 'id'>[]> = {
  'Venue': [
    { name: 'Venue Hire', quantity: 1, price: 15000, completed: false },
    { name: 'Tables & Chairs', quantity: 20, price: 150, completed: false },
    { name: 'Sound System', quantity: 1, price: 3500, completed: false },
  ],
  'Catering': [
    { name: 'Main Course per Person', quantity: 100, price: 180, completed: false },
    { name: 'Drinks & Beverages', quantity: 100, price: 80, completed: false },
    { name: 'Cake', quantity: 1, price: 2500, completed: false },
  ],
  'Attire': [
    { name: 'Main Outfit', quantity: 1, price: 8000, completed: false },
    { name: 'Accessories', quantity: 1, price: 1500, completed: false },
  ],
  'Photography': [
    { name: 'Photographer', quantity: 1, price: 6000, completed: false },
    { name: 'Video Coverage', quantity: 1, price: 4500, completed: false },
  ],
  'Transport': [
    { name: 'Guest Transport', quantity: 2, price: 2000, completed: false },
    { name: 'VIP Transport', quantity: 1, price: 3000, completed: false },
  ],
  'Decor & Flowers': [
    { name: 'Flowers', quantity: 1, price: 3500, completed: false },
    { name: 'Decorations', quantity: 1, price: 2500, completed: false },
  ],
  'Entertainment': [
    { name: 'DJ/MC', quantity: 1, price: 3500, completed: false },
    { name: 'Live Band', quantity: 1, price: 5000, completed: false },
  ],
  'Gifts': [
    { name: 'Gifts for Guests', quantity: 50, price: 100, completed: false },
    { name: 'Thank You Cards', quantity: 50, price: 30, completed: false },
  ],
};

const PlansContext = createContext<PlansContextType | undefined>(undefined);

export function PlansProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<EventPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<EventPlan | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const storedPlans = localStorage.getItem('simpliflow_plans');
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('simpliflow_plans', JSON.stringify(plans));
  }, [plans]);

  const createPlan = (eventType: EventType): EventPlan => {
    const categories = defaultCategories[eventType].map((cat, index) => ({
      ...cat,
      id: `cat-${Date.now()}-${index}`,
      items: (defaultItems[cat.name] || []).map((item, i) => ({
        ...item,
        id: `item-${Date.now()}-${index}-${i}`,
      })),
      expanded: false,
    }));

    const newPlan: EventPlan = {
      id: `plan-${Date.now()}`,
      userId: user?.id,
      name: '',
      eventType,
      categories,
      contributions: [],
      tasks: [],
      vendorQuotes: [],
      guests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      finalized: false,
    };

    setCurrentPlan(newPlan);
    return newPlan;
  };

  const savePlan = (plan: EventPlan) => {
    const updatedPlan = { ...plan, updatedAt: new Date().toISOString() };
    setPlans(prev => {
      const existing = prev.find(p => p.id === plan.id);
      if (existing) {
        return prev.map(p => p.id === plan.id ? updatedPlan : p);
      }
      return [...prev, updatedPlan];
    });
    setCurrentPlan(updatedPlan);
  };

  const deletePlan = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
    if (currentPlan?.id === planId) {
      setCurrentPlan(null);
    }
  };

  const loadPlan = (planId: string): EventPlan | null => {
    const plan = plans.find(p => p.id === planId) || (currentPlan?.id === planId ? currentPlan : null);
    if (plan) {
      setCurrentPlan(plan);
      return plan;
    }
    return null;
  };

  const updatePlan = (plan: EventPlan) => {
    const updatedPlan = { ...plan, updatedAt: new Date().toISOString() };
    setPlans(prev => prev.map(p => p.id === plan.id ? updatedPlan : p));
    setCurrentPlan(updatedPlan);
  };

  const addCategory = (planId: string, category: Omit<BudgetCategory, 'id' | 'items'>) => {
    const plan = plans.find(p => p.id === planId) || (currentPlan?.id === planId ? currentPlan : null);
    if (plan) {
      const newCategory: BudgetCategory = {
        ...category,
        id: `cat-${Date.now()}`,
        items: [],
        expanded: true,
      };
      updatePlan({ ...plan, categories: [...plan.categories, newCategory] });
    }
  };

  const addItem = (planId: string, categoryId: string, item: Omit<BudgetItem, 'id'>) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) {
      const newItem: BudgetItem = { ...item, id: `item-${Date.now()}` };
      const updatedCategories = plan.categories.map(cat =>
        cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat
      );
      updatePlan({ ...plan, categories: updatedCategories });
    }
  };

  const updateItem = (planId: string, categoryId: string, itemId: string, updates: Partial<BudgetItem>) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) {
      const updatedCategories = plan.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, ...updates } : item) }
          : cat
      );
      updatePlan({ ...plan, categories: updatedCategories });
    }
  };

  const deleteItem = (planId: string, categoryId: string, itemId: string) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) {
      const updatedCategories = plan.categories.map(cat =>
        cat.id === categoryId ? { ...cat, items: cat.items.filter(item => item.id !== itemId) } : cat
      );
      updatePlan({ ...plan, categories: updatedCategories });
    }
  };

  const toggleItemComplete = (planId: string, categoryId: string, itemId: string) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) {
      const updatedCategories = plan.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item) }
          : cat
      );
      updatePlan({ ...plan, categories: updatedCategories });
    }
  };

  const toggleCategoryExpand = (planId: string, categoryId: string) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) {
      const updatedCategories = plan.categories.map(cat =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      );
      updatePlan({ ...plan, categories: updatedCategories });
    }
  };

  const calculateTotal = (plan: EventPlan): number => {
    return plan.categories.reduce((total, cat) => total + cat.items.reduce((sum, item) => sum + (item.price * item.quantity), 0), 0);
  };

  const calculateContributions = (plan: EventPlan): number => {
    return plan.contributions.reduce((total, c) => total + c.amount, 0);
  };

  const finalizePlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) updatePlan({ ...plan, finalized: true });
  };

  const addContribution = (planId: string, contribution: Omit<Contribution, 'id'>) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) {
      const newContribution: Contribution = { ...contribution, id: `contrib-${Date.now()}` };
      updatePlan({ ...plan, contributions: [...plan.contributions, newContribution] });
    }
  };

  const deleteContribution = (planId: string, contributionId: string) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) updatePlan({ ...plan, contributions: plan.contributions.filter(c => c.id !== contributionId) });
  };

  const addTask = (planId: string, task: Omit<Task, 'id'>) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) {
      const newTask: Task = { ...task, id: `task-${Date.now()}` };
      updatePlan({ ...plan, tasks: [...plan.tasks, newTask] });
    }
  };

  const updateTask = (planId: string, taskId: string, updates: Partial<Task>) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) updatePlan({ ...plan, tasks: plan.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) });
  };

  const deleteTask = (planId: string, taskId: string) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) updatePlan({ ...plan, tasks: plan.tasks.filter(t => t.id !== taskId) });
  };

  const toggleTaskComplete = (planId: string, taskId: string) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) updatePlan({ ...plan, tasks: plan.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) });
  };

  const addVendorQuote = (planId: string, quote: Omit<VendorQuote, 'id'>) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) {
      const newQuote: VendorQuote = { ...quote, id: `quote-${Date.now()}` };
      updatePlan({ ...plan, vendorQuotes: [...plan.vendorQuotes, newQuote] });
    }
  };

  const deleteVendorQuote = (planId: string, quoteId: string) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) updatePlan({ ...plan, vendorQuotes: plan.vendorQuotes.filter(q => q.id !== quoteId) });
  };

  const addGuest = (planId: string, guest: Omit<Guest, 'id'>) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) {
      const newGuest: Guest = { ...guest, id: `guest-${Date.now()}` };
      updatePlan({ ...plan, guests: [...plan.guests, newGuest] });
    }
  };

  const updateGuest = (planId: string, guestId: string, updates: Partial<Guest>) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) updatePlan({ ...plan, guests: plan.guests.map(g => g.id === guestId ? { ...g, ...updates } : g) });
  };

  const deleteGuest = (planId: string, guestId: string) => {
    const plan = plans.find(p => p.id === planId) || currentPlan;
    if (plan && plan.id === planId) updatePlan({ ...plan, guests: plan.guests.filter(g => g.id !== guestId) });
  };

  return (
    <PlansContext.Provider value={{
      plans, currentPlan, createPlan, savePlan, deletePlan, loadPlan, updatePlan,
      addCategory, addItem, updateItem, deleteItem, toggleItemComplete, toggleCategoryExpand,
      calculateTotal, calculateContributions, finalizePlan,
      addContribution, deleteContribution, addTask, updateTask, deleteTask, toggleTaskComplete,
      addVendorQuote, deleteVendorQuote, addGuest, updateGuest, deleteGuest,
    }}>
      {children}
    </PlansContext.Provider>
  );
}

export function usePlans() {
  const context = useContext(PlansContext);
  if (context === undefined) throw new Error('usePlans must be used within a PlansProvider');
  return context;
}
