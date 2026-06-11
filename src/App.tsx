import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PlansProvider } from '@/context/PlansContext';
import { VendorAuthProvider } from '@/context/VendorAuthContext';
import { UnifiedProvider } from '@/context/UnifiedContext';
import { AdminProvider } from '@/context/AdminContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Pricing } from '@/pages/Pricing';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { MyPlans } from '@/pages/MyPlans';
import { Planner } from '@/pages/Planner';
import { Terms } from '@/pages/Terms';
import { Privacy } from '@/pages/Privacy';
import { About } from '@/pages/About';
import { VendorOnboarding } from '@/pages/VendorOnboarding';
import { ConciergePage } from '@/pages/ConciergePage';
import { BrowseVendors } from '@/pages/BrowseVendors';
import { QuickQuote } from '@/pages/QuickQuote';
import { BookingConfirm } from '@/pages/BookingConfirm';
import { SubmitReview } from '@/pages/SubmitReview';
import { PaymentCheckout } from '@/pages/PaymentCheckout';
import { PaymentSuccess } from '@/pages/PaymentSuccess';
import { PaymentCancel } from '@/pages/PaymentCancel';

import { PortalSelector } from '@/pages/PortalSelector';

import { ClientHome } from '@/pages/client/ClientHome';
import { ClientWizard } from '@/pages/client/ClientWizard';
import { ClientTrack } from '@/pages/client/ClientTrack';
import { ClientProfile } from '@/pages/client/ClientProfile';
import { GuestListManager } from '@/pages/client/GuestListManager';
import { BudgetTracker } from '@/pages/client/BudgetTracker';
import { VendorReviewsPage } from '@/pages/client/VendorReviewsPage';
import { DigitalInvites } from '@/pages/client/DigitalInvites';
import { CulturalGuide } from '@/pages/client/CulturalGuide';
import { ConversationalPlanner } from '@/pages/client/ConversationalPlanner';
import { ClientChat } from '@/pages/client/ClientChat';

import { VendorLogin } from '@/pages/vendor/VendorLogin';
import { VendorSignup } from '@/pages/vendor/VendorSignup';
import { VendorHome } from '@/pages/vendor/VendorHome';
import { VendorQuotes } from '@/pages/vendor/VendorQuotes';
import { VendorChat } from '@/pages/vendor/VendorChat';
import { VendorEarnings } from '@/pages/vendor/VendorEarnings';
import { VendorProfile } from '@/pages/vendor/VendorProfile';
import { VendorInventory } from '@/pages/vendor/VendorInventory';
import { VendorAnalytics } from '@/pages/vendor/VendorAnalytics';

import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminEventsMap } from '@/pages/admin/AdminEventsMap';
import { AdminVendors } from '@/pages/admin/AdminVendors';
import { AdminClients } from '@/pages/admin/AdminClients';
import { AdminMarketing } from '@/pages/admin/AdminMarketing';
import { AdminFinance } from '@/pages/admin/AdminFinance';
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics';
import { AdminHealth } from '@/pages/admin/AdminHealth';
import { AdminConversions } from '@/pages/admin/AdminConversions';
import { VendorLeads } from '@/pages/vendor/VendorLeads';
import { MyEvents } from '@/pages/client/MyEvents';

import './App.css';

function LegacyLayout() {
  return (
    <AuthProvider>
      <PlansProvider>
        <VendorAuthProvider>
          <Layout />
        </VendorAuthProvider>
      </PlansProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <UnifiedProvider>
        <AdminProvider>
          <HashRouter>
            <Routes>
              {/* Public site */}
              <Route path="/" element={<LegacyLayout />}>
                <Route index element={<PortalSelector />} />
                <Route path="home" element={<Home />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="my-plans" element={<MyPlans />} />
                <Route path="planner/:planId" element={<Planner />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="about" element={<About />} />
                <Route path="vendor-join" element={<VendorOnboarding />} />
                <Route path="concierge" element={<ConciergePage />} />
                <Route path="browse" element={<BrowseVendors />} />
                <Route path="quick-quote" element={<QuickQuote />} />
                <Route path="booking-confirm" element={<BookingConfirm />} />
                <Route path="submit-review" element={<SubmitReview />} />
                <Route path="payment-checkout" element={<PaymentCheckout />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="payment-cancel" element={<PaymentCancel />} />
              </Route>

              {/* Client Portal */}
              <Route path="/client" element={<ClientHome />} />
              <Route path="/client/wizard" element={<ClientWizard />} />
              <Route path="/client/track/:eventId" element={<ClientTrack />} />
              <Route path="/client/profile" element={<ClientProfile />} />
              <Route path="/client/guests/:eventId" element={<GuestListManager />} />
              <Route path="/client/budget/:eventId" element={<BudgetTracker />} />
              <Route path="/client/reviews/:vendorId" element={<VendorReviewsPage />} />
              <Route path="/client/invites/:eventId" element={<DigitalInvites />} />
              <Route path="/client/cultural-guide" element={<CulturalGuide />} />
              <Route path="/client/planner" element={<ConversationalPlanner />} />
              <Route path="/client/chat" element={<ClientChat />} />

              {/* Vendor Portal */}
              <Route path="/vendor-login" element={<VendorLogin />} />
              <Route path="/vendor-signup" element={<VendorSignup />} />
              <Route path="/vendor" element={<VendorHome />} />
              <Route path="/vendor/quotes" element={<VendorQuotes />} />
              <Route path="/vendor/chat" element={<VendorChat />} />
              <Route path="/vendor/earnings" element={<VendorEarnings />} />
              <Route path="/vendor/leads" element={<VendorLeads />} />
              <Route path="/vendor/profile" element={<VendorProfile />} />
              <Route path="/vendor/inventory" element={<VendorInventory />} />
              <Route path="/vendor/analytics" element={<VendorAnalytics />} />
              <Route path="/my-events" element={<MyEvents />} />

              {/* Admin Command Center */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="map" element={<AdminEventsMap />} />
                <Route path="vendors" element={<AdminVendors />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="marketing" element={<AdminMarketing />} />
                <Route path="finance" element={<AdminFinance />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="health" element={<AdminHealth />} />
                <Route path="conversions" element={<AdminConversions />} />
              </Route>
            </Routes>
          </HashRouter>
        </AdminProvider>
      </UnifiedProvider>
    </LanguageProvider>
  );
}

export default App;
