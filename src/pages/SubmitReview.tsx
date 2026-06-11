import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  ChevronLeft, Star, Send, CheckCircle, Loader2
} from 'lucide-react';

export function SubmitReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');

  // ─── API Data ───
  const id = bookingId ? parseInt(bookingId) : 0;
  const { data: booking, isLoading: bookingLoading } = trpc.booking.byId.useQuery(
    { id },
    { enabled: id > 0 }
  );
  const { data: vendor } = trpc.vendor.byId.useQuery(
    { id: booking?.vendorId ?? 0 },
    { enabled: !!booking?.vendorId }
  );
  const createReview = trpc.review.create.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!booking || rating === 0) return;
    setSubmitting(true);
    createReview.mutate({
      bookingId: booking.id,
      vendorId: booking.vendorId,
      clientId: booking.clientId,
      clientName: booking.clientName,
      rating,
      comment: comment || undefined,
      eventType: booking.eventType,
    });
  };

  // ─── Submitted ───
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F1F5F9' }}>
        <div className="rounded-2xl p-8 max-w-md w-full text-center" style={{ background: 'white', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#ECFDF5' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#10B981' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Review Submitted!</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>Thank you for your feedback.</p>
          <div className="flex items-center justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6" style={{ color: i < rating ? '#F59E0B' : '#E2E8F0', fill: i < rating ? '#F59E0B' : 'none' }} />
            ))}
          </div>
          <button onClick={() => navigate('/browse')} className="w-full py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>Browse More Vendors</button>
        </div>
      </div>
    );
  }

  // ─── Loading ───
  if (bookingLoading) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Write a Review</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2BBCA8' }} />
        </div>
      </div>
    );
  }

  // ─── No Booking ───
  if (!booking) {
    return (
      <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)' }}>
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
          <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Write a Review</h1>
        </div>
        <div className="max-w-lg mx-auto p-4 text-center py-16">
          <p style={{ color: '#94A3B8' }}>No booking found. You can only review vendors after a confirmed booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100"><ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} /></button>
        <h1 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>Write a Review</h1>
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Vendor Info */}
        <div className="rounded-2xl p-5 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
          {vendor && (
            <>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                {vendor.avatar || vendor.businessName.charAt(0)}
              </div>
              <h2 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{vendor.businessName}</h2>
              <p className="text-xs" style={{ color: '#94A3B8' }}>{booking.eventType} on {booking.eventDate}</p>
            </>
          )}
          <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: '#ECFDF5' }}>
            <CheckCircle className="w-3 h-3" style={{ color: '#10B981' }} />
            <span className="text-[10px] font-bold" style={{ color: '#059669' }}>Verified Booking</span>
          </div>
        </div>

        {/* Rating */}
        <div className="rounded-2xl p-5 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>How would you rate your experience?</h3>
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} onMouseEnter={() => setHoverRating(i + 1)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(i + 1)}
                className="transition-transform hover:scale-110">
                <Star className="w-10 h-10" style={{ color: i < (hoverRating || rating) ? '#F59E0B' : '#E2E8F0', fill: i < (hoverRating || rating) ? '#F59E0B' : 'none' }} />
              </button>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: '#94A3B8' }}>
            {rating === 1 && 'Poor'}{rating === 2 && 'Fair'}{rating === 3 && 'Good'}{rating === 4 && 'Very Good'}{rating === 5 && 'Excellent'}{rating === 0 && 'Tap a star to rate'}
          </p>
        </div>

        {/* Comment */}
        <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#1a1a2e' }}>Tell us about your experience</h3>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="What went well? What could be improved?" rows={4}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
          <p className="text-[10px] mt-1 text-right" style={{ color: '#94A3B8' }}>{comment.length}/500</p>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={rating === 0 || submitting}
          className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}
