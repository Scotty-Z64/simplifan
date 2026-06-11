import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, MessageCircle, Globe, Smartphone,
  ChevronLeft, RefreshCw, UserCheck, MapPin, Activity,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Eye, MessageSquare, BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

const API_URL = import.meta.env.VITE_ANALYTICS_API_URL || 'https://your-bot-server.com';

const COLORS = ['#14b8a6', '#f59e0b', '#6366f1', '#f43f5e', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4'];

interface OnlineUser {
  sessionId: string;
  userId: string | null;
  userName: string | null;
  page: string;
  lastSeen: string;
  secondsAgo: number;
}

interface WhatsAppUser {
  phone: string;
  eventType: string | null;
  eventLabel: string | null;
  province: string | null;
  step: number;
  lastMessage: string;
  secondsAgo: number;
}

interface OverviewStats {
  onlineNow: number;
  whatsappActive: number;
  webSessionsToday: number;
  whatsappConversationsToday: number;
  messagesLastHour: number;
  eventTypeBreakdown: Array<{ event_type: string; count: number }>;
}

export function AdminAnalytics() {
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [waUsers, setWaUsers] = useState<WhatsAppUser[]>([]);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [timeline, setTimeline] = useState<Array<{ hour: string; source: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const fetchAll = async () => {
    try {
      // Fetch all endpoints in parallel
      const [onlineRes, waRes, overviewRes, timelineRes] = await Promise.allSettled([
        fetch(`${API_URL}/api/analytics/online?minutes=2`),
        fetch(`${API_URL}/api/analytics/whatsapp-active?minutes=10`),
        fetch(`${API_URL}/api/analytics/overview`),
        fetch(`${API_URL}/api/analytics/timeline?hours=24`)
      ]);

      if (onlineRes.status === 'fulfilled' && onlineRes.value.ok) {
        const data = await onlineRes.value.json();
        setOnlineUsers(data.users || []);
      }
      if (waRes.status === 'fulfilled' && waRes.value.ok) {
        const data = await waRes.value.json();
        setWaUsers(data.users || []);
      }
      if (overviewRes.status === 'fulfilled' && overviewRes.value.ok) {
        const data = await overviewRes.value.json();
        setOverview(data);
      }
      if (timelineRes.status === 'fulfilled' && timelineRes.value.ok) {
        const data = await timelineRes.value.json();
        setTimeline(data.data || []);
      }

      setLastRefresh(new Date());
    } catch (err) {
      console.warn('[Analytics] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, 10000); // Refresh every 10s
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Process timeline data for chart
  const chartData = (() => {
    const hourMap: Record<string, { hour: string; web: number; whatsapp: number }> = {};
    for (let i = 0; i < 24; i++) {
      const h = i.toString().padStart(2, '0');
      hourMap[h] = { hour: `${h}:00`, web: 0, whatsapp: 0 };
    }
    timeline.forEach(t => {
      if (hourMap[t.hour]) {
        if (t.source === 'web') hourMap[t.hour].web += t.count;
        else if (t.source === 'whatsapp') hourMap[t.hour].whatsapp += t.count;
      }
    });
    return Object.values(hourMap);
  })();

  // Page distribution
  const pageDistribution = (() => {
    const pages: Record<string, number> = {};
    onlineUsers.forEach(u => {
      const page = u.page === '/' ? 'Home' : u.page.replace('/', '');
      pages[page] = (pages[page] || 0) + 1;
    });
    return Object.entries(pages)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  })();

  const statCards = [
    {
      label: 'Online Now',
      value: overview?.onlineNow ?? 0,
      icon: UserCheck,
      color: '#10b981',
      bg: 'bg-emerald-500/10',
      change: '+12%',
      up: true
    },
    {
      label: 'WhatsApp Active',
      value: overview?.whatsappActive ?? 0,
      icon: MessageCircle,
      color: '#25D366',
      bg: 'bg-green-500/10',
      change: '+8%',
      up: true
    },
    {
      label: 'Web Sessions Today',
      value: overview?.webSessionsToday ?? 0,
      icon: Globe,
      color: '#6366f1',
      bg: 'bg-indigo-500/10',
      change: '+23%',
      up: true
    },
    {
      label: 'WA Conversations Today',
      value: overview?.whatsappConversationsToday ?? 0,
      icon: Smartphone,
      color: '#f59e0b',
      bg: 'bg-amber-500/10',
      change: '+15%',
      up: true
    },
    {
      label: 'Messages (1h)',
      value: overview?.messagesLastHour ?? 0,
      icon: MessageSquare,
      color: '#ec4899',
      bg: 'bg-pink-500/10',
      change: '-3%',
      up: false
    },
  ];

  const formatAgo = (seconds: number) => {
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 8) return phone;
    return phone.substring(0, 4) + '****' + phone.substring(phone.length - 3);
  };

  const stepNames = ['Choose Event', 'Select Province', 'Select Area', 'Guest Count', 'Budget', 'Event Date', 'Pick Plan', 'Complete'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Live Analytics</h1>
          <p className="text-[10px] text-gray-500">
            Real-time user activity &middot; Refreshes every 10s &middot; {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white transition-all"
          title="Refresh now"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map((stat, i) => (
            <div key={i} className="glass rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Activity Timeline Chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-5 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Activity Timeline (24h)
              </h3>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" />Web</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" />WhatsApp</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradWeb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradWA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={10} tickFormatter={(v) => v.split(':')[0]} />
                <YAxis stroke="#6b7280" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="web" stroke="#10b981" strokeWidth={2} fill="url(#gradWeb)" name="Web" />
                <Area type="monotone" dataKey="whatsapp" stroke="#22c55e" strokeWidth={2} fill="url(#gradWA)" name="WhatsApp" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Page Distribution */}
          <div className="glass rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              Pages Being Viewed
            </h3>
            {pageDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pageDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                  >
                    {pageDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center">
                <p className="text-xs text-gray-600">No active users</p>
              </div>
            )}
            <div className="space-y-1.5 mt-2">
              {pageDistribution.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[11px] text-gray-400">{p.name}</span>
                  </div>
                  <span className="text-[11px] text-gray-500">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Users Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Online Web Users */}
          <div className="glass rounded-2xl p-5 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Web App Users Online
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400">
                  {onlineUsers.length} active
                </span>
              </h3>
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {onlineUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">No users currently online</p>
                  <p className="text-[10px] text-gray-700 mt-1">Users appear here when they visit the app</p>
                </div>
              )}
              {onlineUsers.map((user, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-800/50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">
                      {(user.userName || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {user.userName || 'Anonymous'}
                      {!user.userId && <span className="text-[10px] text-gray-600 ml-1">(guest)</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-gray-600" />
                      <span className="text-[10px] text-gray-500">{user.page}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-emerald-400">Live</span>
                    </div>
                    <span className="text-[10px] text-gray-600">{formatAgo(user.secondsAgo)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active WhatsApp Users */}
          <div className="glass rounded-2xl p-5 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-green-400" />
                WhatsApp Conversations
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400">
                  {waUsers.length} active
                </span>
              </h3>
              <MessageCircle className="w-4 h-4 text-gray-600" />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {waUsers.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">No active WhatsApp conversations</p>
                  <p className="text-[10px] text-gray-700 mt-1">Users appear here when they message the bot</p>
                </div>
              )}
              {waUsers.map((user, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-800/50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{maskPhone(user.phone)}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {user.eventLabel && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">
                          {user.eventLabel}
                        </span>
                      )}
                      {user.province && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">
                          {user.province}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                      Step {user.step + 1}/{stepNames.length}
                    </span>
                    <p className="text-[10px] text-gray-600 mt-1">{formatAgo(user.secondsAgo)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Type Breakdown */}
        {overview && overview.eventTypeBreakdown.length > 0 && (
          <div className="glass rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Events by Type
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {overview.eventTypeBreakdown.map((et, i) => (
                <div key={i} className="glass rounded-xl p-4 border border-gray-800/50 text-center">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS[i % COLORS.length]}20` }}>
                    <span className="text-lg">
                      {et.event_type === 'wedding' ? '💒' :
                        et.event_type === 'birthday' ? '🎂' :
                          et.event_type === 'funeral' ? '⚰️' :
                            et.event_type === 'umgidi' ? '🐄' :
                              et.event_type === 'lobola' ? '💍' : '🎉'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-white">{et.count}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{et.event_type}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
