import { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, Share2 } from 'lucide-react';
import type { EventPlan } from '@/types';
import type { Language } from '@/types/language';
import { generateInvitation } from '@/ai/engine';
import { Button } from '@/components/ui/button';

interface Props {
  plan: EventPlan;
  culture: Language;
}

export function AIInvitationGenerator({ plan, culture }: Props) {
  const [copied, setCopied] = useState(false);
  const invitation = useMemo(() => generateInvitation(plan, culture), [plan, culture]);

  const handleCopy = () => {
    navigator.clipboard.writeText(invitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(invitation);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Invitation Generator</h3>
            <p className="text-sm text-gray-400">Auto-generated based on your event details</p>
          </div>
        </div>

        {/* Culture badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full border ${
            culture === 'zu' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            culture === 'xh' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
            'bg-teal-500/10 text-teal-400 border-teal-500/20'
          }`}>
            {culture === 'zu' ? 'Zulu Style' : culture === 'xh' ? 'Xhosa Style' : 'Standard English'}
          </span>
        </div>
      </div>

      {/* Generated Invitation */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50 relative">
        <pre className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed font-sans">{invitation}</pre>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleCopy} variant="outline"
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl">
          {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Text'}
        </Button>
        <Button onClick={handleShareWhatsApp}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">
          <Share2 className="w-4 h-4 mr-2" />Share via WhatsApp
        </Button>
      </div>
    </div>
  );
}
