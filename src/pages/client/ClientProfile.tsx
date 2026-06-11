import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { ClientLayout } from '@/components/ClientLayout';
import {
  User, Phone, Mail, MapPin, CalendarCheck, Package,
  Edit3, X, LogOut, Heart
} from 'lucide-react';

export function ClientProfile() {
  const navigate = useNavigate();
  const { clientUser, logout, events } = useUnified();
  const [isEditing, setIsEditing] = useState(false);

  const myEvents = events.filter(e => e.clientId === clientUser?.id);
  const upcoming = myEvents.filter(e => e.status !== 'completed').length;
  const completed = myEvents.filter(e => e.status === 'completed').length;

  if (!clientUser) {
    return (
      <ClientLayout title="Profile">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#1a1a2e' }}>Not Signed In</h2>
          <p className="text-sm mb-6" style={{ color: '#64748B' }}>Sign in to view and manage your profile.</p>
          <button onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>Sign In</button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="My Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 8px 20px -4px rgba(43,188,168,0.3)' }}>
              {clientUser.avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#1a1a2e' }}>{clientUser.name}</h2>
              <p className="text-sm flex items-center gap-1 mb-3" style={{ color: '#64748B' }}><MapPin className="w-4 h-4" />{clientUser.location}</p>
              <div className="flex items-center gap-6">
                <div className="text-center px-4 py-2 rounded-xl" style={{ background: '#F0FDFA' }}>
                  <p className="text-xl font-bold" style={{ color: '#2BBCA8' }}>{myEvents.length}</p>
                  <p className="text-[10px] font-medium" style={{ color: '#64748B' }}>Total Events</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl" style={{ background: '#FEF3C7' }}>
                  <p className="text-xl font-bold" style={{ color: '#F59E0B' }}>{upcoming}</p>
                  <p className="text-[10px] font-medium" style={{ color: '#64748B' }}>Upcoming</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl" style={{ background: '#F3E8FF' }}>
                  <p className="text-xl font-bold" style={{ color: '#8B5CF6' }}>{completed}</p>
                  <p className="text-[10px] font-medium" style={{ color: '#64748B' }}>Completed</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsEditing(!isEditing)}
              className="p-3 rounded-xl transition-all hover:-translate-y-0.5" style={{ background: '#F1F5F9' }}>
              {isEditing ? <X className="w-5 h-5" style={{ color: '#EF4444' }} /> : <Edit3 className="w-5 h-5" style={{ color: '#2BBCA8' }} />}
            </button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#1a1a2e' }}><User className="w-4 h-4" style={{ color: '#2BBCA8' }} /> Contact Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: User, label: 'Full Name', value: clientUser.name },
              { icon: Phone, label: 'Phone', value: clientUser.phone || 'Not set' },
              { icon: Mail, label: 'Email', value: clientUser.email },
              { icon: MapPin, label: 'Location', value: clientUser.location },
            ].map((field, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(43,188,168,0.08)' }}>
                  <field.icon className="w-5 h-5" style={{ color: '#2BBCA8' }} />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>{field.label}</p>
                  <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        {myEvents.length > 0 && (
          <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#1a1a2e' }}><CalendarCheck className="w-4 h-4" style={{ color: '#2BBCA8' }} /> My Events</h3>
            <div className="space-y-3">
              {myEvents.slice(0, 5).map((evt, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(43,188,168,0.1), rgba(43,188,168,0.05))' }}>
                      <Package className="w-5 h-5" style={{ color: '#2BBCA8' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{evt.eventType}</p>
                      <p className="text-[10px]" style={{ color: '#94A3B8' }}>{evt.eventDate} | R {evt.budget.toLocaleString('en-ZA')}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: evt.status === 'completed' ? '#D1FAE5' : '#FEF3C7', color: evt.status === 'completed' ? '#059669' : '#D97706' }}>
                    {evt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="rounded-2xl p-6" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#DC2626' }}><Heart className="w-4 h-4" /> Account</h3>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: '#EF4444' }}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </ClientLayout>
  );
}
