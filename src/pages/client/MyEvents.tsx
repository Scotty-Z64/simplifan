import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { ClientLayout } from '@/components/ClientLayout';
import {
  CalendarCheck, Package, ArrowRight, Plus,
  Clock, CheckCircle, DollarSign, MessageCircle
} from 'lucide-react';

export function MyEvents() {
  const navigate = useNavigate();
  const { events } = useUnified();
  const [activeTab, setActiveTab] = useState<'plans' | 'quotes' | 'bookings'>('plans');

  const upcomingEvents = events.filter(e => e.status !== 'completed');
  const totalBudget = upcomingEvents.reduce((s, e) => s + e.budget, 0);
  const totalSpent = upcomingEvents.reduce((s, e) => s + e.totalCost, 0);

  const statusColors: Record<string, string> = {
    planning: 'bg-amber-50 text-amber-600',
    quoted: 'bg-purple-50 text-purple-600',
    vendor_responded: 'bg-teal-50 text-teal-600',
    confirmed: 'bg-emerald-50 text-emerald-600',
    deposit_paid: 'bg-blue-50 text-blue-600',
    ready: 'bg-green-50 text-green-600',
  };

  return (
    <ClientLayout title="My Events">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: CalendarCheck, label: 'Events', value: upcomingEvents.length, color: '#2BBCA8' },
            { icon: DollarSign, label: 'Budgeted', value: `R ${totalBudget.toLocaleString('en-ZA')}`, color: '#F59E0B' },
            { icon: CheckCircle, label: 'Spent', value: `R ${totalSpent.toLocaleString('en-ZA')}`, color: '#10B981' },
            { icon: Clock, label: 'Pending', value: `R ${(totalBudget - totalSpent).toLocaleString('en-ZA')}`, color: '#8B5CF6' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{stat.value}</p>
              <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['plans', 'quotes', 'bookings'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
              style={activeTab === tab ? { background: '#2BBCA8', color: 'white' } : { background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Events List */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                  <CalendarCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a2e' }}>No Events Yet</h3>
                <p className="text-sm mb-6" style={{ color: '#64748B' }}>Start planning your first event with our AI planner.</p>
                <button onClick={() => navigate('/client/planner')}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2 mx-auto"
                  style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                  <Plus className="w-4 h-4" /> Plan an Event
                </button>
              </div>
            ) : (
              upcomingEvents.map((evt) => (
                <div key={evt.id} className="rounded-xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(43,188,168,0.1), rgba(245,158,11,0.1))' }}>
                    <Package className="w-6 h-6" style={{ color: '#2BBCA8' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>{evt.eventType}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${statusColors[evt.status] || 'bg-gray-50 text-gray-500'}`}>{evt.status}</span>
                    </div>
                    <p className="text-[11px]" style={{ color: '#94A3B8' }}>{evt.eventDate} | {evt.guestCount} guests | {evt.province}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>R {evt.budget.toLocaleString('en-ZA')}</p>
                    <button onClick={() => navigate(`/client/track/${evt.id}`)} className="text-[10px] font-semibold flex items-center gap-1" style={{ color: '#2BBCA8' }}>Track <ArrowRight className="w-3 h-3" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="rounded-2xl p-12 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a2e' }}>Quote Requests</h3>
            <p className="text-sm" style={{ color: '#64748B' }}>Quotes from vendors will appear here once you plan an event.</p>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="rounded-2xl p-12 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a2e' }}>Confirmed Bookings</h3>
            <p className="text-sm" style={{ color: '#64748B' }}>Your confirmed vendor bookings will appear here.</p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
