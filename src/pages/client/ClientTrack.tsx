import { useParams, useNavigate } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { ClientLayout } from '@/components/ClientLayout';
import {
  CheckCircle, Package, DollarSign, MapPin, Users, Calendar,
  MessageCircle
} from 'lucide-react';

export function ClientTrack() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events } = useUnified();
  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <ClientLayout title="Track Event">
        <div className="max-w-lg mx-auto text-center py-16">
          <h2 className="text-xl font-bold mb-3" style={{ color: '#1a1a2e' }}>Event Not Found</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>We could not find this event in your list.</p>
          <button onClick={() => navigate('/client')} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>Back to Dashboard</button>
        </div>
      </ClientLayout>
    );
  }

  const progressSteps = [
    { label: 'Planning', status: 'done' },
    { label: 'Quotes Sent', status: 'done' },
    { label: 'Vendors Confirmed', status: event.status === 'planning' ? 'pending' : event.status === 'quoted' ? 'current' : 'done' },
    { label: 'Deposit Paid', status: event.status === 'deposit_paid' || event.status === 'ready' ? 'done' : 'pending' },
    { label: 'Ready', status: event.status === 'ready' ? 'done' : 'pending' },
  ];

  return (
    <ClientLayout title={`${event.eventType} Progress`}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Event Header */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>{event.eventType}</h2>
              <div className="flex items-center gap-3 text-xs mt-1" style={{ color: '#94A3B8' }}>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.province}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.guestCount}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />R {event.budget.toLocaleString('en-ZA')}</span>
              </div>
            </div>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min((event.totalCost / event.budget) * 100, 100)}%`, background: 'linear-gradient(90deg, #2BBCA8, #34D399)' }} />
          </div>
          <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>R {event.totalCost.toLocaleString('en-ZA')} spent of R {event.budget.toLocaleString('en-ZA')}</p>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-6" style={{ color: '#1a1a2e' }}>Event Progress</h3>
          <div className="flex items-center gap-2">
            {progressSteps.map((step, i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.status === 'done' ? 'text-white' : step.status === 'current' ? 'text-teal-500 border-2 border-teal-400' : ''}`}
                    style={{ background: step.status === 'done' ? 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' : step.status === 'current' ? 'white' : '#F1F5F9' }}>
                    {step.status === 'done' ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                  </div>
                  <span className="text-[10px] font-semibold text-center" style={{ color: step.status === 'pending' ? '#CBD5E1' : '#475569' }}>{step.label}</span>
                </div>
                {i < progressSteps.length - 1 && (
                  <div className="w-6 h-0.5 flex-shrink-0 mb-4" style={{ background: step.status === 'done' ? '#2BBCA8' : '#E2E8F0' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vendors */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Your Vendors</h3>
          </div>
          {event.items.map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-center gap-4 border-b last:border-0" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(43,188,168,0.1), rgba(245,158,11,0.1))' }}>
                <Package className="w-5 h-5" style={{ color: '#2BBCA8' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{item.vendorName}</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-500">{item.status.toUpperCase()}</span>
                </div>
                <p className="text-[11px]" style={{ color: '#94A3B8' }}>{item.service}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>R {item.price.toLocaleString('en-ZA')}</p>
              </div>
              <button onClick={() => navigate('/client/chat')} className="p-2 rounded-lg hover:bg-gray-100">
                <MessageCircle className="w-4 h-4" style={{ color: '#CBD5E1' }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}
