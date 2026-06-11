import { useState } from 'react';
import { MessageCircle, Send, User, X } from 'lucide-react';
import type { EventPlan } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isMe: boolean;
}

export function FamilyChat({ plan }: { plan: EventPlan }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'SimpliPlan', message: `Welcome to the ${plan.name || 'event'} group chat! Everyone on the plan can see and reply here.`, timestamp: new Date().toISOString(), isMe: false },
  ]);
  const [input, setInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Me',
      message: input,
      timestamp: new Date().toISOString(),
      isMe: true,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
    // Auto-reply simulation
    setTimeout(() => {
      const replies = ['That sounds great!', 'I\'ll check and get back to you.', 'Let me confirm the budget for that.', 'Perfect, adding it to the plan!'];
      const reply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'Family Member',
        message: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toISOString(),
        isMe: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  if (!showChat) {
    return (
      <button onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/25 flex items-center justify-center z-40 hover:scale-110 transition-transform">
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{messages.length}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 glass rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50 overflow-hidden z-50 flex flex-col" style={{ height: '450px' }}>
      {/* Header */}
      <div className="p-3 border-b border-gray-700/50 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Family Chat</p>
            <p className="text-xs text-gray-500">{plan.name || 'Event'}</p>
          </div>
        </div>
        <button onClick={() => setShowChat(false)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isMe ? 'bg-teal-500' : 'bg-gray-700'}`}>
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs ${msg.isMe ? 'bg-teal-500/20 text-teal-100 rounded-tr-md border border-teal-500/20' : 'bg-gray-800/70 text-gray-200 rounded-tl-md border border-gray-700/30'}`}>
              <p className="text-[10px] text-gray-500 mb-0.5">{msg.sender}</p>
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700/50">
        <div className="flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-600 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
          <Button onClick={sendMessage} className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl px-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
