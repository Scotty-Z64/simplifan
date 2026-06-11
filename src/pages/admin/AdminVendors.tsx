import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Star, Search, CheckCircle, XCircle,
  Loader2, Store
} from 'lucide-react';

export function AdminVendors() {
  const navigate = useNavigate();

  // ─── Real API Data ───
  const { data: vendors, isLoading } = trpc.vendor.list.useQuery({ limit: 100 });
  const updateMutation = trpc.vendor.update.useMutation();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = [...new Set((vendors ?? []).map(v => v.category))];

  const filtered = (vendors ?? [])
    .filter(v => v.businessName.toLowerCase().includes(search.toLowerCase()))
    .filter(v => filterCategory === 'all' || v.category === filterCategory)
    .filter(v => filterStatus === 'all' || v.isActive === (filterStatus === 'active'));

  const stats = {
    total: vendors?.length ?? 0,
    verified: vendors?.filter(v => v.verified).length ?? 0,
    featured: vendors?.filter(v => v.featured).length ?? 0,
    avgRating: vendors && vendors.length > 0
      ? (vendors.reduce((s, v) => s + Number(v.rating), 0) / vendors.length).toFixed(1)
      : '0',
  };

  const toggleActive = (id: number, current: boolean) => {
    updateMutation.mutate({ id, isActive: !current });
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Vendor Management</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Vendors', value: stats.total, icon: Store, color: '#8B5CF6' },
            { label: 'Verified', value: stats.verified, icon: CheckCircle, color: '#10B981' },
            { label: 'Featured', value: stats.featured, icon: Star, color: '#F59E0B' },
            { label: 'Avg Rating', value: stats.avgRating, icon: Star, color: '#3B82F6' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-[10px] text-gray-500">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..."
              className="w-full pl-10 pr-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <option value="all" style={{ background: '#0f172a' }}>All Categories</option>
            {categories.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <option value="all" style={{ background: '#0f172a' }}>All Status</option>
            <option value="active" style={{ background: '#0f172a' }}>Active</option>
            <option value="inactive" style={{ background: '#0f172a' }}>Inactive</option>
          </select>
        </div>

        {/* Loading */}
        {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#8B5CF6' }} /></div>}

        {/* Vendor Table */}
        {!isLoading && (
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Vendor</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Category</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Rating</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Jobs</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Tier</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
                            {v.avatar || v.businessName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{v.businessName}</p>
                            <p className="text-[10px] text-gray-500">{v.city ?? ''}{v.province ? `, ${v.province}` : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs text-gray-400">{v.category}</span></td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#F59E0B' }}><Star className="w-3 h-3 fill-current" />{v.rating}</span></td>
                      <td className="px-4 py-3"><span className="text-xs text-gray-400">{v.jobs}</span></td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                          style={{ background: v.tier === 'elite' ? 'rgba(139,92,246,0.15)' : v.tier === 'pro' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                                  color: v.tier === 'elite' ? '#A78BFA' : v.tier === 'pro' ? '#60A5FA' : '#34D399' }}>{v.tier}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs">
                          {v.verified ? <CheckCircle className="w-3 h-3" style={{ color: '#10B981' }} /> : <XCircle className="w-3 h-3" style={{ color: '#EF4444' }} />}
                          <span style={{ color: v.isActive ? '#10B981' : '#EF4444' }}>{v.isActive ? 'Active' : 'Inactive'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(v.id, v.isActive ?? true)}
                          className="text-[10px] px-2 py-1 rounded-lg font-bold transition-colors"
                          style={{ background: v.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: v.isActive ? '#EF4444' : '#10B981' }}>
                          {v.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <p className="text-sm text-center py-8 text-gray-500">No vendors match your filters</p>}
          </div>
        )}
      </div>
    </div>
  );
}
