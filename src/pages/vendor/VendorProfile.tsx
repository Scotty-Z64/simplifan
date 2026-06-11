import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { VendorLayout } from '@/components/VendorLayout';
import {
  Store, Star, MapPin, Phone, Mail, Globe, Edit3, X,
  LogOut, CheckCircle, Package, TrendingUp
} from 'lucide-react';

export function VendorProfile() {
  const navigate = useNavigate();
  const { vendorUser, logout } = useUnified();
  const [isEditing, setIsEditing] = useState(false);

  if (!vendorUser) {
    return (
      <VendorLayout title="Profile">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
            <Store className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#1a1a2e' }}>Not Signed In</h2>
          <button onClick={() => navigate('/vendor-login')} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>Vendor Login</button>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout title="My Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 8px 20px -4px rgba(245,158,11,0.3)' }}>
              {vendorUser.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>{vendorUser.businessName}</h2>
                {vendorUser.verified && (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ background: '#10B981' }}>
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm mb-3" style={{ color: '#64748B' }}>{vendorUser.category} | {(vendorUser as any).province || 'South Africa'}</p>
              <div className="flex items-center gap-6">
                <div className="text-center px-4 py-2 rounded-xl" style={{ background: '#FEF3C7' }}>
                  <div className="flex items-center gap-1 justify-center"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><p className="text-xl font-bold" style={{ color: '#F59E0B' }}>{vendorUser.rating}</p></div>
                  <p className="text-[10px]" style={{ color: '#64748B' }}>Rating</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl" style={{ background: '#F0FDFA' }}>
                  <p className="text-xl font-bold" style={{ color: '#2BBCA8' }}>{vendorUser.jobs}</p>
                  <p className="text-[10px]" style={{ color: '#64748B' }}>Jobs Done</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl" style={{ background: '#F3E8FF' }}>
                  <p className="text-xl font-bold" style={{ color: '#8B5CF6' }}>{vendorUser.yearsInBusiness || 3}</p>
                  <p className="text-[10px]" style={{ color: '#64748B' }}>Years</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="p-3 rounded-xl" style={{ background: '#F1F5F9' }}>
              {isEditing ? <X className="w-5 h-5" style={{ color: '#EF4444' }} /> : <Edit3 className="w-5 h-5" style={{ color: '#F59E0B' }} />}
            </button>
          </div>
        </div>

        {/* Business Details */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#1a1a2e' }}><Store className="w-4 h-4" style={{ color: '#F59E0B' }} /> Business Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Store, label: 'Business Name', value: vendorUser.businessName },
              { icon: Package, label: 'Category', value: vendorUser.category },
              { icon: MapPin, label: 'Province', value: (vendorUser as any).province || 'South Africa' },
              { icon: Phone, label: 'Phone', value: (vendorUser as any).phone || 'Not set' },
              { icon: Mail, label: 'Email', value: vendorUser.email },
              { icon: Globe, label: 'Website', value: (vendorUser as any).website || 'Not set' },
            ].map((field, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.08)' }}>
                  <field.icon className="w-5 h-5" style={{ color: '#F59E0B' }} />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>{field.label}</p>
                  <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#1a1a2e' }}><TrendingUp className="w-4 h-4" style={{ color: '#F59E0B' }} /> Subscription</h3>
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '1px solid #FDE68A' }}>
            <div>
              <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>{(vendorUser as any).tier || 'Pro'} Plan</p>
              <p className="text-xs" style={{ color: '#64748B' }}>R {(vendorUser as any).tier === 'starter' ? '199' : (vendorUser as any).tier === 'pro' ? '449' : '899'}/month</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#F59E0B', color: 'white' }}>Active</span>
          </div>
        </div>

        {/* Sign Out */}
        <div className="rounded-2xl p-6" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: '#EF4444' }}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </VendorLayout>
  );
}
