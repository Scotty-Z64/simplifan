import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, Plus, CheckCircle, XCircle, Clock, Trash2, Search } from 'lucide-react';

export function GuestListManager() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { getEventGuests, addGuest, updateGuest, removeGuest, getGuestStats } = useUnified();
  const guests = eventId ? getEventGuests(eventId) : [];
  const stats = eventId ? getGuestStats(eventId) : { total: 0, confirmed: 0, declined: 0, pending: 0 };
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDietary, setNewDietary] = useState('');
  const [newPlusOne, setNewPlusOne] = useState(false);

  const filtered = guests.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if (!newName || !eventId) return;
    addGuest({ eventId, name: newName, phone: newPhone, status: 'invited', dietary: newDietary, plusOne: newPlusOne });
    setNewName(''); setNewPhone(''); setNewDietary(''); setNewPlusOne(false); setShowAdd(false);
  };

  const statusIcons = { confirmed: <CheckCircle className="w-4 h-4 text-emerald-400" />, declined: <XCircle className="w-4 h-4 text-red-400" />, invited: <Clock className="w-4 h-4 text-amber-400" />, attended: <CheckCircle className="w-4 h-4 text-blue-400" /> };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Guest List</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="p-2 rounded-lg bg-teal-500/20 text-teal-400 hover:bg-teal-500/30"><Plus className="w-5 h-5" /></button>
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[{label:'Total',value:stats.total,icon:Users,color:'text-white'},{label:'Coming',value:stats.confirmed,icon:CheckCircle,color:'text-emerald-400'},{label:'Pending',value:stats.pending,icon:Clock,color:'text-amber-400'},{label:'No',value:stats.declined,icon:XCircle,color:'text-red-400'}].map((s,i) => (
            <div key={i} className="glass rounded-xl p-2 border border-gray-700/50 text-center"><s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} /><p className="text-lg font-bold text-white">{s.value}</p><p className="text-[9px] text-gray-500">{s.label}</p></div>
          ))}
        </div>
        {/* Search */}
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guests..." className="pl-10 bg-gray-800/50 border-gray-700 text-white text-sm" /></div>
        {/* Add Form */}
        {showAdd && (
          <div className="glass rounded-xl p-4 border border-teal-500/20 space-y-3">
            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Guest name" className="bg-gray-800/50 border-gray-700 text-white" />
            <Input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone / WhatsApp" className="bg-gray-800/50 border-gray-700 text-white" />
            <Input value={newDietary} onChange={e => setNewDietary(e.target.value)} placeholder="Dietary requirements (optional)" className="bg-gray-800/50 border-gray-700 text-white" />
            <button onClick={() => setNewPlusOne(!newPlusOne)} className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${newPlusOne ? 'border-teal-500/40 bg-teal-500/5' : 'border-gray-700/50'}`}><div className={`w-4 h-4 rounded border flex items-center justify-center ${newPlusOne ? 'bg-teal-500 border-teal-500' : 'border-gray-600'}`}>{newPlusOne && <CheckCircle className="w-3 h-3 text-white" />}</div><span className="text-sm text-gray-300">Plus One</span></button>
            <Button onClick={handleAdd} disabled={!newName} className="w-full bg-teal-500 text-white rounded-xl disabled:opacity-50">Add Guest</Button>
          </div>
        )}
        {/* Guest List */}
        <div className="space-y-2">
          {filtered.map(g => (
            <div key={g.id} className="glass rounded-xl p-4 border border-gray-700/50 flex items-center gap-3">
              <div className="flex-shrink-0">{statusIcons[g.status]}</div>
              <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{g.name}</p><p className="text-xs text-gray-500">{g.phone}{g.dietary ? ` · ${g.dietary}` : ''}{g.plusOne ? ' · +1' : ''}</p></div>
              <select value={g.status} onChange={e => updateGuest({ ...g, status: e.target.value as any })} className="bg-gray-800/50 border border-gray-700 text-white rounded-lg text-xs px-2 py-1">
                <option value="invited">Pending</option><option value="confirmed">Coming</option><option value="declined">No</option><option value="attended">Attended</option>
              </select>
              <button onClick={() => removeGuest(g.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-500 py-8">No guests yet. Add your first guest!</p>}
        </div>
      </div>
    </div>
  );
}
