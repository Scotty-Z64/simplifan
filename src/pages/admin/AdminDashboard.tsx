import { useNavigate } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  Users, Store, Calendar, DollarSign, TrendingUp,
  Activity, ChevronRight, Shield, Star,
  BarChart3, Bell, Loader2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#14b8a6', '#f59e0b', '#6366f1', '#f43f5e', '#8b5cf6', '#10b981'];

export function AdminDashboard() {
  const navigate = useNavigate();

  // ─── Real API Data ───
  const { data: overview, isLoading } = trpc.analytics.overview.useQuery();
  const { data: recentActivity } = trpc.analytics.recentActivity.useQuery({ limit: 8 });

  const stats = [
    { label: 'Clients', value: overview?.clients ?? 0, icon: Users, color: '#14b8a6' },
    { label: 'Vendors', value: overview?.vendors ?? 0, icon: Store, color: '#f59e0b' },
    { label: 'Bookings', value: overview?.bookings ?? 0, icon: Calendar, color: '#6366f1' },
    { label: 'Events', value: overview?.events ?? 0, icon: Activity, color: '#f43f5e' },
    { label: 'Revenue', value: `R${(overview?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: '#10b981' },
    { label: 'Monthly', value: overview?.monthlyBookings ?? 0, icon: TrendingUp, color: '#8b5cf6' },
  ];

  const conversions = overview?.conversions ?? [];
  const convData = conversions.map((c: any, i: number) => ({
    name: c.stage,
    value: Number(c.count),
    color: COLORS[i % COLORS.length],
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#8B5CF6' }} />
          <p className="text-sm" style={{ color: '#64748B' }}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SimpliPlan Command</h1>
          <p className="text-[10px] font-medium" style={{ color: '#64748B' }}>ADMIN · Live Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl relative" style={{ color: '#94A3B8' }}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse" style={{ background: '#EF4444' }} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-[10px] font-semibold" style={{ color: '#64748B' }}>{s.label}</span>
              </div>
              <p className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Conversion Funnel */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: '#8B5CF6' }} /> Conversion Stages
            </h3>
            {convData.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#64748B' }}>No conversion data yet</p>
            ) : (
              <div className="space-y-3">
                {convData.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs capitalize" style={{ color: '#CBD5E1' }}>{c.name.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-bold" style={{ color: c.color }}>{c.value}</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min((c.value / Math.max(...convData.map(d => d.value))) * 100, 100)}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Breakdown Pie */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-bold text-white mb-4">Stage Breakdown</h3>
            {convData.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#64748B' }}>No data yet</p>
            ) : (
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={convData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" stroke="none">
                        {convData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {convData.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                      <span className="text-xs capitalize" style={{ color: '#CBD5E1' }}>{c.name.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-bold text-white ml-auto">{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {(recentActivity?.bookings?.slice(0, 5) ?? []).map((b: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <Star className="w-4 h-4" style={{ color: '#10B981' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{b.eventType} booking — {b.vendorName} — R{Number(b.amount).toLocaleString()}</p>
                  <p className="text-[10px]" style={{ color: '#64748B' }}>{b.status}</p>
                </div>
                <span className="text-[10px] flex-shrink-0" style={{ color: '#64748B' }}>{new Date(b.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {(!recentActivity?.bookings || recentActivity.bookings.length === 0) && (
              <p className="text-sm text-center py-8" style={{ color: '#64748B' }}>No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Vendors', path: '/admin/vendors', color: '#F59E0B' },
            { label: 'Events', path: '/admin/events', color: '#3B82F6' },
            { label: 'Bookings', path: '/admin/bookings', color: '#10B981' },
            { label: 'Reviews', path: '/admin/reviews', color: '#EF4444' },
          ].map((a, i) => (
            <button key={i} onClick={() => navigate(a.path)}
              className="rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-bold mb-1" style={{ color: a.color }}>{a.label}</p>
              <p className="text-[10px]" style={{ color: '#64748B' }}>Manage {a.label.toLowerCase()}</p>
              <ChevronRight className="w-4 h-4 mt-2" style={{ color: '#64748B' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
