import { useState, useEffect, useRef } from 'react';
import { Phone, Send, ChevronLeft, MoreVertical, Bot } from 'lucide-react';

interface ChatMsg {
  id: string;
  role: 'bot' | 'user';
  text: string;
  type?: 'text' | 'list' | 'buttons';
  options?: { id: string; label: string }[];
  buttons?: { id: string; title: string }[];
}

const EVENTS = [
  { id: 'wedding', label: '💒 Wedding' },
  { id: 'funeral', label: '⚰️ Funeral' },
  { id: 'birthday', label: '🎂 Birthday' },
  { id: 'umgidi', label: '🐄 uMgidi' },
  { id: 'lobola', label: '💍 Lobola' },
  { id: 'twenty_first', label: '🔑 21st Birthday' },
];

const PROVINCES = ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Mpumalanga', 'Limpopo', 'Free State'];
const AREAS: Record<string, string[]> = {
  'Gauteng': ['Soweto', 'Sandton', 'Johannesburg', 'Pretoria'],
  'KwaZulu-Natal': ['Durban', 'Umlazi', 'Umhlanga'],
  'Western Cape': ['Cape Town', 'Khayelitsha', 'Stellenbosch'],
};
const GUEST_OPTS = ['Under 20', '20-50', '50-100', '100-200', '200+'];
const BUDGET_OPTS = ['Under R5k', 'R5k-R15k', 'R15k-R30k', 'R30k-R50k', 'R50k+'];

const GREETINGS: Record<string, string> = {
  wedding: 'A wedding! What an exciting celebration.',
  funeral: 'I am so sorry for your loss. I am here to help.',
  birthday: 'A birthday celebration! Let us make it special.',
  umgidi: 'uMgidi — what a beautiful tradition!',
  lobola: 'Lobola is a beautiful journey.',
  twenty_first: '21st birthday — the key to adulthood!',
};

export function WhatsAppPreview() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
  const [buttons, setButtons] = useState<{ id: string; title: string }[]>([]);
  const [province, setProvince] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start the demo
    const t = setTimeout(() => {
      botMsg({
        text: 'Welcome to SimpliPlan! 🎉\n\nI am your AI event planner. I will help you plan your event in just a few taps.',
      });
      setTimeout(() => showEvents(), 800);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [msgs]);

  const botMsg = (msg: Partial<ChatMsg>) => {
    setMsgs(p => [...p, { id: `b-${Date.now()}`, role: 'bot', text: msg.text || '', type: msg.type, options: msg.options, buttons: msg.buttons }]);
  };

  const userMsg = (text: string) => {
    setMsgs(p => [...p, { id: `u-${Date.now()}`, role: 'user', text }]);
  };

  const showEvents = () => {
    setStep(0);
    setOptions(EVENTS.map(e => ({ id: e.id, label: e.label })));
    setButtons([]);
  };

  const handlePick = (id: string, label: string) => {
    userMsg(label);
    setOptions([]);
    setButtons([]);

    if (step === 0) {
      // Event picked
      setStep(1);
      setTimeout(() => {
        botMsg({ text: `${GREETINGS[id] || 'Let me help you plan!'}\n\nI will find the best vendors and build you a custom plan.` });
        setTimeout(() => {
          botMsg({ text: 'Where is the event? Choose your province:', type: 'list' });
          setOptions(PROVINCES.map(p => ({ id: p, label: p })));
        }, 600);
      }, 400);
    } else if (step === 1) {
      setProvince(id);
      setStep(2);
      setTimeout(() => {
        botMsg({ text: `And which area in ${id}?`, type: 'list' });
        setOptions((AREAS[id] || ['Main City']).map(a => ({ id: a, label: a })));
      }, 400);
    } else if (step === 2) {
      setStep(3);
      setTimeout(() => {
        botMsg({ text: 'How many guests are you expecting?', type: 'list' });
        setOptions(GUEST_OPTS.map(g => ({ id: g, label: g })));
      }, 400);
    } else if (step === 3) {
      setStep(4);
      setTimeout(() => {
        botMsg({ text: 'What is your budget?', type: 'list' });
        setOptions(BUDGET_OPTS.map(b => ({ id: b, label: b })));
      }, 400);
    } else if (step === 4) {
      setStep(5);
      setTimeout(() => {
        botMsg({ text: 'Great! When is the event?\n\n(For this demo, I will use 2026-09-15)' });
        setTimeout(() => handlePick('2026-09-15', '15 September 2026'), 1500);
      }, 400);
    } else if (step === 5) {
      setStep(6);
      setTimeout(() => {
        botMsg({ text: `Give me a moment... I am finding the best vendors for your event.` });
        setTimeout(() => {
          botMsg({
            text: `I found 3 plans for you:\n\n💚 *Budget* — R25,000\nEssential vendors only\n\n💙 *Standard* — R45,000\nQuality + nice extras\n\n🧡 *Premium* — R75,000\nEverything + luxury touches\n\nWhich plan would you like?`,
            type: 'buttons',
            buttons: [
              { id: 'budget', title: 'Budget' },
              { id: 'standard', title: 'Standard' },
              { id: 'premium', title: 'Premium' },
            ],
          });
          setButtons([
            { id: 'budget', title: 'Budget' },
            { id: 'standard', title: 'Standard' },
            { id: 'premium', title: 'Premium' },
          ]);
        }, 2000);
      }, 1000);
    }
  };

  const handleButton = (id: string, title: string) => {
    userMsg(title);
    setButtons([]);
    setTimeout(() => {
      botMsg({
        text: `✅ *Your plan is ready!*\n\n📍 ${province || 'Your Area'}\n👥 100 guests\n📅 15 September 2026\n\n✓ Venue: R15,000\n✓ Catering: R18,000\n✓ DJ & Sound: R4,500\n✓ Photography: R6,500\n\n*Total: R${id === 'budget' ? '25,000' : id === 'standard' ? '45,000' : '75,000'}*\n\nI will send quotes to vendors now. They will respond within 24 hours.`,
      });
      setTimeout(() => {
        botMsg({
          text: `🎉 *All done!* Quotes sent!\n\nTrack your plan:\n🔗 simpliplan.co.za\n\nSay HI to plan another event.`,
        });
      }, 1200);
    }, 400);
  };

  return (
    <div className="mx-auto max-w-sm" style={{ height: '580px' }}>
      {/* Phone Frame */}
      <div className="h-full flex flex-col rounded-[2.5rem] overflow-hidden border-[6px] border-gray-800 bg-gray-900 shadow-2xl">
        {/* Notch */}
        <div className="h-6 bg-gray-900 flex items-center justify-center z-10">
          <div className="w-20 h-4 bg-black rounded-full" />
        </div>

        {/* WhatsApp Header */}
        <div className="bg-[#075E54] px-3 py-2 flex items-center gap-2 flex-shrink-0">
          <ChevronLeft className="w-5 h-5 text-white/80" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">SimpliPlan AI</p>
            <p className="text-[10px] text-emerald-300">online</p>
          </div>
          <Phone className="w-4 h-4 text-white/70" />
          <MoreVertical className="w-4 h-4 text-white/70" />
        </div>

        {/* Chat Background */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ background: 'linear-gradient(180deg, #D4E5D2 0%, #C8DCC4 100%)' }}>
          {/* Date divider */}
          <div className="flex items-center justify-center my-2">
            <span className="text-[10px] text-gray-600 bg-[#D4E5D2] px-2 py-0.5 rounded">Today</span>
          </div>

          {msgs.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 ${
                m.role === 'user'
                  ? 'bg-[#DCF8C6] rounded-tr-sm'
                  : 'bg-white rounded-tl-sm shadow-sm'
              }`}>
                {m.text.split('\n').map((line, i) => (
                  <p key={i} className="text-[13px] leading-relaxed" style={{ color: m.role === 'user' ? '#1a1a2e' : '#1a1a2e' }}>
                    {line.includes('*') ? (
                      <span dangerouslySetInnerHTML={{ __html: line.replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
                    ) : line}
                  </p>
                ))}
                <p className="text-[9px] text-right mt-1" style={{ color: '#94A3B8' }}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Interactive Options */}
          {options.length > 0 && (
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mx-2">
              {options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handlePick(opt.id, opt.label)}
                  className="w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  style={{ color: '#1a1a2e' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Button Options */}
          {buttons.length > 0 && (
            <div className="space-y-1.5 mx-2">
              {buttons.map(btn => (
                <button
                  key={btn.id}
                  onClick={() => handleButton(btn.id, btn.title)}
                  className="w-full py-2 rounded-lg text-sm font-medium text-center bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                  style={{ color: '#075E54' }}
                >
                  {btn.title}
                </button>
              ))}
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#F0F2F5] px-3 py-2 flex items-center gap-2 flex-shrink-0">
          <div className="flex-1 bg-white rounded-full px-4 py-2">
            <span className="text-sm text-gray-400">Type a message...</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#075E54] flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
