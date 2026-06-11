import { useState } from 'react';
import { usePlans } from '@/context/PlansContext';
import { MapPin, Info } from 'lucide-react';

interface Props {
  planId: string;
}

const priceData: Record<string, Array<{
  item: string;
  low: number;
  mid: number;
  high: number;
  unit: string;
  note?: string;
}>> = {
  'Gauteng': [
    { item: 'Venue Hire (Community Hall)', low: 3000, mid: 8000, high: 15000, unit: 'per day', note: 'Soweto/ townships' },
    { item: 'Venue Hire (Premium)', low: 15000, mid: 35000, high: 80000, unit: 'per day', note: 'Sandton/ Rosebank' },
    { item: 'Catering (per person)', low: 120, mid: 250, high: 450, unit: 'per person', note: 'Traditional to premium' },
    { item: 'Wedding Dress', low: 3000, mid: 8000, high: 20000, unit: 'each', note: 'Ready-made to designer' },
    { item: 'Photography Package', low: 3500, mid: 8000, high: 18000, unit: 'package', note: 'Basic to full day' },
    { item: 'Sound System / DJ', low: 2000, mid: 4500, high: 9000, unit: 'per day', note: 'Basic PA to premium' },
    { item: 'Transport (Shuttle)', low: 1500, mid: 3000, high: 6000, unit: 'per vehicle', note: 'Minibus to luxury' },
    { item: 'Decor & Flowers', low: 2500, mid: 7000, high: 15000, unit: 'package', note: 'Basic to elaborate' },
    { item: 'Coffin (Funeral)', low: 3000, mid: 8000, high: 25000, unit: 'each', note: 'Basic to premium' },
    { item: 'Tombstone', low: 5000, mid: 15000, high: 50000, unit: 'each', note: 'Basic to elaborate' },
  ],
  'Western Cape': [
    { item: 'Venue Hire (Community Hall)', low: 2500, mid: 7000, high: 12000, unit: 'per day', note: 'Township areas' },
    { item: 'Venue Hire (Premium)', low: 20000, mid: 45000, high: 100000, unit: 'per day', note: 'Cape Town central/ Winelands' },
    { item: 'Catering (per person)', low: 150, mid: 300, high: 550, unit: 'per person', note: 'Coastal premium options' },
    { item: 'Wedding Dress', low: 4000, mid: 10000, high: 25000, unit: 'each', note: 'Cape Town designers' },
    { item: 'Photography Package', low: 4500, mid: 10000, high: 22000, unit: 'package', note: 'Scenic venues cost more' },
    { item: 'Sound System / DJ', low: 2500, mid: 5000, high: 10000, unit: 'per day', note: 'High demand in summer' },
    { item: 'Transport (Shuttle)', low: 1800, mid: 3500, high: 7000, unit: 'per vehicle', note: 'Wine tour routes' },
    { item: 'Decor & Flowers', low: 3000, mid: 8000, high: 18000, unit: 'package', note: 'Protea arrangements popular' },
  ],
  'KwaZulu-Natal': [
    { item: 'Venue Hire (Community Hall)', low: 2000, mid: 6000, high: 10000, unit: 'per day', note: 'Township/ rural areas' },
    { item: 'Venue Hire (Premium)', low: 12000, mid: 30000, high: 70000, unit: 'per day', note: 'Durban/ Umhlanga' },
    { item: 'Catering (per person)', low: 100, mid: 200, high: 400, unit: 'per person', note: 'Traditional Zulu cuisine' },
    { item: 'Traditional Attire (uMemulo)', low: 2000, mid: 5000, high: 12000, unit: 'outfit', note: 'Beads, skirts, accessories' },
    { item: 'Photography Package', low: 3000, mid: 7000, high: 15000, unit: 'package', note: 'Coastal venues' },
    { item: 'Sound System / DJ', low: 1800, mid: 4000, high: 8000, unit: 'per day', note: 'Maskandi/ traditional music' },
    { item: 'Decor & Flowers', low: 2000, mid: 6000, high: 14000, unit: 'package', note: 'Tropical arrangements' },
  ],
  'Eastern Cape': [
    { item: 'Venue Hire (Community Hall)', low: 1500, mid: 4000, high: 8000, unit: 'per day', note: 'Rural areas' },
    { item: 'Venue Hire (Town)', low: 5000, mid: 12000, high: 25000, unit: 'per day', note: 'PE/ East London' },
    { item: 'Catering (per person)', low: 80, mid: 180, high: 350, unit: 'per person', note: 'Traditional Xhosa cuisine' },
    { item: 'Traditional Attire', low: 1500, mid: 4000, high: 10000, unit: 'outfit', note: 'Umbhaco/ traditional wear' },
    { item: 'Photography Package', low: 2500, mid: 6000, high: 12000, unit: 'package', note: 'Coastal venues' },
    { item: 'Sound System / DJ', low: 1500, mid: 3500, high: 7000, unit: 'per day', note: 'Traditional music included' },
    { item: 'Transport (Funeral)', low: 2000, mid: 4500, high: 8000, unit: 'package', note: 'Hearse + family cars' },
  ],
  'Other Provinces': [
    { item: 'Venue Hire', low: 1500, mid: 5000, high: 12000, unit: 'per day', note: 'Free State/ Limpopo/ etc.' },
    { item: 'Catering (per person)', low: 80, mid: 200, high: 400, unit: 'per person', note: 'Varies by region' },
    { item: 'Photography Package', low: 2500, mid: 6000, high: 14000, unit: 'package', note: 'Travel costs may apply' },
    { item: 'Sound System / DJ', low: 1500, mid: 3500, high: 7500, unit: 'per day', note: 'Rural areas may cost more' },
    { item: 'Transport', low: 1200, mid: 3000, high: 6000, unit: 'per vehicle', note: 'Longer distances' },
  ],
};

const provinceFromLocation = (location: string): string => {
  if (!location) return 'Gauteng';
  const loc = location.toLowerCase();
  if (loc.includes('johannesburg') || loc.includes('pretoria') || loc.includes('sandton') || loc.includes('soweto') || loc.includes('durban') && loc.includes('gauteng')) return 'Gauteng';
  if (loc.includes('cape town') || loc.includes('stellenbosch') || loc.includes('paarl') || loc.includes('western cape')) return 'Western Cape';
  if (loc.includes('durban') || loc.includes('pietermaritzburg') || loc.includes('kwazulu') || loc.includes('kzn')) return 'KwaZulu-Natal';
  if (loc.includes('port elizabeth') || loc.includes('east london') || loc.includes('eastern cape') || loc.includes('mthatha')) return 'Eastern Cape';
  return 'Other Provinces';
};

export function PriceEstimator({ planId: _planId }: Props) {
  const { currentPlan } = usePlans();
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  if (!currentPlan) return null;

  const province = selectedProvince || provinceFromLocation(currentPlan.location || '');
  const prices = priceData[province] || priceData['Gauteng'];

  const provinces = Object.keys(priceData);

  return (
    <div className="space-y-4">
      {/* Province Selector */}
      <div>
        <label className="text-sm font-medium text-gray-300 flex items-center gap-1 mb-2">
          <MapPin className="w-4 h-4 text-teal-500" />
          Select Province
        </label>
        <select
          value={province}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800/50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {provinces.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {currentPlan.location && (
          <p className="text-xs text-gray-500 mt-1">
            Auto-detected from: {currentPlan.location}
          </p>
        )}
      </div>

      {/* Seasonal Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-700">
          <p className="font-medium">December Pricing Alert</p>
          <p>Prices may be 20-40% higher during peak season (Dec-Jan). Book early for better rates.</p>
        </div>
      </div>

      {/* Price Table */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {prices.map((item, index) => (
          <div key={index} className="p-3 glass border-gray-700/50 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.item}</p>
                {item.note && (
                  <p className="text-xs text-gray-500">{item.note}</p>
                )}
              </div>
              <span className="text-xs text-gray-500 ml-2">{item.unit}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="text-center p-2 bg-emerald-500/10 rounded">
                <p className="text-xs text-gray-500">Budget</p>
                <p className="text-sm font-bold text-green-700">R {item.low.toLocaleString()}</p>
              </div>
              <div className="text-center p-2 bg-amber-50 rounded">
                <p className="text-xs text-gray-500">Standard</p>
                <p className="text-sm font-bold text-amber-700">R {item.mid.toLocaleString()}</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <p className="text-xs text-gray-500">Premium</p>
                <p className="text-sm font-bold text-purple-700">R {item.high.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center">
        Prices are estimates based on 2025 South African market data. Actual prices may vary.
      </p>
    </div>
  );
}
