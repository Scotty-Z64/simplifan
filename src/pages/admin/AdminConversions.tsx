/**
 * CONVERSION ANALYTICS (Critical Gap #4)
 *
 * Full attribution funnel tracking every stage from discovery
 * to booking to review. Shows where users drop off and what
 * marketing channels drive actual revenue.
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, TrendingUp, MessageSquare, CheckCircle,
  Star, DollarSign, ArrowRight
} from 'lucide-react';

interface ConversionEvent {
  id: string;
  stage: string;
  source?: string;
  vendorId?: string;
  bookingId?: string;
  value?: number;
  rating?: number;
  userPhone?: string;
  timestamp: string;
}

function getConversions(): ConversionEvent[] {
  return JSON.parse(localStorage.getItem('sp_conversions') || '[]');
}

function getBookings() {
  return JSON.parse(localStorage.getItem('sp_bookings') || '[]');
}

function getReviews() {
  return JSON.parse(localStorage.getItem('sp_reviews') || '[]');
}

function getQuoteRequests() {
  return JSON.parse(localStorage.getItem('sp_quote_requests') || '[]');
}

export function AdminConversions() {
  const navigate = useNavigate();

  const conversions = getConversions();
  const bookings = getBookings();
  const reviews = getReviews();
  const quoteRequests = getQuoteRequests();

  const funnel = useMemo(() => {
    const quotes = conversions.filter(c => c.stage === 'quote_request').length + quoteRequests.length;
    const confirmed = conversions.filter(c => c.stage === 'booking_confirmed').length + bookings.filter((b: any) => b.status === 'confirmed').length;
    const reviewed = conversions.filter(c => c.stage === 'review_submitted').length + reviews.length;
    const totalValue = bookings.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : '0';

    return {
      quotes,
      confirmed,
      reviewed,
      totalValue,
      avgRating,
      quoteToBookRate: quotes > 0 ? Math.round((confirmed / quotes) * 100) : 0,
      bookToReviewRate: confirmed > 0 ? Math.round((reviewed / confirmed) * 100) : 0
    };
  }, []);

  const sourceBreakdown = useMemo(() => {
    const sources: Record<string, { quotes: number; bookings: number; value: number }> = {};
    conversions.forEach((c: ConversionEvent) => {
      const src = c.source || 'organic';
      if (!sources[src]) sources[src] = { quotes: 0, bookings: 0, value: 0 };
      if (c.stage === 'quote_request') sources[src].quotes++;
      if (c.stage === 'booking_confirmed') { sources[src].bookings++; sources[src].value += (c.value || 0); }
    });
    quoteRequests.forEach((q: any) => {
      const src = q.source || 'organic';
      if (!sources[src]) sources[src] = { quotes: 0, bookings: 0, value: 0 };
      sources[src].quotes++;
    });
    return Object.entries(sources).map(([name, data]) => ({
      name,
      ...data,
      conversionRate: data.quotes > 0 ? Math.round((data.bookings / data.quotes) * 100) : 0
    }));
  }, []);

  const funnelStages = [
    { name: 'Quote Requests', count: funnel.quotes, color: '#3b82f6', icon: MessageSquare },
    { name: 'Bookings Confirmed', count: funnel.confirmed, color: '#10b981', icon: CheckCircle },
    { name: 'Reviews Submitted', count: funnel.reviewed, color: '#f59e0b', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">Conversion Analytics</h1>
          <p className="text-[10px] text-gray-500">Full attribution funnel from quote to review</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass rounded-xl p-4 border border-gray-700/50">
            <MessageSquare className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{funnel.quotes}</p>
            <p className="text-[10px] text-gray-500">Quote Requests</p>
          </div>
          <div className="glass rounded-xl p-4 border border-gray-700/50">
            <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-white">{funnel.confirmed}</p>
            <p className="text-[10px] text-gray-500">Confirmed Bookings</p>
          </div>
          <div className="glass rounded-xl p-4 border border-gray-700/50">
            <DollarSign className="w-5 h-5 text-amber-400 mb-2" />
            <p className="text-2xl font-bold text-white">R{funnel.totalValue.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500">Total Booking Value</p>
          </div>
          <div className="glass rounded-xl p-4 border border-gray-700/50">
            <Star className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{funnel.avgRating}</p>
            <p className="text-[10px] text-gray-500">Avg Review Rating</p>
          </div>
        </div>

        {/* Funnel Visualization */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-5">Conversion Funnel</h3>
          <div className="space-y-3">
            {funnelStages.map((stage, i) => {
              const maxCount = Math.max(...funnelStages.map(s => s.count), 1);
              const width = Math.max((stage.count / maxCount) * 100, 15);
              const nextStage = funnelStages[i + 1];
              const dropOff = nextStage && stage.count > 0
                ? Math.round(((stage.count - nextStage.count) / stage.count) * 100)
                : null;

              return (
                <div key={stage.name}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${stage.color}20` }}>
                      <stage.icon className="w-4 h-4" style={{ color: stage.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">{stage.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{stage.count}</span>
                          {dropOff !== null && (
                            <span className="text-[10px] text-red-400">-{dropOff}% drop-off</span>
                          )}
                        </div>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, backgroundColor: stage.color }} />
                      </div>
                    </div>
                  </div>
                  {nextStage && (
                    <div className="flex justify-center py-1">
                      <ArrowRight className="w-3 h-3 text-gray-700 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Conversion Rates */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-800">
            <div className="text-center p-3 rounded-xl bg-gray-800/30">
              <p className="text-lg font-bold text-white">{funnel.quoteToBookRate}%</p>
              <p className="text-[10px] text-gray-500">Quote to Booking Rate</p>
              <p className="text-[10px] text-gray-600">Industry avg: 8-15%</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-800/30">
              <p className="text-lg font-bold text-white">{funnel.bookToReviewRate}%</p>
              <p className="text-[10px] text-gray-500">Booking to Review Rate</p>
              <p className="text-[10px] text-gray-600">Industry avg: 20-30%</p>
            </div>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4">Performance by Source</h3>
          {sourceBreakdown.length === 0 ? (
            <p className="text-center text-gray-600 py-8 text-sm">No conversion data yet. Data will appear as users interact with the platform.</p>
          ) : (
            <div className="space-y-3">
              {sourceBreakdown.map((src, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">{src.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white capitalize">{src.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-gray-500">{src.quotes} quotes</span>
                      <span className="text-[10px] text-emerald-400">{src.bookings} bookings</span>
                      <span className="text-[10px] text-amber-400">R{src.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">{src.conversionRate}%</p>
                    <p className="text-[10px] text-gray-500">conv. rate</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings Table */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Bookings</h3>
          {bookings.length === 0 ? (
            <p className="text-center text-gray-600 py-8 text-sm">No bookings recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500">
                    <th className="text-left py-2 pr-3">Client</th>
                    <th className="text-left py-2 pr-3">Vendor</th>
                    <th className="text-left py-2 pr-3">Event</th>
                    <th className="text-right py-2 pr-3">Value</th>
                    <th className="text-center py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 10).map((b: any, i: number) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-2 pr-3 text-white">{b.clientName}</td>
                      <td className="py-2 pr-3 text-gray-400">{b.vendorName}</td>
                      <td className="py-2 pr-3 text-gray-400">{b.eventType}</td>
                      <td className="py-2 pr-3 text-right text-emerald-400">R{(b.amount || 0).toLocaleString()}</td>
                      <td className="py-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : b.status === 'disputed' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
