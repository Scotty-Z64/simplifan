import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/providers/trpc';
import {
  LogIn, ArrowRight, Sparkles, User, Lock,
  Phone, Loader2, Store, CheckCircle
} from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [sentCode, setSentCode] = useState('');

  // API
  const sendOtp = trpc.otp.send.useMutation();
  const verifyOtp = trpc.otp.verify.useMutation();
  const createClient = trpc.spClient.create.useMutation();

  if (user) {
    navigate('/client');
    return null;
  }

  const handleSendOtp = async () => {
    setError('');
    const cleanPhone = phone.replace(/\s/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setError('Please enter a valid phone number (at least 9 digits)');
      return;
    }
    setSending(true);
    try {
      const result = await sendOtp.mutateAsync({ phone: cleanPhone });
      if (!result.success) {
        setError(result.error || 'Failed to send OTP');
        setSending(false);
        return;
      }
      setStep('otp');
      // Show code in development (remove this line in production)
      if ((result as any)._code) {
        setSentCode((result as any)._code);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    }
    setSending(false);
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    setVerifying(true);
    try {
      const cleanPhone = phone.replace(/\s/g, '');
      const result = await verifyOtp.mutateAsync({ phone: cleanPhone, code: otp });
      if (!result.success) {
        setError(result.error || 'Invalid code');
        setVerifying(false);
        return;
      }

      // OTP verified - create/get client profile
      const client = await createClient.mutateAsync({
        name: 'Client ' + cleanPhone.slice(-4),
        phone: cleanPhone,
      });

      const clientUser = {
        id: String(client.id),
        name: client.name,
        phone: client.phone,
        location: (client as any).location || '',
        avatar: client.name.charAt(0).toUpperCase(),
      };
      localStorage.setItem('sp_client_user', JSON.stringify(clientUser));
      localStorage.setItem('sp_auth_type', 'client');

      setVerifying(false);
      window.location.href = '/#/client';
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(43,188,168,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Welcome Back</h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>Sign in to manage your events, chat with vendors, and track your bookings.</p>
          <div className="space-y-4">
            {[
              { icon: Sparkles, text: 'Track all your events in one place' },
              { icon: User, text: 'Chat directly with verified vendors' },
              { icon: Lock, text: 'Secure OTP authentication' },
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

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 8px 20px -4px rgba(43,188,168,0.3)' }}>
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>Sign In</h1>
            <p className="text-sm" style={{ color: '#64748B' }}>{step === 'phone' ? 'Enter your phone number' : 'Enter the OTP sent to your phone'}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          {/* Step 1: Phone Number */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Phone Number</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                  <Phone className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="082 345 6789"
                    className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a1a2e' }} />
                </div>
                <p className="text-[10px] mt-1" style={{ color: '#94A3B8' }}>We will send a 6-digit verification code</p>
              </div>
              <button onClick={handleSendOtp} disabled={sending}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <div className="space-y-4">
              {/* Dev mode: show the code since SMS isn't configured */}
              {sentCode && (
                <div className="p-4 rounded-xl text-center" style={{ background: '#F0FDFA', border: '1px solid #A7F3D0' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#0F766E' }}>Your verification code</p>
                  <p className="text-3xl font-bold tracking-[0.3em]" style={{ color: '#2BBCA8' }}>{sentCode}</p>
                  <p className="text-[10px] mt-1" style={{ color: '#64748B' }}>This will be sent via SMS when you connect an SMS provider</p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#475569' }}>Enter 6-Digit Code</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                  <Lock className="w-4 h-4" style={{ color: '#CBD5E1' }} />
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="------" maxLength={6}
                    className="flex-1 bg-transparent text-sm outline-none text-center" style={{ color: '#1a1a2e', letterSpacing: '0.5em' }} />
                </div>
                <p className="text-[10px] mt-1" style={{ color: '#94A3B8' }}>Code sent to {phone}. Valid for 10 minutes.</p>
              </div>
              <button onClick={handleVerifyOtp} disabled={verifying || otp.length < 6}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
                {verifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <><CheckCircle className="w-4 h-4" /><span>Verify & Sign In</span></>}
              </button>
              <button onClick={() => { setStep('phone'); setOtp(''); setSentCode(''); setError(''); }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold" style={{ color: '#64748B' }}>
                Change phone number
              </button>
            </div>
          )}

          <p className="text-xs text-center mt-6" style={{ color: '#94A3B8' }}>
            New to SimpliPlan? <Link to="/register" className="font-semibold" style={{ color: '#2BBCA8' }}>Create account</Link>
          </p>

          {/* Vendor Login */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid #E2E8F0' }}>
            <Link to="/vendor-login" className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all"
              style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}>
              <Store className="w-4 h-4" /> Login as Vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
