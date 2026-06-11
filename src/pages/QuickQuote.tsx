import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import {
  ChevronLeft, Send, CheckCircle, Phone, User,
  Calendar, MapPin, MessageSquare, Loader2
} from 'lucide-react';

const EVENT_TYPES = ['Wedding', 'Funeral', 'Birthday', 'Umgidi/Traditional', 'Baby Shower', 'Lobola', 'Corporate Event', 'Graduation'];
const GUEST_COUNTS = ['Under 20', '20-50', '50-100', '100-200', '200-500', '500+'];
const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Mpumalanga', 'Limpopo', 'North West', 'Northern Cape'];

interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  province: string;
  notes: string;
  vendorId?: string;
  status: 'submitted' | 'sent_to_vendors' | 'quotes_received' | 'booked';
  submittedAt: string;
}

function saveQuoteRequest(req: QuoteRequest) {
  const existing = JSON.parse(localStorage.getItem('sp_quote_requests') || '[]');
  existing.push(req);
  localStorage.setItem('sp_quote_requests', JSON.stringify(existing));
}

export function QuickQuote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedVendor = searchParams.get('vendor');
  const { vendors } = useUnified();

  const preVendor = preSelectedVendor ? vendors.find(v => v.id === preSelectedVendor) : null;

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({ name: '', phone: '', eventType: '', eventDate: '', guestCount: '', province: '', notes: '' });
  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));
  const canSubmit = form.name && form.phone && form.eventType && form.eventDate && form.guestCount && form.province;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSending(true);
    const request: QuoteRequest = { id: 'qq_' + Date.now().toString(36), ...form, vendorId: preSelectedVendor || undefined, status: 'submitted', submittedAt: new Date().toISOString() };
    saveQuoteRequest(request);
    const conversions = JSON.parse(localStorage.getItem('sp_conversions') || '[]');
    conversions.push({ id: 'conv_' + Date.now(), stage: 'quote_request', source: preVendor ? 'vendor_page' : 'quick_quote', vendorId: preSelectedVendor, timestamp: new Date().toISOString(), userPhone: form.phone });
    localStorage.setItem('sp_conversions', JSON.stringify(conversions));
    setTimeout(() => { setSending(false); setSubmitted(true); }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F1F5F9' }}>
        <div className="rounded-2xl p-8 max-w-md w-full text-center" style={{ background: 'white', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#ECFDF5', boxShadow: '0 4px 12px -3px rgba(16,185,129,0.2)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#10B981' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Quote Request Sent!</h2>
          <p className="text-sm mb-2" style={{ color: '#64748B' }}>Hi {form.name}, we've sent your request to verified vendors in {form.province}.</p>
          <p className="text-sm font-semibold mb-6" style={{ color: '#2BBCA8' }}>You'll receive quotes via WhatsApp within 24 hours.</p>
          <div className="rounded-xl p-4 mb-6 text-left space-y-2" style={{ background: '#F8FAFC' }}>
            <p className="text-xs" style={{ color: '#94A3B8' }}><strong style={{ color: '#1a1a2e' }}>Event:</strong> {form.eventType}</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}><strong style={{ color: '#1a1a2e' }}>Date:</strong> {form.eventDate}</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}><strong style={{ color: '#1a1a2e' }}>Guests:</strong> {form.guestCount}</p>
            <p className="text-xs" style={{ color: '#94A3B8' }}><strong style={{ color: '#1a1a2e' }}>Phone:</strong> {form.phone}</p>
          </div>
          <div className="space-y-2">
            <button onClick={() => navigate('/browse')}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>Browse More Vendors</button>
            <button onClick={() => navigate('/')}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all" style={{ background: '#F1F5F9', color: '#64748B' }}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>Get a Quote</h1>
          <p className="text-[10px]" style={{ color: '#94A3B8' }}>No signup needed — just your phone number</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Progress */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map(s => (
            <div key={s} className="h-1.5 flex-1 rounded-full transition-all" style={{ background: s <= step ? '#2BBCA8' : '#E2E8F0' }} />
          ))}
        </div>

        {/* Pre-selected vendor */}
        {preVendor && (
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: '#F0FDFA', border: '1px solid #A7F3D0' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
              {preVendor.avatar || preVendor.businessName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{preVendor.businessName}</p>
              <p className="text-[10px] font-semibold" style={{ color: '#2BBCA8' }}>Requesting quote from this vendor</p>
            </div>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Your Details</h2>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Your Name</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <User className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                <input type="text" placeholder="e.g. Thabo" value={form.name} onChange={e => update('name', e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>WhatsApp / Phone Number</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <Phone className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                <input type="tel" placeholder="e.g. 082 123 4567" value={form.phone} onChange={e => update('phone', e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#94A3B8' }}>We'll send quotes to this number via WhatsApp</p>
            </div>
            <button onClick={() => setStep(2)} disabled={!form.name || !form.phone}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
              Next: Event Details
            </button>
          </div>
        )}

        {/* Step 2: Event Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Event Details</h2>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: '#475569' }}>Event Type</label>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_TYPES.map(et => (
                  <button key={et} onClick={() => update('eventType', et)}
                    className="p-2.5 rounded-xl text-xs font-semibold text-center transition-all border"
                    style={form.eventType === et ? { background: '#F0FDFA', color: '#2BBCA8', borderColor: '#A7F3D0' } : { background: 'white', color: '#64748B', borderColor: '#E2E8F0' }}>
                    {et}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Event Date</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <Calendar className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                <input type="date" value={form.eventDate} onChange={e => update('eventDate', e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}>Back</button>
              <button onClick={() => setStep(3)} disabled={!form.eventType || !form.eventDate}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>Next: Location</button>
            </div>
          </div>
        )}

        {/* Step 3: Location & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Location & Guests</h2>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Province</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <MapPin className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                <select value={form.province} onChange={e => update('province', e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }}>
                  <option value="">Select province</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: '#475569' }}>Guest Count</label>
              <div className="grid grid-cols-3 gap-2">
                {GUEST_COUNTS.map(gc => (
                  <button key={gc} onClick={() => update('guestCount', gc)}
                    className="p-2 rounded-xl text-xs font-semibold text-center transition-all border"
                    style={form.guestCount === gc ? { background: '#F0FDFA', color: '#2BBCA8', borderColor: '#A7F3D0' } : { background: 'white', color: '#64748B', borderColor: '#E2E8F0' }}>
                    {gc}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Additional Notes (optional)</label>
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <MessageSquare className="w-4 h-4 mt-0.5" style={{ color: '#CBD5E1' }} />
                <textarea placeholder="Any special requirements..." value={form.notes} onChange={e => update('notes', e.target.value)} rows={3}
                  className="flex-1 bg-transparent text-sm outline-none resize-none" style={{ color: '#1a1a2e' }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}>Back</button>
              <button onClick={handleSubmit} disabled={!canSubmit || sending}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
