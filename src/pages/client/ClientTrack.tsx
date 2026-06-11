import { useParams, useNavigate } from 'react-router-dom';
import { ClientLayout } from '@/components/ClientLayout';
import { trpc } from '@/providers/trpc';
import {
  CheckCircle, Package, DollarSign, MapPin, Users, Calendar,
  MessageCircle, Loader2
} from 'lucide-react';

export function ClientTrack() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const id = eventId ? parseInt(eventId) : 0;

  // ─── API Data ───
  const { data: event, isLoading } = trpc.event.byId.useQuery(
    { id },
    { enabled: id > 0 }
  );

  if (isLoading) {
    return (
      <ClientLayout title="Track Event">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2BBCA8' }} />
        </div>
      </ClientLayout>
    );
  }

  if (!event) {
    return (
      <ClientLayout title="Track Event">
        <div className="max-w-lg mx-auto text-center py-16">
          <h2 className="text-xl font-bold mb-3" style={{ color: '#1a1a2e' }}>Event Not Found</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>We could not find this event in your list.</p>
          <button onClick={() => navigate('/my-events')} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>Back to My Events</button>
        </div>
      </ClientLayout>
    );
  }

  const budget = Number(event.budget);
  const spent = Number(event.totalCost ?? 0);
  const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const progressSteps = [
    { label: 'Planning', status: 'done' as const },
    { label: 'Quotes Sent', status: 'done' as const },
    { label: 'Vendors Confirmed', status: event.status === 'planning' ? 'pending' : event.status === 'quoted' ? 'current' : 'done' as const },
    { label: 'Deposit Paid', status: event.status === 'deposit_paid' || event.status === 'confirmed' || event.status === 'ready' || event.status === 'completed' ? 'done' : 'pending' as const },
    { label: 'Ready', status: event.status === 'ready' || event.status === 'completed' ? 'done' : 'pending' as const },
  ];

  const items = event.items ?? [];

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
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.province ?? 'TBD'}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.guestCount ?? 0} guests</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />R {budget.toLocaleString('en-ZA')}</span>
              </div>
            </div>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2BBCA8, #34D399)' }} />
          </div>
          <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>R {spent.toLocaleString('en-ZA')} spent of R {budget.toLocaleString('en-ZA')}</p>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-6" style={{ color: '#1a1a2e' }}>Event Progress</h3>
          <div className="flex items-center gap-2">
            {progressSteps.map((step, i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.status === 'done' ? 'text-white' : step.status === 'current' ? 'border-2' : ''}`}
                    style={{ background: step.status === 'done' ? 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' : step.status === 'current' ? 'white' : '#F1F5F9', borderColor: step.status === 'current' ? '#2BBCA8' : undefined }}>
                    {step.status === 'done' ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-bold" style={{ color: step.status === 'current' ? '#2BBCA8' : '#CBD5E1' }}>{i + 1}</span>}
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
            <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Your Vendors ({items.length})</h3>
          </div>
          {items.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-sm" style={{ color: '#94A3B8' }}>No vendors booked yet</p>
            </div>
          )}
          {items.map((item: any) => (
            <div key={item.id} className="px-6 py-4 flex items-center gap-4 border-b last:border-0" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(43,188,168,0.1), rgba(245,158,11,0.1))' }}>
                <Package className="w-5 h-5" style={{ color: '#2BBCA8' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{item.vendorName ?? item.vendor?.businessName ?? item.category}</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{
                    background: item.status === 'booked' || item.status === 'completed' ? '#ECFDF5' : item.status === 'accepted' ? '#FFFBEB' : '#F1F5F9',
                    color: item.status === 'booked' || item.status === 'completed' ? '#059669' : item.status === 'accepted' ? '#D97706' : '#64748B'
                  }}>{(item.status ?? 'PENDING').toUpperCase()}</span>
                </div>
                <p className="text-[11px]" style={{ color: '#94A3B8' }}>{item.service ?? item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>R {Number(item.price ?? 0).toLocaleString('en-ZA')}</p>
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
