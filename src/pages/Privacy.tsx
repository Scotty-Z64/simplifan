import { Shield } from 'lucide-react';

export function Privacy() {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#F1F5F9' }}>
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 md:p-12" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#F0FDFA' }}>
              <Shield className="w-6 h-6" style={{ color: '#2BBCA8' }} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1a1a2e' }}>SimpliPlan Privacy Policy</h1>
              <p className="text-xs" style={{ color: '#94A3B8' }}>Last updated: 30 November 2025</p>
            </div>
          </div>

          <div className="space-y-6 text-sm" style={{ color: '#475569' }}>
            <p>SimpliPlan ("we", "us", "our") is committed to protecting your personal information and complying with the Protection of Personal Information Act, 4 of 2013 (POPIA) and other applicable data protection laws. By using SimpliPlan, you agree to the collection and use of information in accordance with this Privacy Policy.</p>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>1. Who We Are</h2>
              <div className="rounded-xl p-4" style={{ background: '#F8FAFC' }}>
                <p><strong style={{ color: '#1a1a2e' }}>Responsible Party:</strong> SimpliPlan</p>
                <p><strong style={{ color: '#1a1a2e' }}>Country:</strong> South Africa</p>
                <p><strong style={{ color: '#1a1a2e' }}>Contact:</strong>{' '}<a href="mailto:privacy@simpliplan.co.za" className="font-semibold" style={{ color: '#2BBCA8' }}>privacy@simpliplan.co.za</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>2. Information We Collect</h2>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#1a1a2e' }}>2.1 Personal Information</h3>
              <ul className="list-disc list-inside space-y-1.5 mb-4">
                <li>Full name</li>
                <li>Email address</li>
                <li>Contact number</li>
                <li>Login credentials (encrypted)</li>
              </ul>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#1a1a2e' }}>2.2 Event & Planning Information</h3>
              <ul className="list-disc list-inside space-y-1.5 mb-4">
                <li>Event name and type</li>
                <li>Event date and location</li>
                <li>Expected number of guests</li>
                <li>Budget categories and preferences</li>
              </ul>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#1a1a2e' }}>2.3 Technical Information</h3>
              <ul className="list-disc list-inside space-y-1.5">
                <li>IP address</li>
                <li>Device and browser type</li>
                <li>Usage data (pages visited, features used)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>3. How We Use Your Information</h2>
              <p className="mb-2">We use your information to:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Create and manage user accounts</li>
                <li>Connect clients with vendors</li>
                <li>Process payments securely via PayFast</li>
                <li>Send quote confirmations and updates via WhatsApp</li>
                <li>Improve app performance and usability</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="mt-3 font-semibold" style={{ color: '#1a1a2e' }}>We do not sell your personal information.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>4. Legal Basis for Processing (POPIA)</h2>
              <p className="mb-2">We process personal information based on:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Your consent</li>
                <li>Performance of a contract (providing the SimpliPlan service)</li>
                <li>Legal obligations</li>
                <li>Legitimate business interests that do not override your rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>5. Data Storage and Security</h2>
              <p>We take reasonable technical and organisational measures to protect your information. All data transfers use encryption (HTTPS/SSL). Payment information is processed by PayFast and never stored on our servers. Access is restricted to authorised personnel only.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>6. Data Retention</h2>
              <p>We retain your personal information for as long as your account is active or as needed to provide you with services. You may request deletion of your data at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>7. Your Rights (POPIA)</h2>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Access your personal information</li>
                <li>Correct inaccurate or outdated information</li>
                <li>Request deletion of your data</li>
                <li>Object to processing in certain circumstances</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with the Information Regulator</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a2e' }}>8. Contact Us</h2>
              <p>For privacy-related questions or to exercise your rights, please contact us at:{' '}
                <a href="mailto:privacy@simpliplan.co.za" className="font-semibold" style={{ color: '#2BBCA8' }}>privacy@simpliplan.co.za</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
