import { useState } from 'react';
import { useUnified } from '@/context/UnifiedContext';
import { VendorLayout } from '@/components/VendorLayout';
import {
  DollarSign, TrendingUp, TrendingDown, Calendar,
  Download, Wallet, CircleDot, Receipt
} from 'lucide-react';

type Period = 'week' | 'month' | 'year' | 'all';

export function VendorAnalytics() {
  const { vendorUser, getVendorTransactions, transactions } = useUnified();
  const myTx = vendorUser ? getVendorTransactions(vendorUser.id) : [];
  const [period, setPeriod] = useState<Period>('month');

  const now = new Date('2026-06-04');
  const filteredTx = myTx.filter(tx => {
    const txDate = new Date(tx.date);
    if (period === 'week') {
      const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
      return txDate >= weekAgo;
    }
    if (period === 'month') {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }
    if (period === 'year') {
      return txDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const paidTx = filteredTx.filter(t => t.status === 'paid');
  const pendingTx = filteredTx.filter(t => t.status === 'pending');
  const totalEarned = paidTx.reduce((s, t) => s + t.amount, 0);
  const totalPending = pendingTx.reduce((s, t) => s + t.amount, 0);
  const totalTips = paidTx.filter(t => t.type === 'tip').reduce((s, t) => s + t.amount, 0);
  const avgPerJob = paidTx.filter(t => t.type !== 'tip').length > 0
    ? Math.round(totalEarned / paidTx.filter(t => t.type !== 'tip').length)
    : 0;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlyData = months.map((m, i) => {
    const monthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === i && d.getFullYear() === 2026 && t.vendorId === vendorUser?.id && t.status === 'paid';
    });
    return { month: m, amount: monthTx.reduce((s, t) => s + t.amount, 0), jobs: monthTx.filter(t => t.type !== 'tip').length };
  });
  const maxMonthly = Math.max(...monthlyData.map(d => d.amount), 1);

  const categoryMap: Record<string, number> = {};
  paidTx.forEach(t => {
    const key = t.type === 'deposit' ? 'Deposits' : t.type === 'tip' ? 'Tips' : 'Full Payments';
    categoryMap[key] = (categoryMap[key] || 0) + t.amount;
  });
  const categoryBreakdown = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const totalCategory = categoryBreakdown.reduce((s, [, v]) => s + v, 0) || 1;

  return (
    <VendorLayout title="Earnings & Analytics">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Performance Overview</h2>
          <select value={period} onChange={e => setPeriod(e.target.value as Period)}
            className="px-3 py-2 rounded-xl text-xs font-semibold outline-none"
            style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#ECFDF5' }}>
                <Wallet className="w-4 h-4" style={{ color: '#10B981' }} />
              </div>
              <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>Total Earned</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>R {totalEarned.toLocaleString('en-ZA')}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" style={{ color: '#10B981' }} />
              <span className="text-[10px] font-semibold" style={{ color: '#10B981' }}>+12% from last period</span>
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FFFBEB' }}>
                <Receipt className="w-4 h-4" style={{ color: '#F59E0B' }} />
              </div>
              <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>Pending</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>R {totalPending.toLocaleString('en-ZA')}</p>
            <div className="flex items-center gap-1 mt-2">
              <CircleDot className="w-3 h-3" style={{ color: '#F59E0B' }} />
              <span className="text-[10px] font-semibold" style={{ color: '#F59E0B' }}>{pendingTx.length} awaiting payment</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Jobs Done', value: paidTx.filter(t => t.type !== 'tip').length, icon: Calendar },
            { label: 'Avg/Job', value: `R${avgPerJob.toLocaleString('en-ZA')}`, icon: DollarSign },
            { label: 'Tips', value: `R${totalTips.toLocaleString('en-ZA')}`, icon: TrendingUp },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 text-center" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: '#2BBCA8' }} />
              <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>{s.value}</p>
              <p className="text-[9px] font-medium" style={{ color: '#94A3B8' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Monthly Chart */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>Earnings Trend</h3>
          <div className="flex items-end gap-3 h-36">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center">
                  {d.amount > 0 && (
                    <span className="text-[9px] font-bold mb-1" style={{ color: '#2BBCA8' }}>R{(d.amount / 1000).toFixed(0)}k</span>
                  )}
                  <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: 90, background: '#F1F5F9' }}>
                    <div className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all"
                      style={{ height: `${(d.amount / maxMonthly) * 90}px`, background: 'linear-gradient(to top, #2BBCA8, #34D399)' }} />
                  </div>
                </div>
                <span className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>Payment Breakdown</h3>
            <div className="space-y-4">
              {categoryBreakdown.map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: '#64748B' }}>{cat}</span>
                    <span className="text-xs font-bold" style={{ color: '#1a1a2e' }}>R {amount.toLocaleString('en-ZA')}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                    <div className="h-full rounded-full" style={{ width: `${(amount / totalCategory) * 100}%`, background: 'linear-gradient(90deg, #F59E0B, #D97706)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>Recent Transactions</h3>
          <div className="space-y-3">
            {filteredTx.slice(0, 10).map(tx => (
              <div key={tx.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: tx.status === 'paid' ? '#ECFDF5' : tx.status === 'pending' ? '#FFFBEB' : '#FEF2F2' }}>
                  {tx.status === 'paid' ? <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} /> :
                   tx.status === 'pending' ? <CircleDot className="w-5 h-5" style={{ color: '#F59E0B' }} /> :
                   <TrendingDown className="w-5 h-5" style={{ color: '#EF4444' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1a1a2e' }}>{tx.eventName}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{tx.clientName} | {tx.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: '#2BBCA8' }}>R {tx.amount.toLocaleString('en-ZA')}</p>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>{tx.date}</p>
                </div>
              </div>
            ))}
            {filteredTx.length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: '#94A3B8' }}>No transactions in this period</p>
            )}
          </div>
        </div>

        {/* Export */}
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
          style={{ background: 'white', border: '1px dashed #CBD5E1', color: '#64748B' }}>
          <Download className="w-4 h-4" /> Export Earnings Report
        </button>
      </div>
    </VendorLayout>
  );
}
