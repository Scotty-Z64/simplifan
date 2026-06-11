import { useNavigate, useParams } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { ArrowLeft, Star } from 'lucide-react';

export function VendorReviewsPage() {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const { vendors, getVendorReviews, getVendorAverageRating } = useUnified();
  const vendor = vendors.find(v => v.id === vendorId);
  const reviews = vendorId ? getVendorReviews(vendorId) : [];
  const avgRating = vendorId ? getVendorAverageRating(vendorId) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Reviews</h1>
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {vendor && (
          <div className="glass rounded-2xl p-5 border border-gray-700/50 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">{vendor.avatar}</div>
            <h2 className="text-xl font-bold text-white">{vendor.businessName}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-lg font-bold text-white">{avgRating}</span>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="glass rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />)}</div>
                  <span className="text-xs text-gray-500">{review.clientName}</span>
                </div>
                <span className="text-[10px] text-gray-600">{review.date}</span>
              </div>
              <p className="text-sm text-gray-300">{review.comment}</p>
              <p className="text-[10px] text-teal-400 mt-1">{review.eventType}</p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-center text-gray-500 py-8">No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
}
