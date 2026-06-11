import { useState } from 'react';
import { usePlans } from '@/context/PlansContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette, Download, Share2, Copy, Check, Heart, Sparkles, Flower2, Cross, Star } from 'lucide-react';

interface Props {
  planId: string;
}

const invitationStyles = [
  { id: 'elegant', name: 'Elegant', icon: Sparkles, bgColor: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900', textColor: 'text-white', accentColor: 'text-amber-400' },
  { id: 'romantic', name: 'Romantic', icon: Heart, bgColor: 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600', textColor: 'text-white', accentColor: 'text-amber-200' },
  { id: 'traditional', name: 'Traditional', icon: Flower2, bgColor: 'bg-gradient-to-br from-amber-700 via-yellow-600 to-amber-800', textColor: 'text-white', accentColor: 'text-yellow-200' },
  { id: 'serene', name: 'Serene', icon: Cross, bgColor: 'bg-gradient-to-br from-slate-700 via-gray-600 to-slate-800', textColor: 'text-white', accentColor: 'text-gray-300' },
  { id: 'celebration', name: 'Celebration', icon: Star, bgColor: 'bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600', textColor: 'text-white', accentColor: 'text-yellow-200' },
];

export function DigitalInvitation({ planId: _planId }: Props) {
  const { currentPlan } = usePlans();
  const [selectedStyle, setSelectedStyle] = useState(invitationStyles[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!currentPlan) return null;

  const eventTypeLabels: Record<string, string> = {
    wedding: 'Wedding',
    funeral: 'Memorial Service',
    umemulo: 'uMemulo Ceremony',
    umgidi: 'uMgidi Ceremony',
  };

  const eventTypeVerbiage: Record<string, { verb: string; preposition: string }> = {
    wedding: { verb: 'invite you to celebrate', preposition: 'the wedding of' },
    funeral: { verb: 'invite you to honour', preposition: 'the life of' },
    umemulo: { verb: 'invite you to witness', preposition: 'the coming of age of' },
    umgidi: { verb: 'invite you to celebrate', preposition: 'the homecoming of' },
  };

  const generateInvitationText = () => {
    const verb = eventTypeVerbiage[currentPlan.eventType]?.verb || 'invite you to';
    const prep = eventTypeVerbiage[currentPlan.eventType]?.preposition || '';
    
    let text = `We ${verb} ${prep}\n\n`;
    text += `${currentPlan.name || 'Our Special Event'}\n\n`;
    
    if (currentPlan.eventDate) {
      const date = new Date(currentPlan.eventDate);
      text += `${date.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n`;
    }
    
    if (currentPlan.eventTime) {
      const time = new Date(`2000-01-01T${currentPlan.eventTime}`);
      text += `at ${time.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}\n`;
    }
    
    text += `\n`;
    
    if (currentPlan.preciseLocation?.venueName) {
      text += `${currentPlan.preciseLocation.venueName}\n`;
    }
    if (currentPlan.preciseLocation?.fullAddress) {
      text += `${currentPlan.preciseLocation.fullAddress}\n`;
    } else if (currentPlan.location) {
      text += `${currentPlan.location}\n`;
    }
    
    if (customMessage) {
      text += `\n${customMessage}\n`;
    }
    
    text += `\nKindly RSVP by ${currentPlan.eventDate ? new Date(new Date(currentPlan.eventDate).getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA') : 'the date specified'}\n`;
    text += `\nPlanned with SimpliPlan`;
    
    return text;
  };

  const copyInvitation = () => {
    navigator.clipboard.writeText(generateInvitationText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generateInvitationText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const invitationText = generateInvitationText();

  const downloadInvitation = () => {
    const blob = new Blob([invitationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPlan.name || 'invitation'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Style Selector */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
          <Palette className="w-4 h-4 text-teal-500" />
          Choose Invitation Style
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {invitationStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedStyle.id === style.id
                  ? 'border-teal-500 ring-2 ring-teal-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${style.bgColor}`} />
              <span className="text-xs font-medium text-gray-700">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-1 block">Personal Message (Optional)</Label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Add a personal touch to your invitation..."
          rows={3}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>

      {/* Preview */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">Preview</Label>
        <div className={`${selectedStyle.bgColor} rounded-xl p-8 text-center shadow-lg`}>
          <div className="border-2 border-white/30 rounded-lg p-6">
            <p className={`text-sm ${selectedStyle.accentColor} mb-4 uppercase tracking-widest`}>
              You are cordially invited
            </p>
            
            <h3 className={`text-2xl font-bold ${selectedStyle.textColor} mb-2`}>
              {eventTypeLabels[currentPlan.eventType]}
            </h3>
            
            <p className={`text-lg ${selectedStyle.textColor} mb-4 opacity-90`}>
              {eventTypeVerbiage[currentPlan.eventType]?.verb || 'invite you to celebrate'}
            </p>
            
            <h4 className={`text-xl font-semibold ${selectedStyle.accentColor} mb-4`}>
              {currentPlan.name || 'Our Special Event'}
            </h4>
            
            {currentPlan.eventDate && (
              <div className={`${selectedStyle.textColor} mb-2`}>
                <p className="text-lg">
                  {new Date(currentPlan.eventDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            )}
            
            {currentPlan.eventTime && (
              <p className={`text-lg ${selectedStyle.accentColor} mb-4`}>
                at {new Date(`2000-01-01T${currentPlan.eventTime}`).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
            
            <div className={`${selectedStyle.textColor} mb-4`}>
              {currentPlan.preciseLocation?.venueName && (
                <p className="font-semibold">{currentPlan.preciseLocation.venueName}</p>
              )}
              {currentPlan.preciseLocation?.fullAddress && (
                <p className="text-sm opacity-80">{currentPlan.preciseLocation.fullAddress}</p>
              )}
            </div>
            
            {customMessage && (
              <p className={`text-sm ${selectedStyle.textColor} italic mb-4 opacity-80`}>
                &ldquo;{customMessage}&rdquo;
              </p>
            )}
            
            <div className={`mt-6 pt-4 border-t border-white/20`}>
              <p className={`text-xs ${selectedStyle.textColor} opacity-60`}>
                Kindly RSVP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={shareViaWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        <Button
          onClick={copyInvitation}
          className="bg-gray-600 hover:bg-gray-700 text-white"
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button
          onClick={downloadInvitation}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
}
