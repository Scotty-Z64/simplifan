import { useNavigate, useLocation } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import {
  LayoutDashboard, Inbox, MessageCircle, DollarSign, BarChart3,
  Grid3X3, Store, Bell, LogOut, Star, TrendingUp,
  TrendingDown, Package, ChevronRight,
  Zap, ArrowUpRight, Calendar, Phone, MapPin
} from 'lucide-react';

/* ─── SimpliPlan Logo ─── */
function SimpliPlanLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="4" fill="#F59E0B" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse key={i} cx="24" cy="24" rx="2.5" ry="12" fill="#F59E0B" opacity={0.85} transform={`rotate(${angle} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="5" fill="#fff" />
      <circle cx="24" cy="24" r="3.5" fill="#F59E0B" />
    </svg>
  );
}

const sidebarNav = [
  { path: '/vendor', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vendor/leads', label: 'Lead Inbox', icon: Inbox, badge: 'new' },
  { path: '/vendor/quotes', label: 'Quote Requests', icon: Package },
  { path: '/vendor/chat', label: 'Messages', icon: MessageCircle, badge: 'msg' },
  { path: '/vendor/earnings', label: 'Payments', icon: DollarSign },
  { path: '/vendor/inventory', label: 'Inventory', icon: Grid3X3 },
  { path: '/vendor/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/vendor/profile', label: 'Profile', icon: Store },
];

export function VendorHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { vendorUser, events, getUnreadCount, getVendorTransactions } = useUnified();
  const unread = vendorUser ? getUnreadCount(vendorUser.id) : 0;
  const myTx = vendorUser ? getVendorTransactions(vendorUser.id) : [];

  const thisMonthEarnings = myTx.filter(t => t.status === 'paid' && t.date.startsWith('2026-06')).reduce((s, t) => s + t.amount, 0);
  const lastMonthEarnings = myTx.filter(t => t.status === 'paid' && t.date.startsWith('2026-05')).reduce((s, t) => s + t.amount, 0);
  const earningsGrowth = lastMonthEarnings > 0 ? Math.round(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100) : 12;

  const newQuoteRequests = events.filter(e =>
    e.status === 'quoted' && !e.vendorResponses.some(vr => vendorUser && vr.vendorId === vendorUser.id)
  );

  // Demo leads for the dashboard
  const recentLeads = [
    { name: 'Thabo Mokoena', event: 'Wedding', date: '2026-09-15', guests: 150, budget: 45000, status: 'new', time: '2h ago', location: 'Johannesburg' },
    { name: 'Lerato Khumalo', event: 'Funeral', date: '2026-06-20', guests: 200, budget: 25000, status: 'new', time: '5h ago', location: 'Soweto' },
    { name: 'Sipho Ndlovu', event: '21st Birthday', date: '2026-07-10', guests: 80, budget: 8000, status: 'quoted', time: '1d ago', location: 'Pretoria' },
    { name: 'Mary van Wyk', event: 'Baby Shower', date: '2026-08-05', guests: 30, budget: 5000, status: 'accepted', time: '2d ago', location: 'Centurion' },
  ];

  const recentActivity = [
    { text: 'New quote request: Wedding in Sandton (R45,000)', time: '14:32', type: 'lead' },
    { text: 'Client accepted your quote for 21st Birthday', time: '13:15', type: 'win' },
    { text: 'Payment received: R8,500 deposit', time: '12:48', type: 'payment' },
    { text: 'New review: 5 stars from Lerato M.', time: '11:20', type: 'review' },
    { text: 'Message from Thabo M. about catering menu', time: '10:05', type: 'message' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className="w-64 flex-shrink-0 flex flex-col sticky top-0 h-screen" style={{ background: '#1a1a2e', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <SimpliPlanLogo size={28} />
          <div>
            <p className="text-sm font-bold text-white">SimpliPlan</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: '#F59E0B' }}>Vendor Portal</p>
          </div>
        </div>

        {/* Business Profile Card */}
        <div className="mx-4 mt-4 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.12)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              {vendorUser?.avatar || 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{vendorUser?.businessName || 'Your Business'}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-amber-400">{vendorUser?.rating || '4.5'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>{vendorUser?.jobs || '0'} jobs</span>
            <span className="px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>Verified</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
          {sidebarNav.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                style={isActive ? { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.15)' } : { border: '1px solid transparent' }}>
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge === 'new' && newQuoteRequests.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#EF4444' }}>{newQuoteRequests.length}</span>
                )}
                {item.badge === 'msg' && unread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#EF4444' }}>{unread}</span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button onClick={() => { navigate('/vendor-login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-left">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>Dashboard</h1>
            <p className="text-[10px]" style={{ color: '#94A3B8' }}>Welcome back, {vendorUser?.businessName || 'Vendor'}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl transition-colors hover:bg-gray-100" style={{ color: '#64748B' }}>
              <Bell className="w-5 h-5" />
              {(unread > 0 || newQuoteRequests.length > 0) && <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />}
            </button>
            <button onClick={() => navigate('/vendor/profile')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              {vendorUser?.avatar || 'V'}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ═══ KPI STAT CARDS ═══ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Earnings */}
            <div className="rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))' }}>
                  <DollarSign className="w-5 h-5" style={{ color: '#10B981' }} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: earningsGrowth >= 0 ? '#10B981' : '#EF4444' }}>
                  {earningsGrowth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}+{earningsGrowth}%
                </span>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>R {thisMonthEarnings.toLocaleString('en-ZA')}</p>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>This Month Earnings</p>
            </div>

            {/* New Leads */}
            <div className="rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))' }}>
                  <Inbox className="w-5 h-5" style={{ color: '#F59E0B' }} />
                </div>
                {newQuoteRequests.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#EF4444' }}>{newQuoteRequests.length} NEW</span>
                )}
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>{newQuoteRequests.length + 2}</p>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>New Leads This Week</p>
            </div>

            {/* Messages */}
            <div className="rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(43,188,168,0.1), rgba(43,188,168,0.05))' }}>
                  <MessageCircle className="w-5 h-5" style={{ color: '#2BBCA8' }} />
                </div>
                {unread > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#2BBCA8' }}>{unread} unread</span>}
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>{unread}</p>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Unread Messages</p>
            </div>

            {/* Rating */}
            <div className="rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))' }}>
                  <Star className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: '#10B981' }}><ArrowUpRight className="w-3.5 h-3.5" />+0.2</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>{vendorUser?.rating || '4.5'}</p>
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(vendorUser?.rating || 4.5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Your Rating ({vendorUser?.jobs || '0'} jobs)</p>
            </div>
          </div>

          {/* ═══ TWO COLUMN LAYOUT ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN (2/3) — Leads + Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'View Leads', icon: Inbox, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', path: '/vendor/leads' },
                    { label: 'Check Messages', icon: MessageCircle, color: '#2BBCA8', bg: 'rgba(43,188,168,0.08)', path: '/vendor/chat' },
                    { label: 'View Payments', icon: DollarSign, color: '#10B981', bg: 'rgba(16,185,129,0.08)', path: '/vendor/earnings' },
                    { label: 'Analytics', icon: BarChart3, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', path: '/vendor/analytics' },
                  ].map((action, i) => (
                    <button key={i} onClick={() => navigate(action.path)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:-translate-y-1 text-center"
                      style={{ background: action.bg, border: `1px solid ${action.bg}` }}>
                      <action.icon className="w-6 h-6" style={{ color: action.color }} />
                      <span className="text-xs font-semibold" style={{ color: action.color }}>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Leads Table */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                  <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Recent Lead Enquiries</h3>
                  <button onClick={() => navigate('/vendor/leads')} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#F59E0B' }}>
                    View All <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                  {recentLeads.map((lead, i) => (
                    <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                        background: lead.event === 'Wedding' ? 'rgba(139,92,246,0.08)' : lead.event === 'Funeral' ? 'rgba(100,116,139,0.08)' : lead.event === '21st Birthday' ? 'rgba(43,188,168,0.08)' : 'rgba(244,63,94,0.08)'
                      }}>
                        <Calendar className="w-5 h-5" style={{
                          color: lead.event === 'Wedding' ? '#8B5CF6' : lead.event === 'Funeral' ? '#64748B' : lead.event === '21st Birthday' ? '#2BBCA8' : '#F43F5E'
                        }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate" style={{ color: '#1a1a2e' }}>{lead.name}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            lead.status === 'new' ? 'bg-red-50 text-red-500' : lead.status === 'quoted' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                          }`}>{lead.status.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.location}</span>
                          <span>{lead.event}</span>
                          <span>{lead.guests} guests</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>R {lead.budget.toLocaleString('en-ZA')}</p>
                        <p className="text-[10px]" style={{ color: '#94A3B8' }}>{lead.time}</p>
                      </div>
                      <button onClick={() => navigate('/vendor/leads')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <ChevronRight className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earnings Overview Mini */}
              <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Earnings Overview</h3>
                  <button onClick={() => navigate('/vendor/earnings')} className="text-xs font-semibold" style={{ color: '#10B981' }}>View Details</button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.08)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Total Paid Out</p>
                    <p className="text-lg font-bold mt-1" style={{ color: '#10B981' }}>R {thisMonthEarnings.toLocaleString('en-ZA')}</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.08)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Pending</p>
                    <p className="text-lg font-bold mt-1" style={{ color: '#F59E0B' }}>R 12,500</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.08)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Platform Fees</p>
                    <p className="text-lg font-bold mt-1" style={{ color: '#8B5CF6' }}>R 1,240</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (1/3) — Activity + Performance */}
            <div className="space-y-6">
              {/* Performance Tip */}
              <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 16px -4px rgba(245,158,11,0.3)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Response Rate: 85%</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Vendors who respond within 1 hour win 3x more bookings</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                  <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Recent Activity</h3>
                </div>
                <div className="p-4 space-y-3">
                  {recentActivity.map((act, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{
                        background: act.type === 'lead' ? '#F59E0B' : act.type === 'win' ? '#10B981' : act.type === 'payment' ? '#2BBCA8' : act.type === 'review' ? '#F43F5E' : '#8B5CF6'
                      }} />
                      <div>
                        <p className="text-xs" style={{ color: '#475569' }}>{act.text}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory Status */}
              <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Your Inventory</h3>
                  <button onClick={() => navigate('/vendor/inventory')} className="text-xs font-semibold" style={{ color: '#F59E0B' }}>Manage</button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Premium Wedding Package', price: 'R25,000', bookings: 12 },
                    { name: 'Birthday Basic Setup', price: 'R5,500', bookings: 28 },
                    { name: 'Corporate Event Catering', price: 'R18,000', bookings: 8 },
                  ].map((product, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#1a1a2e' }}>{product.name}</p>
                        <p className="text-[10px]" style={{ color: '#94A3B8' }}>{product.bookings} bookings</p>
                      </div>
                      <p className="text-xs font-bold" style={{ color: '#10B981' }}>{product.price}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/vendor/inventory')}
                  className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-center transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1px dashed rgba(245,158,11,0.2)' }}>
                  + Add New Product
                </button>
              </div>

              {/* Support Card */}
              <div className="rounded-2xl p-5" style={{ background: '#1a1a2e' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(43,188,168,0.15)' }}>
                    <Phone className="w-4 h-4" style={{ color: '#2BBCA8' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Need Help?</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>WhatsApp support 24/7</p>
                  </div>
                </div>
                <a href="https://wa.me/27818430771" target="_blank" rel="noopener noreferrer"
                  className="block w-full py-2.5 rounded-xl text-xs font-bold text-center text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
