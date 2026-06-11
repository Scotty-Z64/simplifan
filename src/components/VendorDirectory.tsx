import { useState } from 'react';
import { usePlans } from '@/context/PlansContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, MapPin, Phone, Mail, Star, Plus, Trash2 } from 'lucide-react';

interface Props {
  planId: string;
}

const saVendors = [
  { id: 'v1', name: 'Luxe Events Venue', category: 'Venue', location: 'Sandton, Johannesburg', province: 'Gauteng', priceRange: 'premium' as const, rating: 4.8, reviewCount: 124, description: 'Luxury venue for weddings and corporate events', services: ['Indoor & Outdoor', 'Catering Available', 'Sound System'], contactPhone: '011 234 5678', contactEmail: 'info@luxeevents.co.za' },
  { id: 'v2', name: 'Soweto Celebration Hall', category: 'Venue', location: 'Soweto, Johannesburg', province: 'Gauteng', priceRange: 'budget' as const, rating: 4.5, reviewCount: 89, description: 'Affordable venue for all celebrations', services: ['Indoor Hall', 'Kitchen Facilities', 'Parking'], contactPhone: '011 876 5432', contactEmail: 'bookings@sowetocelebration.co.za' },
  { id: 'v3', name: 'Mzansi Traditional Caterers', category: 'Catering', location: 'Pretoria', province: 'Gauteng', priceRange: 'mid' as const, rating: 4.7, reviewCount: 156, description: 'Traditional South African cuisine specialists', services: ['Buffet Service', 'Plated Meals', 'Traditional Dishes'], contactPhone: '012 345 6789', contactEmail: 'catering@mzansi.co.za' },
  { id: 'v4', name: 'Royal Wedding Photography', category: 'Photography', location: 'Cape Town', province: 'Western Cape', priceRange: 'premium' as const, rating: 4.9, reviewCount: 203, description: 'Award-winning wedding photography', services: ['Photo & Video', 'Drone Coverage', 'Same-Day Edit'], contactPhone: '021 456 7890', contactEmail: 'hello@royalwedding.co.za' },
  { id: 'v5', name: 'Durban Decor Masters', category: 'Decor', location: 'Durban', province: 'KwaZulu-Natal', priceRange: 'mid' as const, rating: 4.6, reviewCount: 78, description: 'Full event decoration and styling', services: ['Floral Arrangements', 'Lighting', 'Table Setup'], contactPhone: '031 234 5678', contactEmail: 'decor@durbandm.co.za' },
  { id: 'v6', name: 'Eastern Cape Transport', category: 'Transport', location: 'East London', province: 'Eastern Cape', priceRange: 'budget' as const, rating: 4.3, reviewCount: 45, description: 'Reliable transport for events and funerals', services: ['Shuttle Service', 'Luxury Cars', 'Group Transport'], contactPhone: '043 234 5678', contactEmail: 'bookings@ectransport.co.za' },
  { id: 'v7', name: 'Zulu Traditional Attire', category: 'Attire', location: 'Durban', province: 'KwaZulu-Natal', priceRange: 'mid' as const, rating: 4.8, reviewCount: 92, description: 'Authentic traditional wear for all ceremonies', services: ['uMemulo Dresses', 'Traditional Beads', 'Headpieces'], contactPhone: '031 876 5432', contactEmail: 'attire@zulutraditional.co.za' },
  { id: 'v8', name: 'Cape Town Sound & DJ', category: 'Entertainment', location: 'Cape Town', province: 'Western Cape', priceRange: 'mid' as const, rating: 4.7, reviewCount: 134, description: 'Professional sound and DJ services', services: ['DJ Services', 'Live Sound', 'Equipment Hire'], contactPhone: '021 876 5432', contactEmail: 'bookings@ctsound.co.za' },
  { id: 'v9', name: 'Polokwane Funeral Services', category: 'Funeral', location: 'Polokwane', province: 'Limpopo', priceRange: 'budget' as const, rating: 4.4, reviewCount: 67, description: 'Compassionate funeral planning services', services: ['Coffin Supply', 'Transport', 'Grave Preparation'], contactPhone: '015 234 5678', contactEmail: 'help@polokwanefuneral.co.za' },
  { id: 'v10', name: 'Bloemfontein Cake Studio', category: 'Catering', location: 'Bloemfontein', province: 'Free State', priceRange: 'mid' as const, rating: 4.6, reviewCount: 88, description: 'Custom cakes and desserts for all events', services: ['Wedding Cakes', 'Cupcakes', 'Dessert Tables'], contactPhone: '051 234 5678', contactEmail: 'orders@bfncakestudio.co.za' },
];

export function VendorDirectory({ planId }: Props) {
  const { currentPlan, addVendorQuote, deleteVendorQuote } = usePlans();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<typeof saVendors[0] | null>(null);
  const [itemName, setItemName] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');

  if (!currentPlan) return null;

  const categories = ['All', ...Array.from(new Set(saVendors.map(v => v.category)))];

  const filteredVendors = saVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequestQuote = (vendor: typeof saVendors[0]) => {
    setSelectedVendor(vendor);
    setQuoteDialogOpen(true);
  };

  const handleSubmitQuote = () => {
    if (selectedVendor && itemName && quotedPrice) {
      addVendorQuote(planId, {
        vendorId: selectedVendor.id,
        planId,
        itemName,
        quotedPrice: parseFloat(quotedPrice),
        status: 'pending',
        dateRequested: new Date().toISOString(),
      });
      setItemName('');
      setQuotedPrice('');
      setQuoteDialogOpen(false);
    }
  };

  const getPriceColor = (range: string) => {
    switch (range) {
      case 'budget': return 'bg-green-100 text-green-700';
      case 'mid': return 'bg-amber-100 text-amber-700';
      case 'premium': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendors by name or location..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="p-4 glass border-gray-700/50 rounded-lg hover:border-gray-600/50 transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">{vendor.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriceColor(vendor.priceRange)}`}>
                    {vendor.priceRange}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{vendor.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {vendor.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500" />
                    {vendor.rating} ({vendor.reviewCount})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {vendor.services.map((service, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-800/50 text-slate-600 rounded text-xs">
                      {service}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  {vendor.contactPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {vendor.contactPhone}
                    </span>
                  )}
                  {vendor.contactEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {vendor.contactEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={() => handleRequestQuote(vendor)}
              className="w-full mt-3 bg-teal-500 hover:bg-teal-600 text-white text-xs"
              size="sm"
            >
              <Plus className="w-3 h-3 mr-1" />
              Request Quote
            </Button>
          </div>
        ))}
      </div>

      {/* My Quotes */}
      {currentPlan.vendorQuotes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-white mb-2">My Quotes</h4>
          <div className="space-y-2">
            {currentPlan.vendorQuotes.map(quote => {
              const vendor = saVendors.find(v => v.id === quote.vendorId);
              return (
                <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{quote.itemName}</p>
                    <p className="text-xs text-gray-500">{vendor?.name || 'Unknown Vendor'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-teal-600">
                      R {quote.quotedPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => deleteVendorQuote(planId, quote.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quote Dialog */}
      <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Quote from {selectedVendor?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Item/Service Needed</Label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Wedding Photography Package"
              />
            </div>
            <div>
              <Label>Expected Budget (R)</Label>
              <Input
                type="number"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <Button onClick={handleSubmitQuote} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              Save Quote Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
