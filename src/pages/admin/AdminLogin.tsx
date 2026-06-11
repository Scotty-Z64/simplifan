import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, ChevronRight, Zap, BarChart3 } from 'lucide-react';

/* ─── SimpliPlan Logo ─── */
function SimpliPlanLogo({ size = 40 }: { size?: number }) {
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

export function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    const ok = loginAdmin(email, password);
    if (ok) navigate('/admin');
    else setError('Invalid credentials. Try any @simpliplan.co.za email');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#E8EDF2' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(43,188,168,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(43,188,168,0.08) 0%, transparent 50%)' }} />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="flex items-center gap-3 mb-8">
            <SimpliPlanLogo size={40} />
            <div>
              <h2 className="text-xl font-bold text-white">SimpliPlan</h2>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#2BBCA8' }}>Celebrating People</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Team<br /><span style={{ color: '#2BBCA8' }}>Command Center</span>
          </h1>
          <p className="mb-8 max-w-sm" style={{ color: '#94A3B8' }}>
            Full overview of SimpliPlan — clients, vendors, events, revenue, and marketing campaigns.
          </p>
          <div className="space-y-4">
            {[{ icon: BarChart3, label: 'Live stats & analytics', color: '#2BBCA8' }, { icon: Shield, label: 'Role-based access control', color: '#3B82F6' }, { icon: Zap, label: 'Real-time event tracking', color: '#F59E0B' }].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <span className="text-sm" style={{ color: '#CBD5E1' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 lg:hidden">
            <SimpliPlanLogo size={48} />
            <h1 className="text-2xl font-bold mt-3" style={{ color: '#1a1a2e' }}>SimpliPlan</h1>
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#2BBCA8' }}>Celebrating People</p>
          </div>

          <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'white', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.08)' }}>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#2BBCA8' }}>
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>Team Sign In</h2>
              <p className="text-sm" style={{ color: '#94A3B8' }}>Access your command center</p>
            </div>

            {error && <p className="text-sm p-3 rounded-lg mb-4" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>{error}</p>}

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              <div>
                <label className="text-sm mb-1 block font-medium" style={{ color: '#475569' }}>Team Email</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@simpliplan.co.za"
                    className="pl-10" style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1a1a2e' }} />
                </div>
              </div>
              <div>
                <label className="text-sm mb-1 block font-medium" style={{ color: '#475569' }}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                    className="pl-10" style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1a1a2e' }} />
                </div>
              </div>
              <Button type="submit" disabled={!email} className="w-full rounded-xl py-6 text-white font-semibold"
                style={{ background: '#2BBCA8', opacity: !email ? 0.5 : 1 }}>
                <Zap className="w-4 h-4 mr-2" />Access Command Center
              </Button>
              <p className="text-xs text-center" style={{ color: '#94A3B8' }}>Demo: any @simpliplan.co.za email works</p>
            </form>

            <div className="mt-6 pt-4 border-t text-center" style={{ borderColor: '#E2E8F0' }}>
              <button onClick={() => navigate('/')} className="text-sm font-medium hover:underline" style={{ color: '#2BBCA8' }}>Back to SimpliPlan</button>
            </div>
          </div>

          {/* Quick Login */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-center uppercase tracking-wider font-semibold mb-3" style={{ color: '#94A3B8' }}>Quick Login</p>
            {[
              { email: 'singa@simpliplan.co.za', role: 'Super Admin' },
              { email: 'lunga@simpliplan.co.za', role: 'Admin' },
              { email: 'admin@simpliplan.co.za', role: 'Super Admin' },
            ].map(u => (
              <button key={u.email} onClick={() => { setEmail(u.email); }}
                className="w-full rounded-lg p-3 flex items-center gap-3 text-left transition-all hover:-translate-y-0.5"
                style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(43,188,168,0.1)' }}>
                  <span className="text-xs font-bold" style={{ color: '#2BBCA8' }}>{u.email[0].toUpperCase()}{u.email[1].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#1a1a2e' }}>{u.email}</p>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>{u.role}</p>
                </div>
                <ChevronRight className="w-4 h-4" style={{ color: '#CBD5E1' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
