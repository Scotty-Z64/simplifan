import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { ArrowLeft, MapPin, Calendar, DollarSign, Users, Filter, X } from 'lucide-react';

const statusColors: Record<string, string> = {
  planning: '#f59e0b',
  quoted: '#6366f1',
  booked: '#14b8a6',
  completed: '#10b981',
};

const statusLabels: Record<string, string> = {
  planning: 'Planning',
  quoted: 'Quotes Sent',
  booked: 'Booked',
  completed: 'Done',
};

// SA province centers for positioning
const provinceDots: Record<string, { x: number; y: number }> = {
  'Gauteng': { x: 52, y: 38 },
  'KwaZulu-Natal': { x: 68, y: 62 },
  'Western Cape': { x: 22, y: 78 },
  'Eastern Cape': { x: 48, y: 72 },
  'Mpumalanga': { x: 62, y: 42 },
  'Limpopo': { x: 58, y: 22 },
  'Free State': { x: 42, y: 52 },
  'North West': { x: 32, y: 32 },
  'Northern Cape': { x: 25, y: 55 },
};

export function AdminEventsMap() {
  const navigate = useNavigate();
  const { mapEvents, provinceBreakdown } = useAdmin();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [filterProvince, setFilterProvince] = useState('all');

  const filtered = mapEvents.filter(e => {
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchProv = filterProvince === 'all' || e.province === filterProvince;
    return matchStatus && matchProv;
  });

  const selected = mapEvents.find(e => e.id === selectedEvent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Events Map</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{filtered.length} events</span>
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 glass rounded-lg px-3 py-1.5 border border-gray-700/50">
            <Filter className="w-3 h-3 text-gray-500" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-transparent text-white text-xs outline-none">
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="quoted">Quoted</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-1 glass rounded-lg px-3 py-1.5 border border-gray-700/50">
            <MapPin className="w-3 h-3 text-gray-500" />
            <select value={filterProvince} onChange={e => setFilterProvince(e.target.value)} className="bg-transparent text-white text-xs outline-none">
              <option value="all">All Provinces</option>
              {Object.keys(provinceDots).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          {(['planning', 'quoted', 'booked', 'completed'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${filterStatus === s ? 'border-gray-600 text-white' : 'border-gray-800/30 text-gray-500'}`}>
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: statusColors[s] }} />{statusLabels[s]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map */}
          <div className="lg:col-span-2 glass rounded-2xl p-4 border border-gray-700/50 relative overflow-hidden" style={{ minHeight: 450 }}>
            {/* Simple SA Map SVG */}
            <svg viewBox="0 0 100 90" className="w-full h-full" style={{ minHeight: 400 }}>
              {/* SA Outline - simplified */}
              <path d="M15,20 L20,18 L28,15 L35,14 L42,12 L50,12 L58,10 L65,10 L72,12 L78,15 L82,18 L85,22 L86,28 L84,35 L80,42 L78,48 L80,55 L82,62 L78,68 L72,75 L65,80 L58,82 L50,83 L42,82 L35,80 L28,76 L22,70 L18,62 L16,55 L15,48 L14,40 L13,32 Z" fill="none" stroke="#374151" strokeWidth="0.5" />
              {/* Province lines */}
              <path d="M42,12 L42,52 L15,48" stroke="#1f2937" strokeWidth="0.3" fill="none" />
              <path d="M50,12 L50,83" stroke="#1f2937" strokeWidth="0.3" fill="none" />
              <path d="M58,10 L58,82" stroke="#1f2937" strokeWidth="0.3" fill="none" />
              <path d="M42,52 L82,55" stroke="#1f2937" strokeWidth="0.3" fill="none" />
              <path d="M28,15 L25,55" stroke="#1f2937" strokeWidth="0.3" fill="none" />
              <path d="M72,12 L80,42" stroke="#1f2937" strokeWidth="0.3" fill="none" />
              {/* Province labels */}
              <text x="45" y="35" fill="#6b7280" fontSize="2.5">Gauteng</text>
              <text x="65" y="55" fill="#6b7280" fontSize="2.5">KZN</text>
              <text x="25" y="72" fill="#6b7280" fontSize="2.5">WC</text>
              <text x="48" y="68" fill="#6b7280" fontSize="2.5">EC</text>
              <text x="58" y="28" fill="#6b7280" fontSize="2.5">Limpopo</text>
              <text x="60" y="42" fill="#6b7280" fontSize="2.5">Mpumalanga</text>
              <text x="30" y="40" fill="#6b7280" fontSize="2">NW</text>
              <text x="36" y="52" fill="#6b7280" fontSize="2.5">FS</text>
              <text x="22" y="58" fill="#6b7280" fontSize="2">NC</text>
              {/* Event dots */}
              {filtered.map(evt => {
                const base = provinceDots[evt.province];
                if (!base) return null;
                // Jitter positions slightly so overlapping events are visible
                const jitterX = (parseInt(evt.id.replace('me', '')) % 3 - 1) * 3;
                const jitterY = (parseInt(evt.id.replace('me', '')) % 5 - 2) * 2;
                return (
                  <g key={evt.id} onClick={() => setSelectedEvent(evt.id)} style={{ cursor: 'pointer' }}>
                    <circle cx={base.x + jitterX} cy={base.y + jitterY} r="2.5" fill={statusColors[evt.status] || '#6b7280'} opacity={0.9} />
                    <circle cx={base.x + jitterX} cy={base.y + jitterY} r="4" fill="none" stroke={statusColors[evt.status] || '#6b7280'} strokeWidth="0.3" opacity={0.5}>
                      <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}
            </svg>
            {/* Legend */}
            <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2 border border-gray-700/50">
              <div className="flex flex-wrap gap-3">
                {Object.entries(statusLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[key] }} /><span className="text-[10px] text-gray-400">{label}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Event List / Detail */}
          <div className="space-y-3">
            {selected ? (
              <div className="glass rounded-2xl p-5 border border-teal-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">{selected.eventType}</h3>
                  <button onClick={() => setSelectedEvent(null)} className="p-1 rounded-lg text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-teal-400" /><span className="text-gray-400">{selected.clientName}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-400" /><span className="text-gray-400">{selected.area}, {selected.province}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-teal-400" /><span className="text-gray-400">{selected.eventDate}</span></div>
                  <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-teal-400" /><span className="text-gray-400">R {selected.budget.toLocaleString('en-ZA')}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[selected.status] }} />
                    <span className="text-gray-400">{statusLabels[selected.status]}</span>
                  </div>
                  <span className="inline-block text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full mt-1">{selected.tier} tier</span>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-4 border border-gray-700/50">
                <h3 className="text-sm font-semibold text-white mb-3">Events ({filtered.length})</h3>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {filtered.map(evt => (
                    <button key={evt.id} onClick={() => setSelectedEvent(evt.id)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-800/50 hover:border-gray-700 hover:bg-gray-800/30 transition-all text-left">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusColors[evt.status] }} />
                      <div className="flex-1 min-w-0"><p className="text-xs text-white truncate">{evt.eventType}</p><p className="text-[10px] text-gray-500">{evt.area} · R{evt.budget.toLocaleString('en-ZA')}</p></div>
                      <span className="text-[10px] text-gray-600">{evt.eventDate}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Province Breakdown */}
            <div className="glass rounded-2xl p-4 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-white mb-3">By Province</h3>
              <div className="space-y-2">
                {provinceBreakdown.map(p => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{p.name}</span>
                    <div className="flex items-center gap-2"><span className="text-gray-500">{p.events} events</span><span className="text-teal-400">R{(p.revenue/1000).toFixed(0)}k</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
