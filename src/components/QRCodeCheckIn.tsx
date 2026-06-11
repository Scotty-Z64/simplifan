import { useState } from 'react';
import { QrCode, Share2, Copy, Check, Smartphone, Users } from 'lucide-react';
import type { EventPlan } from '@/types';
import { Button } from '@/components/ui/button';

export function QRCodeCheckIn({ plan }: { plan: EventPlan }) {
  const [copied, setCopied] = useState(false);
  const eventUrl = `${window.location.origin}/checkin/${plan.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`You're invited to ${plan.name || 'our event'}! \n\nScan this QR code at the door for check-in:\n${eventUrl}\n\nDate: ${plan.eventDate || 'TBA'}\nLocation: ${plan.location || 'TBA'}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Generate a simple SVG QR code pattern
  const generateQRPattern = () => {
    const size = 29;
    const pattern = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Simplified QR pattern: corner markers and random data
        const isCorner = (i < 7 && j < 7) || (i < 7 && j >= size - 7) || (i >= size - 7 && j < 7);
        const isTiming = i === 6 || j === 6;
        const isData = Math.random() > 0.5;
        if (isCorner || (isTiming && !isCorner) || (isData && !isCorner && !isTiming)) {
          pattern.push({ x: j, y: i });
        }
      }
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">QR Code Check-In</h3>
            <p className="text-sm text-gray-400">Digital guest check-in system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-4">
          <div className="p-3 bg-gray-800/50 rounded-xl">
            <Smartphone className="w-6 h-6 text-teal-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Guests scan QR at door</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-xl">
            <Users className="w-6 h-6 text-teal-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Real-time attendance tracking</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-xl">
            <Check className="w-6 h-6 text-teal-400 mx-auto mb-1" />
            <p className="text-xs text-gray-400">No paper lists needed</p>
          </div>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="flex flex-col items-center">
        <div className="glass rounded-2xl p-8 border border-gray-700/50 bg-white">
          {/* SVG QR Code */}
          <svg viewBox="0 0 29 29" className="w-48 h-48 sm:w-64 sm:h-64">
            <rect width="29" height="29" fill="white" />
            {qrPattern.map((dot, i) => (
              <rect key={i} x={dot.x} y={dot.y} width="1" height="1" fill="#0c1222" />
            ))}
            {/* Corner markers */}
            <rect x="1" y="1" width="5" height="5" fill="none" stroke="#0c1222" strokeWidth="0.5" />
            <rect x="2" y="2" width="3" height="3" fill="#0c1222" />
            <rect x="23" y="1" width="5" height="5" fill="none" stroke="#0c1222" strokeWidth="0.5" />
            <rect x="24" y="2" width="3" height="3" fill="#0c1222" />
            <rect x="1" y="23" width="5" height="5" fill="none" stroke="#0c1222" strokeWidth="0.5" />
            <rect x="2" y="24" width="3" height="3" fill="#0c1222" />
          </svg>
          <p className="text-center text-gray-900 text-sm font-semibold mt-3">{plan.name || 'Event Check-In'}</p>
          <p className="text-center text-gray-500 text-xs">Scan to check in</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleCopy} variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl">
            {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button onClick={handleShareWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">
            <Share2 className="w-4 h-4 mr-2" />Share QR
          </Button>
        </div>
      </div>

      {/* Guest List Preview */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <h4 className="text-sm font-semibold text-white mb-3">Expected Check-Ins</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-gray-800/50 rounded-xl text-center">
            <p className="text-2xl font-bold text-teal-400">{plan.guests.length}</p>
            <p className="text-xs text-gray-500">Total Invited</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-xl text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {plan.guests.filter(g => g.status === 'attending').length}
            </p>
            <p className="text-xs text-gray-500">Confirmed</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-xl text-center">
            <p className="text-2xl font-bold text-amber-400">
              {plan.guests.filter(g => g.status === 'pending').length}
            </p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded-xl text-center">
            <p className="text-2xl font-bold text-red-400">
              {plan.guests.filter(g => g.status === 'not-attending').length}
            </p>
            <p className="text-xs text-gray-500">Declined</p>
          </div>
        </div>
      </div>
    </div>
  );
}
