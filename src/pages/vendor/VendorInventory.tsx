import { VendorLayout } from '@/components/VendorLayout';
import {
  Package, Plus, Edit3, Trash2, DollarSign, Star, Image, Tag
} from 'lucide-react';

const demoProducts = [
  { id: '1', name: 'Premium Wedding Package', description: 'Full decor, draping, flowers, table settings. Setup and breakdown included.', price: 25000, bookings: 12, category: 'Decor', images: 8 },
  { id: '2', name: 'Birthday Basic Setup', description: 'Balloon arch, backdrop, table decor. Perfect for 21st birthdays.', price: 5500, bookings: 28, category: 'Decor', images: 5 },
  { id: '3', name: 'Corporate Event Catering', description: 'Buffet setup for 50-200 guests. Plates, cutlery, serving staff included.', price: 18000, bookings: 8, category: 'Catering', images: 6 },
  { id: '4', name: 'Funeral Tent & Chairs', description: 'White tent with 100 chairs, programmes table, floral arrangements.', price: 12000, bookings: 15, category: 'Venue', images: 4 },
];

export function VendorInventory() {
  return (
    <VendorLayout title="My Inventory">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Add Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>My Products & Services</h2>
          <button className="px-4 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 12px -3px rgba(245,158,11,0.3)' }}>
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Products', value: demoProducts.length, color: '#F59E0B' },
            { label: 'Total Bookings', value: demoProducts.reduce((sum, p) => sum + p.bookings, 0), color: '#10B981' },
            { label: 'Avg Price', value: `R ${Math.round(demoProducts.reduce((sum, p) => sum + p.price, 0) / demoProducts.length).toLocaleString('en-ZA')}`, color: '#8B5CF6' },
          ].map((s, _idx) => (
            <div key={_idx} className="rounded-xl p-4 text-center" style={{ background: 'white', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-medium" style={{ color: '#94A3B8' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {demoProducts.map((product) => (
            <div key={product.id} className="rounded-2xl p-5 flex items-start gap-5 transition-all hover:-translate-y-0.5"
              style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              {/* Image Placeholder */}
              <div className="w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #F1F5F9, #E2E8F0)' }}>
                <Package className="w-10 h-10" style={{ color: '#CBD5E1' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-bold" style={{ color: '#1a1a2e' }}>{product.name}</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#FEF3C7', color: '#D97706' }}>{product.category}</span>
                </div>
                <p className="text-xs mb-2 line-clamp-2" style={{ color: '#64748B' }}>{product.description}</p>
                <div className="flex items-center gap-4 text-xs" style={{ color: '#94A3B8' }}>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />R {product.price.toLocaleString('en-ZA')}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" />{product.bookings} bookings</span>
                  <span className="flex items-center gap-1"><Image className="w-3 h-3" />{product.images} photos</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Edit3 className="w-4 h-4" style={{ color: '#94A3B8' }} /></button>
                <button className="p-2 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '1px solid #FDE68A' }}>
          <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#B45309' }}><Tag className="w-4 h-4" /> Tips for More Bookings</h4>
          <ul className="text-xs space-y-1" style={{ color: '#92400E' }}>
            <li>Upload at least 5 high-quality photos for each product</li>
            <li>Use real photos from past events, not stock images</li>
            <li>Update prices seasonally and add special packages</li>
            <li>Vendors with 10+ product photos get 4x more leads</li>
          </ul>
        </div>
      </div>
    </VendorLayout>
  );
}
