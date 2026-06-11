import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import {
  ChevronLeft, CheckCircle, XCircle, Loader2, Calendar,
  Phone, User, DollarSign, Star
} from 'lucide-react';

export interface BookingRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  vendorId: string;
  vendorName: string;
  eventType: string;
  eventDate: string;
  amount: number;
  clientConfirmed: boolean;
  vendorConfirmed: boolean;
  clientConfirmedAt?: string;
  vendorConfirmedAt?: string;
  reviewSubmitted: boolean;
  status: 'pending' | 'confirmed' | 'disputed' | 'completed';
  createdAt: string;
}

export function getBookings(): BookingRecord[] {
  return JSON.parse(localStorage.getItem('sp_bookings') || '[]');
}

export function saveBooking(booking: BookingRecord) {
  const existing = getBookings();
  const idx = existing.findIndex(b => b.id === booking.id);
  if (idx >= 0) existing[idx] = booking;
  else existing.push(booking);
  localStorage.setItem('sp_bookings', JSON.stringify(existing));
}

export function BookingConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const role = searchParams.get('role') || 'client';
  const { vendors } = useUnified();
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [disputed, setDisputed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      const bookings = getBookings();
      const found = bookings.find(b => b.id === bookingId);
      if (found) {
        setBooking(found);
        if (role === 'client' && found.clientConfirmed) setConfirmed(true);
        if (role === 'vendor' && found.vendorConfirmed) setConfirmed(true);
      }
    }
    setLoading(false);
  }, [bookingId, role]);

  const createDemoBooking = () => {
    const demo: BookingRecord = {
      id: 'bk_' + Date.now(), clientName: 'Thabo Mokoena', clientPhone: '+27821234567',
      vendorId: vendors[0]?.id || 'v1', vendorName: vendors[0]?.businessName || 'Royal Events SA',
      eventType: 'Wedding', eventDate: '2026-09-15', amount: 45000,
      clientConfirmed: false, vendorConfirmed: false, reviewSubmitted: false,
      status: 'pending', createdAt: new Date().toISOString()
    };
    saveBooking(demo);
    setBooking(demo);
    navigate(`/booking-confirm?id=${demo.id}&role=${role}`, { replace: true });
  };

  const handleConfirm = () => {
    if (!booking) return;
    const updated = { ...booking };
    if (role === 'client') { updated.clientConfirmed = true; updated.clientConfirmedAt = new Date().toISOString(); }
    else { updated.vendorConfirmed = true; updated.vendorConfirmedAt = new Date().toISOString(); }
    if (updated.clientConfirmed && updated.vendorConfirmed) {
      updated.status = 'confirmed';
      const conversions = JSON.parse(localStorage.getItem('sp_conversions') || '[]');
      conversions.push({ id: 'conv_' + Date.now(), stage: 'booking_confirmed', bookingId: updated.id, vendorId: updated.vendorId, value: updated.amount, timestamp: new Date().toISOString() });
      localStorage.setItem('sp_conversions', JSON.stringify(conversions));
    }
    saveBooking(updated);
    setBooking(updated);
    setConfirmed(true);
  };

  const handleDispute = () => {
    if (!booking) return;
    const updated = { ...booking, status: 'disputed' as const };
    saveBooking(updated);
    setBooking(updated);
    setDisputed(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F1F5F9' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2BBCA8' }} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Confirm Booking</h1>
        </div>
        <div className="max-w-lg mx-auto p-4 text-center py-16">
          <p className="mb-4" style={{ color: '#94A3B8' }}>No booking found with that ID.</p>
          <button onClick={createDemoBooking}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>Create Demo Booking</button>
        </div>
      </div>
    );
  }

  const bothConfirmed = booking.clientConfirmed && booking.vendorConfirmed;

  // --- CONFIRMED + BOTH CONFIRMED STATE ---
  if (confirmed && bothConfirmed) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Booking Confirmed!</h1>
        </div>
        <div className="max-w-lg mx-auto p-4 text-center py-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#ECFDF5', boxShadow: '0 4px 12px -3px rgba(16,185,129,0.2)' }}>
            <CheckCircle className="w-10 h-10" style={{ color: '#10B981' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Both Parties Confirmed</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>This booking is verified. {booking.clientName} and {booking.vendorName} have both confirmed.</p>
          <div className="rounded-2xl p-5 text-left space-y-3 mb-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Event</span><span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{booking.eventType}</span></div>
            <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Date</span><span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{booking.eventDate}</span></div>
            <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Amount</span><span className="text-sm font-bold" style={{ color: '#10B981' }}>R{booking.amount?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-xs" style={{ color: '#94A3B8' }}>Platform Fee (5%)</span><span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>R{Math.round((booking.amount || 0) * 0.05).toLocaleString()}</span></div>
          </div>
          {!booking.reviewSubmitted && role === 'client' && (
            <button onClick={() => navigate(`/submit-review?booking=${booking.id}`)}
              className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 mb-3"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
              <Star className="w-4 h-4" /> Leave a Review
            </button>
          )}
          <button onClick={() => navigate('/')} className="w-full py-3 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B' }}>Back to Home</button>
        </div>
      </div>
    );
  }

  // --- CONFIRMED WAITING STATE ---
  if (confirmed && !bothConfirmed) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Waiting for Confirmation</h1>
        </div>
        <div className="max-w-lg mx-auto p-4 text-center py-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FFFBEB' }}>
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#F59E0B' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>You Have Confirmed</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>Waiting for the {role === 'client' ? 'vendor' : 'client'} to also confirm.</p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: booking.clientConfirmed ? '#ECFDF5' : '#F1F5F9' }}>
                <User className="w-6 h-6" style={{ color: booking.clientConfirmed ? '#10B981' : '#CBD5E1' }} />
              </div>
              <p className="text-[10px] mt-1 font-medium" style={{ color: '#94A3B8' }}>Client</p>
            </div>
            <div className="w-16 h-0.5" style={{ background: '#E2E8F0' }} />
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: booking.vendorConfirmed ? '#ECFDF5' : '#F1F5F9' }}>
                <CheckCircle className="w-6 h-6" style={{ color: booking.vendorConfirmed ? '#10B981' : '#CBD5E1' }} />
              </div>
              <p className="text-[10px] mt-1 font-medium" style={{ color: '#94A3B8' }}>Vendor</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DISPUTED STATE ---
  if (disputed) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Booking Disputed</h1>
        </div>
        <div className="max-w-lg mx-auto p-4 text-center py-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF2F2' }}>
            <XCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Booking Marked as Disputed</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>Our support team will investigate. No transaction fee will be charged.</p>
          <button onClick={() => navigate('/')} className="w-full py-3 rounded-xl text-sm font-bold" style={{ background: '#F1F5F9', color: '#64748B' }}>Back to Home</button>
        </div>
      </div>
    );
  }

  // --- MAIN FORM ---
  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
        <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Confirm Booking</h1>
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: role === 'client' ? '#2BBCA8' : '#F59E0B' }}>
            {role === 'client' ? 'You are confirming as the CLIENT' : 'You are confirming as the VENDOR'}
          </p>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a2e' }}>Booking Details</h2>
          <div className="space-y-3">
            {[
              { icon: User, label: 'Client', value: booking.clientName },
              { icon: Phone, label: 'Phone', value: booking.clientPhone },
              { icon: Calendar, label: 'Event', value: `${booking.eventType} on ${booking.eventDate}` },
              { icon: DollarSign, label: 'Booking Value', value: `R${booking.amount?.toLocaleString()}`, color: '#10B981' },
              { icon: CheckCircle, label: 'Vendor', value: booking.vendorName },
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

        <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: '#1a1a2e' }}>Did this booking go ahead?</h3>
          <p className="text-xs mb-4" style={{ color: '#64748B' }}>Both the client and vendor must confirm before this booking is verified and any platform fee is applied.</p>
          <div className="flex gap-3">
            <button onClick={handleConfirm}
              className="flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
              <CheckCircle className="w-5 h-5" /> Yes, Booking Happened
            </button>
            <button onClick={handleDispute}
              className="flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}>
              <XCircle className="w-5 h-5" /> No / Dispute
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center" style={{ color: '#CBD5E1' }}>
          Your first booking has no platform fee. Subsequent bookings incur a 3-7% fee based on your subscription tier.
        </p>
      </div>
    </div>
  );
}
