import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowRight, Sparkles, User, Lock } from 'lucide-react';

export function Register() {
  const [formData, setFormData] = useState({ knownAs: '', surname: '', email: '', cellphone: '', password: '', agreeToTerms: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.agreeToTerms) { setError('Please agree to the Terms & Conditions'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.hash = '/client';
    }, 800);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(43,188,168,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Start Planning</h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>Create your account and start planning your perfect event with SimpliPlan.</p>
          <div className="space-y-4">
            {[
              { icon: Sparkles, text: 'Plan any event — weddings, birthdays, funerals' },
              { icon: User, text: 'Get matched with top SA vendors' },
              { icon: Lock, text: 'Secure PayFast payments' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(43,188,168,0.15)' }}>
                  <item.icon className="w-4 h-4" style={{ color: '#2BBCA8' }} />
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 8px 20px -4px rgba(43,188,168,0.3)' }}>
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>Create Account</h1>
            <p className="text-sm" style={{ color: '#64748B' }}>Start planning your celebrations</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>First Name</label>
                <input name="knownAs" value={formData.knownAs} onChange={handleChange} placeholder="First name" required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Surname</label>
                <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Surname" required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Cellphone <span style={{ color: '#94A3B8' }}>(optional)</span></label>
              <input name="cellphone" type="tel" value={formData.cellphone} onChange={handleChange} placeholder="081 234 5678"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                  placeholder="Create a password" required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-10" style={{ background: 'white', border: '1px solid #E2E8F0', color: '#1a1a2e' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4" style={{ color: '#94A3B8' }} /> : <Eye className="w-4 h-4" style={{ color: '#94A3B8' }} />}
                </button>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" checked={formData.agreeToTerms}
                onChange={e => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded accent-teal-500" />
              <label htmlFor="terms" className="text-xs" style={{ color: '#64748B' }}>
                I agree to the <Link to="/terms" className="font-semibold" style={{ color: '#2BBCA8' }}>Terms</Link> and <Link to="/privacy" className="font-semibold" style={{ color: '#2BBCA8' }}>Privacy Policy</Link>
              </label>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
              {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: '#94A3B8' }}>
            Already have an account? <Link to="/login" className="font-semibold" style={{ color: '#2BBCA8' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
