import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/types/language';
import { languageNames } from '@/types/language';

const cultures: { code: Language; name: string }[] = [
  { code: 'en', name: languageNames.en },
  { code: 'zu', name: languageNames.zu },
  { code: 'xh', name: languageNames.xh },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCulture = cultures.find(c => c.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:text-white hover:border-teal-500/30 transition-all"
      >
        <Globe className="w-4 h-4 text-teal-400" />
        <span className="text-sm font-medium">{currentCulture?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50">
          <div className="p-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2">
              Select Culture
            </p>
            {cultures.map((culture) => (
              <button
                key={culture.code}
                onClick={() => {
                  setLanguage(culture.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  language === culture.code
                    ? 'bg-teal-500/10 text-teal-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="flex-1 text-left">{culture.name}</span>
                {language === culture.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
