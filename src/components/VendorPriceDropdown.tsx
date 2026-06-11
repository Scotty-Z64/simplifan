import { useState } from 'react';
import { ChevronDown, ChevronUp, Store, MapPin, Phone, Star, Plus } from 'lucide-react';

interface VendorPrice {
  id: string;
  vendorName: string;
  service: string;
  price: number;
  unit: string;
  location: string;
  rating: number;
  contact?: string;
}

// SA Vendor price database by category
const vendorPrices: Record<string, VendorPrice[]> = {
  'Photography': [
    { id: 'vp1', vendorName: 'Royal Wedding Photography', service: 'Full Day Package', price: 8500, unit: 'package', location: 'Johannesburg', rating: 4.9, contact: '011 234 5678' },
    { id: 'vp2', vendorName: 'SnapSA Studios', service: 'Half Day Package', price: 4500, unit: 'package', location: 'Pretoria', rating: 4.6, contact: '012 345 6789' },
    { id: 'vp3', vendorName: 'Cape Moments', service: 'Full Day + Video', price: 12000, unit: 'package', location: 'Cape Town', rating: 4.8, contact: '021 456 7890' },
    { id: 'vp4', vendorName: 'KZN Lens', service: 'Basic Package', price: 3500, unit: 'package', location: 'Durban', rating: 4.4, contact: '031 234 5678' },
    { id: 'vp5', vendorName: ' township Memories', service: 'Event Coverage', price: 2500, unit: 'package', location: 'Soweto', rating: 4.5, contact: '011 876 5432' },
  ],
  'Venue': [
    { id: 'vp6', vendorName: 'Sandton Convention Centre', service: 'Hall Hire', price: 35000, unit: 'per day', location: 'Sandton', rating: 4.8, contact: '011 234 5678' },
    { id: 'vp7', vendorName: 'Soweto Celebration Hall', service: 'Community Hall', price: 5000, unit: 'per day', location: 'Soweto', rating: 4.5, contact: '011 876 5432' },
    { id: 'vp8', vendorName: 'Durban Beachfront Venue', service: 'Beach Venue', price: 18000, unit: 'per day', location: 'Durban', rating: 4.7, contact: '031 234 5678' },
    { id: 'vp9', vendorName: 'Cape Winelands Estate', service: 'Estate Venue', price: 45000, unit: 'per day', location: 'Stellenbosch', rating: 4.9, contact: '021 456 7890' },
    { id: 'vp10', vendorName: 'EC Community Centre', service: 'Hall Hire', price: 3500, unit: 'per day', location: 'East London', rating: 4.3, contact: '043 234 5678' },
  ],
  'Catering': [
    { id: 'vp11', vendorName: 'Mzansi Traditional Caterers', service: 'Buffet per person', price: 220, unit: 'per person', location: 'Pretoria', rating: 4.7, contact: '012 345 6789' },
    { id: 'vp12', vendorName: 'Soweto Kitchen', service: 'Traditional Plates', price: 150, unit: 'per person', location: 'Soweto', rating: 4.6, contact: '011 876 5432' },
    { id: 'vp13', vendorName: 'Cape Flavours', service: 'Premium Buffet', price: 350, unit: 'per person', location: 'Cape Town', rating: 4.8, contact: '021 456 7890' },
    { id: 'vp14', vendorName: 'Durban Spice', service: 'Curry Buffet', price: 180, unit: 'per person', location: 'Durban', rating: 4.5, contact: '031 234 5678' },
    { id: 'vp15', vendorName: 'Kasi Catering', service: 'Budget Meal', price: 80, unit: 'per person', location: 'Township', rating: 4.4, contact: '081 234 5678' },
  ],
  'Catering & Cake': [
    { id: 'vp16', vendorName: 'Bloemfontein Cake Studio', service: 'Custom Cake', price: 2500, unit: 'per cake', location: 'Bloemfontein', rating: 4.6, contact: '051 234 5678' },
    { id: 'vp17', vendorName: 'Joburg Cake Masters', service: 'Tiered Wedding Cake', price: 4500, unit: 'per cake', location: 'Johannesburg', rating: 4.8, contact: '011 234 5678' },
    { id: 'vp18', vendorName: 'Cape Cake Co', service: 'Designer Cake', price: 3500, unit: 'per cake', location: 'Cape Town', rating: 4.7, contact: '021 456 7890' },
  ],
  'Music & Entertainment': [
    { id: 'vp19', vendorName: 'Cape Town Sound & DJ', service: 'DJ + Sound', price: 5500, unit: 'per day', location: 'Cape Town', rating: 4.7, contact: '021 876 5432' },
    { id: 'vp20', vendorName: 'KZN DJ Services', service: 'DJ Package', price: 3500, unit: 'per day', location: 'Durban', rating: 4.5, contact: '031 234 5678' },
    { id: 'vp21', vendorName: 'Gauteng Live Band', service: 'Live Band', price: 8000, unit: 'per day', location: 'Johannesburg', rating: 4.8, contact: '011 234 5678' },
    { id: 'vp22', vendorName: ' township DJ', service: 'DJ + PA System', price: 2500, unit: 'per day', location: 'Soweto', rating: 4.4, contact: '011 876 5432' },
  ],
  'Decor & Flowers': [
    { id: 'vp23', vendorName: 'Durban Decor Masters', service: 'Full Decor', price: 8500, unit: 'package', location: 'Durban', rating: 4.6, contact: '031 234 5678' },
    { id: 'vp24', vendorName: 'Joburg Floral Design', service: 'Flowers + Setup', price: 12000, unit: 'package', location: 'Johannesburg', rating: 4.8, contact: '011 234 5678' },
    { id: 'vp25', vendorName: 'Cape Decor Studio', service: 'Elegant Decor', price: 15000, unit: 'package', location: 'Cape Town', rating: 4.9, contact: '021 456 7890' },
    { id: 'vp26', vendorName: 'Budget Decor SA', service: 'Basic Decor', price: 3500, unit: 'package', location: 'Nationwide', rating: 4.3, contact: '081 234 5678' },
  ],
  'Transport': [
    { id: 'vp27', vendorName: 'EC Transport', service: 'Shuttle Service', price: 3500, unit: 'per vehicle', location: 'East London', rating: 4.3, contact: '043 234 5678' },
    { id: 'vp28', vendorName: 'Luxury Rides SA', service: 'Luxury Cars', price: 5500, unit: 'per vehicle', location: 'Johannesburg', rating: 4.7, contact: '011 234 5678' },
    { id: 'vp29', vendorName: 'KZN Shuttle', service: 'Minibus Hire', price: 2500, unit: 'per vehicle', location: 'Durban', rating: 4.4, contact: '031 234 5678' },
  ],
  'Attire': [
    { id: 'vp30', vendorName: 'Zulu Traditional Attire', service: 'Full Outfit', price: 5500, unit: 'outfit', location: 'Durban', rating: 4.8, contact: '031 876 5432' },
    { id: 'vp31', vendorName: 'Joburg Bridal Wear', service: 'Wedding Dress', price: 12000, unit: 'dress', location: 'Johannesburg', rating: 4.7, contact: '011 234 5678' },
    { id: 'vp32', vendorName: 'Cape Traditional Wear', service: 'Traditional Outfit', price: 4500, unit: 'outfit', location: 'Cape Town', rating: 4.6, contact: '021 456 7890' },
  ],
  'Coffin & Transport': [
    { id: 'vp33', vendorName: 'Polokwane Funeral Services', service: 'Coffin + Transport', price: 8500, unit: 'package', location: 'Polokwane', rating: 4.4, contact: '015 234 5678' },
    { id: 'vp34', vendorName: 'Dignity Funeral', service: 'Premium Coffin', price: 15000, unit: 'coffin', location: 'Johannesburg', rating: 4.6, contact: '011 234 5678' },
    { id: 'vp35', vendorName: 'Budget Funeral SA', service: 'Basic Package', price: 4500, unit: 'package', location: 'Nationwide', rating: 4.2, contact: '081 234 5678' },
  ],
  'Tombstone': [
    { id: 'vp36', vendorName: 'Memorial Stones JHB', service: 'Standard Tombstone', price: 12000, unit: 'each', location: 'Johannesburg', rating: 4.5, contact: '011 234 5678' },
    { id: 'vp37', vendorName: 'EC Tombstones', service: 'Basic Tombstone', price: 6500, unit: 'each', location: 'East London', rating: 4.3, contact: '043 234 5678' },
    { id: 'vp38', vendorName: 'Premium Memorials', service: 'Premium Tombstone', price: 35000, unit: 'each', location: 'Cape Town', rating: 4.7, contact: '021 456 7890' },
  ],
  'Sound System': [
    { id: 'vp39', vendorName: 'SA Sound Hire', service: 'PA System', price: 2500, unit: 'per day', location: 'Johannesburg', rating: 4.5, contact: '011 234 5678' },
    { id: 'vp40', vendorName: 'Cape Audio', service: 'Full Sound Setup', price: 4500, unit: 'per day', location: 'Cape Town', rating: 4.6, contact: '021 456 7890' },
  ],
};

interface Props {
  categoryName: string;
  onSelectPrice?: (price: number, vendorName: string, service: string) => void;
}

export function VendorPriceDropdown({ categoryName, onSelectPrice }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find matching vendor prices for this category
  const prices = vendorPrices[categoryName] || [];
  
  if (prices.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
      >
        <Store className="w-4 h-4" />
        <span>Compare vendor prices ({prices.length} vendors)</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 animate-slide-up">
          {prices.map((vendor) => (
            <div
              key={vendor.id}
              className="p-3 glass rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{vendor.vendorName}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-400">{vendor.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{vendor.service}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {vendor.location}
                    </span>
                    {vendor.contact && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {vendor.contact}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-teal-400">
                    R {vendor.price.toLocaleString('en-ZA')}
                  </p>
                  <p className="text-xs text-gray-500">{vendor.unit}</p>
                </div>
              </div>
              {onSelectPrice && (
                <button
                  onClick={() => onSelectPrice(vendor.price, vendor.vendorName, vendor.service)}
                  className="mt-2 flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Use this price in budget
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
