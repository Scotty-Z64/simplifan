import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import {
  ChevronLeft, Shield, Lock, CreditCard, CheckCircle,
  AlertTriangle, Loader2
} from 'lucide-react';
import {
  buildPaymentForm,
  calculateDeposit,
  calculateTransactionFee,
  savePaymentRecord,
  PAYFAST_URL,
} from '@/lib/payfast';

interface PayFormField {
  name: string;
  value: string;
}

export function PaymentCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { vendors } = useUnified();

  const bookingId = searchParams.get('booking') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');
  const vendorId = searchParams.get('vendor') || '';
  const eventType = searchParams.get('event') || '';

  const vendor = vendors.find(v => v.id === vendorId);

  const [step, setStep] = useState<'details' | 'processing' | 'form'>('details');
  const [formFields, setFormFields] = useState<PayFormField[]>([]);

  const deposit = calculateDeposit(amount);
  const platformFee = calculateTransactionFee(amount, 'pro');
  const totalToPay = deposit + platformFee;

  useEffect(() => {
    if (step === 'form' && formFields.length > 0) {
      const timer = setTimeout(() => {
        const form = document.getElementById('payfast-form') as HTMLFormElement;
        if (form) form.submit();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, formFields]);

  const handleProceed = () => {
    setStep('processing');
    const paymentRecord = {
      id: 'pay_' + Date.now(), payfastPaymentId: '', bookingId, vendorId,
      clientPhone: '', amount: totalToPay, type: 'deposit' as const,
      status: 'pending' as const, createdAt: new Date().toISOString(),
    };
    savePaymentRecord(paymentRecord);
    const origin = window.location.origin;
    const { fields } = buildPaymentForm({
      amount: totalToPay,
      itemName: `${eventType} Deposit - ${vendor?.businessName || 'Vendor'}`,
      itemDescription: `50% deposit for ${eventType}. Platform fee included.`,
      returnUrl: `${origin}/#/payment-success?booking=${bookingId}&amount=${amount}`,
      cancelUrl: `${origin}/#/payment-cancel?booking=${bookingId}`,
      notifyUrl: `${origin}/api/payfast/itn`,
      customStr1: bookingId, customStr2: vendorId, customStr3: 'client_phone_placeholder',
      nameFirst: 'Client', nameLast: 'Name',
    });
    const fieldEntries = Object.entries(fields).map(([name, value]) => ({ name, value }));
    setFormFields(fieldEntries);
    setStep('form');
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F1F5F9' }}>
        <div className="rounded-2xl p-8 max-w-sm w-full text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#2BBCA8' }} />
          <h2 className="text-lg font-bold mb-1" style={{ color: '#1a1a2e' }}>Redirecting to PayFast</h2>
          <p className="text-sm" style={{ color: '#94A3B8' }}>South Africa's secure payment gateway...</p>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F1F5F9' }}>
        <div className="rounded-2xl p-8 max-w-sm w-full text-center" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: '#2BBCA8' }} />
          <h2 className="text-lg font-bold mb-1" style={{ color: '#1a1a2e' }}>Connecting to PayFast</h2>
          <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>Secure payment processing...</p>
          <div className="flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" style={{ color: '#10B981' }} />
            <span className="text-[10px] font-bold" style={{ color: '#10B981' }}>SSL Encrypted</span>
          </div>
        </div>
        <form id="payfast-form" action={PAYFAST_URL} method="POST" className="hidden">
          {formFields.map(field => <input key={field.name} type="hidden" name={field.name} value={field.value} />)}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5" style={{ color: '#1a1a2e' }} />
        </button>
        <h1 className="text-lg font-bold flex-1" style={{ color: '#1a1a2e', fontFamily: "'Space Grotesk', sans-serif" }}>Pay Deposit</h1>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: '#ECFDF5' }}>
          <Lock className="w-3 h-3" style={{ color: '#10B981' }} />
          <span className="text-[10px] font-bold" style={{ color: '#10B981' }}>Secure</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Vendor Info */}
        <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)' }}>
              {vendor?.avatar || vendor?.businessName?.charAt(0) || 'V'}
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#1a1a2e' }}>{vendor?.businessName || 'Vendor'}</h2>
              <p className="text-sm font-semibold" style={{ color: '#2BBCA8' }}>{eventType}</p>
              <p className="text-xs" style={{ color: '#94A3B8' }}>{vendor?.location}</p>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: '#1a1a2e' }}>Payment Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#64748B' }}>Total Booking Value</span>
              <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>R{amount.toLocaleString()}</span>
            </div>
            <div className="h-px" style={{ background: '#E2E8F0' }} />
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#64748B' }}>Deposit (50%)</span>
              <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>R{deposit.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: '#64748B' }}>Platform Fee (5%)</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#FFFBEB', color: '#D97706' }}>First booking free</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>R{platformFee.toLocaleString()}</span>
            </div>
            <div className="h-px" style={{ background: '#E2E8F0' }} />
            <div className="flex items-center justify-between">
              <span className="text-base font-bold" style={{ color: '#1a1a2e' }}>You Pay Now</span>
              <span className="text-xl font-bold" style={{ color: '#2BBCA8' }}>R{totalToPay.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          {[
            { icon: Shield, title: 'Deposit Protected', desc: 'Your deposit is held securely until the event is completed', color: '#10B981', bg: '#ECFDF5' },
            { icon: CreditCard, title: 'Multiple Payment Methods', desc: 'Card, Instant EFT, SnapScan, Zapper accepted', color: '#3B82F6', bg: '#EFF6FF' },
            { icon: CheckCircle, title: 'Verified Vendor', desc: 'This vendor has passed SimpliPlan verification', color: '#8B5CF6', bg: '#F5F3FF' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: badge.bg }}>
                <badge.icon className="w-5 h-5" style={{ color: badge.color }} />
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#1a1a2e' }}>{badge.title}</p>
                <p className="text-[10px]" style={{ color: '#94A3B8' }}>{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What Happens Next */}
        <div className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#1a1a2e' }}>What happens next?</h3>
          <ol className="space-y-2.5 text-xs" style={{ color: '#64748B' }}>
            {[
              'Your deposit is held securely by SimpliPlan',
              'Vendor is notified and confirms your booking',
              'After your event, the deposit is released to the vendor',
              'You pay the balance directly to the vendor',
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold" style={{ color: '#2BBCA8' }}>{i + 1}.</span>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
          <p className="text-[10px]" style={{ color: '#B45309' }}>
            Only pay deposits through SimpliPlan. Never send cash or EFT directly before your event unless it's the final balance after the deposit was paid here.
          </p>
        </div>

        {/* Pay Button */}
        <button onClick={handleProceed}
          className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white', boxShadow: '0 4px 20px -5px rgba(43,188,168,0.4)' }}>
          <Lock className="w-4 h-4" /> Pay R{totalToPay.toLocaleString()} Securely
        </button>

        <p className="text-[10px] text-center" style={{ color: '#CBD5E1' }}>
          Powered by PayFast, South Africa's trusted payment gateway. SSL encrypted.
        </p>
      </div>
    </div>
  );
}
