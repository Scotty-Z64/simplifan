import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientLayout } from '@/components/ClientLayout';
import { useUnified } from '@/context/UnifiedContext';
import { trpc } from '@/providers/trpc';
import {
  Calendar, DollarSign, Users, AlertCircle, Loader2,
  CheckCircle2, Clock, Plus, Sparkles, PartyPopper,
  ChevronRight, MapPin, Tag
} from 'lucide-react';

const EVENT_IMAGES: Record<string, string> = {
  'Wedding': '/images/wedding-sa.jpg',
  'Birthday': '/images/birthday-sa.jpg',
  'Funeral': '/images/funeral-sa.jpg',
  'uMgidi': '/images/umgidi-sa.jpg',
  'uMemulo': '/images/umemulo-sa.jpg',
  'Lobola': '/images/hero-sa-celebration.jpg',
};

function getEventImage(type: string) {
  return EVENT_IMAGES[type] || '/images/hero-sa-celebration.jpg';
}

function EventSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
      <div className="h-28 animate-pulse" style={{ background: '#E2E8F0' }} />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded-lg animate-pulse" style={{ background: '#E2E8F0' }} />
          <div className="h-6 w-16 rounded-full animate-pulse" style={{ background: '#E2E8F0' }} />
        </div>
        <div className="h-3 w-48 rounded-lg animate-pulse" style={{ background: '#E2E8F0' }} />
        <div className="h-2 w-full rounded-full animate-pulse" style={{ background: '#E2E8F0' }} />
        <div className="flex gap-3">
          <div className="h-3 w-20 rounded-lg animate-pulse" style={{ background: '#E2E8F0' }} />
          <div className="h-3 w-24 rounded-lg animate-pulse" style={{ background: '#E2E8F0' }} />
        </div>
      </div>
    </div>
  );
}

export function MyEvents() {
  const navigate = useNavigate();
  const { clientUser } = useUnified();

  const { data: clientRecord, isLoading: clientLoading } = trpc.spClient.byPhone.useQuery(
    { phone: clientUser?.phone ?? '' },
    { enabled: !!clientUser?.phone }
  );

  const clientId = clientRecord?.id ?? 0;

  const { data: apiEvents, isLoading: eventsLoading } = trpc.event.list.useQuery(
    { clientId, limit: 50 },
    { enabled: clientId > 0 }
  );

  const isLoading = clientLoading || eventsLoading;
  const [activeTab, setActiveTab] = useState<'plans' | 'quotes' | 'bookings'>('plans');

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
      city: e.city ?? '',
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
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Events', value: stats.totalEvents, icon: Calendar, color: '#2BBCA8' },
            { label: 'Budgeted', value: `R${(stats.totalBudgeted / 1000).toFixed(0)}k`, icon: DollarSign, color: '#3B82F6' },
            { label: 'Spent', value: `R${(stats.totalSpent / 1000).toFixed(0)}k`, icon: DollarSign, color: '#F59E0B' },
            { label: 'Pending', value: stats.pending, icon: AlertCircle, color: '#EF4444' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 transition-all hover:-translate-y-0.5" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
              <p className="text-xl font-bold" style={{ color: '#1a1a2e' }}>{isLoading ? '-' : s.value}</p>
              <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + New Event */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex gap-2 p-1 rounded-xl" style={{ background: '#F1F5F9' }}>
            {(['plans', 'quotes', 'bookings'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold capitalize transition-all"
                style={activeTab === t ? { background: 'white', color: '#1a1a2e', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#64748B' }}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/client/planner')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
            <Plus className="w-4 h-4" /> New
          </button>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            <EventSkeleton />
            <EventSkeleton />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && events.length === 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="relative h-40">
              <img src="/images/hero-sa-celebration.jpg" alt="Celebration" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
              <PartyPopper className="absolute bottom-4 left-4 w-10 h-10 text-white" />
            </div>
            <div className="p-8 text-center">
              <h3 className="text-lg font-bold mb-1" style={{ color: '#1a1a2e' }}>No events yet</h3>
              <p className="text-sm mb-5" style={{ color: '#94A3B8' }}>Start planning your first celebration with SimpliPlan</p>
              <button onClick={() => navigate('/client/planner')}
                className="px-8 py-3 rounded-xl text-sm font-bold text-white inline-flex items-center gap-2 transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 15px -3px rgba(43,188,168,0.4)' }}>
                <Sparkles className="w-4 h-4" /> Plan My First Event
              </button>
            </div>
          </div>
        )}

        {/* Event Cards */}
        {!isLoading && (
          <div className="space-y-4">
            {events.map(evt => {
              const st = statusConfig[evt.status] || statusConfig.planning;
              return (
                <div key={evt.id} onClick={() => navigate(`/client/track/${evt.id}`)}
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: 'white', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  {/* Event Image Header */}
                  <div className="relative h-36 overflow-hidden">
                    <img src={getEventImage(evt.type)} alt={evt.type} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: st.bg, color: st.color }}>
                      <span className="flex items-center gap-1"><st.icon className="w-3 h-3" /> {st.label}</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <h3 className="text-lg font-bold text-white">{evt.name}</h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-white/80"><Calendar className="w-3 h-3" /> {evt.date}</span>
                        <span className="flex items-center gap-1 text-[11px] text-white/80"><MapPin className="w-3 h-3" /> {evt.province}{evt.city ? `, ${evt.city}` : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {/* Budget Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold" style={{ color: '#94A3B8' }}>Budget</span>
                        <span className="text-[11px] font-bold" style={{ color: '#1a1a2e' }}>R{evt.spent.toLocaleString()} / R{evt.budget.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((evt.spent / evt.budget) * 100, 100)}%`, background: 'linear-gradient(90deg, #2BBCA8, #10B981)' }} />
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 text-[11px] mb-3" style={{ color: '#94A3B8' }}>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {evt.guests} guests</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> R{evt.budget.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {evt.items.length} items</span>
                    </div>

                    {/* Items */}
                    {evt.items.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {evt.items.map((item, idx) => (
                          <span key={idx} className="text-[9px] px-2.5 py-1 rounded-full font-medium" style={{
                            background: item.status === 'booked' || item.status === 'completed' ? '#ECFDF5' : item.status === 'accepted' ? '#FFFBEB' : '#F1F5F9',
                            color: item.status === 'booked' || item.status === 'completed' ? '#059669' : item.status === 'accepted' ? '#D97706' : '#64748B'
                          }}>
                            {item.category}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* View Detail */}
                    <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid #F1F5F9' }}>
                      <span className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>Tap to track progress</span>
                      <ChevronRight className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
