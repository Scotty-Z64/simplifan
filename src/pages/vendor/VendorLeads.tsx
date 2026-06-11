import { useState, useMemo } from 'react';
import { VendorLayout } from '@/components/VendorLayout';
import {
  MessageSquare, Send, Phone, Calendar, Users, TrendingUp,
  CheckCircle, X
} from 'lucide-react';

interface Lead {
  id: string;
  clientName: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  province: string;
  notes: string;
  status: 'new' | 'quoted' | 'accepted' | 'booked' | 'declined' | 'expired';
  quotedAmount?: number;
  respondedAt?: string;
  createdAt: string;
}

function getLeads(): Lead[] {
  return JSON.parse(localStorage.getItem('sp_vendor_leads') || '[]');
}

function saveLead(lead: Lead) {
  const existing = getLeads();
  const idx = existing.findIndex(l => l.id === lead.id);
  if (idx >= 0) existing[idx] = lead;
  else existing.push(lead);
  localStorage.setItem('sp_vendor_leads', JSON.stringify(existing));
}

function seedDemoLeads() {
  if (getLeads().length > 0) return;
  const demoLeads: Lead[] = [
    { id: 'lead_1', clientName: 'Thabo Mokoena', clientPhone: '+27821234567', eventType: 'Wedding', eventDate: '2026-09-15', guestCount: '150', province: 'Gauteng', notes: 'Traditional wedding, need catering for 150 guests. Prefer braai-style with pap and meat.', status: 'new', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'lead_2', clientName: 'Lerato Khumalo', clientPhone: '+27834567890', eventType: 'Funeral', eventDate: '2026-06-20', guestCount: '200', province: 'Gauteng', notes: 'Urgent - need tent and chairs for 200 people in Soweto.', status: 'new', createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: 'lead_3', clientName: 'Sipho Ndlovu', clientPhone: '+27845678901', eventType: '21st Birthday', eventDate: '2026-07-10', guestCount: '80', province: 'Gauteng', notes: '21st birthday party. Need sound system and DJ. Budget around R8,000.', status: 'quoted', quotedAmount: 7500, respondedAt: new Date(Date.now() - 1 * 3600000).toISOString(), createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
    { id: 'lead_4', clientName: 'Mary van Wyk', clientPhone: '+27856789012', eventType: 'Baby Shower', eventDate: '2026-08-05', guestCount: '30', province: 'Western Cape', notes: 'Small baby shower. Need decor and cake. Pastel colours.', status: 'accepted', quotedAmount: 4500, respondedAt: new Date(Date.now() - 48 * 3600000).toISOString(), createdAt: new Date(Date.now() - 72 * 3600000).toISOString() },
  ];
  localStorage.setItem('sp_vendor_leads', JSON.stringify(demoLeads));
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: '#3b82f6', bg: '#EFF6FF' },
  quoted: { label: 'Quoted', color: '#f59e0b', bg: '#FFFBEB' },
  accepted: { label: 'Accepted', color: '#8b5cf6', bg: '#F5F3FF' },
  booked: { label: 'Booked', color: '#10b981', bg: '#ECFDF5' },
  declined: { label: 'Declined', color: '#ef4444', bg: '#FEF2F2' },
  expired: { label: 'Expired', color: '#6b7280', bg: '#F3F4F6' },
};

export function VendorLeads() {
  seedDemoLeads();

  const [leads, setLeads] = useState<Lead[]>(getLeads());
  const [filter, setFilter] = useState<'all' | 'new' | 'quoted' | 'accepted' | 'booked'>('all');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');

  const filteredLeads = useMemo(() => {
    let result = [...leads];
    if (filter !== 'all') result = result.filter(l => l.status === filter);
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [leads, filter]);

  const stats = useMemo(() => ({
    new: leads.filter(l => l.status === 'new').length,
    quoted: leads.filter(l => l.status === 'quoted').length,
    accepted: leads.filter(l => l.status === 'accepted').length,
    booked: leads.filter(l => l.status === 'booked').length,
    totalValue: leads.filter(l => l.status === 'booked' || l.status === 'accepted').reduce((s, l) => s + (l.quotedAmount || 0), 0),
    responseRate: leads.length > 0 ? Math.round((leads.filter(l => l.status !== 'new').length / leads.length) * 100) : 0,
  }), [leads]);

  const selected = leads.find(l => l.id === selectedLead);

  const handleSendQuote = () => {
    if (!selected || !quoteAmount) return;
    const updated = { ...selected, status: 'quoted' as const, quotedAmount: parseFloat(quoteAmount), respondedAt: new Date().toISOString() };
    saveLead(updated);
    setLeads(getLeads());
    setQuoteAmount('');
    setQuoteMessage('');
    setSelectedLead(null);
  };

  const handleMarkBooked = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const updated = { ...lead, status: 'booked' as const };
    saveLead(updated);
    setLeads(getLeads());
  };

  const formatAgo = (iso: string) => {
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
            { label: 'Booked', value: stats.booked, color: '#10B981', bg: '#ECFDF5' },
            { label: 'Pipeline', value: `R${Math.round(stats.totalValue / 1000)}k`, color: '#1a1a2e', bg: '#F8FAFC' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: s.bg, border: '1px solid rgba(0,0,0,0.04)' }}>
              <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] font-medium" style={{ color: '#94A3B8' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Response Rate Banner */}
        <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(43,188,168,0.08)' }}>
            <TrendingUp className="w-5 h-5" style={{ color: '#2BBCA8' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>Response Rate: {stats.responseRate}%</p>
            <p className="text-[11px]" style={{ color: '#94A3B8' }}>Vendors who respond within 1 hour win 3x more bookings</p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold"
            style={{ background: stats.responseRate >= 80 ? '#D1FAE5' : stats.responseRate >= 50 ? '#FEF3C7' : '#FEF2F2',
                    color: stats.responseRate >= 80 ? '#059669' : stats.responseRate >= 50 ? '#D97706' : '#DC2626' }}>
            {stats.responseRate >= 80 ? 'Great' : stats.responseRate >= 50 ? 'Good' : 'Improve'}
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(['all', 'new', 'quoted', 'accepted', 'booked'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap"
              style={filter === f ? { background: '#1a1a2e', color: 'white' } : { background: 'white', color: '#64748B', border: '1px solid #E2E8F0' }}>
              {f} {f !== 'all' && `(${stats[f as keyof typeof stats] || 0})`}
            </button>
          ))}
        </div>

        {/* Lead List */}
        <div className="space-y-3">
          {filteredLeads.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E1' }} />
              <p className="text-sm" style={{ color: '#94A3B8' }}>No leads in this category</p>
            </div>
          ) : (
            filteredLeads.map(lead => {
              const status = STATUS_CONFIG[lead.status];
              return (
                <div key={lead.id} onClick={() => setSelectedLead(lead.id)}
                  className="rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                  style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: status.bg }}>
                        <MessageSquare className="w-5 h-5" style={{ color: status.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>{lead.clientName}</p>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: status.bg, color: status.color }}>{status.label}</span>
                        </div>
                        <p className="text-[11px]" style={{ color: '#94A3B8' }}>{lead.eventType} &middot; {lead.guestCount} guests &middot; {formatAgo(lead.createdAt)}</p>
                      </div>
                    </div>
                    {lead.quotedAmount && (
                      <span className="text-sm font-bold" style={{ color: '#10B981' }}>R{lead.quotedAmount.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-xs line-clamp-2 mb-2" style={{ color: '#64748B' }}>{lead.notes}</p>
                  <div className="flex items-center gap-3 text-[11px]" style={{ color: '#CBD5E1' }}>
                    <span className="flex items-center gap-1" style={{ color: '#94A3B8' }}><Calendar className="w-3 h-3" /> {lead.eventDate}</span>
                    <span style={{ color: '#94A3B8' }}><Users className="w-3 h-3 inline mr-1" />{lead.guestCount}</span>
                    <span style={{ color: '#94A3B8' }}><Phone className="w-3 h-3 inline mr-1" />{lead.clientPhone}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Lead Detail / Quote Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedLead(null)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
          <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto"
            style={{ background: 'white' }} onClick={e => e.stopPropagation()}>
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
                <button onClick={() => setSelectedLead(null)} className="p-2 rounded-xl hover:bg-gray-100">
                  <X className="w-5 h-5" style={{ color: '#64748B' }} />
                </button>
              </div>

              <div className="rounded-xl p-4 space-y-2" style={{ background: '#F8FAFC' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#94A3B8' }}>Event Type</span>
                  <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{selected.eventType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#94A3B8' }}>Date</span>
                  <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{selected.eventDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#94A3B8' }}>Guests</span>
                  <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{selected.guestCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#94A3B8' }}>Location</span>
                  <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{selected.province}</span>
                </div>
                {selected.notes && (
                  <div className="pt-2 border-t" style={{ borderColor: '#E2E8F0' }}>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>Notes</span>
                    <p className="text-sm mt-1" style={{ color: '#475569' }}>{selected.notes}</p>
                  </div>
                )}
              </div>

              {selected.status === 'new' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Send Quote</h3>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Your Price (R)</label>
                    <input type="number" placeholder="e.g. 15000" value={quoteAmount} onChange={e => setQuoteAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Message (optional)</label>
                    <textarea placeholder="Hi! I'd love to help with your event. Here's my quote..." value={quoteMessage} onChange={e => setQuoteMessage(e.target.value)} rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
                  </div>
                  <button onClick={handleSendQuote} disabled={!quoteAmount}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white' }}>
                    <Send className="w-4 h-4" /> Send Quote
                  </button>
                  <a href={`tel:${selected.clientPhone}`} className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                    style={{ background: '#F1F5F9', color: '#64748B' }}>
                    <Phone className="w-4 h-4" /> Call Client
                  </a>
                </div>
              )}

              {selected.status === 'quoted' && (
                <div className="space-y-3">
                  <div className="rounded-xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <p className="text-sm font-bold" style={{ color: '#B45309' }}>Quote Sent: R{selected.quotedAmount?.toLocaleString()}</p>
                    <p className="text-xs mt-1" style={{ color: '#D97706' }}>Waiting for client response...</p>
                  </div>
                  <button onClick={() => handleMarkBooked(selected.id)}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white' }}>
                    <CheckCircle className="w-4 h-4" /> Client Accepted — Mark as Booked
                  </button>
                  <a href={`https://wa.me/${selected.clientPhone.replace('+', '')}`} target="_blank" rel="noopener noreferrer"
                    className="block w-full py-3 rounded-xl text-sm font-bold text-center transition-all"
                    style={{ background: '#ECFDF5', color: '#059669' }}>
                    Message on WhatsApp
                  </a>
                </div>
              )}

              {selected.status === 'accepted' && (
                <div className="space-y-3">
                  <div className="rounded-xl p-4" style={{ background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
                    <p className="text-sm font-bold" style={{ color: '#7C3AED' }}>Quote Accepted: R{selected.quotedAmount?.toLocaleString()}</p>
                    <p className="text-xs mt-1" style={{ color: '#8B5CF6' }}>Client has accepted your quote!</p>
                  </div>
                  <button onClick={() => handleMarkBooked(selected.id)}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white' }}>
                    <CheckCircle className="w-4 h-4" /> Confirm Booking
                  </button>
                </div>
              )}

              {selected.status === 'booked' && (
                <div className="rounded-xl p-6 text-center" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                  <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#10B981' }} />
                  <p className="text-sm font-bold" style={{ color: '#059669' }}>Booking Confirmed</p>
                  <p className="text-xs mt-2" style={{ color: '#6EE7B7' }}>R{selected.quotedAmount?.toLocaleString()} &middot; Deposit will be processed through SimpliPlan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
}
