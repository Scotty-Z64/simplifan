import { useState } from 'react';
import { usePlans } from '@/context/PlansContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Send, Copy, Check, MessageCircle } from 'lucide-react';

interface Props {
  planId: string;
}

const thankYouTemplates = [
  {
    id: 'general',
    name: 'General Thanks',
    text: 'Thank you so much for being part of our special day and for your generous contribution. Your support means the world to us.',
  },
  {
    id: 'contribution',
    name: 'For Contributors',
    text: 'We are deeply grateful for your contribution towards our celebration. Your generosity has made this day possible. May God bless you abundantly.',
  },
  {
    id: 'attendance',
    name: 'For Attendees',
    text: 'Thank you for taking the time to celebrate with us. Your presence made our day even more special and memorable.',
  },
  {
    id: 'family',
    name: 'For Family',
    text: 'To our beloved family, thank you for your unwavering love and support. This celebration would not have been possible without you. We are blessed to have you in our lives.',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    text: 'Siyabulela kakhulu ngokuba nathi ngale nsuku yakho emnandi. Inkathazo yenu ayigwinywanga. Siyaniconga kakhulu. (Thank you so much for being with us on this special day. Your efforts have not gone unnoticed. We are very grateful.)',
  },
];

export function ThankYouNotes({ planId: _planId }: Props) {
  const { currentPlan } = usePlans();
  const [selectedTemplate, setSelectedTemplate] = useState(thankYouTemplates[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [copied, setCopied] = useState(false);

  if (!currentPlan) return null;

  const message = customMessage || selectedTemplate.text;

  const generateFullMessage = () => {
    let text = '';
    if (recipientName) {
      text += `Dear ${recipientName},\n\n`;
    }
    text += message;
    text += `\n\nWith gratitude,\n${currentPlan.name || 'The Family'}`;
    return text;
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(generateFullMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generateFullMessage());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Recipient */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Recipient Name (Optional)</label>
        <Input
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="e.g., Uncle John"
        />
      </div>

      {/* Template Selector */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
          <Heart className="w-4 h-4 text-teal-500" />
          Choose a Template
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {thankYouTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                setCustomMessage('');
              }}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedTemplate.id === template.id && !customMessage
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-xs font-medium text-gray-700">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Or Write Your Own</label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Write a personal thank you message..."
          rows={4}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>

      {/* Preview */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Preview</label>
        <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-lg">
          <div className="text-center mb-4">
            <Heart className="w-8 h-8 text-rose-400 mx-auto" />
          </div>
          {recipientName && (
            <p className="text-sm font-medium text-gray-800 mb-3">Dear {recipientName},</p>
          )}
          <p className="text-sm text-gray-700 leading-relaxed italic">
            &ldquo;{message}&rdquo;
          </p>
          <div className="mt-4 pt-4 border-t border-rose-200 text-center">
            <p className="text-xs text-gray-500">With gratitude,</p>
            <p className="text-sm font-medium text-gray-800">{currentPlan.name || 'The Family'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button onClick={shareViaWhatsApp} className="bg-green-500 hover:bg-green-600 text-white">
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        <Button onClick={copyMessage} className="bg-gray-600 hover:bg-gray-700 text-white">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button
          onClick={() => {
            setRecipientName('');
            setCustomMessage('');
            setSelectedTemplate(thankYouTemplates[0]);
          }}
          variant="outline"
          className="border-gray-300"
        >
          <Send className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Quick Send to Guests */}
      {currentPlan.guests.length > 0 && (
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Send to Attending Guests</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {currentPlan.guests
              .filter((g) => g.status === 'attending')
              .map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-sm text-gray-700">{guest.name}</span>
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white text-xs"
                    onClick={() => {
                      setRecipientName(guest.name);
                      shareViaWhatsApp();
                    }}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Send
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
