import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import {
  ArrowRight, Eye, EyeOff, Mail, Lock, Sparkles, User, ChevronLeft
} from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { loginClient } = useUnified();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginClient('0712345678');
      setIsLoading(false);
      navigate('/client');
    }, 800);
  };

  const handleDemoLogin = () => {
    loginClient('0712345678');
    navigate('/client');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(43,188,168,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Welcome Back</h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>Access your event dashboard, track your vendors, and manage your bookings all in one place.</p>
          <div className="space-y-4">
            {[
              { icon: Sparkles, text: 'Track your event progress in real-time' },
              { icon: User, text: 'Chat with vendors directly' },
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
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-xs font-medium mb-8 transition-colors hover:text-teal-600" style={{ color: '#94A3B8' }}>
            <ChevronLeft className="w-4 h-4" /> Back to home
          </button>

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>Sign In</h1>
          <p className="text-sm mb-8" style={{ color: '#64748B' }}>Enter your details to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#94A3B8' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Password</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                <Lock className="w-4 h-4 flex-shrink-0" style={{ color: '#94A3B8' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                  className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" style={{ color: '#94A3B8' }} /> : <Eye className="w-4 h-4" style={{ color: '#94A3B8' }} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
              {isLoading ? 'Signing in...' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#94A3B8' }}>or</span>
            <div className="flex-1 h-px" style={{ background: '#E2E8F0' }} />
          </div>

          <button onClick={handleDemoLogin}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
            style={{ background: '#F1F5F9', color: '#2BBCA8', border: '1.5px dashed #2BBCA8' }}>
            Try Demo (No Login)
          </button>

          <p className="text-xs text-center mt-6" style={{ color: '#94A3B8' }}>
            Do not have an account? <button onClick={() => navigate('/register')} className="font-semibold" style={{ color: '#2BBCA8' }}>Register</button>
          </p>
        </div>
      </div>
    </div>
  );
}
