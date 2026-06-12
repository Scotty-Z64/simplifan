import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { useLanguage } from '@/context/LanguageContext';
import { generateSmartPackage } from '@/ai/smartPlanner';
import { getCultureEvents } from '@/translations/cultureEvents';
import type { SmartPackage, TierPackage } from '@/ai/smartPlanner';
import type { Language } from '@/types/language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, Wallet, Users, MapPin, Calendar, Sparkles, ChevronRight,
  Star, CheckCircle, Zap, Send, MapPinned, ShoppingCart, Clock,
  TrendingDown, Lightbulb, AlertTriangle
} from 'lucide-react';

type Step = 'event' | 'details' | 'generating' | 'tiers' | 'customize' | 'grocery' | 'timeline' | 'sent';

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

export function ClientWizard() {
  const navigate = useNavigate();
  const { clientUser, createEvent } = useUnified();
  const { language } = useLanguage();
  const cultureEvents = getCultureEvents(language as Language);

  const [step, setStep] = useState<Step>('event');
  const [eventType, setEventType] = useState('');
  const [budget, setBudget] = useState('');
  const [guests, setGuests] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [pkg, setPkg] = useState<SmartPackage | null>(null);
  const [selectedTier, setSelectedTier] = useState<'budget' | 'standard' | 'premium'>('standard');
  const [selectedVendors, setSelectedVendors] = useState<Map<string, number>>(new Map());
  const [loadingMsg, setLoadingMsg] = useState('');

  const selectedEvent = cultureEvents.find(e => e.type === eventType);
  const areas = saAreas[province] || [];

  const handleGenerate = async () => {
    setStep('generating');
    const msgs = [
      `Understanding your ${selectedEvent?.name.toLowerCase()} needs...`,
      `Finding the best vendors in ${area}...`,
      'Comparing 3 tiers with real quotes...',
      'Building your custom event plan...',
    ];
    for (const msg of msgs) { setLoadingMsg(msg); await new Promise(r => setTimeout(r, 900)); }
    const result = generateSmartPackage(eventType as any, parseFloat(budget) || 0, parseInt(guests) || 0, province, area, date);
    setPkg(result);
    const stdTier = result.tiers.find(t => t.tier === 'standard');
    if (stdTier) { setSelectedTier('standard'); setSelectedVendors(new Map(stdTier.selectedOptions)); }
    setStep('tiers');
  };

  const handleSendQuotes = () => {
    if (!pkg) return;
    const tier = pkg.tiers.find(t => t.tier === selectedTier);
    if (!tier) return;
    const items = tier.items.map(item => {
      const optIdx = selectedVendors.get(item.category) ?? 0;
      const opt = item.options[optIdx];
      if (!opt) return null;
      return { id: `qi-${item.category}`, category: item.label, vendorName: opt.vendor.name, vendorId: opt.vendor.id, service: opt.vendor.description, price: opt.price, rating: opt.vendor.rating, status: 'pending' as const, notes: `${item.label} - ${tier.label} tier`, why: opt.why };
    }).filter(Boolean) as any[];
    if (clientUser) {
      createEvent({ clientId: clientUser.id, clientName: clientUser.name, clientPhone: clientUser.phone, eventType: selectedEvent?.name || eventType, budget: parseFloat(budget) || 0, guestCount: parseInt(guests) || 0, province: `${area}, ${province}`, eventDate: date || 'TBD', items, totalCost: calcTierTotal(tier) });
    }
    setStep('sent');
  };

  const calcTierTotal = (tier: TierPackage) => tier.items.reduce((sum, item) => { const idx = selectedVendors.get(item.category) ?? 0; const opt = item.options[idx]; return sum + (opt?.price || 0); }, 0) + (pkg?.groceryList.reduce((s, g) => s + g.estPrice, 0) || 0);
  const currentTotal = pkg ? calcTierTotal(pkg.tiers.find(t => t.tier === selectedTier)!) : 0;

  const handleSelectVendor = (category: string, optionIndex: number) => {
    setSelectedVendors(prev => { const next = new Map(prev); next.set(category, optionIndex); return next; });
  };

  const tierColors = { budget: 'from-emerald-500 to-green-600', standard: 'from-blue-500 to-indigo-600', premium: 'from-amber-500 to-orange-500' };
  const tierBorders = { budget: 'border-emerald-500/40', standard: 'border-blue-500/40', premium: 'border-amber-500/40' };

  // Map event types to our SA imagery
  const eventImages: Record<string, string> = {
    'wedding': '/images/wedding-sa.jpg',
    'white_wedding': '/images/wedding-sa.jpg',
    'traditional_wedding': '/images/hero-sa-celebration.jpg',
    'lobola': '/images/hero-sa-celebration.jpg',
    'birthday': '/images/birthday-sa.jpg',
    'twenty_first': '/images/birthday-sa.jpg',
    'baby_shower': '/images/umemulo-sa.jpg',
    'funeral': '/images/funeral-sa.jpg',
    'memorial': '/images/funeral-sa.jpg',
    'umemulo': '/images/umemulo-sa.jpg',
    'umgidi': '/images/umgidi-sa.jpg',
    'imbeleko': '/images/umemulo-sa.jpg',
    'graduation': '/images/birthday-sa.jpg',
    'housewarming': '/images/birthday-sa.jpg',
    'anniversary': '/images/wedding-sa.jpg',
    'church_event': '/images/hero-sa-celebration.jpg',
  };

  return (
    <div className="min-h-screen" style={{ background: '#E8EDF2' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        {step !== 'event' && (
          <button onClick={() => { if (step === 'details') setStep('event'); else if (step === 'tiers') setStep('details'); else if (step === 'customize') setStep('tiers'); else if (step === 'grocery') setStep('customize'); else if (step === 'timeline') setStep('grocery'); else if (step === 'sent') navigate('/client'); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ArrowLeft className="w-5 h-5" style={{ color: '#64748B' }} /></button>
        )}
        <h1 className="text-lg font-bold flex-1" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>
          {step === 'event' && 'What Event?'}
          {step === 'details' && 'Event Details'}
          {step === 'generating' && 'AI Planning...'}
          {step === 'tiers' && 'Choose Your Tier'}
          {step === 'customize' && 'Pick Your Vendors'}
          {step === 'grocery' && 'Cultural Checklist'}
          {step === 'timeline' && 'Your Timeline'}
          {step === 'sent' && 'All Set!'}
        </h1>
        {step === 'tiers' && pkg && pkg.groceryList.length > 0 && (
          <button onClick={() => setStep('grocery')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ShoppingCart className="w-4 h-4" style={{ color: '#F59E0B' }} /></button>
        )}
        {step === 'customize' && (
          <button onClick={() => setStep('timeline')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Clock className="w-4 h-4" style={{ color: '#2BBCA8' }} /></button>
        )}
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* ─── STEP 1: Event Selection ─── */}
        {step === 'event' && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#2BBCA8' }}>Step 1 of 3</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>What are you planning?</h2>
              <p className="text-sm" style={{ color: '#64748B' }}>Tap your event type. We will match the right vendors with cultural intelligence.</p>
            </div>

            {/* Featured events - large visual cards */}
            <div className="grid grid-cols-2 gap-3">
              {cultureEvents.slice(0, 4).map(evt => (
                <button key={evt.type} onClick={() => { setEventType(evt.type); setStep('details'); }}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl text-left"
                  style={{ boxShadow: '0 4px 20px -5px rgba(0,0,0,0.15)' }}>
                  <div className="aspect-[4/3] relative">
                    <img src={eventImages[evt.type] || '/images/hero-sa-celebration.jpg'} alt={evt.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-white font-bold text-base block">{evt.name}</span>
                      <span className="text-white/60 text-[10px] block">{evt.description}</span>
                    </div>
                    {evt.isTraditional && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                        TRADITIONAL
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* More events - compact list */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] mb-3" style={{ color: '#94A3B8' }}>More Event Types</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cultureEvents.slice(4).map(evt => {
                  const Icon = evt.icon;
                  return (
                    <button key={evt.type} onClick={() => { setEventType(evt.type); setStep('details'); }}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5 text-left"
                      style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${evt.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{evt.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Details ─── */}
        {step === 'details' && selectedEvent && (
          <div className="space-y-5">
            {/* Selected event hero banner */}
            <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 32px -8px rgba(0,0,0,0.15)' }}>
              <div className="aspect-[21/9] relative">
                <img src={eventImages[selectedEvent.type] || '/images/hero-sa-celebration.jpg'} alt={selectedEvent.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedEvent.color} flex items-center justify-center`}>
                    <selectedEvent.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{selectedEvent.name}</p>
                    <p className="text-white/60 text-xs">{selectedEvent.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#1a1a2e' }}>What is your budget?</label>
                <div className="relative"><Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} /><Input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. 20000" className="pl-10 bg-white border-gray-200" style={{ color: '#1a1a2e' }} /></div>
                <div className="flex gap-2 mt-2 flex-wrap">{['5000','15000','30000','50000','100000'].map(b => <button key={b} onClick={() => setBudget(b)} className={`text-[10px] px-3 py-1.5 rounded-lg border transition-all ${budget === b ? 'text-white border-transparent' : 'bg-white hover:bg-gray-50'}`} style={budget === b ? { background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', borderColor: 'transparent' } : { color: '#64748B', borderColor: '#E2E8F0' }}>R{parseInt(b).toLocaleString('en-ZA')}</button>)}</div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#1a1a2e' }}>How many guests?</label>
                <div className="relative"><Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} /><Input type="number" value={guests} onChange={e => setGuests(e.target.value)} placeholder="e.g. 50" className="pl-10 bg-white border-gray-200" style={{ color: '#1a1a2e' }} /></div>
                <div className="flex gap-2 mt-2 flex-wrap">{['20','50','100','200','500'].map(g => <button key={g} onClick={() => setGuests(g)} className={`text-[10px] px-3 py-1.5 rounded-lg border transition-all ${guests === g ? 'text-white border-transparent' : 'bg-white hover:bg-gray-50'}`} style={guests === g ? { background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', borderColor: 'transparent' } : { color: '#64748B', borderColor: '#E2E8F0' }}>{g}</button>)}</div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#1a1a2e' }}>Province</label>
                <select value={province} onChange={e => { setProvince(e.target.value); setArea(''); }} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" style={{ color: '#1a1a2e' }}>{saProvinces.map(p => <option key={p} value={p}>{p}</option>)}</select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#1a1a2e' }}>Area / Township</label>
                <div className="relative"><MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} /><select value={area} onChange={e => setArea(e.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" style={{ color: '#1a1a2e' }}><option value="">Select area</option>{areas.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block" style={{ color: '#1a1a2e' }}>Date</label>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} /><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="pl-10 bg-white border-gray-200" style={{ color: '#1a1a2e' }} /></div>
              </div>
              <Button onClick={handleGenerate} disabled={!budget || !guests || !area} className="w-full text-white rounded-xl py-6 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 15px -3px rgba(43,188,168,0.4)' }}><Zap className="w-5 h-5 mr-2" />Get My 3 Quotes (AI)</Button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Generating ─── */}
        {step === 'generating' && (
          <div className="rounded-2xl p-12 text-center" style={{ background: 'white', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="relative w-16 h-16 mx-auto mb-6"><div className="absolute inset-0 rounded-full border-2" style={{ borderColor: 'rgba(43,188,168,0.15)' }} /><div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin" style={{ borderTopColor: '#2BBCA8' }} /><Sparkles className="absolute inset-0 m-auto w-6 h-6" style={{ color: '#2BBCA8' }} /></div>
            <p className="text-lg font-semibold mb-2" style={{ color: '#1a1a2e' }}>{loadingMsg}</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}>Our AI is finding the best vendors for your event...</p>
          </div>
        )}

        {/* ─── STEP 4: Tier Selection ─── */}
        {step === 'tiers' && pkg && (
          <div className="space-y-4">
            {/* Cultural Notes */}
            {pkg.culturalNotes.length > 0 && (
              <div className="space-y-2">
                {pkg.culturalNotes.filter(n => n.priority === 'essential').map((note, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                    <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#EF4444' }} /><div><p className="text-sm font-semibold" style={{ color: '#DC2626' }}>{note.title}</p><p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{note.content}</p></div></div>
                  </div>
                ))}
              </div>
            )}

            {/* Planner Note */}
            <div className="rounded-xl p-4" style={{ background: '#F0FDFA', border: '1px solid #99F6E4' }}><p className="text-sm leading-relaxed" style={{ color: '#0F766E' }}>{pkg.plannerNote}</p></div>

            {/* Essentials */}
            <div className="flex flex-wrap gap-1">
              {pkg.essentials.map(e => <span key={e} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>{e} · Essential</span>)}
              {pkg.extras.slice(0, 4).map(e => <span key={e} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#F1F5F9', color: '#64748B' }}>{e}</span>)}
            </div>

            {/* Budget */}
            <div className="rounded-xl p-4 flex justify-between text-sm" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}><span style={{ color: '#64748B' }}>Your Budget</span><span className="font-bold" style={{ color: '#1a1a2e' }}>R {pkg.budget.toLocaleString('en-ZA')}</span></div>

            {/* Tier Cards */}
            <p className="text-sm" style={{ color: '#64748B' }}>Pick your tier. Like Uber — same destination, different ride quality.</p>
            <div className="space-y-3">
              {pkg.tiers.map(tier => {
                const isSel = selectedTier === tier.tier;
                const hasOpts = tier.items.some(i => i.options.length > 0);
                if (!hasOpts) return null;
                return (
                  <button key={tier.tier} onClick={() => { setSelectedTier(tier.tier); setSelectedVendors(new Map(tier.selectedOptions)); }} className="w-full rounded-2xl border-2 transition-all text-left overflow-hidden" style={isSel ? { borderColor: tier.tier === 'budget' ? '#10B981' : tier.tier === 'standard' ? '#3B82F6' : '#F59E0B', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)' } : { borderColor: 'transparent', background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.08)' }}>
                    <div className={`p-4 bg-gradient-to-r ${tierColors[tier.tier]}`}>
                      <div className="flex items-center justify-between">
                        <div><p className="text-lg font-bold text-white">{tier.label}</p><p className="text-xs text-white/70">{tier.tagline}</p></div>
                        <div className="text-right"><p className="text-xl font-bold text-white">R{tier.totalCost >= 1000 ? `${(tier.totalCost/1000).toFixed(0)}k` : tier.totalCost}</p><p className="text-[10px] text-white/60">total est.</p></div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {tier.items.filter(i => i.essential && i.options.length > 0).slice(0, 4).map(item => (
                        <div key={item.category} className="flex items-center justify-between text-sm"><span style={{ color: '#64748B' }}>{item.label}</span><div className="flex items-center gap-2"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs" style={{ color: '#475569' }}>{item.options[0].vendor.name}</span><span className="text-xs font-medium" style={{ color: '#2BBCA8' }}>R{item.options[0].price.toLocaleString('en-ZA')}</span></div></div>
                      ))}
                      <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: '#F1F5F9' }}><CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} /><span className="text-xs" style={{ color: '#64748B' }}>{tier.items.filter(i => i.essential).length} essentials · {tier.items.filter(i => !i.essential).length} extras</span></div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Smart Saves */}
            {pkg.smartSaves.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: '#D97706' }}><TrendingDown className="w-4 h-4" />Smart Save Tips</h3>
                <div className="space-y-2">
                  {pkg.smartSaves.slice(0, 3).map(save => (
                    <div key={save.id} className="flex items-center justify-between text-sm"><span className="text-xs" style={{ color: '#64748B' }}>{save.question}</span><span className="text-xs font-medium" style={{ color: '#059669' }}>Save R{save.saving.toLocaleString('en-ZA')}</span></div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={() => setStep('customize')} variant="outline" className="rounded-xl flex-1" style={{ borderColor: '#E2E8F0', color: '#64748B' }}><MapPin className="w-4 h-4 mr-1" />Pick Vendors</Button>
              <Button onClick={() => { const tier = pkg.tiers.find(t => t.tier === selectedTier); if (tier) setSelectedVendors(new Map(tier.selectedOptions)); handleSendQuotes(); }} className="flex-[2] text-white rounded-xl py-5" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}><Send className="w-4 h-4 mr-2" />Send Quotes</Button>
            </div>
          </div>
        )}

        {/* ─── STEP 5: Customize ─── */}
        {step === 'customize' && pkg && (
          <div className="space-y-4">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-white">{selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier · Pick Your Vendors</h3><span className="text-sm text-teal-400 font-bold">R {currentTotal.toLocaleString('en-ZA')}</span></div>
            <div className="space-y-4">
              {(() => { const tier = pkg.tiers.find(t => t.tier === selectedTier)!; return tier.items.map(item => (
                <div key={item.category} className="glass rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className={`px-4 py-2 ${item.essential ? 'bg-red-500/5 border-b border-red-500/10' : 'bg-gray-800/30 border-b border-gray-700/30'}`}>
                    <div className="flex items-center gap-2"><p className="text-sm font-semibold text-white">{item.label}</p>{item.essential && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">Essential</span>}{item.perPerson && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">Per person</span>}</div>
                  </div>
                  <div className="p-3 space-y-2">
                    {item.options.length === 0 && <p className="text-xs text-gray-500 py-2 text-center">No vendors in this area for this category</p>}
                    {item.options.map((opt, idx) => {
                      const isSel = (selectedVendors.get(item.category) ?? 0) === idx;
                      return (
                        <button key={opt.vendor.id} onClick={() => handleSelectVendor(item.category, idx)} className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${isSel ? 'border-teal-500/40 bg-teal-500/5' : 'border-gray-800/50 hover:border-gray-700'}`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSel ? 'border-teal-500 bg-teal-500' : 'border-gray-600'}`}>{isSel && <CheckCircle className="w-3 h-3 text-white" />}</div>
                          <div className="flex-1 min-w-0"><p className="text-sm text-white">{opt.vendor.name}</p><p className="text-[10px] text-gray-500">{opt.why}</p></div>
                          <div className="text-right flex-shrink-0"><p className="text-sm font-bold text-teal-400">R{opt.price.toLocaleString('en-ZA')}</p><div className="flex items-center gap-1 justify-end"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-[10px] text-gray-500">{opt.vendor.rating}</span></div></div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )); })()}
            </div>
            <div className="sticky bottom-4 glass rounded-2xl p-4 border border-teal-500/20">
              <div className="flex items-center justify-between mb-3"><span className="text-sm text-gray-400">Total</span><span className="text-xl font-bold text-white">R {currentTotal.toLocaleString('en-ZA')}</span></div>
              <Button onClick={handleSendQuotes} className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl py-5"><Send className="w-4 h-4 mr-2" />Send Quotes to My Vendors</Button>
            </div>
          </div>
        )}

        {/* ─── STEP 6: Grocery List ─── */}
        {step === 'grocery' && pkg && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-amber-400" />Cultural Checklist</h3>
            <p className="text-xs text-gray-400">These items are traditionally needed for a {pkg.eventName.toLowerCase()}. Check them off as you get them.</p>
            {pkg.groceryList.length > 0 ? (
              <div className="space-y-2">
                {pkg.groceryList.map((item, i) => (
                  <div key={i} className={`glass rounded-xl p-4 border ${item.essential ? 'border-red-500/20' : 'border-gray-700/50'} flex items-center gap-3`}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${item.essential ? 'border-red-500/40' : 'border-gray-600'}`}>
                      {item.essential && <div className="w-2 h-2 rounded-full bg-red-500" />}
                    </div>
                    <div className="flex-1"><p className="text-sm text-white">{item.item}</p><p className="text-[10px] text-gray-500">{item.quantity}</p></div>
                    <span className="text-sm text-teal-400">R{item.estPrice}</span>
                  </div>
                ))}
                <div className="glass rounded-xl p-4 border border-gray-700/50 flex justify-between"><span className="text-sm text-gray-400">Total groceries</span><span className="text-lg font-bold text-white">R {pkg.groceryList.reduce((s, g) => s + g.estPrice, 0).toLocaleString('en-ZA')}</span></div>
              </div>
            ) : <p className="text-sm text-gray-500 text-center py-8">No specific grocery list for this event type.</p>}
            {pkg.culturalNotes.filter(n => n.priority !== 'essential').map((note, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-teal-500/20 bg-teal-500/5">
                <div className="flex items-start gap-2"><Lightbulb className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" /><div><p className="text-sm font-semibold text-teal-400">{note.title}</p><p className="text-xs text-gray-400 mt-1">{note.content}</p></div></div>
              </div>
            ))}
          </div>
        )}

        {/* ─── STEP 7: Timeline ─── */}
        {step === 'timeline' && pkg && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-teal-400" />Your Event Timeline</h3>
            <p className="text-xs text-gray-400">Follow these steps to plan your {pkg.eventName.toLowerCase()} perfectly.</p>
            <div className="relative pl-6 border-l-2 border-gray-800 space-y-6">
              {pkg.timeline.map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[29px] w-4 h-4 rounded-full ${item.essential ? 'bg-red-500' : 'bg-gray-600'} border-4 border-gray-900`} />
                  <div className={`glass rounded-xl p-4 border ${item.essential ? 'border-red-500/20' : 'border-gray-700/50'}`}>
                    <p className="text-xs text-teal-400 font-medium">{item.time}</p>
                    <p className="text-sm font-semibold text-white mt-1">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── STEP 8: Sent ─── */}
        {step === 'sent' && pkg && (
          <div className="space-y-6 text-center pt-4">
            <div className="glass rounded-2xl p-8 border border-emerald-500/30 bg-emerald-500/5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>
              <h2 className="text-2xl font-bold text-white mb-2">Quotes Sent!</h2>
              <p className="text-gray-400">Your {pkg.eventName} plan is in motion. Vendors in {area} will respond within 24 hours.</p>
              <div className="grid grid-cols-3 gap-4 mt-6 max-w-xs mx-auto">
                <div><p className="text-xl font-bold text-teal-400">{pkg.guestCount}</p><p className="text-xs text-gray-500">Guests</p></div>
                <div><p className="text-xl font-bold text-teal-400">R{currentTotal.toLocaleString('en-ZA')}</p><p className="text-xs text-gray-500">Total Est.</p></div>
                <div><p className="text-xl font-bold text-teal-400">{selectedTier}</p><p className="text-xs text-gray-500">Tier</p></div>
              </div>
            </div>
            <div className="space-y-3 text-left">
              {[{icon: Clock, text:'Vendors will respond within 24 hours', color:'text-amber-400'},{icon:Star, text:'Tap "Track My Event" to see vendor responses', color:'text-teal-400'},{icon:Wallet, text:'Pay deposits only after confirming a vendor', color:'text-emerald-400'}].map((item,i) => (
                <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl border border-gray-700/50"><item.icon className={`w-5 h-5 ${item.color}`} /><p className="text-sm text-gray-300">{item.text}</p></div>
              ))}
            </div>
            <Button onClick={() => navigate('/client')} className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl py-5"><ChevronRight className="w-5 h-5 mr-2" />Go to My Events</Button>
          </div>
        )}
      </div>
    </div>
  );
}
