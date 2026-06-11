import { useState, useEffect } from 'react';
import { MapPin, Building, Navigation, Plus, ChevronDown, ChevronUp, Crosshair, Loader } from 'lucide-react';
import type { PreciseLocation } from '@/types';

interface PreciseLocationInputProps {
  value?: PreciseLocation;
  onChange: (location: PreciseLocation) => void;
}

const saProvinces = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
];

const majorCities: Record<string, string[]> = {
  'Gauteng': ['Johannesburg', 'Pretoria', 'Sandton', 'Soweto', 'Midrand', 'Centurion', 'Benoni', 'Kempton Park', 'Roodepoort', 'Alberton'],
  'Western Cape': ['Cape Town', 'Stellenbosch', 'Paarl', 'George', 'Knysna', 'Hermanus', 'Somerset West'],
  'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Richards Bay', 'Newcastle', 'Umhlanga', 'Ballito'],
  'Eastern Cape': ['Port Elizabeth', 'East London', 'Mthatha', 'Grahamstown', 'Queenstown'],
  'Free State': ['Bloemfontein', 'Welkom', 'Kroonstad'],
  'Limpopo': ['Polokwane', 'Tzaneen', 'Thohoyandou'],
  'Mpumalanga': ['Nelspruit', 'Secunda', 'Mbombela'],
  'North West': ['Rustenburg', 'Mahikeng', 'Potchefstroom'],
  'Northern Cape': ['Kimberley', 'Upington', 'Springbok'],
};

// Map Nominatim address components to SA provinces
function mapToSAProvince(address: any): string {
  const state = address?.state || '';
  const stateLower = state.toLowerCase();
  
  if (stateLower.includes('gauteng')) return 'Gauteng';
  if (stateLower.includes('western cape')) return 'Western Cape';
  if (stateLower.includes('kwazulu') || stateLower.includes('kwa-zulu')) return 'KwaZulu-Natal';
  if (stateLower.includes('eastern cape')) return 'Eastern Cape';
  if (stateLower.includes('free state')) return 'Free State';
  if (stateLower.includes('limpopo')) return 'Limpopo';
  if (stateLower.includes('mpumalanga')) return 'Mpumalanga';
  if (stateLower.includes('north west')) return 'North West';
  if (stateLower.includes('northern cape')) return 'Northern Cape';
  
  // Fallback: try to match city to province
  const city = address?.city || address?.town || address?.suburb || '';
  for (const [province, cities] of Object.entries(majorCities)) {
    if (cities.some(c => city.toLowerCase().includes(c.toLowerCase()))) {
      return province;
    }
  }
  
  return '';
}

function mapToSACity(address: any): string {
  const city = address?.city || address?.town || address?.suburb || '';
  // Check if city is in our known cities list
  const allCities = Object.values(majorCities).flat();
  const matched = allCities.find(c => city.toLowerCase().includes(c.toLowerCase()));
  return matched || city;
}

export function PreciseLocationInput({ value, onChange }: PreciseLocationInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [location, setLocation] = useState<PreciseLocation>({
    venueName: value?.venueName || '',
    streetAddress: value?.streetAddress || '',
    city: value?.city || '',
    province: value?.province || '',
    postalCode: value?.postalCode || '',
    additionalDetails: value?.additionalDetails || '',
    fullAddress: value?.fullAddress || '',
  });

  useEffect(() => {
    if (value) {
      setLocation(value);
    }
  }, [value]);

  const updateField = (field: keyof PreciseLocation, fieldValue: string) => {
    const updated = { ...location, [field]: fieldValue };
    const parts = [
      updated.venueName,
      updated.streetAddress,
      updated.city,
      updated.province,
      updated.postalCode,
    ].filter(Boolean);
    updated.fullAddress = parts.join(', ');
    setLocation(updated);
    onChange(updated);
  };

  const updateMultipleFields = (updates: Partial<PreciseLocation>) => {
    const updated = { ...location, ...updates };
    const parts = [
      updated.venueName,
      updated.streetAddress,
      updated.city,
      updated.province,
      updated.postalCode,
    ].filter(Boolean);
    updated.fullAddress = parts.join(', ');
    setLocation(updated);
    onChange(updated);
  };

  // IP-based geolocation fallback (works on HTTP)
  const getLocationFromIP = async () => {
    try {
      // Try ipapi.co first (free, no key needed for basic usage)
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return {
          city: data.city || '',
          region: data.region || '',
          country: data.country_name || '',
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
    } catch (e) {
      console.log('ipapi failed, trying fallback...');
    }

    // Fallback to ipgeolocation.io
    try {
      const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=demo');
      if (response.ok) {
        const data = await response.json();
        return {
          city: data.city || '',
          region: data.state_prov || '',
          country: data.country_name || '',
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
    } catch (e) {
      console.log('ipgeolocation failed');
    }

    return null;
  };

  const useMyLocation = async () => {
    setLocationError('');
    setIsLocating(true);

    // Check if we're on HTTPS - required for GPS geolocation
    const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    if (!isHttps) {
      // Use IP-based geolocation for HTTP sites
      console.log('HTTP detected - using IP-based geolocation');
      try {
        const ipLocation = await getLocationFromIP();
        
        if (ipLocation && ipLocation.country === 'South Africa') {
          // Map the region to our province list
          const province = mapToSAProvince({ state: ipLocation.region });
          const city = mapToSACity({ city: ipLocation.city, town: ipLocation.city });
          
          updateMultipleFields({
            city: city || ipLocation.city || '',
            province: province || ipLocation.region || '',
          });
          
          setIsLocating(false);
          if (!isExpanded) setIsExpanded(true);
          
          setLocationError(`Located via IP: ${ipLocation.city}, ${ipLocation.region}. For precise GPS location, please use HTTPS.`);
          return;
        } else if (ipLocation) {
          setLocationError(`Location detected: ${ipLocation.city}, ${ipLocation.country}. Please enter your SA address manually for accuracy.`);
          setIsLocating(false);
          if (!isExpanded) setIsExpanded(true);
          return;
        }
      } catch (err) {
        console.error('IP geolocation failed:', err);
      }
      
      setLocationError('Unable to auto-detect location. Please enter your address manually.');
      setIsLocating(false);
      if (!isExpanded) setIsExpanded(true);
      return;
    }

    // HTTPS - use GPS geolocation
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use OpenStreetMap Nominatim for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'User-Agent': 'SimpliPlan SA' } }
          );
          
          if (!response.ok) throw new Error('Failed to fetch location data');
          
          const data = await response.json();
          const address = data.address;
          
          // Extract address components
          const streetNumber = address?.house_number || '';
          const road = address?.road || address?.street || '';
          const suburb = address?.suburb || '';
          const streetAddress = [streetNumber, road, suburb].filter(Boolean).join(' ');
          
          const city = mapToSACity(address);
          const province = mapToSAProvince(address);
          const postalCode = address?.postcode || '';
          
          // Auto-fill the form
          updateMultipleFields({
            streetAddress: streetAddress || data.display_name?.split(',')[0] || '',
            city,
            province,
            postalCode,
          });
          
          setIsLocating(false);
          
          // If not expanded, expand to show the filled data
          if (!isExpanded) {
            setIsExpanded(true);
          }
        } catch (err) {
          setLocationError('Could not fetch address details. Please enter manually.');
          setIsLocating(false);
        }
      },
      async (error) => {
        // GPS failed - try IP fallback even on HTTPS
        console.log('GPS failed, trying IP fallback...');
        try {
          const ipLocation = await getLocationFromIP();
          if (ipLocation) {
            const province = mapToSAProvince({ state: ipLocation.region });
            const city = mapToSACity({ city: ipLocation.city, town: ipLocation.city });
            
            updateMultipleFields({
              city: city || ipLocation.city || '',
              province: province || ipLocation.region || '',
            });
            
            setIsLocating(false);
            if (!isExpanded) setIsExpanded(true);
            setLocationError(`GPS unavailable. Located via IP: ${ipLocation.city}. For best accuracy, enable GPS permissions.`);
            return;
          }
        } catch (e) {
          console.error('IP fallback failed:', e);
        }

        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions or enter address manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable. Please enter your address manually.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again or enter manually.');
            break;
          default:
            setLocationError('An error occurred while fetching your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const hasAnyValue = location.venueName || location.streetAddress || location.city || location.province;

  return (
    <div className="space-y-3">
      {/* Quick View / Summary */}
      {hasAnyValue && !isExpanded && (
        <div 
          className="p-3 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-lg cursor-pointer hover:border-teal-500/40 transition-all"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-teal-400 mt-0.5" />
              <div>
                {location.venueName && (
                  <p className="text-sm font-semibold text-white">{location.venueName}</p>
                )}
                <p className="text-xs text-gray-400">{location.fullAddress}</p>
                {location.additionalDetails && (
                  <p className="text-xs text-gray-500 mt-1">{location.additionalDetails}</p>
                )}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-teal-400" />
          </div>
        </div>
      )}

      {/* Expand/Collapse Button when no value */}
      {!hasAnyValue && !isExpanded && (
        <div className="space-y-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full p-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-teal-500/50 hover:text-teal-400 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Precise Location Details</span>
          </button>
          <button
            onClick={useMyLocation}
            disabled={isLocating}
            className="w-full p-3 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-lg text-teal-400 hover:border-teal-500/40 hover:from-teal-500/20 hover:to-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLocating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Getting your location...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4" />
                <span className="text-sm">Use My Current Location</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Full Form */}
      {isExpanded && (
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-teal-400" />
              Event Location Details
            </h4>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 text-gray-500 hover:text-white transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Use My Location Button */}
          <button
            onClick={useMyLocation}
            disabled={isLocating}
            className="w-full p-3 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-lg text-teal-400 hover:border-teal-500/40 hover:from-teal-500/20 hover:to-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLocating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Detecting your location...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4" />
                <span className="text-sm font-medium">Use My Current Location (GPS)</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {locationError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-400">{locationError}</p>
            </div>
          )}

          {/* Venue Name */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">
              Venue Name <span className="text-gray-600">(e.g., Sandton Convention Centre)</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={location.venueName}
                onChange={(e) => updateField('venueName', e.target.value)}
                placeholder="Enter venue or building name"
                className="w-full pl-10 pr-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-600"
              />
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">
              Street Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={location.streetAddress}
                onChange={(e) => updateField('streetAddress', e.target.value)}
                placeholder="123 Main Street, Suburb"
                className="w-full pl-10 pr-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-600"
              />
            </div>
          </div>

          {/* City & Province Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block">City</label>
              <select
                value={location.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
              >
                <option value="" className="bg-gray-800">Select City</option>
                {location.province && majorCities[location.province]?.map(city => (
                  <option key={city} value={city} className="bg-gray-800">{city}</option>
                ))}
                {!location.province && Object.values(majorCities).flat().map(city => (
                  <option key={city} value={city} className="bg-gray-800">{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block">Province</label>
              <select
                value={location.province}
                onChange={(e) => {
                  updateField('province', e.target.value);
                  updateField('city', '');
                }}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
              >
                <option value="" className="bg-gray-800">Select Province</option>
                {saProvinces.map(province => (
                  <option key={province} value={province} className="bg-gray-800">{province}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">Postal Code</label>
            <input
              type="text"
              value={location.postalCode}
              onChange={(e) => updateField('postalCode', e.target.value)}
              placeholder="0000"
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-600"
            />
          </div>

          {/* Additional Details */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">
              Additional Directions <span className="text-gray-600">(Optional)</span>
            </label>
            <textarea
              value={location.additionalDetails}
              onChange={(e) => updateField('additionalDetails', e.target.value)}
              placeholder="e.g., Next to the petrol station, Use gate 3, Parking at the back..."
              rows={2}
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-600 resize-none"
            />
          </div>

          {/* Preview of Full Address */}
          {location.fullAddress && (
            <div className="p-3 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-lg">
              <p className="text-xs font-medium text-teal-400 mb-1">Full Address:</p>
              <p className="text-sm text-white">{location.fullAddress}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
