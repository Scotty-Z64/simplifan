import { useState } from 'react';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, MessageCircle, Send, Clock, Users, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type StatusFilter = 'all' | 'new' | 'quoted' | 'accepted' | 'declined';

export function VendorQuotes() {
  const { quotes, respondToQuote } = useVendorAuth();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [responseForm, setResponseForm] = useState({ price: '', message: '' });

  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.status === filter);

  const stats = {
    all: quotes.length,
    new: quotes.filter(q => q.status === 'new').length,
    quoted: quotes.filter(q => q.status === 'quoted').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    declined: quotes.filter(q => q.status === 'declined').length,
  };

  const handleRespond = (quoteId: string) => {
    if (!responseForm.price || !responseForm.message) return;
    respondToQuote(quoteId, parseFloat(responseForm.price), responseForm.message);
    setRespondingId(null);
    setResponseForm({ price: '', message: '' });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(['all', 'new', 'quoted', 'accepted', 'declined'] as StatusFilter[]).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`glass rounded-xl p-3 border text-center transition-all ${
              filter === s ? 'border-teal-500/30 bg-teal-500/5' : 'border-gray-700/50'
            }`}>
            <p className={`text-xl font-bold ${filter === s ? 'text-teal-400' : 'text-white'}`}>{stats[s]}</p>
            <p className="text-xs text-gray-500">{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</p>
          </button>
        ))}
      </div>

      {/* Quote Cards */}
      <div className="space-y-4">
        {filtered.map(quote => (
          <div key={quote.id} className={`glass rounded-2xl border overflow-hidden ${
            quote.status === 'new' ? 'border-purple-500/20' : 'border-gray-700/50'
          }`}>
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    quote.status === 'new' ? 'bg-purple-500/20' :
                    quote.status === 'quoted' ? 'bg-teal-500/20' :
                    quote.status === 'accepted' ? 'bg-emerald-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {quote.status === 'new' ? <AlertCircle className="w-5 h-5 text-purple-400" /> :
                     quote.status === 'quoted' ? <CheckCircle className="w-5 h-5 text-teal-400" /> :
                     quote.status === 'accepted' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> :
                     <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">{quote.customerName}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        quote.status === 'new' ? 'bg-purple-500/20 text-purple-400' :
                        quote.status === 'quoted' ? 'bg-teal-500/20 text-teal-400' :
                        quote.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{quote.status.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-gray-500">{quote.eventType} | {quote.eventDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-sm font-medium text-teal-400">{quote.budget}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-2 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-1 text-gray-600 mb-0.5"><Users className="w-3 h-3" /><span className="text-[10px]">Guests</span></div>
                  <p className="text-sm text-white font-medium">{quote.guestCount}</p>
                </div>
                <div className="p-2 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-1 text-gray-600 mb-0.5"><Clock className="w-3 h-3" /><span className="text-[10px]">Date</span></div>
                  <p className="text-sm text-white font-medium">{quote.eventDate}</p>
                </div>
                <div className="p-2 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-1 text-gray-600 mb-0.5"><DollarSign className="w-3 h-3" /><span className="text-[10px]">Phone</span></div>
                  <p className="text-sm text-white font-medium">{quote.customerPhone}</p>
                </div>
                <div className="p-2 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-1 text-gray-600 mb-0.5"><FileText className="w-3 h-3" /><span className="text-[10px]">Received</span></div>
                  <p className="text-sm text-white font-medium">{quote.createdAt}</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="p-3 bg-gray-800/20 rounded-xl mb-4">
                <p className="text-xs text-gray-500 mb-1">Requirements:</p>
                <p className="text-sm text-gray-300">{quote.requirements}</p>
              </div>

              {/* Vendor Response (if quoted) */}
              {quote.vendorResponse && (
                <div className="p-3 bg-teal-500/5 border border-teal-500/20 rounded-xl mb-4">
                  <p className="text-xs text-teal-400 mb-1">Your Response:</p>
                  <p className="text-sm text-gray-300">{quote.vendorResponse}</p>
                  {quote.vendorPrice && <p className="text-sm text-teal-400 font-medium mt-1">Quoted: R {quote.vendorPrice.toLocaleString('en-ZA')}</p>}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <a href={`https://wa.me/${quote.customerPhone.replace(/\s/g, '')}?text=Hi ${quote.customerName}, I received your quote request for your ${quote.eventType}.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-2 rounded-lg transition-all">
                  <MessageCircle className="w-3 h-3" />WhatsApp
                </a>

                {quote.status === 'new' && (
                  <button onClick={() => setRespondingId(respondingId === quote.id ? null : quote.id)}
                    className="flex items-center gap-1 text-xs bg-teal-500 hover:bg-teal-400 text-white px-3 py-2 rounded-lg transition-all">
                    <Send className="w-3 h-3" />{respondingId === quote.id ? 'Cancel' : 'Send Quote'}
                  </button>
                )}
              </div>

              {/* Response Form */}
              {respondingId === quote.id && (
                <div className="mt-4 p-4 bg-gray-800/30 rounded-xl space-y-3">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input type="number" value={responseForm.price} onChange={e => setResponseForm({ ...responseForm, price: e.target.value })}
                      placeholder="Your price (R)..." className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
                  </div>
                  <textarea value={responseForm.message} onChange={e => setResponseForm({ ...responseForm, message: e.target.value })}
                    placeholder="Describe what your quote includes..." rows={3}
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-600 rounded-lg text-sm p-3 resize-none" />
                  <Button onClick={() => handleRespond(quote.id)} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl">
                    <Send className="w-4 h-4 mr-2" />Send Quote
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No quote requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
