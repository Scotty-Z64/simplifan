import { useVendorAuth } from '@/context/VendorAuthContext';
import { TrendingUp, Eye, MousePointerClick, CalendarCheck, Wallet, Users, Target, ArrowUpRight, ArrowDownRight, Star, BadgeCheck, FileText, Package } from 'lucide-react';

export function VendorOverview() {
  const { vendor, analytics, bookings, quotes, products } = useVendorAuth();
  if (!vendor) return null;

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const newQuotes = quotes.filter(q => q.status === 'new').length;
  const activeProducts = products.filter(p => p.active).length;

  const stats = [
    { label: 'Total Views', value: analytics.views.toLocaleString('en-ZA'), change: '+23%', up: true, icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { label: 'Clicks', value: analytics.clicks.toLocaleString('en-ZA'), change: '+18%', up: true, icon: MousePointerClick, color: 'from-purple-500 to-violet-500' },
    { label: 'Bookings', value: analytics.bookings.toString(), change: '+12%', up: true, icon: CalendarCheck, color: 'from-emerald-500 to-teal-500' },
    { label: 'Revenue', value: `R ${analytics.revenue.toLocaleString('en-ZA')}`, change: '+45%', up: true, icon: Wallet, color: 'from-amber-500 to-orange-500' },
    { label: 'Leads', value: analytics.leads.toString(), change: '+8%', up: true, icon: Users, color: 'from-pink-500 to-rose-500' },
    { label: 'Conversion', value: `${analytics.conversionRate}%`, change: '+5.2%', up: true, icon: Target, color: 'from-indigo-500 to-blue-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Welcome back,</p>
            <h2 className="text-2xl font-bold text-white mb-2">{vendor.ownerName}</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm text-white font-medium">{vendor.rating}</span>
                <span className="text-xs text-gray-500">({vendor.reviews} reviews)</span>
              </div>
              {vendor.verified && (
                <span className="flex items-center gap-1 text-xs text-teal-400">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">This Month</p>
            <p className="text-xl font-bold text-teal-400">R {analytics.monthlyRevenue[analytics.monthlyRevenue.length - 1]?.value.toLocaleString('en-ZA')}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-0.5 text-xs ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Summary */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-base font-semibold text-white mb-4">Booking Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-amber-300">Pending</span>
              </div>
              <span className="text-lg font-bold text-amber-400">{pendingBookings}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-teal-400" />
                <span className="text-sm text-teal-300">Confirmed</span>
              </div>
              <span className="text-lg font-bold text-teal-400">{confirmedBookings}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-emerald-300">Completed</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">{completedBookings}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-base font-semibold text-white mb-4">Quick Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-purple-300">New Quote Requests</span>
              </div>
              <span className="text-lg font-bold text-purple-400">{newQuotes}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-blue-300">Active Products</span>
              </div>
              <span className="text-lg font-bold text-blue-400">{activeProducts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                <span className="text-sm text-pink-300">Profile Views</span>
              </div>
              <span className="text-lg font-bold text-pink-400">{analytics.views}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="glass rounded-2xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Monthly Performance</h3>
        <div className="space-y-4">
          {/* Revenue bars */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Revenue (R)</span>
              <span className="text-xs text-teal-400 font-medium">This Year</span>
            </div>
            <div className="flex items-end gap-3 h-32">
              {analytics.monthlyRevenue.map((m, i) => {
                const maxVal = Math.max(...analytics.monthlyRevenue.map(r => r.value));
                const height = (m.value / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-teal-400">R{(m.value / 1000).toFixed(0)}k</span>
                    <div className="w-full bg-gray-800 rounded-lg relative" style={{ height: '80px' }}>
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-teal-500 to-emerald-400 rounded-lg transition-all" style={{ height: `${height}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Views line */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Profile Views</span>
            </div>
            <div className="flex items-end gap-3 h-24">
              {analytics.monthlyViews.map((m, i) => {
                const maxVal = Math.max(...analytics.monthlyViews.map(v => v.value));
                const height = (m.value / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-purple-400">{m.value}</span>
                    <div className="w-full bg-gray-800 rounded-lg relative" style={{ height: '60px' }}>
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-lg transition-all" style={{ height: `${height}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="glass rounded-2xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-700/50">
                <th className="pb-2 pr-4">Customer</th>
                <th className="pb-2 pr-4">Event</th>
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id} className="border-b border-gray-800/30">
                  <td className="py-3 pr-4 text-white">{b.customerName}</td>
                  <td className="py-3 pr-4 text-gray-400">{b.eventType}</td>
                  <td className="py-3 pr-4 text-gray-400">{b.eventDate}</td>
                  <td className="py-3 pr-4 text-teal-400">R {b.totalAmount.toLocaleString('en-ZA')}</td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      b.status === 'confirmed' ? 'bg-teal-500/20 text-teal-400' :
                      b.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

