import { useState, useMemo } from 'react';
import { Utensils, Users, Calculator, Beef, Leaf, Droplets, Coffee, Cake } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CateringResult {
  item: string;
  quantity: string;
  icon: React.ReactNode;
  category: string;
}

export function CateringCalculator() {
  const [guests, setGuests] = useState(100);
  const [eventType, setEventType] = useState<'formal' | 'casual' | 'braai' | 'traditional'>('formal');
  const [dietary, setDietary] = useState({ vegetarian: false, halaal: false, kosher: false });
  const [duration, setDuration] = useState(5);

  const results = useMemo<CateringResult[]>(() => {
    const mult = guests / 100;
    const items: CateringResult[] = [];

    if (eventType === 'braai') {
      items.push(
        { item: 'Beef Boerewors', quantity: `${Math.ceil(3 * mult)} kg (${Math.ceil(3 * mult * 4)} rolls)`, icon: <Beef className="w-4 h-4 text-red-400" />, category: 'Meat' },
        { item: 'Lamb Chops', quantity: `${Math.ceil(2.5 * mult)} kg`, icon: <Beef className="w-4 h-4 text-red-400" />, category: 'Meat' },
        { item: 'Chicken Braai Packs', quantity: `${Math.ceil(20 * mult)} pieces`, icon: <Beef className="w-4 h-4 text-amber-400" />, category: 'Meat' },
        { item: 'Pap & Sheba', quantity: `${Math.ceil(10 * mult)} kg pap + sheba`, icon: <Utensils className="w-4 h-4 text-yellow-400" />, category: 'Starch' },
        { item: 'Chakalaka', quantity: `${Math.ceil(5 * mult)} kg`, icon: <Leaf className="w-4 h-4 text-green-400" />, category: 'Sides' },
        { item: 'Green Salad', quantity: `${Math.ceil(8 * mult)} kg`, icon: <Leaf className="w-4 h-4 text-green-400" />, category: 'Sides' },
        { item: 'Potato Salad', quantity: `${Math.ceil(8 * mult)} kg`, icon: <Utensils className="w-4 h-4 text-yellow-400" />, category: 'Sides' },
        { item: 'Garlic Bread', quantity: `${Math.ceil(4 * mult)} loaves`, icon: <Utensils className="w-4 h-4 text-amber-400" />, category: 'Starch' },
      );
    } else if (eventType === 'traditional') {
      items.push(
        { item: 'Umqombothi (Traditional Beer)', quantity: `${Math.ceil(20 * mult)} L`, icon: <Droplets className="w-4 h-4 text-amber-400" />, category: 'Beverages' },
        { item: 'Beef Stew (Isitambu)', quantity: `${Math.ceil(15 * mult)} kg`, icon: <Beef className="w-4 h-4 text-red-400" />, category: 'Main' },
        { item: ' samp & Beans', quantity: `${Math.ceil(12 * mult)} kg`, icon: <Utensils className="w-4 h-4 text-yellow-400" />, category: 'Starch' },
        { item: 'Steamed Bread (Dombolo)', quantity: `${Math.ceil(8 * mult)} loaves`, icon: <Utensils className="w-4 h-4 text-amber-400" />, category: 'Starch' },
        { item: 'Roasted Chicken', quantity: `${Math.ceil(15 * mult)} birds`, icon: <Beef className="w-4 h-4 text-amber-400" />, category: 'Main' },
        { item: 'Spinach (Imifino)', quantity: `${Math.ceil(6 * mult)} kg`, icon: <Leaf className="w-4 h-4 text-green-400" />, category: 'Veg' },
        { item: 'Butternut & Pumpkin', quantity: `${Math.ceil(8 * mult)} kg`, icon: <Leaf className="w-4 h-4 text-orange-400" />, category: 'Veg' },
        { item: 'Rice', quantity: `${Math.ceil(10 * mult)} kg`, icon: <Utensils className="w-4 h-4 text-yellow-400" />, category: 'Starch' },
        { item: 'Fruitcake / Traditional Cake', quantity: `${Math.ceil(2 * mult)} cakes`, icon: <Cake className="w-4 h-4 text-pink-400" />, category: 'Dessert' },
      );
    } else if (eventType === 'formal') {
      items.push(
        { item: 'Starter (Canapes)', quantity: `${Math.ceil(6 * guests)} pieces`, icon: <Utensils className="w-4 h-4 text-teal-400" />, category: 'Starter' },
        { item: 'Chicken/Beef Main', quantity: `${Math.ceil(180 * mult)} portions`, icon: <Beef className="w-4 h-4 text-red-400" />, category: 'Main' },
        { item: 'Rice / Pasta', quantity: `${Math.ceil(12 * mult)} kg`, icon: <Utensils className="w-4 h-4 text-yellow-400" />, category: 'Starch' },
        { item: 'Seasonal Vegetables', quantity: `${Math.ceil(10 * mult)} kg`, icon: <Leaf className="w-4 h-4 text-green-400" />, category: 'Veg' },
        { item: 'Dinner Rolls', quantity: `${Math.ceil(3 * guests)} rolls`, icon: <Utensils className="w-4 h-4 text-amber-400" />, category: 'Bread' },
        { item: 'Wedding/Event Cake', quantity: `${Math.ceil(3 * mult)} tier cake`, icon: <Cake className="w-4 h-4 text-pink-400" />, category: 'Dessert' },
        { item: 'Dessert Platters', quantity: `${Math.ceil(6 * mult)} platters`, icon: <Cake className="w-4 h-4 text-pink-400" />, category: 'Dessert' },
      );
    } else {
      // Casual
      items.push(
        { item: 'Finger Foods / Platters', quantity: `${Math.ceil(10 * mult)} platters`, icon: <Utensils className="w-4 h-4 text-teal-400" />, category: 'Snacks' },
        { item: 'Mini Burgers / Sliders', quantity: `${Math.ceil(3 * guests)} pieces`, icon: <Beef className="w-4 h-4 text-red-400" />, category: 'Main' },
        { item: 'Chips & Dips', quantity: `${Math.ceil(8 * mult)} kg chips + dips`, icon: <Utensils className="w-4 h-4 text-yellow-400" />, category: 'Snacks' },
        { item: 'Chicken Wings', quantity: `${Math.ceil(4 * mult)} kg`, icon: <Beef className="w-4 h-4 text-amber-400" />, category: 'Main' },
        { item: 'Pizza (Large)', quantity: `${Math.ceil(8 * mult)} pizzas`, icon: <Utensils className="w-4 h-4 text-orange-400" />, category: 'Main' },
        { item: 'Fruit Platter', quantity: `${Math.ceil(4 * mult)} platters`, icon: <Leaf className="w-4 h-4 text-green-400" />, category: 'Sides' },
      );
    }

    // Beverages for all types
    const drinksMultiplier = duration / 5;
    items.push(
      { item: 'Soft Drinks (2L)', quantity: `${Math.ceil(15 * mult * drinksMultiplier)} bottles`, icon: <Droplets className="w-4 h-4 text-blue-400" />, category: 'Drinks' },
      { item: 'Water (500ml)', quantity: `${Math.ceil(2 * guests * drinksMultiplier)} bottles`, icon: <Droplets className="w-4 h-4 text-cyan-400" />, category: 'Drinks' },
      { item: 'Juice (1L)', quantity: `${Math.ceil(10 * mult * drinksMultiplier)} cartons`, icon: <Coffee className="w-4 h-4 text-orange-400" />, category: 'Drinks' },
    );

    if (dietary.vegetarian) {
      items.push(
        { item: 'Veggie Burger / Plant-Based', quantity: `${Math.ceil(0.15 * guests)} portions`, icon: <Leaf className="w-4 h-4 text-green-400" />, category: 'Vegetarian' },
        { item: 'Garden Salad (Extra)', quantity: `${Math.ceil(5 * mult)} kg`, icon: <Leaf className="w-4 h-4 text-green-400" />, category: 'Vegetarian' },
      );
    }

    if (dietary.halaal) {
      items.push({ item: 'Halaal Certified Meat', quantity: 'All meat must be Halaal certified', icon: <Check className="w-4 h-4 text-emerald-400" />, category: 'Halaal' });
    }

    return items;
  }, [guests, eventType, dietary, duration]);

  // Estimate costs
  const estimatedCost = useMemo(() => {
    const basePerPerson = eventType === 'formal' ? 450 : eventType === 'traditional' ? 180 : eventType === 'braai' ? 220 : 150;
    return basePerPerson * guests;
  }, [guests, eventType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Smart Catering Calculator</h3>
            <p className="text-sm text-gray-400">Calculate exact food & drink quantities for your event</p>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="glass rounded-2xl p-5 border border-gray-700/50 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Number of Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input type="number" value={guests} onChange={e => setGuests(Math.max(1, parseInt(e.target.value) || 0))}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Event Duration (hours)</label>
            <Input type="number" value={duration} onChange={e => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-gray-800/50 border-gray-700 text-white" />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-2 block">Event Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: 'formal', label: 'Formal/Sit-down', desc: 'Weddings, galas' },
              { key: 'braai', label: 'Braai/Shisa Nyama', desc: 'Casual gathering' },
              { key: 'traditional', label: 'Traditional', desc: 'Umemulo, lobola' },
              { key: 'casual', label: 'Casual/Finger Foods', desc: 'Birthday, shower' },
            ].map(opt => (
              <button key={opt.key} onClick={() => setEventType(opt.key as any)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  eventType === opt.key ? 'bg-orange-500/10 border-orange-500/30' : 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600'
                }`}>
                <p className={`text-sm font-semibold ${eventType === opt.key ? 'text-orange-400' : 'text-white'}`}>{opt.label}</p>
                <p className="text-[10px] text-gray-500">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-2 block">Dietary Requirements</label>
          <div className="flex gap-3">
            {[
              { key: 'vegetarian', label: 'Vegetarian Options' },
              { key: 'halaal', label: 'Halaal' },
              { key: 'kosher', label: 'Kosher' },
            ].map(opt => (
              <button key={opt.key}
                onClick={() => setDietary(prev => ({ ...prev, [opt.key]: !prev[opt.key as keyof typeof dietary] }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${
                  dietary[opt.key as keyof typeof dietary]
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-gray-800/30 border-gray-700/30 text-gray-400'
                }`}>
                {dietary[opt.key as keyof typeof dietary] ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-600" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="glass rounded-2xl p-5 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-teal-400" />
            <div>
              <p className="text-sm text-gray-400">Estimated Catering Cost</p>
              <p className="text-xs text-gray-500">Based on {guests} guests, {eventType} style</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-teal-400">R {estimatedCost.toLocaleString('en-ZA')}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">This is an estimate. Actual costs vary by caterer and location. Contact vendors in the Marketplace for quotes.</p>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Utensils className="w-4 h-4 text-orange-400" /> Recommended Quantities
        </h4>
        {results.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl border border-gray-700/50">
            <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{item.item}</p>
            </div>
            <span className="text-sm font-semibold text-teal-400 whitespace-nowrap">{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
