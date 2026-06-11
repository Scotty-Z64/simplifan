import { useState } from 'react';
import { Phone, Ambulance, Shield, Flame, HeartPulse, MapPin, Plus, Trash2, AlertTriangle, Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: string;
  icon: React.ReactNode;
  color: string;
}

const defaultContacts: EmergencyContact[] = [
  { id: '1', name: 'Police (SAPS)', number: '10111', type: 'Emergency', icon: <Shield className="w-5 h-5" />, color: 'text-blue-400' },
  { id: '2', name: 'Ambulance', number: '10177', type: 'Medical', icon: <Ambulance className="w-5 h-5" />, color: 'text-red-400' },
  { id: '3', name: 'Fire Department', number: '10111', type: 'Emergency', icon: <Flame className="w-5 h-5" />, color: 'text-orange-400' },
  { id: '4', name: 'Netcare 911', number: '082 911', type: 'Private Medical', icon: <HeartPulse className="w-5 h-5" />, color: 'text-emerald-400' },
  { id: '5', name: 'ER24 Emergency', number: '084 124', type: 'Private Medical', icon: <HeartPulse className="w-5 h-5" />, color: 'text-emerald-400' },
  { id: '6', name: 'Crime Stop', number: '08600 10111', type: 'Report Crime', icon: <Siren className="w-5 h-5" />, color: 'text-purple-400' },
  { id: '7', name: 'GBV Hotline', number: '0800 428 428', type: 'Support', icon: <HeartPulse className="w-5 h-5" />, color: 'text-pink-400' },
  { id: '8', name: 'Childline SA', number: '0800 055 555', type: 'Support', icon: <HeartPulse className="w-5 h-5" />, color: 'text-pink-400' },
];

export function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(defaultContacts);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', number: '', type: '' });
  const [calling, setCalling] = useState<string | null>(null);

  const handleCall = (number: string) => {
    setCalling(number);
    window.location.href = `tel:${number.replace(/\s/g, '')}`;
    setTimeout(() => setCalling(null), 3000);
  };

  const handleWhatsApp = (number: string) => {
    const clean = number.replace(/\s/g, '').replace(/^0/, '+27');
    window.open(`https://wa.me/${clean}`, '_blank');
  };

  const addContact = () => {
    if (!newContact.name || !newContact.number) return;
    setContacts(prev => [...prev, {
      id: `em-${Date.now()}`,
      name: newContact.name,
      number: newContact.number,
      type: newContact.type || 'Custom',
      icon: <Phone className="w-5 h-5" />,
      color: 'text-teal-400',
    }]);
    setNewContact({ name: '', number: '', type: '' });
    setShowAdd(false);
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Emergency Contacts</h3>
            <p className="text-sm text-gray-400">Quick access numbers for event day emergencies</p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300">
            Save these numbers before your event. In an emergency, every second counts.
            Tap any number to call directly.
          </p>
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" /> National Emergency Numbers
        </h4>
        {contacts.map(contact => (
          <div key={contact.id} className="glass rounded-xl p-4 border border-gray-700/50 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center flex-shrink-0 ${contact.color}`}>
              {contact.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{contact.name}</p>
              <p className="text-xs text-gray-500">{contact.type}</p>
            </div>
            <div className="text-right mr-2">
              <p className="text-lg font-bold text-teal-400 font-mono">{contact.number}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCall(contact.number)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  calling === contact.number
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : 'bg-teal-500 hover:bg-teal-400 text-white'
                }`}>
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleWhatsApp(contact.number)}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all">
                <MapPin className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteContact(contact.id)}
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-red-500/20 text-gray-500 hover:text-red-400 flex items-center justify-center transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Contact */}
      {showAdd ? (
        <div className="glass rounded-xl p-4 border border-gray-700/50 space-y-3">
          <h4 className="text-sm font-semibold text-white">Add Emergency Contact</h4>
          <Input value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })}
            placeholder="Name (e.g., Venue Security)..." className="bg-gray-800/50 border-gray-700 text-white" />
          <Input value={newContact.number} onChange={e => setNewContact({ ...newContact, number: e.target.value })}
            placeholder="Phone number..." className="bg-gray-800/50 border-gray-700 text-white" />
          <Input value={newContact.type} onChange={e => setNewContact({ ...newContact, type: e.target.value })}
            placeholder="Type (e.g., Security, Medical)..." className="bg-gray-800/50 border-gray-700 text-white" />
          <div className="flex gap-2">
            <Button onClick={addContact} className="bg-red-500 hover:bg-red-600 text-white rounded-xl flex-1">Add Contact</Button>
            <Button onClick={() => setShowAdd(false)} variant="outline" className="border-gray-700 text-gray-300">Cancel</Button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-red-500/50 hover:text-red-400 transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />Add Custom Contact
        </button>
      )}

      {/* Event Day Tips */}
      <div className="glass rounded-2xl p-5 border border-gray-700/50">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-400" /> Event Day Safety Tips
        </h4>
        <div className="space-y-2">
          {[
            'Designate a safety officer from your family or team',
            'Have a first aid kit at the venue entrance',
            'Ensure clear emergency exit routes are marked',
            'Keep emergency numbers visible at the venue',
            'Brief security on emergency procedures',
            'Have a designated driver or transport for emergencies',
            'Keep venue address posted near phones for 911 calls',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-gray-800/30 rounded-lg">
              <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
