import { useState } from 'react';
import { Store, Star, MapPin, Phone, Mail, BadgeCheck, Calendar, MessageCircle, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MarketplaceVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  province: string;
  rating: number;
  reviews: number;
  verified: boolean;
  premium: boolean;
  services: string[];
  priceRange: string;
  contactPhone: string;
  contactEmail: string;
  website?: string;
  description: string;
  bookings: number;
  image?: string;
}

const mockVendors: MarketplaceVendor[] = [
  {
    id: '1', name: 'Royal Events SA', category: 'Venue', location: 'Sandton', province: 'Gauteng',
    rating: 4.9, reviews: 127, verified: true, premium: true,
    services: ['Wedding Venue', 'Conference Centre', 'Garden Events', 'Catering Included'],
    priceRange: 'R15,000 - R50,000', contactPhone: '011 234 5678', contactEmail: 'bookings@royalevents.co.za',
    website: 'https://royalevents.co.za', description: 'Luxury venue in the heart of Sandton with panoramic city views. Perfect for weddings, corporate events, and celebrations.',
    bookings: 89
  },
  {
    id: '2', name: 'Maboneng Decor Studio', category: 'Decor & Flowers', location: 'Maboneng', province: 'Gauteng',
    rating: 4.7, reviews: 84, verified: true, premium: false,
    services: ['Floral Arrangements', 'Stage Decor', 'Table Settings', 'Balloon Decor'],
    priceRange: 'R3,000 - R15,000', contactPhone: '072 345 6789', contactEmail: 'hello@mabonengdecor.co.za',
    description: 'Urban chic decor specialists bringing Maboneng creativity to your event. Modern, bold, and unforgettable designs.',
    bookings: 156
  },
  {
    id: '3', name: 'Zulu Traditional Catering', category: 'Catering', location: 'Umlazi', province: 'KwaZulu-Natal',
    rating: 4.8, reviews: 203, verified: true, premium: true,
    services: ['Traditional Zulu Cuisine', 'Braai Services', 'Wedding Catering', 'Corporate Events'],
    priceRange: 'R150 - R350 per person', contactPhone: '073 456 7890', contactEmail: 'orders@zulucatering.co.za',
    description: 'Authentic Zulu traditional food for all occasions. From umqombothi to braai, we bring culture to your table.',
    bookings: 312
  },
  {
    id: '4', name: 'Cape Town Photography', category: 'Photography', location: 'Cape Town CBD', province: 'Western Cape',
    rating: 4.9, reviews: 95, verified: true, premium: true,
    services: ['Wedding Photography', 'Event Coverage', 'Drone Shots', 'Photo Booth'],
    priceRange: 'R8,000 - R25,000', contactPhone: '021 345 6789', contactEmail: 'info@cptphotography.co.za',
    website: 'https://cptphotography.co.za', description: 'Award-winning photography team capturing your special moments against Cape Town\'s stunning backdrop.',
    bookings: 67
  },
  {
    id: '5', name: 'DJ Maphorisa Entertainment', category: 'Music & DJ', location: 'Pretoria', province: 'Gauteng',
    rating: 4.6, reviews: 142, verified: true, premium: false,
    services: ['DJ Services', 'Sound System', 'Lighting', 'MC Services'],
    priceRange: 'R4,000 - R12,000', contactPhone: '074 567 8901', contactEmail: 'bookings@djmaphorisa.co.za',
    description: 'Premium DJ and entertainment services for all events. Amapiano, House, Gospel, and Traditional music specialists.',
    bookings: 198
  },
  {
    id: '6', name: 'Xhosa Heritage Designs', category: 'Attire & Traditional Wear', location: 'Gqeberha', province: 'Eastern Cape',
    rating: 4.8, reviews: 76, verified: true, premium: true,
    services: ['Traditional Xhosa Attire', 'Wedding Dresses', 'Suits', 'Accessory Rental'],
    priceRange: 'R5,000 - R20,000', contactPhone: '075 678 9012', contactEmail: 'designs@xhosaheritage.co.za',
    description: 'Beautiful traditional Xhosa attire for weddings, umemulo, and cultural celebrations. Handcrafted with love.',
    bookings: 54
  },
  {
    id: '7', name: 'Limousine SA', category: 'Transport', location: 'Johannesburg', province: 'Gauteng',
    rating: 4.5, reviews: 63, verified: true, premium: false,
    services: ['Luxury Cars', 'Stretch Limos', 'Party Buses', 'Airport Transfers'],
    priceRange: 'R3,500 - R15,000', contactPhone: '076 789 0123', contactEmail: 'rentals@limosa.co.za',
    description: 'Arrive in style. Luxury vehicle rentals for weddings, matric dances, and VIP events across Gauteng.',
    bookings: 112
  },
  {
    id: '8', name: 'Eastern Cape Venues', category: 'Venue', location: 'East London', province: 'Eastern Cape',
    rating: 4.4, reviews: 45, verified: false, premium: false,
    services: ['Beach Venues', 'Community Halls', 'Garden Events'], priceRange: 'R5,000 - R20,000',
    contactPhone: '043 789 0123', contactEmail: 'venues@ecvenues.co.za',
    description: 'Affordable and beautiful venues across the Eastern Cape. From beachfront to countryside settings.',
    bookings: 34
  },
];

const categories = ['All', 'Venue', 'Catering', 'Photography', 'Music & DJ', 'Decor & Flowers', 'Attire & Traditional Wear', 'Transport'];
const provinces = ['All', 'Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Mpumalanga', 'Limpopo', 'Free State', 'North West', 'Northern Cape'];

export function VendorMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<MarketplaceVendor | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);

  const filtered = mockVendors.filter(v => {
    const catMatch = selectedCategory === 'All' || v.category === selectedCategory;
    const provMatch = selectedProvince === 'All' || v.province === selectedProvince;
    const searchMatch = !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return catMatch && provMatch && searchMatch;
  });

  const handleBook = (vendor: MarketplaceVendor) => {
    setSelectedVendor(vendor);
    setShowBookModal(true);
  };

  const handleWhatsApp = (vendor: MarketplaceVendor) => {
    const text = encodeURIComponent(`Hi ${vendor.name}, I'm interested in booking your services for my event via SimpliPlan. Can we discuss availability?`);
    window.open(`https://wa.me/${vendor.contactPhone.replace(/\s/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Vendor Marketplace</h3>
            <p className="text-sm text-gray-400">Browse, compare & book verified SA event vendors</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors by name or service..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-600"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0 mt-2" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-2" />
            {provinces.map(prov => (
              <button
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedProvince === prov
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-teal-400">{mockVendors.length}</p>
          <p className="text-xs text-gray-500">Vendors</p>
        </div>
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-emerald-400">{mockVendors.filter(v => v.verified).length}</p>
          <p className="text-xs text-gray-500">Verified</p>
        </div>
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-amber-400">{categories.length - 1}</p>
          <p className="text-xs text-gray-500">Categories</p>
        </div>
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-purple-400">{mockVendors.reduce((s, v) => s + v.bookings, 0)}</p>
          <p className="text-xs text-gray-500">Total Bookings</p>
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(vendor => (
          <div key={vendor.id} className="glass rounded-2xl p-5 border border-gray-700/50 hover:border-teal-500/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-semibold text-white">{vendor.name}</h4>
                  {vendor.verified && <BadgeCheck className="w-4 h-4 text-teal-400" />}
                  {vendor.premium && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">PREMIUM</span>}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{vendor.location}, {vendor.province}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-white">{vendor.rating}</span>
                </div>
                <p className="text-xs text-gray-500">{vendor.reviews} reviews</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{vendor.description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {vendor.services.slice(0, 3).map((service, i) => (
                <span key={i} className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full border border-gray-700/30">
                  {service}
                </span>
              ))}
              {vendor.services.length > 3 && (
                <span className="text-xs text-gray-500">+{vendor.services.length - 3} more</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
              <span className="text-sm font-medium text-teal-400">{vendor.priceRange}</span>
              <div className="flex gap-2">
                <Button onClick={() => handleWhatsApp(vendor)} variant="outline" size="sm"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />WhatsApp
                </Button>
                <Button onClick={() => handleBook(vendor)} size="sm"
                  className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-xs">
                  <Calendar className="w-3 h-3 mr-1" />Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No vendors found matching your filters.</p>
          <button onClick={() => { setSelectedCategory('All'); setSelectedProvince('All'); setSearchQuery(''); }}
            className="text-teal-400 hover:underline mt-2 text-sm">Clear filters</button>
        </div>
      )}

      {/* Book Modal */}
      {showBookModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowBookModal(false)}>
          <div className="glass rounded-2xl p-6 border border-gray-700/50 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Book {selectedVendor.name}</h3>
                <p className="text-xs text-gray-500">Send a booking request via WhatsApp</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm text-white">{selectedVendor.category}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500">Price Range</p>
                <p className="text-sm text-white">{selectedVendor.priceRange}</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500">Contact</p>
                <p className="text-sm text-white flex items-center gap-2"><Phone className="w-3 h-3 text-teal-400" />{selectedVendor.contactPhone}</p>
                <p className="text-sm text-white flex items-center gap-2 mt-1"><Mail className="w-3 h-3 text-teal-400" />{selectedVendor.contactEmail}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { handleWhatsApp(selectedVendor); setShowBookModal(false); }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
                <MessageCircle className="w-4 h-4 mr-2" />Book via WhatsApp
              </Button>
              <Button onClick={() => setShowBookModal(false)} variant="outline"
                className="border-gray-700 text-gray-300">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
