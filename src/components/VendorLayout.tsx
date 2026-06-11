import { useNavigate, useLocation } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import {
  LayoutDashboard, Inbox, MessageCircle, DollarSign, BarChart3,
  Grid3X3, Store, Bell, ChevronRight, LogOut
} from 'lucide-react';

function SimpliPlanLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="4" fill="#F59E0B" />
      {[0,45,90,135,180,225,270,315].map(a => (
        <ellipse key={a} cx="24" cy="24" rx="2.5" ry="12" fill="#F59E0B" opacity={0.85} transform={`rotate(${a} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="5" fill="#fff" />
      <circle cx="24" cy="24" r="3.5" fill="#F59E0B" />
    </svg>
  );
}

const navItems = [
  { path: '/vendor', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vendor/leads', label: 'Lead Inbox', icon: Inbox, badge: 'new' },
  { path: '/vendor/quotes', label: 'Quote Requests', icon: Inbox },
  { path: '/vendor/chat', label: 'Messages', icon: MessageCircle, badge: 'msg' },
  { path: '/vendor/earnings', label: 'Payments', icon: DollarSign },
  { path: '/vendor/inventory', label: 'Inventory', icon: Grid3X3 },
  { path: '/vendor/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/vendor/profile', label: 'Profile', icon: Store },
];

export function VendorLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { vendorUser, getUnreadCount, logout } = useUnified();
  const unread = vendorUser ? getUnreadCount(vendorUser.id) : 0;

  return (
    <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col sticky top-0 h-screen" style={{ background: '#1a1a2e', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <SimpliPlanLogo size={28} />
          <div>
            <p className="text-sm font-bold text-white">SimpliPlan</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: '#F59E0B' }}>Vendor Portal</p>
          </div>
        </div>

        <div className="mx-4 mt-4 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              {vendorUser?.avatar || 'V'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{vendorUser?.businessName || 'Your Business'}</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{vendorUser?.rating || '4.5'} stars</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                style={isActive ? { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.15)' } : { border: '1px solid transparent' }}>
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge === 'new' && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#EF4444' }}>NEW</span>
                )}
                {item.badge === 'msg' && unread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#EF4444' }}>{unread}</span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-left">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>{title || 'SimpliPlan'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl transition-colors hover:bg-gray-100" style={{ color: '#64748B' }}>
              <Bell className="w-5 h-5" />
              {unread > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />}
            </button>
            <button onClick={() => navigate('/vendor/profile')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              {vendorUser?.avatar || 'V'}
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
