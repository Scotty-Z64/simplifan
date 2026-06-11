import { useState, useMemo } from 'react';
import { VendorLayout } from '@/components/VendorLayout';
import {
  DollarSign, TrendingUp, TrendingDown, Wallet,
  Receipt, Calendar, CheckCircle, AlertCircle,
  PieChart as PieIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface EarningRecord {
  id: string;
  bookingId: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'pending' | 'paid_out' | 'held';
  paidAt?: string;
  createdAt: string;
}

function getEarnings(): EarningRecord[] {
  const stored = JSON.parse(localStorage.getItem('sp_vendor_earnings') || '[]');
  if (stored.length === 0) return seedDemoEarnings();
  return stored;
}

function seedDemoEarnings(): EarningRecord[] {
  const demo: EarningRecord[] = [
    { id: 'earn_1', bookingId: 'bk_1', clientName: 'Thabo Mokoena', eventType: 'Wedding', eventDate: '2026-05-20', grossAmount: 25000, platformFee: 1250, netAmount: 23750, status: 'paid_out', paidAt: '2026-05-22', createdAt: '2026-05-15' },
    { id: 'earn_2', bookingId: 'bk_2', clientName: 'Lerato Khumalo', eventType: 'Funeral', eventDate: '2026-06-10', grossAmount: 15000, platformFee: 750, netAmount: 14250, status: 'paid_out', paidAt: '2026-06-12', createdAt: '2026-06-05' },
    { id: 'earn_3', bookingId: 'bk_3', clientName: 'Sipho Ndlovu', eventType: 'Birthday', eventDate: '2026-06-25', grossAmount: 8000, platformFee: 400, netAmount: 7600, status: 'held', createdAt: '2026-06-15' },
    { id: 'earn_4', bookingId: 'bk_4', clientName: 'Mary van Wyk', eventType: 'Baby Shower', eventDate: '2026-07-05', grossAmount: 4500, platformFee: 0, netAmount: 4500, status: 'pending', createdAt: '2026-06-18' },
  ];
  localStorage.setItem('sp_vendor_earnings', JSON.stringify(demo));
  return demo;
}

export function VendorEarnings() {
  const [earnings] = useState<EarningRecord[]>(getEarnings());

  const stats = useMemo(() => {
    const totalGross = earnings.reduce((s, e) => s + e.grossAmount, 0);
    const totalFees = earnings.reduce((s, e) => s + e.platformFee, 0);
    const totalNet = earnings.reduce((s, e) => s + e.netAmount, 0);
    const paidOut = earnings.filter(e => e.status === 'paid_out').reduce((s, e) => s + e.netAmount, 0);
    const held = earnings.filter(e => e.status === 'held').reduce((s, e) => s + e.netAmount, 0);
    const pending = earnings.filter(e => e.status === 'pending').reduce((s, e) => s + e.netAmount, 0);
    return { totalGross, totalFees, totalNet, paidOut, held, pending, bookingCount: earnings.length };
  }, [earnings]);

  const feeBreakdown = [
    { name: 'You Keep', value: stats.totalNet, color: '#10B981' },
    { name: 'Platform Fee', value: stats.totalFees, color: '#F59E0B' },
  ];

  return (
    <VendorLayout title="My Earnings">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Total Earnings Card */}
        <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '1px solid #A7F3D0' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#6EE7B7' }}>Total Net Earnings</p>
          <p className="text-3xl font-bold" style={{ color: '#059669' }}>R{stats.totalNet.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
            <span className="text-xs font-semibold" style={{ color: '#10B981' }}>{stats.bookingCount} bookings</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: DollarSign, label: 'Paid Out', value: `R${stats.paidOut.toLocaleString()}`, color: '#10B981', bg: '#ECFDF5' },
            { icon: Wallet, label: 'Held', value: `R${stats.held.toLocaleString()}`, color: '#F59E0B', bg: '#FFFBEB' },
            { icon: Receipt, label: 'Gross Revenue', value: `R${stats.totalGross.toLocaleString()}`, color: '#3B82F6', bg: '#EFF6FF' },
            { icon: TrendingDown, label: 'Platform Fees', value: `R${stats.totalFees.toLocaleString()}`, color: '#EF4444', bg: '#FEF2F2' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
              <p className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{s.value}</p>
              <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Fee Transparency */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#1a1a2e' }}>
            <PieIcon className="w-4 h-4" style={{ color: '#2BBCA8' }} /> Where Your Money Goes
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={feeBreakdown} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value" stroke="none">
                    {feeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {feeBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium" style={{ color: '#64748B' }}>{item.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>R{item.value.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                <span className="text-xs" style={{ color: '#94A3B8' }}>Effective Rate</span>
                <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>
                  {stats.totalGross > 0 ? ((stats.totalFees / stats.totalGross) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Per-Booking Breakdown */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>Booking Breakdown</h3>
          <div className="space-y-3">
            {earnings.map(e => (
              <div key={e.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: e.status === 'paid_out' ? '#ECFDF5' : e.status === 'held' ? '#FFFBEB' : '#F1F5F9' }}>
                  {e.status === 'paid_out' ? <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} /> : e.status === 'held' ? <AlertCircle className="w-5 h-5" style={{ color: '#F59E0B' }} /> : <Calendar className="w-5 h-5" style={{ color: '#94A3B8' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1a1a2e' }}>{e.clientName}</p>
                  <p className="text-[11px]" style={{ color: '#94A3B8' }}>{e.eventType} &middot; {e.eventDate}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>R{e.netAmount.toLocaleString()}</p>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>R{e.grossAmount.toLocaleString()} - R{e.platformFee} fee</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Info */}
        <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: '#1a1a2e' }}>Payout Schedule</h3>
          <p className="text-xs mb-3" style={{ color: '#64748B' }}>
            Deposits are held until the event date + 48 hours (to cover dispute window). After that, payouts are processed every Monday.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
            <Wallet className="w-4 h-4" style={{ color: '#2BBCA8' }} />
            <span>Next payout: </span>
            <span className="font-bold" style={{ color: '#2BBCA8' }}>R{stats.held.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
