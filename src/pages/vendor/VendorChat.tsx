import { useState, useRef, useEffect } from 'react';
import { VendorLayout } from '@/components/VendorLayout';
import {
  Send, CalendarCheck
} from 'lucide-react';

export function VendorChat() {
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const demoChats = [
    { clientName: 'Thabo Mokoena', event: 'Wedding', date: '2026-09-15', messages: [
      { from: 'client', text: 'Hi, I saw your quote for my wedding. Can you do the decor in teal and gold?', time: '14:30' },
      { from: 'vendor', text: 'Absolutely! Teal and gold is a beautiful combination. I have photos from a similar wedding I did in Sandton last month. Would you like to see them?', time: '14:35' },
      { from: 'client', text: 'Yes please! Also, can you include draping for the ceiling?', time: '14:40' },
    ]},
    { clientName: 'Lerato Khumalo', event: 'Funeral', date: '2026-06-20', messages: [
      { from: 'client', text: 'Thank you for the quote. Can you do the setup on Friday evening instead of Saturday morning?', time: '10:15' },
      { from: 'vendor', text: 'Yes, Friday evening works perfectly. I will bring my team at 6pm. No extra charge for the evening setup.', time: '10:22' },
    ]},
    { clientName: 'Sipho Ndlovu', event: '21st Birthday', date: '2026-07-10', messages: [
      { from: 'client', text: 'Hi, is the R7,200 quote still valid? I am ready to book.', time: 'Yesterday' },
    ]},
  ];

  const chat = demoChats[activeChat];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeChat]);

  return (
    <VendorLayout title="Messages">
      <div className="max-w-4xl mx-auto" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="flex gap-4 h-full">
          {/* Chat List */}
          <div className="w-72 flex-shrink-0 rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Conversations</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              {demoChats.map((c, i) => (
                <button key={i} onClick={() => setActiveChat(i)}
                  className={`w-full p-4 text-left transition-colors ${activeChat === i ? 'bg-amber-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                      {c.clientName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${activeChat === i ? 'text-amber-700' : 'text-gray-900'}`}>{c.clientName}</p>
                      <p className="text-[11px] truncate" style={{ color: '#94A3B8' }}>{c.messages[c.messages.length - 1].text}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                {chat.clientName[0]}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>{chat.clientName}</p>
                <p className="text-[10px] flex items-center gap-1" style={{ color: '#94A3B8' }}><CalendarCheck className="w-3 h-3" />{chat.event} on {chat.date}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chat.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${msg.from === 'vendor' ? 'rounded-br-md text-white' : 'rounded-bl-md'}`}
                    style={{ background: msg.from === 'vendor' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : '#F1F5F9', color: msg.from === 'vendor' ? 'white' : '#475569' }}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.from === 'vendor' ? 'text-amber-100' : 'text-gray-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2">
                <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-amber-400/30" style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1a1a2e' }} />
                <button className="p-3 rounded-xl text-white transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
