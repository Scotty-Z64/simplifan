import { useNavigate } from 'react-router-dom';
import {
  Users, Store, ArrowRight, Star, Shield, Zap, CheckCircle,
  ListChecks, Wallet, UserPlus, Timer, MessageCircle,
  Facebook, Twitter, Music2, Sparkles, Heart, Award, Phone
} from 'lucide-react';
import { WhatsAppPreview } from '@/components/WhatsAppPreview';

/* ─── SimpliPlan Logo SVG ─── */
function SimpliPlanLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="4" fill="#2BBCA8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse key={i} cx="24" cy="24" rx="2.5" ry="12" fill="#2BBCA8" opacity={0.85} transform={`rotate(${angle} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="5" fill="#fff" />
      <circle cx="24" cy="24" r="3.5" fill="#2BBCA8" />
    </svg>
  );
}

const eventTypes = [
  { name: 'Birthday', image: '/images/birthday-premium.jpg', path: '/client/planner', count: '12,500+', color: '#2BBCA8' },
  { name: 'Wedding', image: '/images/wedding-premium.jpg', path: '/client/planner', count: '3,200+', color: '#F59E0B' },
  { name: 'Funeral', image: '/images/funeral-premium.jpg', path: '/client/planner', count: '1,800+', color: '#64748B' },
  { name: 'uMgidi', image: '/images/umgidi-premium.jpg', path: '/client/planner', count: '890+', color: '#8B5CF6' },
  { name: 'uMemulo', image: '/images/umemulo-premium.jpg', path: '/client/planner', count: '650+', color: '#F43F5E' },
];

const features = [
  { icon: ListChecks, title: 'Stay Organised', desc: 'Never miss event items, tasks, bookings or deadlines.' },
  { icon: Wallet, title: 'Control Your Budget', desc: 'Track every cost in one place with real-time updates.' },
  { icon: UserPlus, title: 'Plan Together', desc: 'Share plans with family or friends and plan together.' },
  { icon: Timer, title: 'Move Fast', desc: 'Create a birthday plan in seconds with AI assistance.' },
];

const stats = [
  { icon: Users, value: '25K+', label: 'Happy Clients' },
  { icon: Store, value: '500+', label: 'Trusted Vendors' },
  { icon: Star, value: '4.8', label: 'Average Rating' },
  { icon: Shield, value: '100%', label: 'Secure Payments' },
];

const testimonials = [
  { name: 'Lerato M.', event: 'Wedding in Soweto', text: 'Planned my entire wedding in 3 days. The AI found vendors I never knew existed!', rating: 5 },
  { name: 'Thabo K.', event: 'uMgidi Ceremony', text: 'From finding a caterer to booking tents, everything was seamless. Saved me hours.', rating: 5 },
  { name: 'Sarah V.', event: '21st Birthday', text: 'The WhatsApp bot is genius. I planned my party while commuting on the taxi!', rating: 5 },
];

export function PortalSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#E8EDF2' }}>
      {/* ═══════════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <SimpliPlanLogo size={36} />
            <div className="text-left">
              <span className="text-lg font-bold tracking-tight" style={{ color: '#1a1a2e' }}>SimpliPlan</span>
              <span className="block text-[8px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#2BBCA8', marginTop: '-3px' }}>Celebrating People</span>
            </div>
          </button>
          <div className="flex items-center gap-4 sm:gap-8">
            <button onClick={() => navigate('/')} className="text-sm font-medium" style={{ color: '#1a1a2e' }}>Home</button>
            <button onClick={() => navigate('/browse')} className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Browse</button>
            <button onClick={() => navigate('/admin-login')} className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: '#2BBCA8', border: '1.5px solid #2BBCA8' }}>Admin</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-medium hidden sm:block" style={{ color: '#64748B' }}>Login</button>
            <button onClick={() => navigate('/client')} className="px-5 py-2.5 rounded-lg text-sm font-bold text-white flex items-center gap-1.5 transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO — Full Visual Impact
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '85vh' }}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src="/images/hero-celebration.jpg" alt="Celebration" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.7) 40%, rgba(43,188,168,0.3) 100%)' }} />
        </div>
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full animate-float"
              style={{
                width: `${20 + i * 15}px`,
                height: `${20 + i * 15}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                background: i % 2 === 0 ? 'rgba(43,188,168,0.08)' : 'rgba(245,158,11,0.06)',
                filter: 'blur(2px)',
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }} />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center" style={{ minHeight: '85vh' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="pt-16 pb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(43,188,168,0.15)', border: '1px solid rgba(43,188,168,0.25)', backdropFilter: 'blur(10px)' }}>
                <Sparkles className="w-4 h-4" style={{ color: '#2BBCA8' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#2BBCA8' }}>Built for Mzansi</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Plan Your<br />
                <span style={{ color: '#2BBCA8' }}>Perfect Event</span><br />
                <span className="text-4xl sm:text-5xl lg:text-6xl" style={{ color: 'rgba(255,255,255,0.7)' }}>Without the Stress</span>
              </h1>

              <p className="text-lg sm:text-xl mb-8 max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Weddings, birthdays, funerals & traditional ceremonies. AI-powered planning with real South African vendors.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <button onClick={() => navigate('/client/planner')}
                  className="px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center gap-2 transition-all hover:shadow-2xl hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 8px 30px -5px rgba(43,188,168,0.5)' }}>
                  <Zap className="w-5 h-5" /> Plan an Event <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate('/browse')}
                  className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                  <Store className="w-5 h-5" /> Browse Vendors
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6">
                {['Free to start', '500+ SA Vendors', 'PayFast Secure'].map((badge, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <CheckCircle className="w-4 h-4" style={{ color: '#2BBCA8' }} /> {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: WhatsApp Preview floating */}
            <div className="hidden lg:flex justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(43,188,168,0.15) 0%, transparent 70%)' }} />
              </div>
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <WhatsAppPreview />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, #E8EDF2, transparent)' }} />
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR — Floating
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 px-4 -mt-16 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl p-5 text-center transition-all hover:-translate-y-1" style={{ background: 'white', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg, rgba(43,188,168,0.1), rgba(245,158,11,0.1))' }}>
                  <s.icon className="w-6 h-6" style={{ color: '#2BBCA8' }} />
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                <p className="text-xs font-medium" style={{ color: '#64748B' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EVENT TYPES — Full Visual Cards
          ═══════════════════════════════════════════ */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#2BBCA8' }}>What are you planning?</span>
            <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>
              Every Celebration<br /><span style={{ color: '#64748B' }}>Covered</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {eventTypes.map((event) => (
              <button key={event.name} onClick={() => navigate(event.path)}
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{ boxShadow: '0 4px 20px -5px rgba(0,0,0,0.15)' }}>
                <div className="aspect-[3/4] relative">
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white"
                    style={{ background: event.color }}>
                    {event.count}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-white font-bold text-xl block mb-1">{event.name}</span>
                    <span className="text-white/50 text-xs block opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to plan &rarr;</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Dark Section
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20" style={{ background: '#0f172a' }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(43,188,168,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#F59E0B' }}>How It Works</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Plan in 4 Simple Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div key={feat.title} className="text-center p-6 rounded-2xl transition-all hover:-translate-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: i === 0 ? 'rgba(43,188,168,0.15)' : i === 1 ? 'rgba(245,158,11,0.15)' : i === 2 ? 'rgba(139,92,246,0.15)' : 'rgba(244,63,94,0.15)' }}>
                  <feat.icon className="w-8 h-8" style={{ color: i === 0 ? '#2BBCA8' : i === 1 ? '#F59E0B' : i === 2 ? '#8B5CF6' : '#F43F5E' }} />
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                  {i + 1}
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHATSAPP BOT — Split Layout
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20" style={{ background: '#1a1a2e' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)' }}>
                <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} />
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#25D366' }}>New: WhatsApp Bot</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Plan on <span style={{ color: '#25D366' }}>WhatsApp</span><br />in Just 7 Taps
              </h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                No app download needed. Chat with our AI on WhatsApp, answer a few questions, and get a complete event plan with vendor quotes in 24 hours.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: '💬', title: 'Start with HI', desc: 'Send "HI" to our WhatsApp number' },
                  { icon: '📋', title: 'Answer 7 Questions', desc: 'Event type, province, guests, budget, date' },
                  { icon: '🎯', title: 'Get 3 Plans', desc: 'Budget, Standard & Premium tiers' },
                  { icon: '⚡', title: 'Quotes in 24h', desc: 'Vendors respond, you pick the best' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-white">{item.title}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => window.open('https://wa.me/27000000000?text=HI', '_blank')}
                className="px-7 py-3.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all hover:shadow-xl hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 4px 20px -5px rgba(37,211,102,0.4)' }}>
                <Phone className="w-4 h-4" /> Try WhatsApp Bot
              </button>
            </div>
            <div className="flex justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(37,211,102,0.08) 0%, transparent 70%)' }} />
              </div>
              <div className="relative"><WhatsAppPreview /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PORTAL SELECTION — Bold Cards
          ═══════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#E8EDF2' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(43,188,168,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#2BBCA8' }}>Get Started</span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>
              Choose Your Portal
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Portal */}
            <button onClick={() => navigate('/client')}
              className="group text-left p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2" style={{ background: 'white', boxShadow: '0 8px 40px -8px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>I Need an Event</h3>
                  <p className="text-sm font-semibold" style={{ color: '#2BBCA8' }}>Client Portal</p>
                </div>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#64748B' }}>
                Let our AI plan your entire event. Tell us your budget and guest count — we find vendors, get quotes, and track everything.
              </p>
              <div className="space-y-2.5 mb-6">
                {['AI auto-plans your event', 'Vendors come to you', 'Track everything like Uber', 'Pay deposits securely'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: '#475569' }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#2BBCA8' }} />{item}
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: '#2BBCA8' }}>
                Enter Client Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            {/* Vendor Portal */}
            <button onClick={() => navigate('/vendor-login')}
              className="group text-left p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2" style={{ background: 'white', boxShadow: '0 8px 40px -8px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>I Provide Services</h3>
                  <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>Vendor Portal</p>
                </div>
              </div>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: '#64748B' }}>
                Get connected to clients actively looking for your services. Respond to quote requests with one tap.
              </p>
              <div className="space-y-2.5 mb-6">
                {['Quote requests come to you', 'Accept with one tap', 'Chat with clients', 'Get paid on time'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: '#475569' }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} />{item}
                  </div>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: '#F59E0B' }}>
                Enter Vendor Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ background: 'white' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#F59E0B' }}>Testimonials</span>
            <h2 className="text-4xl font-bold" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>
              Loved by South Africans
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 transition-all hover:-translate-y-1" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: '#475569' }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#1a1a2e' }}>{t.name}</p>
                    <p className="text-[10px]" style={{ color: '#94A3B8' }}>{t.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20" style={{ background: '#0f172a' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(43,188,168,0.08) 0%, transparent 60%)' }} />
        </div>
        <div className="max-w-2xl mx-auto text-center relative px-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to Plan Something<br />Important?
          </h2>
          <p className="text-base mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Join 25,000+ South Africans who trust SimpliPlan for their most important celebrations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/client/planner')}
              className="px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center gap-2 transition-all hover:shadow-2xl hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 8px 30px -5px rgba(43,188,168,0.5)' }}>
              <Sparkles className="w-5 h-5" /> Create Free Plan
            </button>
            <button onClick={() => navigate('/client/wizard')}
              className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Zap className="w-5 h-5" /> Quick Birthday Plan
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="px-4 py-12" style={{ background: '#1a1a2e' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SimpliPlanLogo size={28} />
                <span className="text-sm font-bold text-white">SimpliPlan</span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                South Africa's most trusted event planning platform. From Lobola to uMemulo, we help you plan every celebration.
              </p>
              <div className="flex items-center gap-3">
                {[Facebook, Twitter, Music2].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                {['Home', 'Browse Vendors', 'Client Portal', 'Vendor Portal', 'Pricing', 'About'].map((item, i) => (
                  <button key={i} onClick={() => navigate(item === 'Home' ? '/' : item === 'Browse Vendors' ? '/browse' : item === 'Client Portal' ? '/client' : item === 'Vendor Portal' ? '/vendor-login' : item === 'Pricing' ? '/pricing' : '/about')}
                    className="block text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{item}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Contact</h4>
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}><Phone className="w-3.5 h-3.5" /> 081 843 0771</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>South Africa</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm" style={{ color: '#2BBCA8' }}>
                <Award className="w-4 h-4" /> SA's #1 Event Planning Platform
              </div>
            </div>
          </div>
          <div className="pt-6 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>&copy; 2026 SimpliPlan. All rights reserved. Made with love for South Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
