import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Calendar, Search, DollarSign, CheckCircle,
  XCircle, Loader2, Clock
} from 'lucide-react';

export function AdminBookings() {
  const navigate = useNavigate();
  const { data: bookings, isLoading } = trpc.booking.list.useQuery({ limit: 100 });

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const statuses = [...new Set((bookings ?? []).map(b => b.status))];

  const filtered = (bookings ?? [])
    .filter(b => !search || b.clientName.toLowerCase().includes(search.toLowerCase()) || b.vendorName.toLowerCase().includes(search.toLowerCase()))
    .filter(b => filterStatus === 'all' || b.status === filterStatus);

  const stats = {
    total: bookings?.length ?? 0,
    pending: bookings?.filter(b => b.status === 'pending').length ?? 0,
    confirmed: bookings?.filter(b => b.status === 'confirmed').length ?? 0,
    completed: bookings?.filter(b => b.status === 'completed').length ?? 0,
    disputed: bookings?.filter(b => b.status === 'disputed').length ?? 0,
    revenue: bookings?.filter(b => b.status === 'completed' || b.status === 'confirmed').reduce((s, b) => s + Number(b.amount), 0) ?? 0,
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    confirmed: { label: 'Confirmed', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    deposit_paid: { label: 'Deposit Paid', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
    completed: { label: 'Completed', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    disputed: { label: 'Disputed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    cancelled: { label: 'Cancelled', color: '#64748B', bg: 'rgba(100,116,139,0.1)' },
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Booking Management</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total', value: stats.total, icon: Calendar, color: '#8B5CF6' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: '#F59E0B' },
            { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: '#10B981' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#3B82F6' },
            { label: 'Revenue', value: `R${(stats.revenue / 1000).toFixed(0)}k`, icon: DollarSign, color: '#10B981' },
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..."
              className="w-full pl-10 pr-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <option value="all" style={{ background: '#0f172a' }}>All Status</option>
            {statuses.map(s => <option key={s} value={s} style={{ background: '#0f172a' }}>{s}</option>)}
          </select>
        </div>

        {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#8B5CF6' }} /></div>}

        {/* Bookings Table */}
        {!isLoading && (
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Client</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Vendor</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Event</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Confirmed</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => {
                    const st = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-300">{b.clientName}</p>
                          <p className="text-[10px] text-gray-500">{b.clientPhone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-300">{b.vendorName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-300">{b.eventType}</p>
                          <p className="text-[10px] text-gray-500">{b.eventDate}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold text-emerald-400">R{Number(b.amount).toLocaleString()}</p>
                          {b.depositAmount && <p className="text-[10px] text-gray-500">Deposit: R{Number(b.depositAmount).toLocaleString()}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {b.clientConfirmed ? <CheckCircle className="w-3 h-3" style={{ color: '#10B981' }} /> : <XCircle className="w-3 h-3" style={{ color: '#EF4444' }} />}
                            <span className="text-[10px] text-gray-500">C</span>
                            {b.vendorConfirmed ? <CheckCircle className="w-3 h-3 ml-1" style={{ color: '#10B981' }} /> : <XCircle className="w-3 h-3 ml-1" style={{ color: '#EF4444' }} />}
                            <span className="text-[10px] text-gray-500">V</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <p className="text-sm text-center py-8 text-gray-500">No bookings found</p>}
          </div>
        )}
      </div>
    </div>
  );
}
