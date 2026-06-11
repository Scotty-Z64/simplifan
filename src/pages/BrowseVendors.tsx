import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  Search, Star, Phone, ChevronLeft, SlidersHorizontal,
  X, ArrowRight, CheckCircle, MessageCircle
} from 'lucide-react';

export function BrowseVendors() {
  const navigate = useNavigate();

  // ─── API Data ───
  const { data: apiVendors, isLoading } = trpc.vendor.list.useQuery({ limit: 100 });
  const { data: categories } = trpc.vendor.categories.useQuery();
  const { data: provinces } = trpc.vendor.provinces.useQuery();

  // ─── Local State ───
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const handleCloseModal = () => setSelectedVendor(null);

  // ─── Filtering ───
  const filteredVendors = useMemo(() => {
    if (!apiVendors) return [];
    return apiVendors.filter(v => {
      if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
      if (selectedProvince !== 'All' && v.province !== selectedProvince) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return v.businessName.toLowerCase().includes(q) ||
               v.category.toLowerCase().includes(q) ||
               (v.city ?? '').toLowerCase().includes(q) ||
               (v.bio ?? '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [apiVendors, selectedCategory, selectedProvince, searchQuery]);

  const activeVendor = apiVendors?.find(v => v.id === selectedVendor);

  const categoryList = ['All', ...(categories ?? [])];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F1F5F9' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-teal-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: '#94A3B8' }}>Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} />
        </button>
        <h1 className="text-lg font-bold flex-1" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>Browse Vendors</h1>
        <button onClick={() => setShowFilters(!showFilters)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <SlidersHorizontal className="w-5 h-5" style={{ color: '#64748B' }} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: '#CBD5E1' }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search vendors, categories, locations..."
            className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 rounded-lg hover:bg-gray-100">
              <X className="w-4 h-4" style={{ color: '#94A3B8' }} />
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categoryList.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
              style={selectedCategory === cat
                ? { background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }
                : { background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Province Filter */}
        {showFilters && (
          <div className="rounded-2xl p-4" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <p className="text-xs font-bold mb-3" style={{ color: '#475569' }}>Filter by Province</p>
            <div className="flex flex-wrap gap-2">
              {['All', ...(provinces ?? []).filter((p): p is string => !!p)].map(p => (
                <button key={p} onClick={() => setSelectedProvince(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={selectedProvince === p
                    ? { background: '#F0FDFA', color: '#2BBCA8', border: '1px solid #A7F3D0' }
                    : { background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <p className="text-xs font-semibold" style={{ color: '#94A3B8' }}>
          {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          {selectedProvince !== 'All' ? ` in ${selectedProvince}` : ''}
        </p>

        {/* Vendor Cards */}
        <div className="space-y-3">
          {filteredVendors.map(vendor => (
            <div key={vendor.id} onClick={() => setSelectedVendor(vendor.id)}
              className="rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: vendor.verified
                    ? 'linear-gradient(135deg, #2BBCA8, #1E9B8A)'
                    : 'linear-gradient(135deg, #94A3B8, #64748B)' }}>
                  {vendor.avatar || vendor.businessName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold truncate" style={{ color: '#1a1a2e' }}>{vendor.businessName}</h3>
                    {vendor.verified && <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#2BBCA8' }} />}
                    {vendor.featured && <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: '#FFFBEB', color: '#D97706' }}>Featured</span>}
                  </div>
                  <p className="text-xs mb-2" style={{ color: '#64748B' }}>{vendor.category} &middot; {vendor.city ?? vendor.province}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#F59E0B' }}>
                      <Star className="w-3.5 h-3.5 fill-current" /> {vendor.rating}
                    </span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>{vendor.jobs} jobs</span>
                    {vendor.priceRange && <span className="text-xs font-semibold" style={{ color: '#2BBCA8' }}>{vendor.priceRange}</span>}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 flex-shrink-0 mt-4" style={{ color: '#CBD5E1' }} />
              </div>
            </div>
          ))}

          {filteredVendors.length === 0 && (
            <div className="rounded-2xl p-12 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <Search className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E1' }} />
              <p className="text-sm" style={{ color: '#94A3B8' }}>No vendors match your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Detail Modal */}
      {activeVendor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={handleCloseModal}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto"
            style={{ background: 'white' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="relative h-40 overflow-hidden rounded-t-2xl sm:rounded-t-2xl">
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                    {activeVendor.avatar || activeVendor.businessName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{activeVendor.businessName}</h2>
                      {activeVendor.verified && <CheckCircle className="w-5 h-5 text-white" />}
                    </div>
                    <p className="text-xs text-white/80">{activeVendor.category} &middot; {activeVendor.city ?? activeVendor.province}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Rating', value: `★ ${activeVendor.rating}`, color: '#F59E0B' },
                  { label: 'Jobs', value: String(activeVendor.jobs), color: '#3B82F6' },
                  { label: 'Price', value: activeVendor.priceRange ?? 'N/A', color: '#2BBCA8' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl p-3 text-center" style={{ background: '#F8FAFC' }}>
                    <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[9px] font-medium" style={{ color: '#94A3B8' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Bio */}
              {activeVendor.bio && (
                <p className="text-sm" style={{ color: '#64748B' }}>{activeVendor.bio}</p>
              )}

              {/* Services */}
              {activeVendor.services && activeVendor.services.length > 0 && (
                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: '#475569' }}>Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeVendor.services.map((s, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#F0FDFA', color: '#2BBCA8' }}>
                        {s.name ?? s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <a href={`https://wa.me/${(activeVendor.phone ?? '').replace(/\+|\s/g, '')}?text=Hi ${activeVendor.businessName}, I found you on SimpliPlan and would like to discuss my event.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
                  <MessageCircle className="w-4 h-4" /> Get Quote
                </a>
                {activeVendor.phone && (
                  <a href={`tel:${activeVendor.phone}`}
                    className="px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    style={{ background: '#F1F5F9', color: '#64748B' }}>
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
