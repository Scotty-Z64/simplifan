import { useState, useMemo } from 'react';
import { VendorLayout } from '@/components/VendorLayout';
import { useUnified } from '@/context/UnifiedContext';
import { trpc } from '@/providers/trpc';
import {
  MessageSquare, Send, Phone, Calendar, Users, TrendingUp,
  CheckCircle, X, Loader2
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'New', color: '#3b82f6', bg: '#EFF6FF' },
  sent: { label: 'Sent', color: '#3b82f6', bg: '#EFF6FF' },
  quoted: { label: 'Quoted', color: '#f59e0b', bg: '#FFFBEB' },
  accepted: { label: 'Accepted', color: '#8b5cf6', bg: '#F5F3FF' },
  declined: { label: 'Declined', color: '#ef4444', bg: '#FEF2F2' },
  expired: { label: 'Expired', color: '#6b7280', bg: '#F3F4F6' },
};

export function VendorLeads() {
  const { vendorUser } = useUnified();
  const vendorId = vendorUser ? parseInt(vendorUser.id) : 0;

  // ─── API Data ───
  const { data: quotes, isLoading, refetch } = trpc.quote.list.useQuery(
    vendorId > 0 ? { vendorId, limit: 100 } : undefined,
    { enabled: vendorId > 0 }
  );
  const respondMutation = trpc.quote.respond.useMutation({ onSuccess: () => refetch() });
  const statusMutation = trpc.quote.updateStatus.useMutation({ onSuccess: () => refetch() });

  const [filter, setFilter] = useState<'all' | 'submitted' | 'quoted' | 'accepted'>('all');
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');

  const filteredLeads = useMemo(() => {
    if (!quotes) return [];
    let result = [...quotes];
    if (filter !== 'all') result = result.filter(l => l.status === filter);
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [quotes, filter]);

  const stats = useMemo(() => {
    if (!quotes) return { new: 0, quoted: 0, accepted: 0, totalValue: 0, responseRate: 0 };
    const newQuotes = quotes.filter(l => l.status === 'submitted' || l.status === 'sent').length;
    const quoted = quotes.filter(l => l.status === 'quoted').length;
    const accepted = quotes.filter(l => l.status === 'accepted').length;
    const totalValue = quotes
      .filter(l => l.status === 'accepted' && l.quotedAmount)
      .reduce((s, l) => s + Number(l.quotedAmount ?? 0), 0);
    const responseRate = quotes.length > 0
      ? Math.round(((quotes.length - newQuotes) / quotes.length) * 100)
      : 0;
    return { new: newQuotes, quoted, accepted, totalValue, responseRate };
  }, [quotes]);

  const selected = quotes?.find(l => l.id === selectedLead);

  const handleSendQuote = () => {
    if (!selected || !quoteAmount) return;
    respondMutation.mutate({
      id: selected.id,
      quotedAmount: parseFloat(quoteAmount),
      vendorMessage: quoteMessage || undefined,
    });
    setQuoteAmount('');
    setQuoteMessage('');
    setSelectedLead(null);
  };

  const handleMarkBooked = (leadId: number) => {
    statusMutation.mutate({ id: leadId, status: 'accepted' });
  };

  const formatAgo = (iso: string | Date | null) => {
    if (!iso) return 'Recently';
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <VendorLayout title="Lead Inbox">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'New', value: stats.new, color: '#3B82F6', bg: '#EFF6FF' },
            { label: 'Quoted', value: stats.quoted, color: '#F59E0B', bg: '#FFFBEB' },
            { label: 'Accepted', value: stats.accepted, color: '#8B5CF6', bg: '#F5F3FF' },
            { label: 'Booked', value: stats.accepted, color: '#10B981', bg: '#ECFDF5' },
            { label: 'Pipeline', value: `R${Math.round(stats.totalValue / 1000)}k`, color: '#1a1a2e', bg: '#F8FAFC' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: s.bg, border: '1px solid rgba(0,0,0,0.04)' }}>
              <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] font-medium" style={{ color: '#94A3B8' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Response Rate */}
        <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(43,188,168,0.08)' }}>
            <TrendingUp className="w-5 h-5" style={{ color: '#2BBCA8' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>Response Rate: {stats.responseRate}%</p>
            <p className="text-[11px]" style={{ color: '#94A3B8' }}>Vendors who respond within 1 hour win 3x more bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(['all', 'submitted', 'quoted', 'accepted'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap"
              style={filter === f ? { background: '#1a1a2e', color: 'white' } : { background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}>
              {f === 'submitted' ? 'new' : f} {f !== 'all' && `(${stats[f as keyof typeof stats] || 0})`}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2BBCA8' }} />
          </div>
        )}

        {/* Lead List */}
        <div className="space-y-3">
          {!isLoading && filteredLeads.length === 0 && (
            <div className="rounded-2xl p-12 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E1' }} />
              <p className="text-sm" style={{ color: '#94A3B8' }}>No leads yet. They will appear here when clients request quotes.</p>
            </div>
          )}

          {filteredLeads.map(lead => {
            const status = STATUS_CONFIG[lead.status] || STATUS_CONFIG.submitted;
            return (
              <div key={lead.id} onClick={() => setSelectedLead(lead.id)}
                className="rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: status.bg }}>
                      <MessageSquare className="w-5 h-5" style={{ color: status.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>{lead.clientName}</p>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: status.bg, color: status.color }}>{status.label}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: '#94A3B8' }}>{lead.eventType} &middot; {lead.guestCount ?? 'N/A'} guests &middot; {formatAgo(lead.createdAt)}</p>
                    </div>
                  </div>
                  {lead.quotedAmount && (
                    <span className="text-sm font-bold" style={{ color: '#10B981' }}>R{Number(lead.quotedAmount).toLocaleString()}</span>
                  )}
                </div>
                {lead.notes && <p className="text-xs line-clamp-2 mb-2" style={{ color: '#64748B' }}>{lead.notes}</p>}
                <div className="flex items-center gap-3 text-[11px]" style={{ color: '#94A3B8' }}>
                  {lead.eventDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {lead.eventDate}</span>}
                  {lead.guestCount && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{lead.guestCount}</span>}
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.clientPhone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedLead(null)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto" style={{ background: 'white' }} onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                    {selected.clientName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold" style={{ color: '#1a1a2e' }}>{selected.clientName}</h2>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>{selected.clientPhone}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5" style={{ color: '#64748B' }} /></button>
              </div>

              <div className="rounded-xl p-4 space-y-2" style={{ background: '#F8FAFC' }}>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Event Type</span><span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{selected.eventType}</span></div>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Date</span><span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{selected.eventDate ?? 'TBD'}</span></div>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Guests</span><span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{selected.guestCount ?? 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Location</span><span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{selected.province ?? 'N/A'}</span></div>
                {selected.notes && <div className="pt-2 border-t" style={{ borderColor: '#E2E8F0' }}><span className="text-xs" style={{ color: '#94A3B8' }}>Notes</span><p className="text-sm mt-1" style={{ color: '#475569' }}>{selected.notes}</p></div>}
              </div>

              {/* Send Quote */}
              {(selected.status === 'submitted' || selected.status === 'sent') && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Send Quote</h3>
                  <input type="number" placeholder="Your Price (R)" value={quoteAmount} onChange={e => setQuoteAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
                  <textarea placeholder="Hi! I'd love to help with your event..." value={quoteMessage} onChange={e => setQuoteMessage(e.target.value)} rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
                  <button onClick={handleSendQuote} disabled={!quoteAmount || respondMutation.isPending}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white' }}>
                    {respondMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Quote
                  </button>
                  <a href={`tel:${selected.clientPhone}`} className="block w-full py-3 rounded-xl text-sm font-semibold text-center" style={{ background: '#F1F5F9', color: '#64748B' }}>
                    <Phone className="w-4 h-4 inline mr-2" />Call Client
                  </a>
                </div>
              )}

              {/* Already Quoted */}
              {selected.status === 'quoted' && (
                <div className="space-y-3">
                  <div className="rounded-xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <p className="text-sm font-bold" style={{ color: '#B45309' }}>Quote Sent: R{Number(selected.quotedAmount).toLocaleString()}</p>
                    {selected.vendorMessage && <p className="text-xs mt-1" style={{ color: '#64748B' }}>{selected.vendorMessage}</p>}
                  </div>
                  <button onClick={() => handleMarkBooked(selected.id)}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white' }}>
                    <CheckCircle className="w-4 h-4" /> Mark as Booked
                  </button>
                </div>
              )}

              {selected.status === 'accepted' && (
                <div className="rounded-xl p-6 text-center" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                  <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#10B981' }} />
                  <p className="text-sm font-bold" style={{ color: '#059669' }}>Booking Accepted</p>
                  <p className="text-xs mt-2" style={{ color: '#6EE7B7' }}>R{Number(selected.quotedAmount).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
}
