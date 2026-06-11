import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Star, Search, CheckCircle, Loader2,
  User, Store, MessageSquare
} from 'lucide-react';

export function AdminReviews() {
  const navigate = useNavigate();
  const { data: reviews, isLoading } = trpc.review.list.useQuery({ limit: 100 });

  const [search, setSearch] = useState('');

  const filtered = (reviews ?? []).filter(r =>
    !search || r.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: reviews?.length ?? 0,
    avgRating: reviews && reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '0',
    fiveStar: reviews?.filter(r => r.rating === 5).length ?? 0,
    verified: reviews?.filter(r => r.verifiedBooking).length ?? 0,
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Review Moderation</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Reviews', value: stats.total, icon: MessageSquare, color: '#8B5CF6' },
            { label: 'Avg Rating', value: stats.avgRating, icon: Star, color: '#F59E0B' },
            { label: '5-Star', value: stats.fiveStar, icon: Star, color: '#10B981' },
            { label: 'Verified', value: stats.verified, icon: CheckCircle, color: '#3B82F6' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <s.icon className="w-4 h-4 mb-2" style={{ color: s.color }} />
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews by client name..."
            className="w-full pl-10 pr-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>

        {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#8B5CF6' }} /></div>}

        {/* Reviews */}
        {!isLoading && (
          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
                      {r.clientName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{r.clientName}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3" style={{ color: i < r.rating ? '#F59E0B' : '#374151', fill: i < r.rating ? '#F59E0B' : 'none' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: r.verifiedBooking ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)', color: r.verifiedBooking ? '#10B981' : '#94A3B8' }}>
                      {r.verifiedBooking ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                {r.comment && <p className="text-sm text-gray-300 mb-2">{r.comment}</p>}
                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><Store className="w-3 h-3" /> Vendor #{r.vendorId}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {r.eventType}</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-sm text-center py-8 text-gray-500">No reviews found</p>}
          </div>
        )}
      </div>
    </div>
  );
}
