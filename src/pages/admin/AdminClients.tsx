import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { ArrowLeft, Users, Search, MapPin, Calendar, DollarSign } from 'lucide-react';

export function AdminClients() {
  const navigate = useNavigate();
  const { events } = useUnified();
  const [search, setSearch] = useState('');
  const [filterProvince, setFilterProvince] = useState('all');

  // Build client list from events (each client may have multiple events)
  const clientMap = new Map();
  events.forEach(e => {
    if (!clientMap.has(e.clientId)) {
      clientMap.set(e.clientId, { id: e.clientId, name: e.clientName, phone: e.clientPhone, events: [], totalSpent: 0 });
    }
    const c = clientMap.get(e.clientId);
    c.events.push(e);
    c.totalSpent += e.totalCost;
  });
  const allClients = Array.from(clientMap.values());

  const provinces = [...new Set(events.map(e => e.province?.split(',')[1]?.trim() || e.province).filter(Boolean))];

  const filtered = allClients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search);
    const matchProv = filterProvince === 'all' || c.events.some((e: any) => e.province?.includes(filterProvince));
    return matchSearch && matchProv;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Client Database</h1>
      </div>
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-3 border border-gray-700/50 text-center"><Users className="w-4 h-4 text-teal-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">{allClients.length}</p><p className="text-[9px] text-gray-500">Total Clients</p></div>
          <div className="glass rounded-xl p-3 border border-gray-700/50 text-center"><Calendar className="w-4 h-4 text-blue-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">{events.length}</p><p className="text-[9px] text-gray-500">Total Events</p></div>
          <div className="glass rounded-xl p-3 border border-gray-700/50 text-center"><DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" /><p className="text-xl font-bold text-white">R{(allClients.reduce((s, c) => s + c.totalSpent, 0) / 1000000).toFixed(1)}M</p><p className="text-[9px] text-gray-500">Total GMV</p></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm" /></div>
          <select value={filterProvince} onChange={e => setFilterProvince(e.target.value)} className="px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm"><option value="all">All Provinces</option>{provinces.map(p => <option key={p} value={p}>{p}</option>)}</select>
        </div>
        <div className="space-y-2">
          {filtered.map((client: any) => (
            <div key={client.id} className="glass rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center"><span className="text-sm font-bold text-teal-400">{client.name?.[0]}</span></div><div><p className="text-sm font-semibold text-white">{client.name}</p><p className="text-[10px] text-gray-500">{client.phone}</p></div></div>
                <div className="text-right"><p className="text-sm text-emerald-400 font-medium">R{client.totalSpent.toLocaleString('en-ZA')}</p><p className="text-[10px] text-gray-500">{client.events.length} events</p></div>
              </div>
              <div className="flex flex-wrap gap-1">
                {client.events.map((evt: any, i: number) => (
                  <span key={i} className="text-[10px] bg-gray-800/50 text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1"><MapPin className="w-2 h-2" />{evt.eventType} · {evt.province}</span>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-500 py-8">No clients found.</p>}
        </div>
      </div>
    </div>
  );
}
