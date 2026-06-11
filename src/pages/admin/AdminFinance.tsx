import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Wallet, Receipt, ArrowUpRight, ArrowDownRight, Download, CreditCard, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { getPaymentRecords } from '@/lib/payfast';

export function AdminFinance() {
  const navigate = useNavigate();
  const { monthlyRevenue, financials } = useAdmin();
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    setPayments(getPaymentRecords());
  }, []);

  const totalRevenue = financials.filter(f => f.amount > 0).reduce((s, f) => s + f.amount, 0);
  const totalPayouts = financials.filter(f => f.amount < 0).reduce((s, f) => s + f.amount, 0);
  const netRevenue = totalRevenue + totalPayouts; // payouts are negative
  const platformFees = financials.filter(f => f.type === 'platform_fee').reduce((s, f) => s + f.amount, 0);
  const vendorSubs = financials.filter(f => f.type === 'vendor_sub').reduce((s, f) => s + f.amount, 0);
  const featuredRev = financials.filter(f => f.type === 'featured_listing').reduce((s, f) => s + f.amount, 0);

  // Payment tracking from PayFast
  const totalPaymentVolume = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const paymentCount = payments.filter(p => p.status === 'completed').length;
  const avgPaymentSize = paymentCount > 0 ? totalPaymentVolume / paymentCount : 0;

  const revByType = [
    { name: 'Platform Fees', value: platformFees, color: '#14b8a6' },
    { name: 'Vendor Subs', value: vendorSubs, color: '#f59e0b' },
    { name: 'Featured', value: featuredRev, color: '#6366f1' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Financial Overview</h1>
        <button className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white"><Download className="w-4 h-4" /></button>
      </div>
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass rounded-xl p-4 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-emerald-400" /><span className="text-xs text-gray-500">Net Revenue</span></div>
            <p className="text-xl font-bold text-white">R{netRevenue.toLocaleString('en-ZA')}</p>
            <div className="flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3 text-emerald-400" /><span className="text-[10px] text-emerald-400">+15% vs last month</span></div>
          </div>
          <div className="glass rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2"><Receipt className="w-4 h-4 text-blue-400" /><span className="text-xs text-gray-500">Platform Fees</span></div>
            <p className="text-xl font-bold text-white">R{platformFees.toLocaleString('en-ZA')}</p>
            <div className="flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3 text-emerald-400" /><span className="text-[10px] text-emerald-400">+8% vs last month</span></div>
          </div>
          <div className="glass rounded-xl p-4 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2"><Wallet className="w-4 h-4 text-amber-400" /><span className="text-xs text-gray-500">Vendor Subs</span></div>
            <p className="text-xl font-bold text-white">R{vendorSubs.toLocaleString('en-ZA')}</p>
            <div className="flex items-center gap-1 mt-1"><ArrowUpRight className="w-3 h-3 text-emerald-400" /><span className="text-[10px] text-emerald-400">+22% vs last month</span></div>
          </div>
          <div className="glass rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-400" /><span className="text-xs text-gray-500">Payouts</span></div>
            <p className="text-xl font-bold text-red-400">R{Math.abs(totalPayouts).toLocaleString('en-ZA')}</p>
            <div className="flex items-center gap-1 mt-1"><ArrowDownRight className="w-3 h-3 text-red-400" /><span className="text-[10px] text-red-400">-5% vs last month</span></div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-400" />Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyRevenue}>
                <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} /><stop offset="95%" stopColor="#14b8a6" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} tickFormatter={v => `R${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="platform" stroke="#14b8a6" strokeWidth={2} fill="url(#revGrad)" name="Platform Revenue" />
                <Area type="monotone" dataKey="vendors" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} name="Vendor Subs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="glass rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-white mb-4">Revenue by Type</h3>
            <div className="space-y-4">
              {revByType.map((r, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-400">{r.name}</span><span className="text-xs text-white">R{r.value.toLocaleString('en-ZA')}</span></div>
                  <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${netRevenue > 0 ? (r.value / netRevenue) * 100 : 0}%`, backgroundColor: r.color }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800/50"><p className="text-xs text-gray-500">Projected Year-End (at current growth)</p><p className="text-lg font-bold text-emerald-400">R {(netRevenue * 12 / 1000000).toFixed(1)}M</p></div>
          </div>
        </div>

        {/* Payment Tracking */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-400" />Payment Tracking (PayFast)</h3>
            <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">{paymentCount} payments</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gray-800/30 text-center">
              <p className="text-lg font-bold text-white">R{totalPaymentVolume.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500">Total Volume</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-800/30 text-center">
              <p className="text-lg font-bold text-white">{paymentCount}</p>
              <p className="text-[10px] text-gray-500">Deposits Paid</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-800/30 text-center">
              <p className="text-lg font-bold text-white">R{Math.round(avgPaymentSize).toLocaleString()}</p>
              <p className="text-[10px] text-gray-500">Avg Deposit</p>
            </div>
          </div>
          {payments.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {payments.slice(0, 10).reverse().map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{p.type === 'deposit' ? 'Deposit' : 'Payment'} — Booking {p.bookingId?.slice(-6)}</p>
                      <p className="text-[10px] text-gray-500">{new Date(p.createdAt).toLocaleDateString('en-ZA')}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-emerald-400">R{p.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CreditCard className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-600">No payments recorded yet</p>
              <p className="text-[10px] text-gray-700">Payments will appear here when clients pay deposits through PayFast</p>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-2">
            {financials.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {tx.amount > 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                  </div>
                  <div><p className="text-sm text-white">{tx.description}</p><p className="text-[10px] text-gray-500">{tx.date}</p></div>
                </div>
                <span className={`text-sm font-medium ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{tx.amount > 0 ? '+' : ''}R{tx.amount.toLocaleString('en-ZA')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
