import { Phone, User, Mail, MapPin, Sparkles, Heart, Target } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#F1F5F9' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', boxShadow: '0 8px 20px -4px rgba(43,188,168,0.3)' }}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>About SimpliPlan</h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: '#64748B' }}>
            SimpliPlan is South Africa's event planning marketplace, connecting clients with verified vendors for weddings, funerals, birthdays, and all life's celebrations.
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl p-8 mb-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F0FDFA' }}>
              <Target className="w-5 h-5" style={{ color: '#2BBCA8' }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>Our Mission</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
            We believe every South African deserves a stress-free celebration. From township to suburbs, 
            from traditional ceremonies to modern weddings — SimpliPlan makes it easy to find, book, and 
            pay trusted local vendors. No more cold calls. No more price haggling. Just celebrate.
          </p>
        </div>

        {/* What We Do */}
        <div className="rounded-2xl p-8 mb-6" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFFBEB' }}>
              <Heart className="w-5 h-5" style={{ color: '#F59E0B' }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: '#1a1a2e' }}>What We Do</h2>
          </div>
          <ul className="space-y-3">
            {[
              'Connect clients with verified local vendors across all 9 provinces',
              'Provide instant quotes via WhatsApp — no waiting, no back-and-forth',
              'Secure PayFast payments protect your deposit until after your event',
              'Help vendors grow their business with a steady stream of qualified leads',
              'Support every type of celebration — weddings, funerals, uMgidi, corporate events',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#64748B' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#F0FDFA', color: '#2BBCA8', fontSize: '10px', fontWeight: 'bold' }}>{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: User, label: 'Contact', value: 'Head of Marketing', color: '#2BBCA8', bg: '#F0FDFA' },
              { icon: Phone, label: 'WhatsApp', value: '081 843 0771', color: '#10B981', bg: '#ECFDF5' },
              { icon: Mail, label: 'Email', value: 'support@simpliplan.co.za', color: '#3B82F6', bg: '#EFF6FF' },
              { icon: MapPin, label: 'Location', value: 'South Africa', color: '#8B5CF6', bg: '#F5F3FF' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F8FAFC' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: item.bg }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>{item.label}</p>
                  <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
