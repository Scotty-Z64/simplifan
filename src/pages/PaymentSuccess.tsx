import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, MessageSquare, Calendar, Phone, ArrowRight } from 'lucide-react';
import { savePaymentRecord, getPaymentRecords } from '@/lib/payfast';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get('booking') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');
  const pfPaymentId = searchParams.get('pf_payment_id') || 'sandbox_' + Date.now();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const existing = getPaymentRecords().find(p => p.bookingId === bookingId);
    if (!existing) {
      savePaymentRecord({
        id: 'pay_' + Date.now(), payfastPaymentId: pfPaymentId, bookingId, vendorId: '',
        clientPhone: '', amount: amount * 0.5, type: 'deposit', status: 'completed',
        payfastStatus: 'COMPLETE', createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });
    }
  }, [bookingId, amount, pfPaymentId]);

  useEffect(() => {
    if (countdown <= 0) { navigate('/browse'); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const deposit = amount * 0.5;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F1F5F9' }}>
      <div className="rounded-2xl p-8 max-w-md w-full text-center" style={{ background: 'white', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: '#ECFDF5', boxShadow: '0 4px 12px -3px rgba(16,185,129,0.2)' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#10B981' }} />
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Payment Successful!</h1>
        <p className="text-sm mb-6" style={{ color: '#64748B' }}>Your deposit has been received and secured by SimpliPlan.</p>

        {/* Payment Details */}
        <div className="rounded-xl p-4 text-left space-y-3 mb-6" style={{ background: '#F8FAFC' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#94A3B8' }}>Payment ID</span>
            <span className="text-xs font-mono" style={{ color: '#1a1a2e' }}>{pfPaymentId?.slice(0, 16)}...</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#94A3B8' }}>Deposit Amount</span>
            <span className="text-sm font-bold" style={{ color: '#10B981' }}>R{deposit.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#94A3B8' }}>Status</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ background: '#D1FAE5', color: '#059669' }}>Completed</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#94A3B8' }}>Secured By</span>
            <span className="text-xs font-semibold" style={{ color: '#1a1a2e' }}>SimpliPlan + PayFast</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-left mb-6">
          <h3 className="text-xs font-bold mb-3" style={{ color: '#1a1a2e' }}>What happens next:</h3>
          <div className="space-y-3">
            {[
              { icon: MessageSquare, title: 'Vendor Notified', desc: 'They\'ve received your deposit confirmation and will contact you shortly.', color: '#2BBCA8', bg: '#F0FDFA' },
              { icon: Calendar, title: 'Event Preparation', desc: 'The vendor will confirm all details and prepare for your event date.', color: '#3B82F6', bg: '#EFF6FF' },
              { icon: Phone, title: 'After Your Event', desc: 'Pay the balance directly to the vendor. Leave a review to help others.', color: '#8B5CF6', bg: '#F5F3FF' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: item.bg }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: '#1a1a2e' }}>{item.title}</p>
                  <p className="text-[10px]" style={{ color: '#94A3B8' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => navigate('/browse')}
          className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
          Browse More Vendors <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[10px] mt-3" style={{ color: '#CBD5E1' }}>Redirecting in {countdown} seconds...</p>
      </div>
    </div>
  );
}
