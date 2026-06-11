import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse, ChevronLeft, RefreshCw, Server, Database,
  Globe, Webhook, Clock, AlertTriangle, CheckCircle,
  XCircle, Activity, TrendingUp, Cpu, MemoryStick,
  HardDrive, Zap, ShieldAlert, ArrowUpRight, Pause, Play
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer
} from 'recharts';

const API_URL = import.meta.env.VITE_ANALYTICS_API_URL || 'https://your-bot-server.com';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTimeMs: number | null;
  lastChecked: string;
  error: string | null;
  details: Record<string, string | number | boolean | undefined>;
}

interface HealthSummary {
  overall: 'healthy' | 'degraded' | 'down';
  checkedAt: string;
  services: ServiceHealth[];
}

interface HistoryPoint {
  checked_at: string;
  status: string;
  response_time_ms: number | null;
}

const SERVICE_META: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  bot_server: { icon: Server, label: 'Bot Server', color: '#6366f1' },
  database: { icon: Database, label: 'Database', color: '#14b8a6' },
  meta_api: { icon: Globe, label: 'Meta WhatsApp API', color: '#25D366' },
  webhook: { icon: Webhook, label: 'Webhook Endpoint', color: '#f59e0b' }
};

export function AdminHealth() {
  const navigate = useNavigate();
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const [history, setHistory] = useState<Record<string, HistoryPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setHealth(data);

        // Fetch history for each service
        const historyPromises = data.services.map(async (s: ServiceHealth) => {
          try {
            const hRes = await fetch(`${API_URL}/api/health/history/${s.name}?hours=6`);
            if (hRes.ok) {
              const hData = await hRes.json();
              return { name: s.name, data: hData.data || [] };
            }
            return { name: s.name, data: [] };
          } catch {
            return { name: s.name, data: [] };
          }
        });

        const historyResults = await Promise.all(historyPromises);
        const historyMap: Record<string, HistoryPoint[]> = {};
        historyResults.forEach(r => { historyMap[r.name] = r.data; });
        setHistory(historyMap);
      }
    } catch (err) {
      console.warn('[Health] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const runManualCheck = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/health/check`, { method: 'POST' });
      await fetchHealth();
    } catch (err) {
      console.warn('[Health] Manual check error:', err);
    }
  };

  useEffect(() => {
    fetchHealth();
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchHealth, 15000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh]);

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => {
      if (prev && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return !prev;
    });
  };

  const overallIcon = () => {
    if (!health) return Activity;
    if (health.overall === 'healthy') return CheckCircle;
    if (health.overall === 'degraded') return AlertTriangle;
    return XCircle;
  };

  const overallColor = () => {
    if (!health) return '#6b7280';
    if (health.overall === 'healthy') return '#10b981';
    if (health.overall === 'degraded') return '#f59e0b';
    return '#ef4444';
  };

  const statusBadge = (status: string) => {
    if (status === 'healthy') return {
      bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle, label: 'Healthy'
    };
    if (status === 'degraded') return {
      bg: 'bg-amber-500/10', text: 'text-amber-400', icon: AlertTriangle, label: 'Degraded'
    };
    return {
      bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle, label: 'Down'
    };
  };

  const formatTime = (iso: string) => {
    try { return new Date(iso).toLocaleTimeString(); } catch { return '—'; }
  };

  // Process history for chart
  const getChartData = (serviceName: string) => {
    const data = history[serviceName] || [];
    return data
      .slice(0, 30)
      .reverse()
      .map(h => ({
        time: new Date(h.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responseTime: h.response_time_ms || 0,
        status: h.status
      }));
  };

  // Calculate uptime percentage
  const getUptime = (serviceName: string) => {
    const data = history[serviceName] || [];
    if (data.length === 0) return null;
    const healthy = data.filter(h => h.status === 'healthy').length;
    return Math.round((healthy / data.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${overallColor()}20` }}>
          {(() => { const Icon = overallIcon(); return <Icon className="w-5 h-5" style={{ color: overallColor() }} />; })()}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">System Health</h1>
          <p className="text-[10px] text-gray-500">
            {health ? `All systems ${health.overall} · Checked ${formatTime(health.checkedAt)}` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAutoRefresh}
            className={`p-2 rounded-lg transition-all ${autoRefresh ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800/50 text-gray-500'}`}
            title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          >
            {autoRefresh ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={runManualCheck}
            className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white transition-all"
            title="Run checks now"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Overall Status Banner */}
        <div className="glass rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${overallColor()}20` }}>
              <HeartPulse className="w-7 h-7" style={{ color: overallColor() }} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">
                {health ? `System ${health.overall.charAt(0).toUpperCase() + health.overall.slice(1)}` : 'Checking...'}
              </h2>
              <p className="text-xs text-gray-500">
                {health
                  ? `${health.services.filter(s => s.status === 'healthy').length}/${health.services.length} services operational`
                  : 'Fetching health data...'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {health?.services.map((s, i) => {
                const meta = SERVICE_META[s.name] || { icon: Activity, color: '#6b7280' };
                const Icon = meta.icon;
                return (
                  <div key={i} className="text-center">
                    <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center ${s.status === 'healthy' ? 'bg-emerald-500/10' : s.status === 'degraded' ? 'bg-amber-500/10' : 'bg-red-500/10'}`}>
                      <Icon className="w-4 h-4" style={{ color: s.status === 'healthy' ? '#10b981' : s.status === 'degraded' ? '#f59e0b' : '#ef4444' }} />
                    </div>
                    <p className="text-[9px] text-gray-600 mt-1 capitalize">{meta.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {health?.services.map((service, i) => {
            const meta = SERVICE_META[service.name] || { icon: Activity, label: service.name, color: '#6b7280' };
            const Icon = meta.icon;
            const badge = statusBadge(service.status);
            const BadgeIcon = badge.icon;
            const chartData = getChartData(service.name);
            const uptime = getUptime(service.name);

            return (
              <div key={i} className="glass rounded-2xl p-5 border border-gray-700/50">
                {/* Service Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${meta.color}20` }}>
                      <Icon className="w-5 h-5" style={{ color: meta.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{meta.label}</h3>
                      <p className="text-[10px] text-gray-500">{service.name}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${badge.bg}`}>
                    <BadgeIcon className={`w-3 h-3 ${badge.text}`} />
                    <span className={`text-[10px] font-medium ${badge.text}`}>{badge.label}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded-lg bg-gray-800/30">
                    <Clock className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-white">
                      {service.responseTimeMs ? `${service.responseTimeMs}ms` : '—'}
                    </p>
                    <p className="text-[9px] text-gray-600">Response</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-800/30">
                    <TrendingUp className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-white">{uptime !== null ? `${uptime}%` : '—'}</p>
                    <p className="text-[9px] text-gray-600">Uptime</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-800/30">
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-white">{formatTime(service.lastChecked)}</p>
                    <p className="text-[9px] text-gray-600">Checked</p>
                  </div>
                </div>

                {/* Response Time Chart */}
                {chartData.length > 0 && (
                  <div className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id={`grad-${service.name}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={meta.color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={meta.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="responseTime"
                          stroke={meta.color}
                          strokeWidth={1.5}
                          fill={`url(#grad-${service.name})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Error message */}
                {service.error && (
                  <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-[10px] text-red-400 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      {service.error}
                    </p>
                  </div>
                )}

                {/* Bot Server Details */}
                {service.name === 'bot_server' && service.details && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <Cpu className="w-3 h-3 text-gray-600" />
                      Node {service.details.nodeVersion}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3 text-gray-600" />
                      Up {service.details.uptimeHuman}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <MemoryStick className="w-3 h-3 text-gray-600" />
                      {service.details.memoryUsedMB}MB RAM
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <HardDrive className="w-3 h-3 text-gray-600" />
                      Heap {service.details.memoryHeapMB}MB
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Response Time Comparison */}
        {health && (
          <div className="glass rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Response Time Comparison
            </h3>
            <div className="space-y-3">
              {health.services.map((service, i) => {
                const meta = SERVICE_META[service.name] || { label: service.name, color: '#6b7280' };
                const responseTime = service.responseTimeMs || 0;
                const maxResponse = Math.max(...health.services.map(s => s.responseTimeMs || 0), 100);
                const widthPercent = maxResponse > 0 ? (responseTime / maxResponse) * 100 : 0;

                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{meta.label}</span>
                      <span className="text-xs text-gray-500">{responseTime > 0 ? `${responseTime}ms` : 'N/A'}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(widthPercent, 5)}%`,
                          backgroundColor: service.status === 'healthy' ? '#10b981' : service.status === 'degraded' ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Alerts / Incidents */}
        {health && health.services.some(s => s.status !== 'healthy') && (
          <div className="glass rounded-2xl p-5 border border-red-500/30 bg-red-500/5">
            <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Active Alerts
            </h3>
            <div className="space-y-2">
              {health.services
                .filter(s => s.status !== 'healthy')
                .map((service, i) => {
                  const meta = SERVICE_META[service.name] || { label: service.name };
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-white">{meta.label} is {service.status}</p>
                        {service.error && <p className="text-[10px] text-red-400">{service.error}</p>}
                      </div>
                      <span className="text-[10px] text-gray-500">{formatTime(service.lastChecked)}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
