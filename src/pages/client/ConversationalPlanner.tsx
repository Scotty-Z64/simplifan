import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientLayout } from '@/components/ClientLayout';
import { useUnified } from '@/context/UnifiedContext';
import { trpc } from '@/providers/trpc';
import {
  ChevronRight, CheckCircle, Loader2, Calendar,
  MapPin, Users, DollarSign, Sparkles, Phone, User, AlertTriangle
} from 'lucide-react';

const EVENT_TYPES = ['Wedding', 'Funeral', 'Birthday', 'Umgidi/Traditional', 'Baby Shower', 'Lobola', 'Corporate Event', 'Graduation'];
const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Mpumalanga', 'Limpopo', 'North West', 'Northern Cape'];
const GUEST_OPTIONS = ['Under 20', '20-50', '50-100', '100-200', '200-500', '500+'];
const BUDGET_OPTIONS = [
  { label: 'Under R5,000', value: 5000 },
  { label: 'R5,000 - R15,000', value: 15000 },
  { label: 'R15,000 - R30,000', value: 30000 },
  { label: 'R30,000 - R60,000', value: 60000 },
  { label: 'R60,000 - R100,000', value: 100000 },
  { label: 'R100,000+', value: 150000 },
];

export function ConversationalPlanner() {
  const navigate = useNavigate();
  const { clientUser } = useUnified();
  const isLoggedIn = !!clientUser?.phone;

  // API
  const createClient = trpc.spClient.create.useMutation();
  const createEvent = trpc.event.create.useMutation({
    onSuccess: () => navigate('/my-events'),
  });

  const [step, setStep] = useState(0);
  const [creating, setCreating] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [createdEventId, setCreatedEventId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: clientUser?.name ?? '',
    phone: clientUser?.phone ?? '',
    eventType: '',
    province: '',
    city: '',
    eventDate: '',
    guestCount: '',
    budget: 0,
    notes: '',
  });

  const update = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error on input
  };

  // Steps: guest users see Name/Phone first, logged-in users skip it
  const allSteps = isLoggedIn
    ? [
        { title: 'Event Type', icon: Calendar },
        { title: 'Location', icon: MapPin },
        { title: 'Date', icon: Calendar },
        { title: 'Guests', icon: Users },
        { title: 'Budget', icon: DollarSign },
      ]
    : [
        { title: 'Your Details', icon: User },
        { title: 'Event Type', icon: Calendar },
        { title: 'Location', icon: MapPin },
        { title: 'Date', icon: Calendar },
        { title: 'Guests', icon: Users },
        { title: 'Budget', icon: DollarSign },
      ];

  const canNext = () => {
    // Check against the actual step index (0-based in allSteps array)
    // Step 0 = Your Details (guests) or Event Type (logged-in)
    if (step === 0) {
      if (isLoggedIn) return !!form.eventType;
      return form.name.trim().length >= 2 && form.phone.length >= 9;
    }
    if (step === 1) {
      if (isLoggedIn) return !!form.province;
      return !!form.eventType;
    }
    if (step === 2) {
      if (isLoggedIn) return !!form.eventDate;
      return !!form.province;
    }
    if (step === 3) {
      if (isLoggedIn) return !!form.guestCount;
      return !!form.eventDate;
    }
    if (step === 4) {
      if (isLoggedIn) return form.budget > 0;
      return !!form.guestCount;
    }
    if (step === 5) {
      // Only for guests (6 steps)
      return form.budget > 0;
    }
    return false;
  };

  const handleCreate = async () => {
    if (creating) return;
    setCreating(true);
    setError('');

    try {
      // Ensure client exists
      let clientId = 0;
      const phone = form.phone || clientUser?.phone || '';
      const name = form.name || clientUser?.name || 'Guest';

      if (!phone) {
        throw new Error('Please provide a phone number so vendors can contact you.');
      }

      const result = await createClient.mutateAsync({
        name: name,
        phone: phone.replace(/\s/g, ''),
      });
      clientId = result.id as number;

      if (clientId === 0) {
        throw new Error('Failed to create client profile. Please try again.');
      }

      // Save to localStorage for future visits
      if (!isLoggedIn) {
        localStorage.setItem('sp_client_user', JSON.stringify({
          id: String(clientId),
          name: name,
          phone: phone,
          avatar: name.charAt(0).toUpperCase(),
        }));
      }

      // Parse guest count
      const guestNum = form.guestCount.includes('+') ? 500 :
        form.guestCount.includes('-') ? parseInt(form.guestCount.split('-')[1]) :
        parseInt(form.guestCount);

      // Create event
      const eventResult = await createEvent.mutateAsync({
        clientId,
        clientName: name,
        clientPhone: phone,
        eventType: form.eventType,
        eventDate: form.eventDate,
        guestCount: isNaN(guestNum) ? 50 : guestNum,
        province: form.province,
        city: form.city || undefined,
        budget: form.budget,
        notes: form.notes || undefined,
        items: [
          { category: 'Catering' },
          { category: 'Venue' },
          { category: 'Decor' },
          { category: 'Music / DJ' },
        ],
      });

      setCreatedEventId(clientId);
      setDone(true);
    } catch (err: any) {
      console.error('Event creation failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setCreating(false);
    }
  };

  // ─── Done Screen ───
  if (done) {
    return (
      <ClientLayout title="Event Created">
        <div className="max-w-md mx-auto pt-12 text-center px-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: '#ECFDF5', boxShadow: '0 4px 12px -3px rgba(16,185,129,0.2)' }}>
            <CheckCircle className="w-10 h-10" style={{ color: '#10B981' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Plan Created!</h2>
          <p className="text-sm mb-2" style={{ color: '#64748B' }}>Your {form.eventType} plan has been saved.</p>
          <p className="text-sm font-semibold mb-6" style={{ color: '#2BBCA8' }}>We will send you quotes from verified vendors shortly.</p>

          {/* Summary Card */}
          <div className="rounded-2xl p-5 text-left mb-6 space-y-3" style={{ background: 'white', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Event</span><span className="font-semibold" style={{ color: '#1a1a2e' }}>{form.eventType}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Date</span><span className="font-semibold" style={{ color: '#1a1a2e' }}>{form.eventDate}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Guests</span><span className="font-semibold" style={{ color: '#1a1a2e' }}>{form.guestCount}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Location</span><span className="font-semibold" style={{ color: '#1a1a2e' }}>{form.province}{form.city ? `, ${form.city}` : ''}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: '#64748B' }}>Budget</span><span className="font-semibold" style={{ color: '#2BBCA8' }}>R{form.budget.toLocaleString('en-ZA')}</span></div>
          </div>

          <div className="space-y-2">
            <button onClick={() => navigate('/my-events')}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 15px -3px rgba(43,188,168,0.4)' }}>View My Events</button>
            <button onClick={() => navigate('/browse')}
              className="w-full py-3.5 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B' }}>Browse Vendors</button>
            <button onClick={() => { setDone(false); setStep(0); setForm({ name: clientUser?.name ?? '', phone: clientUser?.phone ?? '', eventType: '', province: '', city: '', eventDate: '', guestCount: '', budget: 0, notes: '' }); }}
              className="w-full py-3 rounded-xl text-sm font-medium" style={{ color: '#94A3B8' }}>Plan Another Event</button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Plan Your Event">
      <div className="max-w-lg mx-auto px-4">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6 mt-4">
          {allSteps.map((_step, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={step === i ? { background: '#2BBCA8', color: 'white' } : step > i ? { background: '#10B981', color: 'white' } : { background: '#E2E8F0', color: '#94A3B8' }}>
                {step > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < allSteps.length - 1 && <div className="flex-1 h-0.5 rounded-full" style={{ background: step > i ? '#10B981' : '#E2E8F0' }} />}
            </div>
          ))}
        </div>

        {/* Step Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>{allSteps[step]?.title}</h2>
          <p className="text-xs" style={{ color: '#94A3B8' }}>Step {step + 1} of {allSteps.length}</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 rounded-xl flex items-start gap-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>Something went wrong</p>
              <p className="text-xs" style={{ color: '#991B1B' }}>{error}</p>
            </div>
          </div>
        )}

        {/* ─── Step 0: Your Details (guests only) ─── */}
        {!isLoggedIn && step === 0 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ background: '#F0FDFA', border: '1px solid #A7F3D0' }}>
              <p className="text-sm" style={{ color: '#0F766E' }}>Welcome! Tell us a bit about yourself so vendors can reach you with quotes.</p>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Thabo Mokoena"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="e.g. 082 345 6789"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#94A3B8' }}>Vendors will use this to contact you with quotes.</p>
            </div>
          </div>
        )}

        {/* ─── Step: Event Type ─── */}
        {step === (isLoggedIn ? 0 : 1) && (
          <div className="grid grid-cols-2 gap-3">
            {EVENT_TYPES.map(et => (
              <button key={et} onClick={() => update('eventType', et)}
                className="p-4 rounded-2xl text-sm font-semibold text-center transition-all border hover:-translate-y-0.5"
                style={form.eventType === et ? { background: '#F0FDFA', color: '#2BBCA8', borderColor: '#A7F3D0', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.2)' } : { background: 'white', color: '#64748B', borderColor: '#E2E8F0' }}>
                {et}
              </button>
            ))}
          </div>
        )}

        {/* ─── Step: Location ─── */}
        {step === (isLoggedIn ? 1 : 2) && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: '#475569' }}>Province</label>
              <div className="grid grid-cols-2 gap-2">
                {PROVINCES.map(p => (
                  <button key={p} onClick={() => update('province', p)}
                    className="p-3 rounded-xl text-xs font-semibold text-center transition-all border hover:-translate-y-0.5"
                    style={form.province === p ? { background: '#F0FDFA', color: '#2BBCA8', borderColor: '#A7F3D0' } : { background: 'white', color: '#64748B', borderColor: '#E2E8F0' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>City/Area (optional)</label>
              <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Sandton"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
            </div>
          </div>
        )}

        {/* ─── Step: Date ─── */}
        {step === (isLoggedIn ? 2 : 3) && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Event Date</label>
              <input type="date" value={form.eventDate} onChange={e => update('eventDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Special Requests (optional)</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any special requirements..." rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
            </div>
          </div>
        )}

        {/* ─── Step: Guests ─── */}
        {step === (isLoggedIn ? 3 : 4) && (
          <div className="grid grid-cols-2 gap-3">
            {GUEST_OPTIONS.map(gc => (
              <button key={gc} onClick={() => update('guestCount', gc)}
                className="p-4 rounded-2xl text-sm font-semibold text-center transition-all border hover:-translate-y-0.5"
                style={form.guestCount === gc ? { background: '#F0FDFA', color: '#2BBCA8', borderColor: '#A7F3D0', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.2)' } : { background: 'white', color: '#64748B', borderColor: '#E2E8F0' }}>
                {gc}
              </button>
            ))}
          </div>
        )}

        {/* ─── Step: Budget ─── */}
        {step === (isLoggedIn ? 4 : 5) && (
          <div className="space-y-3">
            <p className="text-sm mb-2" style={{ color: '#64748B' }}>We will find vendors that match your budget tier.</p>
            {BUDGET_OPTIONS.map(b => (
              <button key={b.value} onClick={() => update('budget', b.value)}
                className="w-full p-4 rounded-2xl text-left transition-all border flex items-center justify-between hover:-translate-y-0.5"
                style={form.budget === b.value ? { background: '#F0FDFA', color: '#2BBCA8', borderColor: '#A7F3D0', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.2)' } : { background: 'white', color: '#64748B', borderColor: '#E2E8F0' }}>
                <span className="text-sm font-semibold">{b.label}</span>
                {form.budget === b.value && <CheckCircle className="w-5 h-5" style={{ color: '#2BBCA8' }} />}
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="px-5 py-3.5 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B' }}>Back</button>
          )}
          {step < allSteps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleCreate} disabled={creating || !canNext()}
              className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {creating ? 'Creating...' : 'Create My Plan'}
            </button>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
