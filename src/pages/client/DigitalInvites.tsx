import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, CheckCircle, Copy } from 'lucide-react';

const templates = [
  { id: 'elegant', name: 'Elegant', emoji: '✨', sample: 'You are cordially invited to celebrate with us. Your presence would make this occasion truly special.' },
  { id: 'traditional', name: 'Traditional', emoji: '🏘️', sample: 'The family requests the honor of your presence at this sacred celebration of our culture and heritage.' },
  { id: 'fun', name: 'Fun & Young', emoji: '🎉', sample: 'Pull through! It is going to be a vibe you do not want to miss. Save the date!' },
  { id: 'simple', name: 'Simple', emoji: '📅', sample: 'You are invited! Please join us for this special occasion. Details below.' },
];

export function DigitalInvites() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { events } = useUnified();
  const event = events.find(e => e.id === eventId);
  const [selectedTemplate, setSelectedTemplate] = useState('elegant');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const template = templates.find(t => t.id === selectedTemplate);
  const fullMessage = `${template?.sample}\n\n📅 ${event?.eventType || 'Event'}\n📍 ${event?.province || 'TBD'}\n🗓️ ${event?.eventDate || 'TBD'}\n\n${message}\n\nSent via SimpliPlan`;

  const handleSend = () => {
    const text = encodeURIComponent(fullMessage);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setSent(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Digital Invites</h1>
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-5">
        {/* Templates */}
        <div><label className="text-sm text-gray-400 mb-2 block">Choose a style</label><div className="grid grid-cols-2 gap-2">
          {templates.map(t => (
            <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-3 rounded-xl border transition-all text-left ${selectedTemplate === t.id ? 'border-teal-500/40 bg-teal-500/10' : 'border-gray-700/50 hover:border-gray-600'}`}>
              <span className="text-lg">{t.emoji}</span><p className="text-sm text-white mt-1">{t.name}</p>
            </button>
          ))}
        </div></div>
        {/* Preview */}
        <div className="glass rounded-xl p-4 border border-teal-500/20 bg-teal-500/5">
          <p className="text-xs text-teal-400 mb-2">Preview</p>
          <p className="text-sm text-white whitespace-pre-line">{fullMessage}</p>
        </div>
        {/* Custom Message */}
        <div><label className="text-sm text-gray-400 mb-1 block">Add a personal note (optional)</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="E.g. We would love to see you there!"
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm min-h-[80px] resize-none" />
        </div>
        {/* Actions */}
        {!sent ? (
          <div className="space-y-3">
            <Button onClick={handleSend} className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl py-5"><MessageCircle className="w-5 h-5 mr-2" />Send via WhatsApp</Button>
            <Button onClick={handleCopy} variant="outline" className="w-full border-gray-700 text-gray-300 rounded-xl"><Copy className="w-4 h-4 mr-2" />Copy to Clipboard</Button>
          </div>
        ) : (
          <div className="glass rounded-xl p-6 border border-emerald-500/30 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-white font-semibold">Invite Ready!</p>
            <p className="text-sm text-gray-400 mt-1">WhatsApp will open with your message pre-filled.</p>
          </div>
        )}
      </div>
    </div>
  );
}
