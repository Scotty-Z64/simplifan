import { FileText } from 'lucide-react';

export function Terms() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#F1F5F9' }}>
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 md:p-12" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#F0FDFA' }}>
              <FileText className="w-6 h-6" style={{ color: '#2BBCA8' }} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1a1a2e' }}>SimpliPlan Terms & Conditions</h1>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Last updated: 30 November 2025</p>
            </div>
          </div>

          <div className="space-y-6 text-sm" style={{ color: '#475569' }}>
            <p>These Terms and Conditions ("Terms") govern your access to and use of SimpliPlan (the "Platform", "Service", "App", or "Website"), operated in South Africa. By accessing or using SimpliPlan, you agree to be bound by these Terms.</p>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>1. DEFINITIONS</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong>"SimpliPlan" / "we" / "us"</strong> - refers to the SimpliPlan platform and its operators.</li>
                <li><strong>"User" / "you"</strong> - refers to any individual who accesses or uses SimpliPlan.</li>
                <li><strong>"Vendor"</strong> - a business or service provider listed on the platform.</li>
                <li><strong>"Client"</strong> - a user seeking event planning services or vendors.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>2. ELIGIBILITY</h2>
              <p>You must be 16 years or older to create an account and use SimpliPlan. By using the Service, you confirm that you meet this requirement and have the legal capacity to enter into these Terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>3. ACCOUNT REGISTRATION</h2>
              <p className="mb-2">To access core features, you must create an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Provide accurate and complete information</li>
                <li>Keep your login credentials secure</li>
                <li>Notify us immediately of any unauthorised use of your account</li>
                <li>You are responsible for all activity that occurs under your account.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>4. VENDOR SUBSCRIPTIONS</h2>
              <p className="mb-2">Vendors pay a monthly subscription fee to be listed on SimpliPlan. Subscription tiers are clearly displayed on the Pricing page. By subscribing, vendors agree to:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Maintain accurate and up-to-date business information</li>
                <li>Respond to quote requests within a reasonable timeframe</li>
                <li>Deliver services as described in their profile</li>
                <li>Pay a platform fee (3-7%) on confirmed bookings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>5. PAYMENTS & DEPOSITS</h2>
              <p className="mb-2">All payments are processed securely through PayFast, South Africa's trusted payment gateway. Clients pay a 50% deposit to secure their booking. The deposit is held by SimpliPlan until the event is completed, then released to the vendor (minus the platform fee).</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>6. PLATFORM FEES</h2>
              <p>SimpliPlan charges vendors a platform fee of 3-7% on confirmed bookings, depending on the vendor's subscription tier. The first booking for new vendors has no platform fee. Clients do not pay any platform fees.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>7. CANCELLATIONS & REFUNDS</h2>
              <p className="mb-2">Cancellation policies vary by vendor and are displayed on each vendor's profile. In case of disputes, SimpliPlan will mediate and may withhold payment until resolution. Clients should only pay deposits through SimpliPlan — never send cash or EFT directly before the event.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>8. TERMINATION</h2>
              <p>We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or unlawful activity. You may delete your account at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>9. CONTACT</h2>
              <p>For questions about these Terms, please contact us at:{' '}
                <a href="mailto:support@simpliplan.co.za" className="font-semibold" style={{ color: '#2BBCA8' }}>support@simpliplan.co.za</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
