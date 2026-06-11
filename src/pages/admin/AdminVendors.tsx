import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { ArrowLeft, Star, TrendingUp, TrendingDown, Minus, Search } from 'lucide-react';

export function AdminVendors() {
  const navigate = useNavigate();
  const { vendorPerformance } = useAdmin();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'revenue' | 'bookings' | 'rating' | 'response'>('revenue');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [...new Set(vendorPerformance.map(v => v.category))];

  const filtered = vendorPerformance
    .filter(v => v.vendorName.toLowerCase().includes(search.toLowerCase()))
    .filter(v => filterCategory === 'all' || v.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.totalRevenue - a.totalRevenue;
      if (sortBy === 'bookings') return b.totalBookings - a.totalBookings;
      if (sortBy === 'rating') return b.avgRating - a.avgRating;
      return b.responseRate - a.responseRate;
    });

  const topVendor = filtered[0];
  const avgResponse = Math.round(vendorPerformance.reduce((s, v) => s + v.responseRate, 0) / vendorPerformance.length);
  const avgRating = (vendorPerformance.reduce((s, v) => s + v.avgRating, 0) / vendorPerformance.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Vendor Performance</h1>
      </div>
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass rounded-xl p-4 border border-gray-700/50"><p className="text-2xl font-bold text-white">{vendorPerformance.length}</p><p className="text-[10px] text-gray-500">Active Vendors</p></div>
          <div className="glass rounded-xl p-4 border border-gray-700/50"><p className="text-2xl font-bold text-emerald-400">{avgResponse}%</p><p className="text-[10px] text-gray-500">Avg Response Rate</p></div>
          <div className="glass rounded-xl p-4 border border-gray-700/50"><p className="text-2xl font-bold text-amber-400">{avgRating}</p><p className="text-[10px] text-gray-500">Avg Rating</p></div>
          <div className="glass rounded-xl p-4 border border-gray-700/50"><p className="text-2xl font-bold text-purple-400">R{(vendorPerformance.reduce((s, v) => s + v.totalRevenue, 0) / 1000000).toFixed(1)}M</p><p className="text-[10px] text-gray-500">Total GMV</p></div>
        </div>

        {/* Top Vendor Highlight */}
        {topVendor && (
          <div className="glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3"><Star className="w-5 h-5 text-amber-400 fill-amber-400" /><span className="text-sm font-semibold text-amber-400">#1 Top Performer</span></div>
            <div className="flex flex-wrap items-center gap-6">
              <div><p className="text-lg font-bold text-white">{topVendor.vendorName}</p><p className="text-xs text-gray-500">{topVendor.category} · {topVendor.area}</p></div>
              <div className="text-center"><p className="text-lg font-bold text-white">{topVendor.totalBookings}</p><p className="text-[10px] text-gray-500">Bookings</p></div>
              <div className="text-center"><p className="text-lg font-bold text-emerald-400">R{(topVendor.totalRevenue / 1000).toFixed(0)}k</p><p className="text-[10px] text-gray-500">Revenue</p></div>
              <div className="text-center"><p className="text-lg font-bold text-amber-400">{topVendor.avgRating}</p><p className="text-[10px] text-gray-500">Rating</p></div>
              <div className="text-center"><p className="text-lg font-bold text-blue-400">{topVendor.responseRate}%</p><p className="text-[10px] text-gray-500">Response</p></div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..." className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm" /></div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm">
            <option value="revenue">Sort by Revenue</option>
            <option value="bookings">Sort by Bookings</option>
            <option value="rating">Sort by Rating</option>
            <option value="response">Sort by Response</option>
          </select>
        </div>

        {/* Vendor Table */}
        <div className="glass rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-800/50">
                <th className="text-left text-xs text-gray-500 font-medium p-3">Vendor</th>
                <th className="text-left text-xs text-gray-500 font-medium p-3">Category</th>
                <th className="text-right text-xs text-gray-500 font-medium p-3">Bookings</th>
                <th className="text-right text-xs text-gray-500 font-medium p-3">Revenue</th>
                <th className="text-right text-xs text-gray-500 font-medium p-3">Rating</th>
                <th className="text-right text-xs text-gray-500 font-medium p-3">Response</th>
                <th className="text-center text-xs text-gray-500 font-medium p-3">Trend</th>
              </tr></thead>
              <tbody>
                {filtered.map((v, i) => (
                  <tr key={v.vendorId} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
                    <td className="p-3"><div className="flex items-center gap-2"><span className="text-[10px] text-gray-600 w-5">#{i + 1}</span><div><p className="text-sm text-white">{v.vendorName}</p><p className="text-[10px] text-gray-500">{v.area}</p></div></div></td>
                    <td className="p-3"><span className="text-xs text-gray-400">{v.category}</span></td>
                    <td className="p-3 text-right"><span className="text-sm text-white">{v.totalBookings}</span></td>
                    <td className="p-3 text-right"><span className="text-sm text-emerald-400">R{(v.totalRevenue / 1000).toFixed(0)}k</span></td>
                    <td className="p-3 text-right"><div className="flex items-center justify-end gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-sm text-white">{v.avgRating}</span></div></td>
                    <td className="p-3 text-right"><span className={`text-sm ${v.responseRate >= 95 ? 'text-emerald-400' : v.responseRate >= 85 ? 'text-amber-400' : 'text-red-400'}`}>{v.responseRate}%</span></td>
                    <td className="p-3 text-center">{v.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto" /> : v.trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-400 mx-auto" /> : <Minus className="w-4 h-4 text-gray-500 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
