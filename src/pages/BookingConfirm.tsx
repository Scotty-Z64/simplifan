import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  ChevronLeft, CheckCircle, XCircle, Loader2, Calendar,
  Phone, User, DollarSign, Star
} from 'lucide-react';

export function BookingConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const role = searchParams.get('role') || 'client';
  // ─── API Data ───
  const id = bookingId ? parseInt(bookingId) : 0;
  const { data: booking, isLoading, refetch } = trpc.booking.byId.useQuery(
    { id },
    { enabled: id > 0 }
  );
  const confirmMutation = trpc.booking.confirm.useMutation({ onSuccess: () => refetch() });
  const disputeMutation = trpc.booking.dispute.useMutation({ onSuccess: () => refetch() });

  const [confirmed, setConfirmed] = useState(false);
  const [disputed, setDisputed] = useState(false);

  useEffect(() => {
    if (booking) {
      if (role === 'client' && booking.clientConfirmed) setConfirmed(true);
      if (role === 'vendor' && booking.vendorConfirmed) setConfirmed(true);
    }
  }, [booking, role]);

  const handleConfirm = () => {
    if (!booking) return;
    confirmMutation.mutate({ id: booking.id, role: role as 'client' | 'vendor' });
    setConfirmed(true);
  };

  const handleDispute = () => {
    if (!booking) return;
    disputeMutation.mutate({ id: booking.id });
    setDisputed(true);
  };

  const bothConfirmed = booking?.clientConfirmed && booking?.vendorConfirmed;

  // ─── Loading ───
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F1F5F9' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2BBCA8' }} />
      </div>
    );
  }

  // ─── Both Confirmed ───
  if (confirmed && bothConfirmed) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Booking Confirmed!</h1>
        </div>
        <div className="max-w-lg mx-auto p-4 text-center py-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#ECFDF5' }}>
            <CheckCircle className="w-10 h-10" style={{ color: '#10B981' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Both Parties Confirmed</h2>
          <div className="rounded-2xl p-5 text-left space-y-3 mb-6" style={{ background: 'white' }}>
            <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Event</span><span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{booking?.eventType}</span></div>
            <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Date</span><span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{booking?.eventDate}</span></div>
            <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Amount</span><span className="text-sm font-bold" style={{ color: '#10B981' }}>R{Number(booking?.amount ?? 0).toLocaleString()}</span></div>
          </div>
          {!booking?.reviewSubmitted && role === 'client' && (
            <button onClick={() => navigate(`/submit-review?booking=${booking?.id}`)}
              className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mb-3"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white' }}>
              <Star className="w-4 h-4" /> Leave a Review
            </button>
          )}
          <button onClick={() => navigate('/')} className="w-full py-3 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B' }}>Back to Home</button>
        </div>
      </div>
    );
  }

  // ─── Waiting ───
  if (confirmed && !bothConfirmed) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Waiting for Confirmation</h1>
        </div>
        <div className="max-w-lg mx-auto p-4 text-center py-8">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#F59E0B' }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>You Have Confirmed</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>Waiting for the {role === 'client' ? 'vendor' : 'client'} to also confirm.</p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: booking?.clientConfirmed ? '#ECFDF5' : '#F1F5F9' }}>
                <User className="w-6 h-6" style={{ color: booking?.clientConfirmed ? '#10B981' : '#CBD5E1' }} />
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#94A3B8' }}>Client</p>
            </div>
            <div className="w-16 h-0.5" style={{ background: '#E2E8F0' }} />
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: booking?.vendorConfirmed ? '#ECFDF5' : '#F1F5F9' }}>
                <CheckCircle className="w-6 h-6" style={{ color: booking?.vendorConfirmed ? '#10B981' : '#CBD5E1' }} />
              </div>
              <p className="text-[10px] mt-1" style={{ color: '#94A3B8' }}>Vendor</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Disputed ───
  if (disputed) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Booking Disputed</h1>
        </div>
        <div className="max-w-lg mx-auto p-4 text-center py-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF2F2' }}>
            <XCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Booking Marked as Disputed</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>Our support team will investigate.</p>
          <button onClick={() => navigate('/')} className="w-full py-3 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B' }}>Back to Home</button>
        </div>
      </div>
    );
  }

  // ─── Main Form ───
  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
        <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Confirm Booking</h1>
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="rounded-2xl p-5" style={{ background: 'white' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: role === 'client' ? '#2BBCA8' : '#F59E0B' }}>
            {role === 'client' ? 'You are confirming as the CLIENT' : 'You are confirming as the VENDOR'}
          </p>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a2e' }}>Booking Details</h2>
          <div className="space-y-3">
            {[
              { icon: User, label: 'Client', value: booking?.clientName ?? 'N/A' },
              { icon: Phone, label: 'Phone', value: booking?.clientPhone ?? 'N/A' },
              { icon: Calendar, label: 'Event', value: `${booking?.eventType ?? ''} on ${booking?.eventDate ?? ''}` },
              { icon: DollarSign, label: 'Booking Value', value: `R${Number(booking?.amount ?? 0).toLocaleString()}`, color: '#10B981' },
              { icon: CheckCircle, label: 'Vendor', value: booking?.vendorName ?? 'N/A' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="w-4 h-4" style={{ color: item.color || '#CBD5E1' }} />
                <div>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>{item.label}</p>
                  <p className="text-sm font-semibold" style={{ color: item.color || '#1a1a2e' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'white' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: '#1a1a2e' }}>Did this booking go ahead?</h3>
          <p className="text-xs mb-4" style={{ color: '#64748B' }}>Both parties must confirm before this booking is verified.</p>
          <div className="flex gap-3">
            <button onClick={handleConfirm}
              className="flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white' }}>
              <CheckCircle className="w-5 h-5" /> Yes, Booking Happened
            </button>
            <button onClick={handleDispute}
              className="flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}>
              <XCircle className="w-5 h-5" /> No / Dispute
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center" style={{ color: '#CBD5E1' }}>Your first booking has no platform fee. Subsequent bookings incur 3-7% fee based on subscription tier.</p>
      </div>
    </div>
  );
}
