import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { VendorOverview } from '@/components/VendorOverview';
import { VendorProducts } from '@/components/VendorProducts';
import { VendorPackages } from '@/components/VendorPackages';
import { VendorBookings } from '@/components/VendorBookings';
import { VendorQuotes } from '@/components/VendorQuotes';
import { VendorProfile } from '@/components/VendorProfile';
import {
  LayoutDashboard, Package, Boxes, CalendarDays, FileText, UserCircle,
  Bell, LogOut, Menu, ChevronRight, Star, BadgeCheck, Sparkles
} from 'lucide-react';

type TabType = 'overview' | 'products' | 'packages' | 'bookings' | 'quotes' | 'profile';

const sidebarItems: { id: TabType; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'My Products', icon: Package },
  { id: 'packages', label: 'Packages', icon: Boxes },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'quotes', label: 'Quote Requests', icon: FileText },
  { id: 'profile', label: 'Business Profile', icon: UserCircle },
];

export function VendorDashboard() {
  const { vendor, isVendorLoggedIn, logout, unreadCount } = useVendorAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!isVendorLoggedIn || !vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Vendor Portal</h2>
          <p className="text-gray-400 mb-6">Please sign in to access your vendor dashboard.</p>
          <button onClick={() => navigate('/vendor-login')}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-all w-full">
            Sign In to Vendor Portal
          </button>
          <button onClick={() => navigate('/')}
            className="mt-3 px-6 py-3 border border-gray-700 text-gray-400 hover:text-white rounded-xl font-medium transition-all w-full">
            Back to SimpliPlan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 glass border-r border-gray-800/50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } flex flex-col`}>
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Vendor Portal</h2>
              <p className="text-[10px] text-gray-500 tracking-wider uppercase">Business Suite</p>
            </div>
          </div>
        </div>

        <div className="p-4 mx-4 mt-4 glass rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-lg font-bold text-white">
              {vendor.businessName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-white truncate">{vendor.businessName}</p>
                {vendor.verified && <BadgeCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs text-gray-400">{vendor.rating} ({vendor.reviews})</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{vendor.status}</span>
            {vendor.premium && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">PREMIUM</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-teal-500 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}>
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'quotes' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
              {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800/50 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="flex-1 text-left">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" /><span className="flex-1 text-left">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">{sidebarItems.find(i => i.id === activeTab)?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white">
              {vendor.businessName.charAt(0)}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'overview' && <VendorOverview />}
          {activeTab === 'products' && <VendorProducts />}
          {activeTab === 'packages' && <VendorPackages />}
          {activeTab === 'bookings' && <VendorBookings />}
          {activeTab === 'quotes' && <VendorQuotes />}
          {activeTab === 'profile' && <VendorProfile />}
        </div>
      </main>
    </div>
  );
}
