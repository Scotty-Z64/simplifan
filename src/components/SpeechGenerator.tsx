import { useState } from 'react';
import { Mic, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import type { EventPlan } from '@/types';
import type { Language } from '@/types/language';
import { Button } from '@/components/ui/button';

const speechTemplates: Record<string, Record<string, string[]>> = {
  'mc-script': {
    en: [`Good evening everyone! Welcome to {eventName}. My name is [Your Name] and I'll be your MC for this beautiful celebration.\n\nLet me start by thanking each and every one of you for being here today. Your presence means the world to the family.\n\nPROGRAMME:\n1. Welcome & Opening Prayer\n2. Speech by Family Elder\n3. Main Ceremony\n4. Entertainment & Dancing\n5. Cutting of the Cake\n6. Closing Remarks\n\nBefore we begin, a few reminders:\n- Please keep your phones on silent\n- The photobooth is open all evening\n- Transport is arranged for those who need it\n\nLet us begin with an opening prayer...`,
    `Ladies and gentlemen, family and friends!\n\nWe gather here today at {eventName} to celebrate love, unity, and the beautiful bond that brings us all together.\n\nOn behalf of the families, I want to say Siyabulela / Enkosi / Thank you to everyone who travelled far and wide to be with us today.\n\nToday\'s order of events:\n- 14:00 - Guest Arrival & Refreshments\n- 15:00 - Official Proceedings Begin\n- 16:30 - Main Ceremony\n- 18:00 - Reception & Dinner\n- 20:00 - Dancing & Celebration\n\nLet\'s make this a day to remember!`],
    zu: [`Sawubona nonke! Siyanemukela ku {eventName}.\n\nSiyabonga kakhulu ukuba nikhethe ukuba lapha namhlanje. Lokhu kusho kakhulu emndenini.\n\nUhlelo:\n1. Imfundiso Yokuqala\n2. Inkulumo Yomndeni\n3. Umcimbi Omkhulu\n4. Ukusina Nokujabula\n5. Ukuqeda\n\nAmasiko:\n- Amakhambi azoba ethule\n- Ithashbahothi ivulekile\n- Thinta umndeni uma udinga usizo\n\Ake siqale!`],
    xh: [`Molo nonke! Siyanamkela ku {eventName}.\n\nEnkosi kakhulu ngokukhetha ukuba nikho namhlanje. Oku kuthetha kakhulu kumzi.\n\nUluhlo:\n1. Umthandazo Wokuqala\n2. Intetho Yomzi\n3. Umsitho Omkhulu\n4. Ukuxhentsa Nokonwatywa\n5. Ukugqibezela\n\nImiyalelo:\n- Amafowuni azoba ethule\n- Ithashbahothi ivulekile\n\Ake siqale!`],
  },
  'father-speech': {
    en: [`My dear daughter/son, family, and friends,\n\nToday is a day I have dreamed about since the day you were born. Watching you grow into the remarkable person you are today has been the greatest privilege of my life.\n\nTo my child: You have brought us nothing but joy. Your kindness, your strength, and your love for family are qualities that make me proud every single day.\n\nTo the new family joining ours: Welcome. We are so happy to have you in our lives. Please know that you are now part of our family, and we will always be here for you.\n\nMay your union be blessed with love, laughter, and endless happiness.\n\nNgiyabonga. Enkosi. Thank you.`],
  },
  'thank-you': {
    en: [`Dear family and friends,\n\nWords cannot express how grateful we are for your love and support on this special day.\n\nTo our parents: Thank you for everything. Your guidance, sacrifice, and unconditional love have made us who we are today.\n\nTo our guests: Thank you for travelling to be with us. Your presence has made this day truly unforgettable.\n\nTo everyone who contributed - whether with your time, your talents, or your resources - we are deeply grateful.\n\nSiyabulela kakhulu. Enkosi. Thank you from the bottom of our hearts.\n\nWith love,\n[Your Names]`],
  },
};

export function SpeechGenerator({ plan, culture }: { plan: EventPlan; culture: Language }) {
  const [type, setType] = useState('mc-script');
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState('');

  const generate = () => {
    const templates = speechTemplates[type];
    const langTemplates = templates[culture] || templates.en;
    const template = langTemplates[Math.floor(Math.random() * langTemplates.length)];
    const filled = template
      .replace(/{eventName}/g, plan.name || 'our special event')
      .replace(/\[Your Name\]/g, 'your name here')
      .replace(/\[Your Names\]/g, 'your names here');
    setGenerated(filled);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const types = [
    { key: 'mc-script', label: 'MC Script', desc: 'Full event hosting script' },
    { key: 'father-speech', label: 'Father Speech', desc: 'Parent of the bride/groom' },
    { key: 'thank-you', label: 'Thank You Note', desc: 'Post-event thank you message' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Speech & Script Generator</h3>
            <p className="text-sm text-gray-400">Generate speeches, MC scripts & thank-you notes</p>
          </div>
        </div>
      </div>

      {/* Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {types.map(t => (
          <button key={t.key} onClick={() => { setType(t.key); setGenerated(''); }}
            className={`p-4 rounded-xl border transition-all text-left ${
              type === t.key ? 'bg-teal-500/10 border-teal-500/30' : 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600'
            }`}>
            <p className={`text-sm font-semibold ${type === t.key ? 'text-teal-400' : 'text-white'}`}>{t.label}</p>
            <p className="text-xs text-gray-500">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <Button onClick={generate} className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white py-6 rounded-xl">
        <Sparkles className="w-5 h-5 mr-2" />Generate {types.find(t => t.key === type)?.label}
      </Button>

      {/* Generated Speech */}
      {generated && (
        <div className="glass rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">Generated {types.find(t => t.key === type)?.label}</h4>
            <Button onClick={handleCopy} variant="outline" size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800">
              {copied ? <Check className="w-4 h-4 mr-1 text-emerald-400" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <pre className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed font-sans">{generated}</pre>
          <Button onClick={generate} variant="ghost" size="sm" className="mt-3 text-gray-400 hover:text-teal-400">
            <RefreshCw className="w-4 h-4 mr-1" />Generate Another
          </Button>
        </div>
      )}
    </div>
  );
}
