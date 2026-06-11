import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Star, Phone, ChevronLeft, SlidersHorizontal,
  X, ArrowRight, CheckCircle
} from 'lucide-react';

const categories = ['All', 'Catering', 'DJ & Sound', 'Photography', 'Decor', 'Venue', 'Cake', 'Transport'];

const vendors = [
  { id: '1', name: 'Royal Events SA', category: 'Venue', location: 'Johannesburg, Sandton', rating: 4.9, bookings: 128, priceRange: 'R15,000 - R80,000', description: 'Premium wedding venue with gardens, chapel, and reception hall. Full catering and decor included.', tags: ['Wedding', 'Corporate', 'Functions'] },
  { id: '2', name: 'Cakes by Lerato', category: 'Cake', location: 'Johannesburg, Soweto', rating: 4.9, bookings: 203, priceRange: 'R800 - R5,000', description: 'Custom birthday and wedding cakes. 3D designs, fondant, and traditional fruit cakes.', tags: ['Birthday', 'Wedding', 'Baby Shower'] },
  { id: '3', name: 'Maboneng Decor Co', category: 'Decor', location: 'Johannesburg, CBD', rating: 4.7, bookings: 89, priceRange: 'R3,500 - R25,000', description: 'Event decor, draping, lighting, floral arrangements. Modern and traditional styles.', tags: ['Wedding', 'Corporate', 'Traditional'] },
  { id: '4', name: 'Glam Squad SA', category: 'Photography', location: 'Pretoria, Centurion', rating: 4.8, bookings: 156, priceRange: 'R4,500 - R15,000', description: 'Professional photography and videography. Drone shots, same-day edit, photo booth.', tags: ['Wedding', '21st', 'Graduation'] },
  { id: '5', name: 'Braai Masters', category: 'Catering', location: 'Johannesburg, Midrand', rating: 4.7, bookings: 312, priceRange: 'R120 - R250/person', description: 'Braai catering, spit braai, traditional potjie. All equipment and staff included.', tags: ['Corporate', 'Wedding', 'uMgidi'] },
  { id: '6', name: 'DJ Maphorisa Ent', category: 'DJ & Sound', location: 'Johannesburg, Tembisa', rating: 4.8, bookings: 267, priceRange: 'R3,500 - R12,000', description: 'Professional DJ, MC, sound system, lighting. Amapiano, House, Gospel, Traditional.', tags: ['Wedding', '21st', 'Corporate'] },
];

export function BrowseVendors() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null);

  const filtered = vendors.filter(v => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || v.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} />
        </button>
        <h1 className="text-lg font-bold flex-1" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>Find Vendors</h1>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-5">
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: '#94A3B8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors, categories..."
            className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
          {search && <button onClick={() => setSearch('')}><X className="w-4 h-4" style={{ color: '#94A3B8' }} /></button>}
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
              style={activeCategory === cat ? { background: '#1a1a2e', color: 'white' } : { background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>{filtered.length} vendor{filtered.length !== 1 ? 's' : ''} found</p>
          <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#64748B' }}><SlidersHorizontal className="w-3.5 h-3.5" /> Sort by Rating</button>
        </div>

        {/* Vendor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((vendor, i) => (
            <div key={vendor.id} className="rounded-2xl p-5 transition-all hover:-translate-y-1 cursor-pointer"
              style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}
              onClick={() => setSelectedVendor(vendor)}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${['#2BBCA8','#F59E0B','#8B5CF6','#F43F5E','#10B981','#3B82F6'][i % 6]}, ${['#1E9B8A','#D97706','#7C3AED','#E11D48','#059669','#2563EB'][i % 6]})` }}>
                  {vendor.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold truncate" style={{ color: '#1a1a2e' }}>{vendor.name}</h3>
                    {i < 3 && <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold text-white" style={{ background: '#10B981' }}><CheckCircle className="w-2.5 h-2.5" /> Verified</span>}
                  </div>
                  <p className="text-[11px] mb-2" style={{ color: '#94A3B8' }}>{vendor.category} | {vendor.location}</p>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: '#64748B' }}>{vendor.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><strong style={{ color: '#1a1a2e' }}>{vendor.rating}</strong></span>
                    <span style={{ color: '#94A3B8' }}>{vendor.bookings} jobs</span>
                    <span className="font-semibold" style={{ color: '#2BBCA8' }}>{vendor.priceRange}</span>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    {vendor.tags.map(tag => (
                      <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#F1F5F9', color: '#64748B' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedVendor(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto"
            style={{ background: 'white' }} onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                    {selectedVendor.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{selectedVendor.name}</h3>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>{selectedVendor.category} | {selectedVendor.location}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVendor(null)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5" style={{ color: '#64748B' }} /></button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{selectedVendor.rating}</span></div>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>Rating</p>
                </div>
                <div className="w-px h-8" style={{ background: '#E2E8F0' }} />
                <div className="text-center flex-1">
                  <p className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{selectedVendor.bookings}</p>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>Jobs Done</p>
                </div>
                <div className="w-px h-8" style={{ background: '#E2E8F0' }} />
                <div className="text-center flex-1">
                  <p className="text-sm font-bold" style={{ color: '#2BBCA8' }}>{selectedVendor.priceRange}</p>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>Price Range</p>
                </div>
              </div>

              <p className="text-sm" style={{ color: '#475569' }}>{selectedVendor.description}</p>

              <div className="flex gap-3">
                <button onClick={() => navigate('/quick-quote')}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
                  <ArrowRight className="w-4 h-4" /> Get Quote
                </button>
                <button className="p-3 rounded-xl" style={{ background: '#F1F5F9' }}><Phone className="w-5 h-5" style={{ color: '#2BBCA8' }} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
