import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  Store, ArrowRight, CheckCircle, User, Mail, Phone, MapPin,
  Briefcase, Star, ChevronRight, BadgeCheck, Sparkles
} from 'lucide-react';

type Step = 'account' | 'business' | 'services' | 'done';

const serviceCategories = [
  'Venue', 'Catering', 'Decor', 'Music / DJ', 'Photography',
  'Cake', 'Drinks / Bar', 'Hair & Makeup', 'Transport',
  'Security', 'Equipment Hire', 'Invitations', 'Other'
];

const saProvinces = ['Gauteng','KwaZulu-Natal','Western Cape','Eastern Cape','Mpumalanga','Limpopo','Free State','North West','Northern Cape'];

export function VendorSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('account');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [years, setYears] = useState('');

  // API
  const createVendor = trpc.vendor.create.useMutation({
    onSuccess: () => setStep('done'),
  });

  const toggleService = (s: string) => {
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const canProceed = () => {
    if (step === 'account') return ownerName && email && phone;
    if (step === 'business') return businessName && category && bio && address;
    if (step === 'services') return selectedServices.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createVendor.mutateAsync({
        businessName,
        ownerName,
        email,
        phone,
        category,
        bio,
        province,
        city: city || undefined,
        address,
        priceRange: priceRange || undefined,
        yearsInBusiness: years ? parseInt(years) : undefined,
        services: selectedServices.map(s => ({ name: s })),
      });
    } catch (err) {
      console.error('Vendor creation failed:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Join as Vendor</h1>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#F59E0B' }}>SimpliPlan Business</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {/* Progress */}
        {step !== 'done' && (
          <div className="flex items-center gap-2 mb-8 mt-4">
            {(['account','business','services'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? 'text-white' : ['account','business','services'].indexOf(step) > i ? 'text-white' : ''
                }`} style={step === s ? { background: '#F59E0B' } : ['account','business','services'].indexOf(step) > i ? { background: '#10B981' } : { background: '#E2E8F0', color: '#94A3B8' }}>
                  {['account','business','services'].indexOf(step) > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                {i < 2 && <div className="flex-1 h-0.5 rounded-full" style={{ background: ['account','business','services'].indexOf(step) > i ? '#10B981' : '#E2E8F0' }} />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Account */}
        {step === 'account' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: '#1a1a2e' }}>Your Details</h2>
              <p className="text-sm" style={{ color: '#94A3B8' }}>Tell us about yourself first</p>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Full Name</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <User className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                <input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Your full name"
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <Mail className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@business.co.za"
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Phone / WhatsApp</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <Phone className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="082 345 6789"
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
              </div>
            </div>
            <button onClick={() => setStep('business')} disabled={!canProceed()}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 12px -3px rgba(245,158,11,0.3)' }}>
              Next: Business Info <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Business */}
        {step === 'business' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: '#1a1a2e' }}>Business Details</h2>
              <p className="text-sm" style={{ color: '#94A3B8' }}>Tell clients about your business</p>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Business Name</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <Store className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Royal Events SA"
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Primary Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }}>
                <option value="">Select your main service</option>
                {serviceCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>About Your Business</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                placeholder="Describe what makes your business special..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Province</label>
                <select value={province} onChange={e => setProvince(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }}>
                  {saProvinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>City</label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Sandton"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Business Address</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <MapPin className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Rivonia Road, Sandton"
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Price Range</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                  <Briefcase className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                  <input value={priceRange} onChange={e => setPriceRange(e.target.value)} placeholder="e.g. R5k - R20k"
                    className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Years in Business</label>
                <input value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 5"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('account')}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}>Back</button>
              <button onClick={() => setStep('services')} disabled={!canProceed()}
                className="flex-[2] py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 12px -3px rgba(245,158,11,0.3)' }}>
                Next: Services <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Services */}
        {step === 'services' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: '#1a1a2e' }}>Your Services</h2>
              <p className="text-sm" style={{ color: '#94A3B8' }}>Select all the services you offer</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {serviceCategories.map(s => {
                const isSelected = selectedServices.includes(s);
                return (
                  <button key={s} onClick={() => toggleService(s)}
                    className="p-3 rounded-xl border text-left transition-all"
                    style={isSelected ? { background: '#FFFBEB', borderColor: '#FDE68A', color: '#1a1a2e' } : { background: 'white', borderColor: '#E2E8F0', color: '#64748B' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border flex items-center justify-center"
                        style={{ borderColor: isSelected ? '#F59E0B' : '#CBD5E1', background: isSelected ? '#F59E0B' : 'transparent' }}>
                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-xs font-medium">{s}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('business')}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}>Back</button>
              <button onClick={handleSubmit} disabled={!canProceed() || isSubmitting}
                className="flex-[2] py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 12px -3px rgba(245,158,11,0.3)' }}>
                {isSubmitting ? <><Sparkles className="w-4 h-4 animate-spin" />Creating...</> : <><BadgeCheck className="w-4 h-4" />Complete Signup</>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Done */}
        {step === 'done' && (
          <div className="space-y-6 text-center pt-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 8px 20px -4px rgba(16,185,129,0.3)' }}>
              <BadgeCheck className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Welcome to SimpliPlan!</h2>
              <p className="text-sm" style={{ color: '#64748B' }}>Your vendor profile has been created. You can start receiving quote requests immediately.</p>
            </div>
            <div className="rounded-2xl p-5 text-left space-y-3" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>What happens next?</h3>
              {[
                { icon: CheckCircle, text: 'Profile is live and searchable', color: '#10B981' },
                { icon: Sparkles, text: 'Add your products & services', color: '#F59E0B' },
                { icon: Star, text: 'Start receiving quote requests', color: '#2BBCA8' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  <p className="text-sm" style={{ color: '#475569' }}>{item.text}</p>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/vendor-login')}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 12px -3px rgba(245,158,11,0.3)' }}>
              <ChevronRight className="w-5 h-5" /> Go to Vendor Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
