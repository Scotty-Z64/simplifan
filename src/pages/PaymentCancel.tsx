import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowRight, MessageSquare, Phone } from 'lucide-react';

export function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking') || '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F1F5F9' }}>
      <div className="rounded-2xl p-8 max-w-md w-full text-center" style={{ background: 'white', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#FFFBEB' }}>
          <XCircle className="w-10 h-10" style={{ color: '#F59E0B' }} />
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a1a2e' }}>Payment Cancelled</h1>
        <p className="text-sm mb-6" style={{ color: '#64748B' }}>
          No worries. Your booking hasn't been affected. You can try again whenever you're ready.
        </p>

        <div className="space-y-2 mb-6">
          <button onClick={() => navigate(`/payment-checkout?booking=${bookingId}&amount=15000&vendor=v1&event=Wedding`)}
            className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2BBCA8, #1E9B8A)', color: 'white', boxShadow: '0 4px 12px -3px rgba(43,188,168,0.3)' }}>
            <ArrowRight className="w-4 h-4" /> Try Again
          </button>
          <button onClick={() => navigate('/browse')}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all" style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' }}>
            Browse Other Vendors
          </button>
        </div>

        <div className="rounded-xl p-4 text-left" style={{ background: '#F8FAFC' }}>
          <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>Need help? Contact us:</p>
          <div className="flex gap-2">
            <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
              style={{ background: '#ECFDF5', color: '#059669' }}>
              <MessageSquare className="w-3 h-3" /> WhatsApp
            </a>
            <a href="tel:+27000000000"
              className="flex-1 py-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1"
              style={{ background: '#EFF6FF', color: '#3B82F6' }}>
              <Phone className="w-3 h-3" /> Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
