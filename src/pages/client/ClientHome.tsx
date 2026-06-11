import { useNavigate, useLocation } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { useLanguage } from '@/context/LanguageContext';
import { getCultureEvents } from '@/translations/cultureEvents';
import type { Language } from '@/types/language';
import {
  LayoutDashboard, CalendarCheck, Sparkles, Store, MessageCircle,
  Bell, UserCircle, LogOut, DollarSign, Star,
  CheckCircle, Clock, Phone, ChevronRight,
  ArrowRight, Plus, Zap
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

/* ─── SimpliPlan Logo ─── */
function SimpliPlanLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="4" fill="#2BBCA8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse key={i} cx="24" cy="24" rx="2.5" ry="12" fill="#2BBCA8" opacity={0.85} transform={`rotate(${angle} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="5" fill="#fff" />
      <circle cx="24" cy="24" r="3.5" fill="#2BBCA8" />
    </svg>
  );
}

const sidebarNav = [
  { path: '/client', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/client/planner', label: 'Plan Event', icon: Sparkles },
  { path: '/client/wizard', label: 'Classic Planner', icon: Zap },
  { path: '/my-events', label: 'My Events', icon: CalendarCheck },
  { path: '/browse', label: 'Find Vendors', icon: Store },
  { path: '/client/chat', label: 'Messages', icon: MessageCircle, badge: 'msg' },
  { path: '/client/profile', label: 'Profile', icon: UserCircle },
];

const COLORS = ['#2BBCA8', '#F59E0B', '#8B5CF6', '#F43F5E', '#10B981'];

export function ClientHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clientUser, events, getUnreadCount } = useUnified();
  const { language } = useLanguage();
  const cultureEvents = getCultureEvents(language as Language);
  const unread = clientUser ? getUnreadCount(clientUser.id) : 0;

  // Get upcoming events (not completed)
  const upcomingEvents = events.filter(e => e.status !== 'completed');
  const mainEvent = upcomingEvents[0];

  // Calculate budget stats
  const totalBudget = mainEvent?.budget || 0;
  const totalSpent = mainEvent?.totalCost || 0;
  const budgetRemaining = totalBudget - totalSpent;
  const budgetPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Vendors booked count
  const confirmedVendors = mainEvent?.items.filter(i => i.status === 'confirmed' || i.status === 'accepted') || [];
  const totalVendors = mainEvent?.items.length || 0;

  // Days until event
  const daysUntil = mainEvent?.eventDate
    ? Math.max(0, Math.ceil((new Date(mainEvent.eventDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Event progress steps
  const progressSteps = [
    { label: 'Planning', status: 'done' },
    { label: 'Quotes Sent', status: mainEvent?.status !== 'planning' ? 'done' : 'current' },
    { label: 'Vendors Confirmed', status: mainEvent && (mainEvent.status === 'confirmed' || mainEvent.status === 'deposit_paid' || mainEvent.status === 'ready') ? 'done' : mainEvent?.status === 'vendor_responded' ? 'current' : 'pending' },
    { label: 'Deposit Paid', status: mainEvent?.status === 'deposit_paid' || mainEvent?.status === 'ready' ? 'done' : mainEvent?.status === 'confirmed' ? 'current' : 'pending' },
    { label: 'Ready', status: mainEvent?.status === 'ready' ? 'done' : 'pending' },
  ];

  // Budget breakdown for pie chart
  const budgetData = mainEvent
    ? mainEvent.items.map((item, i) => ({
        name: item.category,
        value: item.price,
        color: COLORS[i % COLORS.length]
      }))
    : [];

  // Upcoming tasks
  const tasks = [
    { label: 'Confirm venue booking', done: confirmedVendors.some(v => v.category === 'Venue'), urgent: true },
    { label: 'Pay deposit to caterer', done: mainEvent?.status === 'deposit_paid' || mainEvent?.status === 'ready', urgent: true },
    { label: 'Send digital invites', done: false, urgent: daysUntil < 30 },
    { label: 'Order birthday cake', done: confirmedVendors.some(v => v.category === 'Cake'), urgent: false },
    { label: 'Confirm guest count', done: false, urgent: daysUntil < 14 },
    { label: 'Book transport/decor', done: confirmedVendors.length >= 3, urgent: false },
  ];

  const doneCount = tasks.filter(t => t.done).length;

  // Recent activity
  const activity = [
    { text: 'Royal Events SA confirmed your venue booking', time: '2h ago', type: 'vendor', color: '#2BBCA8' },
    { text: 'Braai Masters sent a quote: R7,200 for catering', time: '5h ago', type: 'quote', color: '#F59E0B' },
    { text: 'You paid R2,250 deposit to Royal Events SA', time: '1d ago', type: 'payment', color: '#10B981' },
    { text: 'Cakes by Lerato confirmed: 21st birthday cake', time: '1d ago', type: 'vendor', color: '#2BBCA8' },
    { text: 'Reminder: Event is in 67 days — confirm remaining vendors', time: '2d ago', type: 'reminder', color: '#F59E0B' },
  ];

  const eventInfo = mainEvent
    ? cultureEvents.find(e => e.type === mainEvent.eventType) || { name: mainEvent.eventType }
    : null;

  return (
    <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className="w-64 flex-shrink-0 flex flex-col sticky top-0 h-screen" style={{ background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <SimpliPlanLogo size={28} />
          <div>
            <p className="text-sm font-bold text-white">SimpliPlan</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: '#2BBCA8' }}>Client Portal</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mx-4 mt-4 p-4 rounded-xl" style={{ background: 'rgba(43,188,168,0.08)', border: '1px solid rgba(43,188,168,0.12)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
              {clientUser?.avatar || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{clientUser?.name || 'Guest'}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{clientUser?.location || 'South Africa'}</p>
            </div>
          </div>
          {mainEvent && (
            <div className="flex items-center justify-between text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" />{daysUntil} days left</span>
              <span className="px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(43,188,168,0.15)', color: '#2BBCA8' }}>{mainEvent.eventType}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
          {sidebarNav.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                style={isActive ? { background: 'rgba(43,188,168,0.12)', border: '1px solid rgba(43,188,168,0.15)' } : { border: '1px solid transparent' }}>
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-teal-400' : ''}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge === 'msg' && unread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#2BBCA8' }}>{unread}</span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-teal-400" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button onClick={() => navigate('/login')}
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
            <p className="text-[10px]" style={{ color: '#94A3B8' }}>
              {mainEvent ? `${eventInfo?.name || mainEvent.eventType} on ${mainEvent.eventDate}` : 'Ready to plan something special?'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/client/planner')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
              <Plus className="w-4 h-4" /> New Event
            </button>
            <button className="relative p-2.5 rounded-xl transition-colors hover:bg-gray-100" style={{ color: '#64748B' }}>
              <Bell className="w-5 h-5" />
              {unread > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />}
            </button>
            <button onClick={() => navigate('/client/profile')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
              {clientUser?.avatar || '?'}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ═══ KPI STAT CARDS ═══ */}
          {mainEvent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Budget Remaining */}
              <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))' }}>
                    <DollarSign className="w-5 h-5" style={{ color: '#10B981' }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: budgetRemaining > totalBudget * 0.2 ? '#10B981' : '#EF4444' }}>
                    {budgetPercent}% used
                  </span>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>R {budgetRemaining.toLocaleString('en-ZA')}</p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Budget Remaining of R {totalBudget.toLocaleString('en-ZA')}</p>
                <div className="w-full h-2 rounded-full mt-3 overflow-hidden" style={{ background: '#F1F5F9' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(budgetPercent, 100)}%`, background: budgetPercent > 90 ? '#EF4444' : budgetPercent > 70 ? '#F59E0B' : '#2BBCA8' }} />
                </div>
              </div>

              {/* Vendors Booked */}
              <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))' }}>
                    <Store className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: confirmedVendors.length === totalVendors ? '#10B981' : '#F59E0B' }}>
                    {confirmedVendors.length}/{totalVendors}
                  </span>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>{confirmedVendors.length} <span className="text-sm font-normal" style={{ color: '#94A3B8' }}>of {totalVendors}</span></p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Vendors Confirmed</p>
              </div>

              {/* Days Until */}
              <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(43,188,168,0.1), rgba(43,188,168,0.05))' }}>
                    <Clock className="w-5 h-5" style={{ color: '#2BBCA8' }} />
                  </div>
                  {daysUntil < 30 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#EF4444' }}>URGENT</span>}
                </div>
                <p className="text-2xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>{daysUntil}</p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Days Until {eventInfo?.name || mainEvent.eventType}</p>
              </div>

              {/* Messages */}
              <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))' }}>
                    <MessageCircle className="w-5 h-5" style={{ color: '#3B82F6' }} />
                  </div>
                  {unread > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#EF4444' }}>{unread} NEW</span>}
                </div>
                <p className="text-2xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>{unread}</p>
                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Unread Vendor Messages</p>
              </div>
            </div>
          ) : (
            /* Empty state when no event */
            <div className="rounded-2xl p-8 text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Start Planning Your Event</h2>
              <p className="text-sm mb-6" style={{ color: '#64748B' }}>Let our AI help you plan the perfect celebration. Set your budget and we do the rest.</p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => navigate('/client/planner')}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                  <Sparkles className="w-4 h-4" /> AI Planner
                </button>
                <button onClick={() => navigate('/client/wizard')}
                  className="px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2" style={{ color: '#2BBCA8', border: '1.5px solid #2BBCA8' }}>
                  <Zap className="w-4 h-4" /> Classic Wizard
                </button>
              </div>
            </div>
          )}

          {/* ═══ PROGRESS TIMELINE ═══ */}
          {mainEvent && (
            <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Event Progress</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(43,188,168,0.1)', color: '#2BBCA8' }}>
                  {progressSteps.filter(s => s.status === 'done').length} of {progressSteps.length} complete
                </span>
              </div>
              <div className="flex items-center gap-2">
                {progressSteps.map((step, i) => (
                  <div key={i} className="flex-1 flex items-center gap-2">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
                        step.status === 'done'
                          ? 'text-white'
                          : step.status === 'current'
                          ? 'text-teal-500 border-2 border-teal-400'
                          : ''
                      }`}
                        style={{
                          background: step.status === 'done' ? 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' : step.status === 'current' ? 'white' : '#F1F5F9',
                        }}>
                        {step.status === 'done' ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                      </div>
                      <span className={`text-[10px] font-semibold text-center ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-600'}`}>{step.label}</span>
                    </div>
                    {i < progressSteps.length - 1 && (
                      <div className="w-8 h-0.5 flex-shrink-0 mb-5" style={{ background: step.status === 'done' ? '#2BBCA8' : '#E2E8F0' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ TWO COLUMN LAYOUT ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Vendors Table */}
              {mainEvent && (
                <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Your Vendors</h3>
                    <button onClick={() => navigate('/browse')} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#2BBCA8' }}>
                      Find More <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    {mainEvent.items.map((item, i) => (
                      <div key={item.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${COLORS[i % COLORS.length]}15` }}>
                          <Store className="w-5 h-5" style={{ color: COLORS[i % COLORS.length] }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold truncate" style={{ color: '#1a1a2e' }}>{item.vendorName}</p>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                              item.status === 'confirmed' ? 'bg-emerald-50 text-emerald-500' :
                              item.status === 'accepted' ? 'bg-teal-50 text-teal-500' :
                              item.status === 'pending' ? 'bg-amber-50 text-amber-500' :
                              'bg-red-50 text-red-500'
                            }`}>{item.status.toUpperCase()}</span>
                          </div>
                          <p className="text-[11px] mt-0.5" style={{ color: '#94A3B8' }}>{item.service}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>R {item.price.toLocaleString('en-ZA')}</p>
                          <div className="flex items-center gap-0.5 justify-end">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-[10px]" style={{ color: '#94A3B8' }}>{item.rating}</span>
                          </div>
                        </div>
                        <button onClick={() => navigate('/client/chat')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <MessageCircle className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Plan Event', icon: Sparkles, color: '#2BBCA8', bg: 'rgba(43,188,168,0.08)', path: '/client/planner' },
                    { label: 'Find Vendors', icon: Store, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', path: '/browse' },
                    { label: 'My Events', icon: CalendarCheck, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', path: '/my-events' },
                    { label: 'Messages', icon: MessageCircle, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', path: '/client/chat' },
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
            </div>

            {/* RIGHT COLUMN (1/3) */}
            <div className="space-y-6">
              {/* Budget Pie Chart */}
              {mainEvent && budgetData.length > 0 && (
                <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>Budget Breakdown</h3>
                  <div className="flex justify-center mb-4">
                    <ResponsiveContainer width={180} height={180}>
                      <PieChart>
                        <Pie data={budgetData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                          {budgetData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `R ${value.toLocaleString('en-ZA')}`} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {budgetData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                          <span style={{ color: '#475569' }}>{item.name}</span>
                        </div>
                        <span className="font-semibold" style={{ color: '#1a1a2e' }}>R {item.value.toLocaleString('en-ZA')}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t flex items-center justify-between text-xs font-bold" style={{ borderColor: '#F1F5F9' }}>
                      <span style={{ color: '#64748B' }}>Total Spent</span>
                      <span style={{ color: '#1a1a2e' }}>R {totalSpent.toLocaleString('en-ZA')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks Checklist */}
              {mainEvent && (
                <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Your Checklist</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(43,188,168,0.1)', color: '#2BBCA8' }}>{doneCount}/{tasks.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {tasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl" style={{ background: task.done ? 'rgba(16,185,129,0.04)' : 'rgba(245,158,11,0.03)' }}>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          task.done ? 'text-white' : 'border-2'
                        }`}
                          style={{
                            background: task.done ? 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' : 'transparent',
                            borderColor: task.done ? 'transparent' : task.urgent ? '#F59E0B' : '#CBD5E1'
                          }}>
                          {task.done && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs ${task.done ? 'line-through' : ''}`} style={{ color: task.done ? '#94A3B8' : '#475569' }}>{task.label}</p>
                          {task.urgent && !task.done && <span className="text-[9px] font-semibold" style={{ color: '#EF4444' }}>Urgent</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>Recent Activity</h3>
                <div className="space-y-3">
                  {activity.map((act, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: act.color }} />
                      <div>
                        <p className="text-xs" style={{ color: '#475569' }}>{act.text}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#94A3B8' }}>{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="rounded-2xl p-5" style={{ background: '#0f172a' }}>
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
