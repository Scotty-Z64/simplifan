import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSmartPackage } from '@/ai/smartPlanner';
import { getCultureEvents } from '@/translations/cultureEvents';
import type { SmartPackage } from '@/ai/smartPlanner';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EventType } from '@/types';
import type { Language } from '@/types/language';
import {
  Sparkles, ArrowLeft, Wallet, Users, MapPin, Calendar,
  ChevronRight, Zap
} from 'lucide-react';

type Step = 'event' | 'budget' | 'generating' | 'result';

const saProvinces = ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Mpumalanga', 'Limpopo', 'Free State', 'North West', 'Northern Cape'];

export function ConciergePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>('event');
  const [eventType, setEventType] = useState<EventType>('birthday');
  const [budget, setBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [loadingText, setLoadingText] = useState('');
  const [pkg, setPkg] = useState<SmartPackage | null>(null);
  const [selectedTier, setSelectedTier] = useState<'budget' | 'standard' | 'premium'>('standard');

  const cultureEvents = getCultureEvents(language as Language);

  const handleGenerate = async () => {
    setStep('generating');
    const messages = [
      'Analyzing your event needs...',
      'Finding vendors in your area...',
      'Comparing 3 tiers...',
      'Building your custom plan...',
    ];
    for (let i = 0; i < messages.length; i++) {
      setLoadingText(messages[i]);
      await new Promise(r => setTimeout(r, 800));
    }
    const generated = generateSmartPackage(
      eventType, parseFloat(budget) || 0, parseInt(guestCount) || 0, province, 'Johannesburg', ''
    );
    setPkg(generated);
    setStep('result');
  };

  const selectedEventName = cultureEvents.find(e => e.type === eventType)?.name || eventType;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* STEP: Event Selection */}
        {step === 'event' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">What event are you planning?</h2>
            <p className="text-gray-400 mb-6">Choose your event type to get tailored vendor recommendations.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cultureEvents.map(evt => {
                const Icon = evt.icon;
                return (
                  <button key={evt.type} onClick={() => { setEventType(evt.type); setStep('budget'); }}
                    className="glass rounded-xl p-4 border border-gray-700/50 hover:border-teal-500/30 transition-all text-left group">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${evt.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-white">{evt.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP: Budget & Details */}
        {step === 'budget' && (
          <div className="glass rounded-2xl p-6 border border-gray-700/50 space-y-5">
            <h2 className="text-xl font-bold text-white">{selectedEventName} Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block flex items-center gap-2"><Wallet className="w-4 h-4" />Budget (R)</label>
                <Input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. 20000" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block flex items-center gap-2"><Users className="w-4 h-4" />Guests</label>
                <Input type="number" value={guestCount} onChange={e => setGuestCount(e.target.value)} placeholder="e.g. 50" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block flex items-center gap-2"><MapPin className="w-4 h-4" />Province</label>
                <select value={province} onChange={e => setProvince(e.target.value)} className="w-full p-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg">
                  {saProvinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block flex items-center gap-2"><Calendar className="w-4 h-4" />Date</label>
                <Input type="date" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={!budget || !guestCount} className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl py-5 disabled:opacity-50">
              <Zap className="w-5 h-5 mr-2" /> Get 3 Quotes (AI)
            </Button>
          </div>
        )}

        {/* STEP: Generating */}
        {step === 'generating' && (
          <div className="text-center py-20">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-teal-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-t-teal-500 animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-teal-400" />
            </div>
            <p className="text-lg text-white">{loadingText}</p>
          </div>
        )}

        {/* STEP: Result - Tier Selection */}
        {step === 'result' && pkg && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Your {selectedEventName} Plan</h2>
              <p className="text-gray-400 text-sm">{pkg.plannerNote}</p>
            </div>

            {/* Essentials & Extras */}
            <div className="flex flex-wrap gap-1">
              {pkg.essentials.map(e => (
                <span key={e} className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">{e} · Essential</span>
              ))}
              {pkg.extras.slice(0, 4).map(e => (
                <span key={e} className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">{e}</span>
              ))}
            </div>

            {/* Tier Cards */}
            <div className="space-y-4">
              {pkg.tiers.map(tier => {
                if (!tier.items.some(i => i.options.length > 0)) return null;
                const isSelected = selectedTier === tier.tier;
                const tierColors = { budget: 'from-emerald-500 to-green-600', standard: 'from-blue-500 to-indigo-600', premium: 'from-amber-500 to-orange-500' };
                return (
                  <button key={tier.tier} onClick={() => setSelectedTier(tier.tier)}
                    className={`w-full glass rounded-2xl border-2 transition-all text-left overflow-hidden ${isSelected ? 'border-teal-500/40' : 'border-gray-800/50'}`}>
                    <div className={`p-4 bg-gradient-to-r ${tierColors[tier.tier]}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-white">{tier.label}</p>
                          <p className="text-xs text-white/70">{tier.tagline}</p>
                        </div>
                        <p className="text-xl font-bold text-white">R{tier.totalCost >= 1000 ? `${(tier.totalCost/1000).toFixed(0)}k` : tier.totalCost}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {tier.items.filter(i => i.essential && i.options.length > 0).slice(0, 5).map(item => (
                        <div key={item.category} className="flex justify-between text-sm">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-gray-300">{item.options[0].vendor.name} <span className="text-teal-400">R{item.options[0].price.toLocaleString('en-ZA')}</span></span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl py-5">
              <ChevronRight className="w-5 h-5 mr-2" /> Continue with {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
