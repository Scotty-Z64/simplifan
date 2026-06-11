import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import {
  Users, Store, Calendar, Send, DollarSign, UserPlus, TrendingUp,
  TrendingDown, Activity, ChevronRight, Shield, MapPin, Star,
  BarChart3, Bell, Globe, MessageCircle, HeartPulse, Zap, Award
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_ANALYTICS_API_URL || 'https://your-bot-server.com';

const iconMap: Record<string, React.ElementType> = { Users, Store, Calendar, Send, DollarSign, UserPlus, Globe, MessageCircle };

const COLORS = ['#14b8a6', '#f59e0b', '#6366f1', '#f43f5e', '#8b5cf6', '#10b981'];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { adminUser, liveStats, monthlyRevenue, weeklySignups, eventTypeBreakdown } = useAdmin();
  const [realtimeStats, setRealtimeStats] = useState({ onlineNow: 0, whatsappActive: 0 });

  useEffect(() => {
    const fetchRealtime = async () => {
      try {
        const [onlineRes, waRes] = await Promise.allSettled([
          fetch(`${API_URL}/api/analytics/online?minutes=2`),
          fetch(`${API_URL}/api/analytics/whatsapp-active?minutes=10`)
        ]);
        const online = onlineRes.status === 'fulfilled' && onlineRes.value.ok
          ? (await onlineRes.value.json()).count : 0;
        const wa = waRes.status === 'fulfilled' && waRes.value.ok
          ? (await waRes.value.json()).count : 0;
        setRealtimeStats({ onlineNow: online, whatsappActive: wa });
      } catch { /* silent fail */ }
    };
    fetchRealtime();
    const interval = setInterval(fetchRealtime, 15000);
    return () => clearInterval(interval);
  }, []);

  const recentActivity = [
    { time: '14:32', text: 'New event created: Wedding in Sandton (R85,000)', type: 'event', color: '#14b8a6' },
    { time: '14:28', text: 'Royal Events SA accepted a quote (R15,000)', type: 'vendor', color: '#f59e0b' },
    { time: '14:15', text: 'New vendor signup: "Tembisa Tent Hire"', type: 'vendor', color: '#8b5cf6' },
    { time: '14:05', text: 'Client Lerato M. paid deposit (R4,500)', type: 'payment', color: '#10b981' },
    { time: '13:48', text: 'Quote sent: Funeral in Soweto (R25,000)', type: 'event', color: '#14b8a6' },
    { time: '13:30', text: '5 new client signups from KwaZulu-Natal', type: 'signup', color: '#6366f1' },
    { time: '13:15', text: 'Vendor "DJ Maphorisa" rated 5 stars', type: 'review', color: '#f43f5e' },
    { time: '12:55', text: 'Campaign "Summer Wedding Rush" hit 45K reach', type: 'marketing', color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen mesh-bg-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-dark-premium border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center icon-circle-purple">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SimpliPlan Command</h1>
          <p className="text-[10px] font-medium" style={{ color: '#64748B' }}>{adminUser?.role.toUpperCase()} · Live Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl relative transition-colors hover:bg-white/5" style={{ color: '#94A3B8' }}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse" style={{ background: '#EF4444' }} />
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
            <span className="text-xs font-bold" style={{ color: '#A78BFA' }}>{adminUser?.avatar}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-5">
        {/* Live Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3">
          {/* Real-time: Online Now */}
          <div className="glass-dark-premium rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group cursor-pointer"
            onClick={() => navigate('/admin/analytics')}>
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <div className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </div>
            </div>
            <p className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{realtimeStats.onlineNow}</p>
            <p className="text-[10px]" style={{ color: '#64748B' }}>Online Now</p>
          </div>
          {/* Real-time: WhatsApp Active */}
          <div className="glass-dark-premium rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all group cursor-pointer"
            onClick={() => navigate('/admin/analytics')}>
            <div className="flex items-center justify-between mb-2">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <div className="flex items-center gap-0.5 text-[10px] text-green-400 font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </div>
            </div>
            <p className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{realtimeStats.whatsappActive}</p>
            <p className="text-[10px]" style={{ color: '#64748B' }}>WA Active</p>
          </div>
          {liveStats.map((stat, i) => {
            const Icon = iconMap[stat.icon] || Activity;
            return (
              <div key={i} className="glass-dark-premium rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                onClick={() => { if (stat.label === 'Active Events') navigate('/admin/map'); if (stat.label === 'Vendors Online') navigate('/admin/vendors'); }}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <div className={`flex items-center gap-0.5 text-[10px] font-bold ${stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change >= 0 ? '+' : ''}{stat.change}%
                  </div>
                </div>
                <p className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</p>
                <p className="text-[10px]" style={{ color: '#64748B' }}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-dark-premium rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-400" />Platform Revenue</h3>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorPlatform" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} /><stop offset="95%" stopColor="#14b8a6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#4b5563" fontSize={11} />
                <YAxis stroke="#4b5563" fontSize={11} tickFormatter={(v) => `R${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="gmv" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorGmv)" name="GMV" />
                <Area type="monotone" dataKey="platform" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorPlatform)" name="Platform Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Event Type Pie */}
          <div className="glass-dark-premium rounded-2xl p-5 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><PieIcon className="w-4 h-4 text-purple-400" />Events by Type</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={eventTypeBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count" nameKey="type" stroke="none">
                  {eventTypeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {eventTypeBreakdown.slice(0, 4).map((e, i) => (
                <div key={i} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} /><span className="text-[10px]" style={{ color: '#94A3B8' }}>{e.type}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Weekly Signups */}
          <div className="glass-dark-premium rounded-2xl p-5 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><UserPlus className="w-4 h-4 text-rose-400" />Signups This Week</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklySignups}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="day" stroke="#4b5563" fontSize={11} />
                <YAxis stroke="#4b5563" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="clients" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Clients" />
                <Bar dataKey="vendors" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Vendors" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="glass-dark-premium rounded-2xl p-5 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'View Events Map', desc: 'See all events across SA', icon: MapPin, color: 'text-blue-400', bg: 'rgba(59,130,246,0.1)', path: '/admin/map' },
                { label: 'Live Analytics', desc: 'Real-time users & activity', icon: Activity, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)', path: '/admin/analytics' },
                { label: 'System Health', desc: 'Monitor API & services', icon: HeartPulse, color: 'text-rose-400', bg: 'rgba(244,63,94,0.1)', path: '/admin/health' },
                { label: 'Vendor Performance', desc: 'Top vendors & analytics', icon: Star, color: 'text-amber-400', bg: 'rgba(245,158,11,0.1)', path: '/admin/vendors' },
                { label: 'Marketing Center', desc: 'Campaigns & growth', icon: BarChart3, color: 'text-purple-400', bg: 'rgba(139,92,246,0.1)', path: '/admin/marketing' },
                { label: 'Financial Overview', desc: 'Revenue & payouts', icon: DollarSign, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)', path: '/admin/finance' },
              ].map((action, i) => (
                <button key={i} onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-left group">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all" style={{ background: action.bg }}>
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <div className="flex-1"><p className="text-sm text-white font-medium">{action.label}</p><p className="text-[10px]" style={{ color: '#64748B' }}>{action.desc}</p></div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Live Activity */}
          <div className="glass-dark-premium rounded-2xl p-5 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" />Live Activity</h3>
            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: act.color }} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-300 leading-relaxed">{act.text}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#4b5563' }}>{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Vendors Teaser */}
        <div className="glass-dark-premium rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" />Top Performing Vendors</h3>
            <button onClick={() => navigate('/admin/vendors')} className="text-xs font-semibold px-3 py-1 rounded-full transition-colors hover:bg-white/5" style={{ color: '#A78BFA' }}>View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'Braai Masters SA', cat: 'Catering', rev: 'R230,400', bookings: 128, rating: 4.5, trend: '+12%' },
              { name: 'Royal Events SA', cat: 'Venue', rev: 'R675,000', bookings: 45, rating: 4.9, trend: '+8%' },
              { name: 'DJ Maphorisa Ent', cat: 'Music', rev: 'R712,000', bookings: 89, rating: 4.8, trend: '+15%' },
            ].map((v, i) => (
              <div key={i} className="glass-dark-premium rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${COLORS[i]}, ${COLORS[i]}88)` }}>
                    <span className="text-sm font-bold text-white">#{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{v.name}</p>
                    <p className="text-[10px]" style={{ color: '#64748B' }}>{v.cat}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span style={{ color: '#64748B' }}>{v.bookings} bookings</span>
                  <span className="text-emerald-400 font-bold">{v.rev}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-400 font-medium">{v.rating}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />{v.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PieIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>;
}
