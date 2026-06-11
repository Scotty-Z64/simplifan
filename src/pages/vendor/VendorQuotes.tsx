import { useUnified } from '@/context/UnifiedContext';
import { trpc } from '@/providers/trpc';
import { VendorLayout } from '@/components/VendorLayout';
import { Package, Users, Calendar, MapPin, CheckCircle, XCircle, MessageCircle, Clock, Loader2 } from 'lucide-react';

export function VendorQuotes() {
  const { vendorUser } = useUnified();
  const vendorId = vendorUser ? parseInt(vendorUser.id) : 0;

  // ─── API Data ───
  const { data: quotes, isLoading } = trpc.quote.list.useQuery(
    vendorId > 0 ? { vendorId, limit: 100 } : undefined,
    { enabled: vendorId > 0 }
  );
  const respondMutation = trpc.quote.respond.useMutation();
  const statusMutation = trpc.quote.updateStatus.useMutation();

  const handleAccept = (quoteId: number, price: number) => {
    respondMutation.mutate({ id: quoteId, quotedAmount: price, vendorMessage: 'I accept this request. Let\'s discuss details.' });
    statusMutation.mutate({ id: quoteId, status: 'accepted' });
  };

  const handleDecline = (quoteId: number) => {
    statusMutation.mutate({ id: quoteId, status: 'declined' });
  };

  const newRequests = (quotes ?? []).filter(q => q.status === 'submitted' || q.status === 'sent');
  const responded = (quotes ?? []).filter(q => q.status === 'quoted' || q.status === 'accepted' || q.status === 'declined');

  return (
    <VendorLayout title="Quote Requests">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* New Requests */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a1a2e' }}>
            <Package className="w-4 h-4" style={{ color: '#F59E0B' }} /> New Requests ({newRequests.length})
          </h2>
          {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2BBCA8' }} /></div>}
          {!isLoading && newRequests.length === 0 && (
            <div className="rounded-2xl p-10 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <Clock className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E1' }} />
              <p className="text-sm" style={{ color: '#94A3B8' }}>No new requests. They will appear here.</p>
            </div>
          )}
          {newRequests.map(q => (
            <div key={q.id} className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{q.eventType}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{q.clientName} | {q.clientPhone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs" style={{ color: '#64748B' }}>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />{q.guestCount ?? 'N/A'} guests</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />{q.eventDate ?? 'TBD'}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />{q.province ?? 'N/A'}</span>
                <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />{q.notes ? 'Has notes' : 'No details'}</span>
              </div>
              {q.notes && <p className="text-xs mb-4 p-3 rounded-xl" style={{ background: '#F8FAFC', color: '#64748B' }}>{q.notes}</p>}
              <div className="flex gap-2">
                <button onClick={() => handleAccept(q.id, 5000)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                  <CheckCircle className="w-4 h-4" />Accept
                </button>
                <button onClick={() => handleDecline(q.id)}
                  className="px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ background: '#F1F5F9', color: '#EF4444' }}>
                  <XCircle className="w-4 h-4" />
                </button>
                <a href={`https://wa.me/${q.clientPhone.replace(/\s/g, '')}?text=Hi ${q.clientName}, I received your request for ${q.eventType}.`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{ background: '#ECFDF5', color: '#059669' }}>
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Responded */}
        {responded.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a1a2e' }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} /> My Responses ({responded.length})
            </h2>
            {responded.map(q => (
              <div key={q.id} className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{q.eventType}</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>{q.clientName}</p>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                    style={{ background: q.status === 'accepted' ? '#D1FAE5' : q.status === 'declined' ? '#FEF2F2' : '#FFFBEB',
                            color: q.status === 'accepted' ? '#059669' : q.status === 'declined' ? '#DC2626' : '#D97706' }}>
                    {q.status}
                  </span>
                </div>
                {q.quotedAmount && <p className="text-sm font-bold mt-2" style={{ color: '#2BBCA8' }}>R {Number(q.quotedAmount).toLocaleString('en-ZA')}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </VendorLayout>
  );
}
