import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Map, Star, Users, BarChart3, DollarSign, Store,
  LogOut, Shield, ChevronLeft, ChevronRight, Activity, HeartPulse, TrendingUp
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, perm: 'dashboard' },
  { path: '/admin/map', label: 'Events Map', icon: Map, perm: 'map' },
  { path: '/admin/vendors', label: 'Vendors', icon: Star, perm: 'vendors' },
  { path: '/admin/clients', label: 'Clients', icon: Users, perm: 'clients' },
  { path: '/admin/marketing', label: 'Marketing', icon: BarChart3, perm: 'marketing' },
  { path: '/admin/finance', label: 'Finance', icon: DollarSign, perm: 'finance' },
  { path: '/admin/analytics', label: 'Live Analytics', icon: Activity, perm: 'analytics' },
  { path: '/admin/health', label: 'System Health', icon: HeartPulse, perm: 'health' },
  { path: '/admin/conversions', label: 'Conversions', icon: TrendingUp, perm: 'analytics' },
  { path: '/browse', label: 'Browse Vendors', icon: Store, perm: 'vendors' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, logoutAdmin, hasPermission } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  if (!adminUser) {
    navigate('/admin-login');
    return null;
  }

  return (
    <div className="min-h-screen mesh-bg-dark flex">
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-16' : 'w-56'} glass-dark-premium border-r border-white/5 flex-shrink-0 transition-all duration-300 flex flex-col sticky top-0 h-screen z-40`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 icon-circle-purple">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SimpliPlan</p>
              <p className="text-[9px] font-bold tracking-widest" style={{ color: '#64748B' }}>COMMAND</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg transition-colors hover:bg-white/5 flex-shrink-0" style={{ color: '#64748B' }}>
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.filter(item => hasPermission(item.perm)).map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                  isActive
                    ? 'text-white border'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                style={isActive ? { background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))', borderColor: 'rgba(139,92,246,0.2)' } : {}}>
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-400' : ''}`} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />}
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <span className="text-xs font-bold" style={{ color: '#A78BFA' }}>{adminUser.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate font-medium">{adminUser.name}</p>
                <p className="text-[9px] capitalize" style={{ color: '#64748B' }}>{adminUser.role}</p>
              </div>
            </div>
          )}
          <button onClick={() => { logoutAdmin(); navigate('/admin-login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left text-gray-500 hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
