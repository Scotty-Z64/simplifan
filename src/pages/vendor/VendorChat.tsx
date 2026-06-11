import { useState } from 'react';
import { VendorLayout } from '@/components/VendorLayout';
import { useUnified } from '@/context/UnifiedContext';
import { trpc } from '@/providers/trpc';
import {
  Send, ArrowLeft, Loader2, MessageCircle
} from 'lucide-react';

export function VendorChat() {
  const { vendorUser } = useUnified();
  const vendorId = vendorUser ? parseInt(vendorUser.id) : 0;

  // ─── API Data ───
  const { data: conversations, isLoading } = trpc.conversation.list.useQuery(
    { vendorId },
    { enabled: vendorId > 0, refetchInterval: 5000 }
  );
  const sendMessage = trpc.conversation.sendMessage.useMutation();
  const utils = trpc.useUtils();

  const [selectedConv, setSelectedConv] = useState<number | null>(null);
  const [reply, setReply] = useState('');

  // Fetch full conversation with messages when one is selected
  const { data: activeConvFull } = trpc.conversation.byId.useQuery(
    { id: selectedConv ?? 0 },
    { enabled: selectedConv !== null && selectedConv > 0, refetchInterval: 3000 }
  );

  const activeConv = conversations?.find(c => c.id === selectedConv);
  const messages = activeConvFull?.messages ?? [];

  const handleSend = () => {
    if (!reply.trim() || !selectedConv) return;
    sendMessage.mutate(
      { conversationId: selectedConv, senderType: 'vendor', content: reply.trim() },
      {
        onSuccess: () => {
          utils.conversation.byId.invalidate({ id: selectedConv });
          utils.conversation.list.invalidate({ vendorId });
        }
      }
    );
    setReply('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <VendorLayout title="Messages">
      <div className="flex-1 flex h-[calc(100vh-80px)]">
        {/* Conversation List */}
        <div className={`w-full sm:w-80 flex-shrink-0 border-r overflow-y-auto ${selectedConv ? 'hidden sm:block' : ''}`} style={{ borderColor: '#E2E8F0' }}>
          {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#2BBCA8' }} /></div>}
          {!isLoading && (!conversations || conversations.length === 0) && (
            <div className="p-8 text-center">
              <MessageCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E1' }} />
              <p className="text-sm" style={{ color: '#94A3B8' }}>No conversations yet</p>
            </div>
          )}
          {conversations?.map(conv => (
            <button key={conv.id} onClick={() => setSelectedConv(conv.id)}
              className="w-full p-4 flex items-center gap-3 text-left transition-colors hover:bg-gray-50 border-b"
              style={{ borderColor: '#F1F5F9', background: selectedConv === conv.id ? '#F0FDFA' : 'white' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                {conv.client?.name?.charAt(0) ?? 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#1a1a2e' }}>{conv.client?.name ?? 'Client'}</p>
                <p className="text-xs truncate" style={{ color: '#94A3B8' }}>{conv.lastMessage ?? 'No messages yet'}</p>
              </div>
              {conv.vendorUnread > 0 && (
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#EF4444' }}>{conv.vendorUnread}</span>
              )}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!selectedConv ? 'hidden sm:flex' : ''}`}>
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E1' }} />
                <p className="text-sm" style={{ color: '#94A3B8' }}>Select a conversation to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 py-3 flex items-center gap-3 border-b" style={{ borderColor: '#E2E8F0', background: 'white' }}>
                <button onClick={() => setSelectedConv(null)} className="sm:hidden p-1"><ArrowLeft className="w-5 h-5" style={{ color: '#64748B' }} /></button>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                  {activeConv.client?.name?.charAt(0) ?? 'C'}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{activeConv.client?.name ?? 'Client'}</p>
                  <p className="text-[10px]" style={{ color: '#10B981' }}>Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#F8FAFC' }}>
                {messages.length === 0 && (
                  <p className="text-xs text-center py-8" style={{ color: '#CBD5E1' }}>No messages yet. Say hello!</p>
                )}
                {messages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.senderType === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.senderType === 'vendor'
                        ? 'rounded-br-md text-white'
                        : 'rounded-bl-md'
                    }`} style={msg.senderType === 'vendor'
                      ? { background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }
                      : { background: 'white', color: '#1a1a2e', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t" style={{ borderColor: '#E2E8F0', background: 'white' }}>
                <div className="flex items-center gap-2">
                  <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F1F5F9', color: '#1a1a2e' }} />
                  <button onClick={handleSend} disabled={!reply.trim()}
                    className="p-3 rounded-xl transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </VendorLayout>
  );
}
