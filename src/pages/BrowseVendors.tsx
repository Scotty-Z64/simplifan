import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  Search, Star, Phone, ChevronLeft, SlidersHorizontal,
  X, ArrowRight, CheckCircle, MessageCircle, Loader2, MapPin
} from 'lucide-react';

// Category-to-image mapping for rich visual cards
const CATEGORY_IMAGES: Record<string, string> = {
  'Catering': '/images/vendor-catering.jpg',
  'Music / DJ': '/images/vendor-dj.jpg',
  'Photography': '/images/vendor-photography.jpg',
  'Decor': '/images/vendor-decor.jpg',
  'Venue': '/images/vendor-venue.jpg',
  'Cake': '/images/vendor-cake.jpg',
  'Transport': '/images/vendor-transport.jpg',
  'Security': '/images/vendor-security.jpg',
  'Tent & Equipment': '/images/vendor-tent.jpg',
  'Drinks / Bar': '/images/vendor-bar.jpg',
  'Hair & Makeup': '/images/vendor-makeup.jpg',
};

function getVendorImage(vendor: any) {
  if (vendor.images && vendor.images.length > 0) return vendor.images[0].url;
  return CATEGORY_IMAGES[vendor.category] || '/images/vendor-catering.jpg';
}

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

  // ─── Loading Skeleton ───
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="h-5 w-32 rounded-lg animate-pulse" style={{ background: '#E2E8F0' }} />
        </div>
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {/* Search skeleton */}
          <div className="h-12 rounded-2xl animate-pulse" style={{ background: '#E2E8F0' }} />
          {/* Category chips skeleton */}
          <div className="flex gap-2">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-8 w-20 rounded-xl animate-pulse" style={{ background: '#E2E8F0' }} />)}
          </div>
          {/* Vendor card skeletons */}
          {[1,2,3,4,5].map(i => (
            <div key={i} className="rounded-2xl p-5" style={{ background: 'white' }}>
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl animate-pulse flex-shrink-0" style={{ background: '#E2E8F0' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded-lg animate-pulse" style={{ background: '#E2E8F0' }} />
                  <div className="h-3 w-24 rounded-lg animate-pulse" style={{ background: '#E2E8F0' }} />
                  <div className="h-3 w-32 rounded-lg animate-pulse" style={{ background: '#E2E8F0' }} />
                </div>
              </div>
            </div>
          ))}
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
        <div className="space-y-4">
          {filteredVendors.map(vendor => (
            <div key={vendor.id} onClick={() => setSelectedVendor(vendor.id)}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ background: 'white', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)' }}>
              {/* Category Image Banner */}
              <div className="relative h-32 overflow-hidden">
                <img src={getVendorImage(vendor)} alt={vendor.category} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
                {/* Badges on image */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {vendor.featured && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>Featured</span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-bold text-white" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>{vendor.category}</span>
                </div>
                {/* Bottom info on image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: vendor.verified ? 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' : 'linear-gradient(135deg, #94A3B8, #64748B)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                      {vendor.avatar || vendor.businessName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{vendor.businessName}</h3>
                      <p className="text-[10px] text-white/70">{vendor.city ?? vendor.province}</p>
                    </div>
                  </div>
                  {vendor.verified && <CheckCircle className="w-5 h-5 text-white flex-shrink-0" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />}
                </div>
              </div>
              {/* Card Body */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#F59E0B' }}>
                      <Star className="w-3.5 h-3.5 fill-current" /> {vendor.rating}
                    </span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>{vendor.jobs} jobs</span>
                    {vendor.yearsInBusiness && (
                      <span className="text-xs" style={{ color: '#94A3B8' }}>{vendor.yearsInBusiness} yrs exp</span>
                    )}
                  </div>
                  {vendor.priceRange && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: '#F0FDFA', color: '#2BBCA8' }}>{vendor.priceRange}</span>
                  )}
                </div>
                {vendor.bio && (
                  <p className="text-xs mt-2 line-clamp-2" style={{ color: '#94A3B8' }}>{vendor.bio}</p>
                )}
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
            {/* Header with category image */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl sm:rounded-t-2xl">
              <img src={getVendorImage(activeVendor)} alt={activeVendor.category} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {activeVendor.avatar || activeVendor.businessName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white truncate">{activeVendor.businessName}</h2>
                      {activeVendor.verified && <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3 h-3 text-white/60" />
                      <p className="text-xs text-white/80">{activeVendor.category} &middot; {activeVendor.city ?? activeVendor.province}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
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
