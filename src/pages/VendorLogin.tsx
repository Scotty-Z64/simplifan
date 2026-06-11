import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, ArrowRight, BadgeCheck, TrendingUp, Users } from 'lucide-react';

export function VendorLogin() {
  const { login, isVendorLoggedIn } = useVendorAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isVendorLoggedIn) {
      navigate('/vendor-dashboard');
    }
  }, [isVendorLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const success = login(email, password);
    if (!success) setError('Invalid credentials. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-gray-950" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">SimpliPlan</h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Vendor Portal</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Grow Your<br /><span className="text-amber-400">Event Business</span>
          </h1>
          <p className="text-gray-400 mb-8 max-w-sm">
            Join South Africa's most trusted event marketplace. Connect with thousands of event planners looking for your services.
          </p>
          <div className="space-y-4">
            {[
              { icon: Users, label: '25,000+ event planners', color: 'text-teal-400' },
              { icon: TrendingUp, label: 'Zero commission on bookings', color: 'text-emerald-400' },
              { icon: BadgeCheck, label: 'Verified vendor badge', color: 'text-amber-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Vendor Portal</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">SimpliPlan Business</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 sm:p-8 border border-gray-700/50">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Vendor Sign In</h2>
              <p className="text-sm text-gray-500">Access your vendor dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="vendor@business.co.za" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Password</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl py-5">
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-700/50 text-center space-y-2">
              <p className="text-sm text-gray-500">
                Don't have a vendor account?{' '}
                <Link to="/vendor-join" className="text-amber-400 hover:text-amber-300 font-medium">Apply here</Link>
              </p>
              <p className="text-sm text-gray-500">
                <Link to="/" className="text-teal-400 hover:text-teal-300 font-medium">Back to SimpliPlan</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
