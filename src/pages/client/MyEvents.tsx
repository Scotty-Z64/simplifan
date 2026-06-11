import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientLayout } from '@/components/ClientLayout';
import { useUnified } from '@/context/UnifiedContext';
import { trpc } from '@/providers/trpc';
import {
  Calendar, DollarSign, Users, AlertCircle, Loader2,
  CheckCircle2, Clock
} from 'lucide-react';

export function MyEvents() {
  const navigate = useNavigate();
  const { clientUser } = useUnified();

  // Get client from API by phone
  const { data: clientRecord } = trpc.spClient.byPhone.useQuery(
    { phone: clientUser?.phone ?? '' },
    { enabled: !!clientUser?.phone }
  );

  const clientId = clientRecord?.id ?? 0;

  // Fetch real events from API
  const { data: apiEvents, isLoading } = trpc.event.list.useQuery(
    { clientId, limit: 50 },
    { enabled: clientId > 0 }
  );

  const [activeTab, setActiveTab] = useState<'plans' | 'quotes' | 'bookings'>('plans');

  // Convert API events to display format
  const events = useMemo(() => {
    if (!apiEvents) return [];
    return apiEvents.map(e => ({
      id: String(e.id),
      name: e.eventType,
      type: e.eventType,
      date: e.eventDate ?? 'TBD',
      status: e.status,
      budget: Number(e.budget),
      spent: Number(e.totalCost ?? 0),
      guests: e.guestCount ?? 0,
      province: e.province ?? '',
      items: (e.items ?? []).map((item: any) => ({
        category: item.category,
        vendor: item.vendorName ?? item.vendor?.businessName ?? 'TBD',
        price: Number(item.price ?? 0),
        status: item.status ?? 'pending',
      })),
    }));
  }, [apiEvents]);

  const stats = useMemo(() => ({
    totalEvents: events.length,
    totalBudgeted: events.reduce((s, e) => s + e.budget, 0),
    totalSpent: events.reduce((s, e) => s + e.spent, 0),
    pending: events.filter(e => e.status === 'planning' || e.status === 'quoted').length,
  }), [events]);

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    planning: { label: 'Planning', color: '#3B82F6', bg: '#EFF6FF', icon: Clock },
    quoted: { label: 'Quoted', color: '#F59E0B', bg: '#FFFBEB', icon: DollarSign },
    deposit_paid: { label: 'Deposit Paid', color: '#8B5CF6', bg: '#F5F3FF', icon: CheckCircle2 },
    confirmed: { label: 'Confirmed', color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 },
    ready: { label: 'Ready', color: '#2BBCA8', bg: '#F0FDFA', icon: CheckCircle2 },
    completed: { label: 'Completed', color: '#64748B', bg: '#F1F5F9', icon: CheckCircle2 },
  };

  return (
    <ClientLayout title="My Events">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Events', value: stats.totalEvents, icon: Calendar, color: '#2BBCA8' },
            { label: 'Budgeted', value: `R${(stats.totalBudgeted / 1000).toFixed(0)}k`, icon: DollarSign, color: '#3B82F6' },
            { label: 'Spent', value: `R${(stats.totalSpent / 1000).toFixed(0)}k`, icon: DollarSign, color: '#F59E0B' },
            { label: 'Pending', value: stats.pending, icon: AlertCircle, color: '#EF4444' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
              <p className="text-xl font-bold" style={{ color: '#1a1a2e' }}>{s.value}</p>
              <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: '#F1F5F9' }}>
          {(['plans', 'quotes', 'bookings'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold capitalize transition-all"
              style={activeTab === t ? { background: 'white', color: '#1a1a2e', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#64748B' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2BBCA8' }} />
          </div>
        )}

        {/* Events List */}
        {!isLoading && events.length === 0 && (
          <div className="rounded-2xl p-12 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E1' }} />
            <p className="text-sm font-semibold mb-1" style={{ color: '#1a1a2e' }}>No events yet</p>
            <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>Start planning your first event</p>
            <button onClick={() => navigate('/planner')}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
              Plan an Event
            </button>
          </div>
        )}

        <div className="space-y-3">
          {events.map(evt => {
            const st = statusConfig[evt.status] || statusConfig.planning;
            return (
              <div key={evt.id} onClick={() => navigate(`/track/${evt.id}`)}
                className="rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: st.bg }}>
                      <st.icon className="w-5 h-5" style={{ color: st.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>{evt.name}</h3>
                      <p className="text-[11px]" style={{ color: '#94A3B8' }}>{evt.date} &middot; {evt.province}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-bold" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                </div>

                {/* Budget Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: '#94A3B8' }}>Budget</span>
                    <span className="text-[10px] font-bold" style={{ color: '#1a1a2e' }}>R{evt.spent.toLocaleString()} / R{evt.budget.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((evt.spent / evt.budget) * 100, 100)}%`, background: 'linear-gradient(90deg, #2BBCA8, #10B981)' }} />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-[11px]" style={{ color: '#94A3B8' }}>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {evt.guests} guests</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> R{evt.budget.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {evt.items.length} items</span>
                </div>

                {/* Items */}
                {evt.items.length > 0 && (
                  <div className="mt-3 pt-3 flex flex-wrap gap-1.5" style={{ borderTop: '1px solid #F1F5F9' }}>
                    {evt.items.map((item, idx) => (
                      <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{
                        background: item.status === 'booked' || item.status === 'completed' ? '#ECFDF5' : item.status === 'accepted' ? '#FFFBEB' : '#F1F5F9',
                        color: item.status === 'booked' || item.status === 'completed' ? '#059669' : item.status === 'accepted' ? '#D97706' : '#64748B'
                      }}>
                        {item.category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ClientLayout>
  );
}
