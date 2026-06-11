import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, ArrowRight, BadgeCheck, TrendingUp, Users, Star } from 'lucide-react';

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

export function VendorLogin() {
  const { loginVendor } = useUnified();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    loginVendor(email, password);
    navigate('/vendor');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#E8EDF2' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245,158,11,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(43,188,168,0.08) 0%, transparent 50%)' }} />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="flex items-center gap-3 mb-8">
            <SimpliPlanLogo size={40} />
            <div>
              <h2 className="text-xl font-bold text-white">SimpliPlan</h2>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#2BBCA8' }}>Celebrating People</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Get More<br /><span style={{ color: '#F59E0B' }}>Event Bookings</span>
          </h1>
          <p className="mb-8 max-w-sm" style={{ color: '#94A3B8' }}>
            Clients come to you. Accept quote requests with one tap. Get paid securely.
          </p>
          <div className="space-y-4">
            {[{ icon: Users, label: '25,000+ clients looking for vendors', color: '#2BBCA8' }, { icon: BadgeCheck, label: 'Verified vendor badge', color: '#10B981' }, { icon: TrendingUp, label: 'Track earnings & growth', color: '#F59E0B' }].map((item, i) => (
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
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: '#F59E0B' }}>
                <Store className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>Vendor Sign In</h2>
              <p className="text-sm" style={{ color: '#94A3B8' }}>Access your business dashboard</p>
            </div>

            {error && <p className="text-sm p-3 rounded-lg mb-4" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm mb-1 block font-medium" style={{ color: '#475569' }}>Email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vendor@business.co.za"
                  style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1a1a2e' }} />
              </div>
              <div>
                <label className="text-sm mb-1 block font-medium" style={{ color: '#475569' }}>Password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                  style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#1a1a2e' }} />
              </div>
              <Button type="submit" className="w-full rounded-xl py-5 font-semibold text-white"
                style={{ background: '#F59E0B' }}>
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t space-y-2" style={{ borderColor: '#E2E8F0' }}>
              <p className="text-sm text-center" style={{ color: '#94A3B8' }}>New vendor? <Link to="/vendor-signup" className="font-medium" style={{ color: '#F59E0B' }}>Apply here</Link></p>
              <p className="text-sm text-center"><Link to="/" className="font-medium" style={{ color: '#2BBCA8' }}>Back to SimpliPlan</Link></p>
            </div>
          </div>

          {/* Quick Demo Login */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-center uppercase tracking-wider font-semibold mb-3" style={{ color: '#94A3B8' }}>Demo Login</p>
            {[
              { email: 'info@royalevents.co.za', name: 'Royal Events SA', rating: 4.9 },
              { email: 'braai@masters.co.za', name: 'Braai Masters', rating: 4.7 },
            ].map(v => (
              <button key={v.email} onClick={() => { setEmail(v.email); setPassword('demo'); }}
                className="w-full rounded-lg p-3 flex items-center gap-3 text-left transition-all hover:-translate-y-0.5"
                style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
                  <Store className="w-4 h-4" style={{ color: '#F59E0B' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#1a1a2e' }}>{v.name}</p>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>{v.email}</p>
                </div>
                <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs" style={{ color: '#64748B' }}>{v.rating}</span></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
