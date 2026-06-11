import { Link } from 'react-router-dom';
import { Check, Building2, Crown, ArrowRight } from 'lucide-react';

const plans = [
  {
    id: 'free', name: 'Starter', price: 0, period: 'Free Forever',
    description: 'Perfect for trying out SimpliPlan',
    color: '#64748B', features: [
      '1 event plan at a time', 'Basic budget calculator', 'Guest list (up to 30)',
      'Simple digital invitation', 'Event checklist', 'Location search', 'Share via WhatsApp',
    ], cta: 'Start Free', popular: false,
  },
  {
    id: 'basic', name: 'Family', price: 19, period: '/month',
    description: 'For families planning celebrations',
    color: '#2BBCA8', features: [
      'Everything in Starter', '3 active event plans', 'Full budget with categories',
      'Guest list (up to 100)', 'Contribution tracker', 'Task assignments',
      'Vendor directory access', 'RSVP management', 'Price estimator', 'Priority support',
    ], cta: 'Start Family Plan', popular: true,
  },
  {
    id: 'premium', name: 'Premium', price: 49, period: '/month',
    description: 'Unlimited everything for serious planners',
    color: '#8B5CF6', features: [
      'Everything in Family', 'Unlimited event plans', 'Unlimited guests',
      'Precise location + Maps', 'Digital invitations (5 styles)', 'Vendor payment tracker',
      'Seating planner', 'Thank you notes', 'Export to PDF/Excel', 'VIP support',
    ], cta: 'Go Premium', popular: false,
  },
  {
    id: 'annual', name: 'Annual Saver', price: 349, period: '/year',
    description: 'Best value - Save R239/year',
    color: '#F59E0B', features: [
      'Everything in Premium', 'All premium features', 'Early access to new features',
      'Exclusive templates', 'Family account (5 members)', 'Backup & restore', 'Priority feature requests',
    ], cta: 'Get Annual', popular: false,
  },
];

const vendorPlan = {
  name: 'Vendor Pro', price: 99, period: '/month',
  description: 'Get booked by thousands of event planners',
  color: '#EC4899', features: [
    'List in vendor directory', 'Receive quote requests', 'Portfolio showcase',
    'Contact details visible', 'Customer reviews', 'Verified vendor badge',
    'Priority listing', 'Analytics dashboard', 'Lead notifications', 'WhatsApp integration',
  ], cta: 'List My Business',
};

export function Pricing() {
  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6"
            style={{ background: 'white', color: '#2BBCA8', border: '1px solid #E2E8F0' }}>
            <Crown className="w-4 h-4" /> Affordable for Every South African Family
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>
            Simple Pricing for <span style={{ color: '#2BBCA8' }}>Everyone</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#64748B' }}>
            From R19/month - less than a loaf of bread. Plan smarter, save more.
          </p>
        </div>

        {/* Main Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {plans.map(plan => (
            <div key={plan.id} className={`relative rounded-2xl p-6 transition-all hover:-translate-y-1 ${plan.popular ? 'ring-2' : ''}`}
              style={{
                background: 'white', boxShadow: plan.popular ? '0 8px 24px -4px rgba(43,188,168,0.2)' : '0 2px 12px -4px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.04)',
                transform: plan.popular ? 'scale(1.03)' : undefined,
              }}>
              {plan.popular && (
                <div className="absolute -top-px left-0 right-0 rounded-t-2xl py-2 text-center text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(90deg, #2BBCA8, #10B981)' }}>MOST POPULAR</div>
              )}
              <div className={`text-center ${plan.popular ? 'pt-8' : ''}`}>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#1a1a2e' }}>{plan.name}</h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>{plan.description}</p>
                <div className="flex items-baseline justify-center mb-1">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold" style={{ color: '#1a1a2e' }}>Free</span>
                  ) : (
                    <><span className="text-sm font-bold" style={{ color: '#94A3B8' }}>R</span>
                    <span className="text-4xl font-bold" style={{ color: plan.color }}>{plan.price}</span></>
                  )}
                </div>
                <p className="text-xs mb-5" style={{ color: '#94A3B8' }}>{plan.period}</p>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-xs">
                    <Check className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                    <span style={{ color: '#64748B' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <button className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={plan.popular ? { background: `linear-gradient(135deg, ${plan.color}, #10B981)`, color: 'white', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' } : { background: '#F1F5F9', color: '#1a1a2e', border: '1px solid #E2E8F0' }}>
                  {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Vendor Plan */}
        <div className="max-w-lg mx-auto mb-10">
          <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="py-2.5 text-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(90deg, #EC4899, #F43F5E)' }}>
              FOR EVENT VENDORS & BUSINESSES
            </div>
            <div className="p-6">
              <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 className="w-6 h-6" style={{ color: '#EC4899' }} />
                  <h3 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>{vendorPlan.name}</h3>
                </div>
                <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>{vendorPlan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-sm font-bold" style={{ color: '#94A3B8' }}>R</span>
                  <span className="text-4xl font-bold" style={{ color: vendorPlan.color }}>{vendorPlan.price}</span>
                  <span className="text-sm ml-1" style={{ color: '#94A3B8' }}>{vendorPlan.period}</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {vendorPlan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-xs">
                    <Check className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" style={{ color: vendorPlan.color }} />
                    <span style={{ color: '#64748B' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/vendor-signup">
                <button className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #EC4899, #F43F5E)', boxShadow: '0 4px 12px -3px rgba(236,72,153,0.3)' }}>
                  {vendorPlan.cta} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Trust */}
        <p className="text-xs text-center" style={{ color: '#94A3B8' }}>
          Trusted by thousands of South African families. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
