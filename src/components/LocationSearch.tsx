import { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';

interface LocationSearchProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
}

// Common South African locations for autocomplete
const southAfricanLocations = [
  'Johannesburg, Gauteng',
  'Pretoria, Gauteng',
  'Sandton, Gauteng',
  'Midrand, Gauteng',
  'Centurion, Gauteng',
  'Soweto, Gauteng',
  'Benoni, Gauteng',
  'Kempton Park, Gauteng',
  'Roodepoort, Gauteng',
  'Cape Town, Western Cape',
  'Stellenbosch, Western Cape',
  'Paarl, Western Cape',
  'George, Western Cape',
  'Knysna, Western Cape',
  'Hermanus, Western Cape',
  'Durban, KwaZulu-Natal',
  'Pietermaritzburg, KwaZulu-Natal',
  'Richards Bay, KwaZulu-Natal',
  'Newcastle, KwaZulu-Natal',
  'Port Elizabeth, Eastern Cape',
  'East London, Eastern Cape',
  'Mthatha, Eastern Cape',
  'Bloemfontein, Free State',
  'Welkom, Free State',
  'Polokwane, Limpopo',
  'Tzaneen, Limpopo',
  'Nelspruit, Mpumalanga',
  'Secunda, Mpumalanga',
  'Rustenburg, North West',
  'Mahikeng, North West',
  'Kimberley, Northern Cape',
  'Upington, Northern Cape',
];

export function LocationSearch({ value, onChange, placeholder = 'Search location...' }: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredLocations([]);
      setIsOpen(false);
      return;
    }

    const filtered = southAfricanLocations.filter(location =>
      location.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredLocations(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleSelect = (location: string) => {
    setSearchTerm(location);
    onChange(location);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      onChange(searchTerm.trim());
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim() && filteredLocations.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-sm bg-gray-800/50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {searchTerm ? (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
      </div>

      {isOpen && filteredLocations.length > 0 && (
        <div className="absolute z-50 w-full mt-1 glass border-gray-700/50 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelect(location)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center"
            >
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              {location}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
