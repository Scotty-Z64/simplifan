import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientLayout } from '@/components/ClientLayout';
import {
  Send, Sparkles, MapPin, Users, Wallet,
  CheckCircle
} from 'lucide-react';

/* ... existing helper functions and data ... */
const EVENT_TYPES = ['Wedding', 'Funeral', 'Birthday', 'uMgidi', 'uMemulo', 'Lobola', 'Traditional Wedding', '21st Birthday'];
const PROVINCES = ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Free State', 'Mpumalanga', 'Limpopo', 'North West', 'Northern Cape'];
const AREAS: Record<string, string[]> = {
  'Gauteng': ['Johannesburg', 'Soweto', 'Sandton', 'Pretoria', 'Tembisa', 'Alexandra', 'Midrand', 'Randburg', 'Centurion', 'Benoni', 'Vosloorus', 'Katlehong'],
  'KwaZulu-Natal': ['Durban', 'Umlazi', 'Umhlanga', 'Pinetown', 'KwaMashu', 'Chatsworth', 'Phoenix', 'Newcastle'],
  'Western Cape': ['Cape Town', 'Khayelitsha', 'Mitchells Plain', 'Bellville', 'Stellenbosch', 'Gugulethu', 'Paarl'],
  'Eastern Cape': ['Port Elizabeth', 'East London', 'Uitenhage', 'Mthatha', 'Mdantsane'],
  'Free State': ['Bloemfontein', 'Welkom', 'Sasolburg'],
  'Mpumalanga': ['Nelspruit', 'Witbank', 'Secunda'],
  'Limpopo': ['Polokwane', 'Thohoyandou', 'Tzaneen'],
  'North West': ['Rustenburg', 'Mahikeng', 'Potchefstroom'],
  'Northern Cape': ['Kimberley', 'Upington'],
};
const GUEST_COUNTS = ['Under 20', '20-50', '50-100', '100-200', '200-500', '500+'];
const BUDGETS = ['Under R5,000', 'R5,000-R15,000', 'R15,000-R30,000', 'R30,000-R50,000', 'R50,000-R100,000', 'R100,000+'];

/* Simple step-driven planner */
function StepPlanner({ onComplete }: { onComplete: (plan: any) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ eventType: '', province: '', area: '', guests: '', budget: '', date: '' });
  const steps = [
    { label: 'Event Type', options: EVENT_TYPES, field: 'eventType' as const, icon: Sparkles },
    { label: 'Province', options: PROVINCES, field: 'province' as const, icon: MapPin },
    { label: 'Area', options: data.province ? AREAS[data.province] || [] : [], field: 'area' as const, icon: MapPin },
    { label: 'Guests', options: GUEST_COUNTS, field: 'guests' as const, icon: Users },
    { label: 'Budget', options: BUDGETS, field: 'budget' as const, icon: Wallet },
  ];

  const selectOption = (value: string) => {
    const newData = { ...data, [steps[step].field]: value };
    setData(newData);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newData);
    }
  };

  const current = steps[step];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        {steps.map((_step, i) => (
          <div key={i} className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: i <= step ? '100%' : '0%', background: i <= step ? '#2BBCA8' : '#E2E8F0' }} />
          </div>
        ))}
      </div>
      <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>Step {step + 1} of {steps.length}</p>

      {/* Question */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
          <current.icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>What is your {current.label}?</h3>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {current.options.map(opt => (
          <button key={opt} onClick={() => selectOption(opt)}
            className="p-4 rounded-xl text-left transition-all hover:-translate-y-0.5 text-sm font-semibold"
            style={{ background: 'white', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', color: '#1a1a2e' }}>
            {opt}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="text-sm font-medium" style={{ color: '#94A3B8' }}>Back</button>
      )}
    </div>
  );
}

export function ConversationalPlanner() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);
  const [showQuotes, setShowQuotes] = useState(false);

  const handleComplete = (data: any) => {
    const budgetNum = data.budget.includes('100,000') ? 100000 : data.budget.includes('50,000') ? 50000 : data.budget.includes('30,000') ? 30000 : data.budget.includes('15,000') ? 15000 : data.budget.includes('5,000') ? 5000 : 50000;
    const newPlan = {
      id: `evt_${Date.now()}`,
      clientId: 'demo', clientName: 'Demo User',
      eventType: data.eventType, province: data.province, area: data.area,
      eventDate: new Date().toISOString().split('T')[0],
      guestCount: data.guests, budget: budgetNum,
      status: 'planning' as const,
      items: [
        { id: '1', category: 'Venue', service: 'Venue & Decor', vendorName: 'Royal Events SA', price: Math.round(budgetNum * 0.3), status: 'pending' as const, rating: 4.9 },
        { id: '2', category: 'Catering', service: 'Catering & Food', vendorName: 'Braai Masters', price: Math.round(budgetNum * 0.4), status: 'pending' as const, rating: 4.7 },
        { id: '3', category: 'Entertainment', service: 'DJ & Sound', vendorName: 'DJ Maphorisa Ent', price: Math.round(budgetNum * 0.15), status: 'pending' as const, rating: 4.8 },
        { id: '4', category: 'Photography', service: 'Photo & Video', vendorName: 'Glam Squad SA', price: Math.round(budgetNum * 0.1), status: 'pending' as const, rating: 4.6 },
      ],
      totalCost: 0, vendorResponses: [], messages: [],
    };
    setPlan(newPlan);
  };

  const sendQuotes = () => {
    const requests = JSON.parse(localStorage.getItem('sp_quote_requests') || '[]');
    requests.push({ ...plan, sentAt: new Date().toISOString() });
    localStorage.setItem('sp_quote_requests', JSON.stringify(requests));
    setShowQuotes(true);
  };

  return (
    <ClientLayout title="Plan Your Event">
      <div className="max-w-3xl mx-auto">
        {!plan ? (
          <StepPlanner onComplete={handleComplete} />
        ) : !showQuotes ? (
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #F0FDFA, #ECFDF5)', border: '1px solid #A7F3D0' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Your Plan is Ready</h3>
              </div>
              <p className="text-sm mb-4" style={{ color: '#64748B' }}>We have matched you with vendors for your <strong>{plan.eventType}</strong> in <strong>{plan.area}</strong>.</p>
            </div>

            {/* Matched Vendors */}
            <h4 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Matched Vendors</h4>
            <div className="space-y-3">
              {plan.items.map((item: any, i: number) => (
                <div key={i} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(43,188,168,0.1), rgba(245,158,11,0.1))' }}>
                    <Sparkles className="w-5 h-5" style={{ color: '#2BBCA8' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{item.vendorName}</p>
                    <p className="text-[11px]" style={{ color: '#94A3B8' }}>{item.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>R {item.price.toLocaleString('en-ZA')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4" style={{ background: '#F0FDFA', border: '1px solid #A7F3D0' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium" style={{ color: '#64748B' }}>Total Estimated</p>
                  <p className="text-lg font-bold" style={{ color: '#1a1a2e' }}>R {plan.items.reduce((sum: number, it: any) => sum + it.price, 0).toLocaleString('en-ZA')}</p>
                </div>
                <p className="text-[10px]" style={{ color: '#64748B' }}>of R {plan.budget.toLocaleString('en-ZA')} budget</p>
              </div>
            </div>

            <button onClick={sendQuotes}
              className="w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 8px 20px -4px rgba(43,188,168,0.3)' }}>
              <Send className="w-5 h-5" /> Send Quotes to Vendors
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#1a1a2e' }}>Quotes Sent</h2>
            <p className="text-sm mb-2" style={{ color: '#64748B' }}>Your {plan.eventType} plan has been sent to vendors.</p>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>Vendors typically respond within 24 hours.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/client')}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>View Dashboard</button>
              <button onClick={() => setPlan(null)}
                className="px-6 py-3 rounded-xl text-sm font-bold" style={{ color: '#2BBCA8', border: '1.5px solid #2BBCA8' }}>Plan Another</button>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
