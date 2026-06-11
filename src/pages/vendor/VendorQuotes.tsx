import { useUnified } from '@/context/UnifiedContext';
import { VendorLayout } from '@/components/VendorLayout';
import { Package, Users, Calendar, MapPin, CheckCircle, XCircle, MessageCircle, Clock } from 'lucide-react';

export function VendorQuotes() {
  const { vendorUser, events, vendorRespond } = useUnified();

  const newRequests = events.filter(e =>
    e.status === 'quoted' && !e.vendorResponses.some(vr => vendorUser && vr.vendorId === vendorUser.id)
  );
  const myResponses = events.filter(e =>
    e.vendorResponses.some(vr => vendorUser && vr.vendorId === vendorUser.id)
  );

  const handleAccept = (eventId: string, price: number) => {
    if (!vendorUser) return;
    vendorRespond(eventId, {
      vendorId: vendorUser.id, vendorName: vendorUser.businessName,
      price, message: 'I accept this request. Let\'s discuss details.',
      status: 'accepted', timestamp: new Date().toISOString().split('T')[0],
    });
  };

  const handleDecline = (eventId: string) => {
    if (!vendorUser) return;
    vendorRespond(eventId, {
      vendorId: vendorUser.id, vendorName: vendorUser.businessName,
      price: 0, message: 'Sorry, I am not available for this date.',
      status: 'declined', timestamp: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <VendorLayout title="Quote Requests">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* New Requests */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a1a2e' }}>
            <Package className="w-4 h-4" style={{ color: '#F59E0B' }} /> New Requests ({newRequests.length})
          </h2>
          {newRequests.length === 0 && (
            <div className="rounded-2xl p-10 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <Clock className="w-10 h-10 mx-auto mb-3" style={{ color: '#CBD5E1' }} />
              <p className="text-sm" style={{ color: '#94A3B8' }}>No new requests. They will appear here.</p>
            </div>
          )}
          {newRequests.map(evt => (
            <div key={evt.id} className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{evt.eventType}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{evt.clientName} | {evt.clientPhone}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#94A3B8' }}>Budget</p>
                  <p className="text-lg font-bold" style={{ color: '#2BBCA8' }}>R {evt.budget.toLocaleString('en-ZA')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs" style={{ color: '#64748B' }}>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />{evt.guestCount} guests</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />{evt.eventDate}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />{evt.province}</span>
                <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" style={{ color: '#CBD5E1' }} />{evt.items.length} items</span>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold mb-2" style={{ color: '#475569' }}>Client needs:</p>
                <div className="flex flex-wrap gap-1.5">
                  {evt.items.map(item => (
                    <span key={item.id} className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#F1F5F9', color: '#64748B' }}>
                      {item.category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleAccept(evt.id, Math.round(evt.budget * 0.3))}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                  <CheckCircle className="w-4 h-4" />Accept
                </button>
                <button onClick={() => handleDecline(evt.id)}
                  className="px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  style={{ background: '#F1F5F9', color: '#EF4444' }}>
                  <XCircle className="w-4 h-4" />
                </button>
                <a href={`https://wa.me/${evt.clientPhone.replace(/\s/g, '')}?text=Hi ${evt.clientName}, I received your request for ${evt.eventType}. Can we discuss?`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  style={{ background: '#ECFDF5', color: '#059669' }}>
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* My Responses */}
        {myResponses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: '#1a1a2e' }}>
              <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} /> My Responses ({myResponses.length})
            </h2>
            {myResponses.map(evt => {
              const myResponse = evt.vendorResponses.find(vr => vendorUser && vr.vendorId === vendorUser.id);
              return (
                <div key={evt.id} className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{evt.eventType}</p>
                      <p className="text-xs" style={{ color: '#94A3B8' }}>{evt.clientName}</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                      style={{ background: myResponse?.status === 'accepted' ? '#D1FAE5' : '#FEF2F2', color: myResponse?.status === 'accepted' ? '#059669' : '#DC2626' }}>
                      {myResponse?.status}
                    </span>
                  </div>
                  {myResponse && (
                    <p className="text-sm font-bold mt-2" style={{ color: '#2BBCA8' }}>R {myResponse.price.toLocaleString('en-ZA')}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </VendorLayout>
  );
}
