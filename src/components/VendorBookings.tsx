import { useState } from 'react';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { CalendarCheck, MapPin, Phone, Mail, MessageCircle, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: AlertCircle },
  confirmed: { label: 'Confirmed', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
};

export function VendorBookings() {
  const { bookings, updateBookingStatus } = useVendorAuth();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = bookings.filter(b => {
    const matchStatus = filter === 'all' || b.status === filter;
    const matchSearch = !search || b.customerName.toLowerCase().includes(search.toLowerCase()) || b.eventType.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-4 border border-gray-700/50">
          <p className="text-2xl font-bold text-teal-400">{stats.all}</p>
          <p className="text-xs text-gray-500">Total Bookings</p>
        </div>
        <div className="glass rounded-xl p-4 border border-amber-500/20">
          <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="glass rounded-xl p-4 border border-teal-500/20">
          <p className="text-2xl font-bold text-teal-400">{stats.confirmed}</p>
          <p className="text-xs text-gray-500">Confirmed</p>
        </div>
        <div className="glass rounded-xl p-4 border border-emerald-500/20">
          <p className="text-2xl font-bold text-emerald-400">R {totalRevenue.toLocaleString('en-ZA')}</p>
          <p className="text-xs text-gray-500">Total Revenue</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search bookings..." className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as StatusFilter[]).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === s ? 'bg-teal-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
              }`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({stats[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Booking Cards */}
      <div className="space-y-3">
        {filtered.map(booking => {
          const config = statusConfig[booking.status];
          const StatusIcon = config.icon;
          const isExpanded = expandedId === booking.id;

          return (
            <div key={booking.id} className="glass rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color.split(' ')[0]}`}>
                      <StatusIcon className={`w-5 h-5 ${booking.status === 'pending' ? 'text-amber-400' : booking.status === 'confirmed' ? 'text-teal-400' : booking.status === 'completed' ? 'text-emerald-400' : 'text-red-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{booking.customerName}</p>
                      <p className="text-xs text-gray-500">{booking.eventType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-teal-400">R {booking.totalAmount.toLocaleString('en-ZA')}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${config.color}`}>{config.label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1"><CalendarCheck className="w-3 h-3 text-gray-600" />{booking.eventDate}</div>
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-600" />{booking.eventLocation}</div>
                  <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-gray-600" />{booking.customerPhone}</div>
                  <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-gray-600" />{booking.customerEmail}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/30">
                  <button onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                    className="text-xs text-gray-500 hover:text-teal-400 transition-colors">
                    {isExpanded ? 'Hide Details' : 'View Details'}
                  </button>
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="flex items-center gap-1 text-xs bg-teal-500 hover:bg-teal-400 text-white px-3 py-1.5 rounded-lg transition-all">
                          <CheckCircle className="w-3 h-3" />Confirm
                        </button>
                        <button onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all">
                          <XCircle className="w-3 h-3" />Decline
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="flex items-center gap-1 text-xs bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-lg transition-all">
                        <CheckCircle className="w-3 h-3" />Mark Complete
                      </button>
                    )}
                    <a href={`https://wa.me/${booking.customerPhone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-all">
                      <MessageCircle className="w-3 h-3" />WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-700/30 pt-3">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.services.map((s, i) => (
                        <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                    {booking.notes && (
                      <div className="mt-2 p-2 bg-gray-800/30 rounded-lg">
                        <p className="text-xs text-gray-500">Notes:</p>
                        <p className="text-xs text-gray-300">{booking.notes}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mt-2">Booked on {booking.createdAt}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
