import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSmartPackage } from '@/ai/smartPlanner';
import { getCultureEvents } from '@/translations/cultureEvents';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/types/language';
import { ArrowLeft, BookOpen, Search, Info, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

export function CulturalGuide() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const cultureEvents = getCultureEvents(language as Language);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [search, setSearch] = useState('');

  const pkg = selectedEvent ? generateSmartPackage(selectedEvent as any, 0, 0, 'Gauteng', 'Johannesburg', '') : null;

  const filteredEvents = cultureEvents.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Cultural Guide</h1>
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <p className="text-sm text-gray-400">Learn about South African event traditions and what to expect.</p>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm" /></div>

        {!selectedEvent ? (
          <div className="space-y-2">
            {filteredEvents.map(evt => {
              const Icon = evt.icon;
              return (
                <button key={evt.type} onClick={() => setSelectedEvent(evt.type)} className="w-full glass rounded-xl p-4 border border-gray-700/50 hover:border-teal-500/30 transition-all text-left flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${evt.color} flex items-center justify-center flex-shrink-0`}><Icon className="w-5 h-5 text-white" /></div>
                  <div className="flex-1"><p className="text-sm font-semibold text-white">{evt.name}</p><p className="text-xs text-gray-500">{evt.description}</p></div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={() => setSelectedEvent('')} className="text-sm text-teal-400 hover:underline">← Back to all events</button>
            {pkg && (
              <>
                <div className="glass rounded-2xl p-5 border border-gray-700/50">
                  <h2 className="text-xl font-bold text-white mb-2">{pkg.eventName}</h2>
                  <p className="text-sm text-teal-300 leading-relaxed">{pkg.plannerNote}</p>
                </div>
                {pkg.culturalNotes.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2"><BookOpen className="w-4 h-4 text-teal-400" />Cultural Protocol</h3>
                    {pkg.culturalNotes.map((note, i) => (
                      <div key={i} className={`glass rounded-xl p-4 border ${note.priority === 'essential' ? 'border-red-500/20 bg-red-500/5' : 'border-teal-500/20 bg-teal-500/5'}`}>
                        <div className="flex items-start gap-2">
                          {note.priority === 'essential' ? <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" /> : <Lightbulb className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />}
                          <div><p className={`text-sm font-semibold ${note.priority === 'essential' ? 'text-red-400' : 'text-teal-400'}`}>{note.title}</p><p className="text-xs text-gray-400 mt-1">{note.content}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {pkg.groceryList.length > 0 && (
                  <div className="glass rounded-2xl p-5 border border-gray-700/50">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3"><Info className="w-4 h-4 text-amber-400" />Traditional Items Needed</h3>
                    <div className="space-y-2">
                      {pkg.groceryList.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm"><span className="text-gray-400">{item.item} <span className="text-gray-600">({item.quantity})</span></span><span className="text-teal-400">R{item.estPrice}</span></div>
                      ))}
                    </div>
                  </div>
                )}
                {pkg.timeline.length > 0 && (
                  <div className="glass rounded-2xl p-5 border border-gray-700/50">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">Timeline</h3>
                    <div className="space-y-3">
                      {pkg.timeline.map((item, i) => (
                        <div key={i} className="flex items-start gap-3"><span className="text-xs text-teal-400 font-medium flex-shrink-0 w-24">{item.time}</span><div><p className="text-sm text-white">{item.label}</p><p className="text-xs text-gray-500">{item.description}</p></div></div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
