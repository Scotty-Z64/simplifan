import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Calendar, Search, MapPin, Users, DollarSign,
  Loader2, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

const STATUS_STYLES: Record<string, { color: string; bg: string; icon: any }> = {
  planning: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', icon: Clock },
  quoted: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: DollarSign },
  deposit_paid: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', icon: CheckCircle },
  confirmed: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  ready: { color: '#2BBCA8', bg: 'rgba(43,188,168,0.1)', icon: CheckCircle },
  completed: { color: '#64748B', bg: 'rgba(100,116,139,0.1)', icon: CheckCircle },
  cancelled: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: AlertCircle },
};

export function AdminEvents() {
  const navigate = useNavigate();
  const { data: events, isLoading } = trpc.event.list.useQuery({ limit: 100 });

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const statuses = [...new Set((events ?? []).map(e => e.status))];

  const filtered = (events ?? [])
    .filter(e => !search || e.eventType.toLowerCase().includes(search.toLowerCase()) || e.clientName.toLowerCase().includes(search.toLowerCase()))
    .filter(e => filterStatus === 'all' || e.status === filterStatus);

  const stats = {
    total: events?.length ?? 0,
    planning: events?.filter(e => e.status === 'planning').length ?? 0,
    confirmed: events?.filter(e => e.status === 'confirmed' || e.status === 'ready').length ?? 0,
    completed: events?.filter(e => e.status === 'completed').length ?? 0,
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Event Management</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Events', value: stats.total, icon: Calendar, color: '#8B5CF6' },
            { label: 'Planning', value: stats.planning, icon: Clock, color: '#3B82F6' },
            { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: '#10B981' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#64748B' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <s.icon className="w-4 h-4 mb-2" style={{ color: s.color }} />
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
              className="w-full pl-10 pr-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <option value="all" style={{ background: '#0f172a' }}>All Status</option>
            {statuses.map(s => <option key={s} value={s} style={{ background: '#0f172a' }}>{s}</option>)}
          </select>
        </div>

        {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#8B5CF6' }} /></div>}

        {/* Events Table */}
        {!isLoading && (
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Event</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Client</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Guests</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Budget</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => {
                    const st = STATUS_STYLES[e.status] || STATUS_STYLES.planning;
                    return (
                      <tr key={e.id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-white">{e.eventType}</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{e.province ?? 'N/A'}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-300">{e.clientName}</p>
                          <p className="text-[10px] text-gray-500">{e.clientPhone}</p>
                        </td>
                        <td className="px-4 py-3"><span className="text-xs text-gray-400">{e.eventDate ?? 'TBD'}</span></td>
                        <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs text-gray-400"><Users className="w-3 h-3" />{e.guestCount ?? 0}</span></td>
                        <td className="px-4 py-3"><span className="text-xs font-bold text-emerald-400">R{Number(e.budget).toLocaleString()}</span></td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: st.bg, color: st.color }}>{e.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <p className="text-sm text-center py-8 text-gray-500">No events found</p>}
          </div>
        )}
      </div>
    </div>
  );
}
