import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PlansProvider } from '@/context/PlansContext';
import { VendorAuthProvider } from '@/context/VendorAuthContext';
import { UnifiedProvider } from '@/context/UnifiedContext';
import { AdminProvider } from '@/context/AdminContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Layout } from '@/components/Layout';

// Core pages - loaded eagerly (lightweight)
import { PortalSelector } from '@/pages/PortalSelector';
import './App.css';

// Lazy load all heavy pages (named exports wrapped to default)
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const Pricing = lazy(() => import('@/pages/Pricing').then(m => ({ default: m.Pricing })));
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('@/pages/Register').then(m => ({ default: m.Register })));
const MyPlans = lazy(() => import('@/pages/MyPlans').then(m => ({ default: m.MyPlans })));
const Planner = lazy(() => import('@/pages/Planner').then(m => ({ default: m.Planner })));
const Terms = lazy(() => import('@/pages/Terms').then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import('@/pages/Privacy').then(m => ({ default: m.Privacy })));
const About = lazy(() => import('@/pages/About').then(m => ({ default: m.About })));
const VendorOnboarding = lazy(() => import('@/pages/VendorOnboarding').then(m => ({ default: m.VendorOnboarding })));
const ConciergePage = lazy(() => import('@/pages/ConciergePage').then(m => ({ default: m.ConciergePage })));
const BrowseVendors = lazy(() => import('@/pages/BrowseVendors').then(m => ({ default: m.BrowseVendors })));
const QuickQuote = lazy(() => import('@/pages/QuickQuote').then(m => ({ default: m.QuickQuote })));
const BookingConfirm = lazy(() => import('@/pages/BookingConfirm').then(m => ({ default: m.BookingConfirm })));
const SubmitReview = lazy(() => import('@/pages/SubmitReview').then(m => ({ default: m.SubmitReview })));
const PaymentCheckout = lazy(() => import('@/pages/PaymentCheckout').then(m => ({ default: m.PaymentCheckout })));
const PaymentSuccess = lazy(() => import('@/pages/PaymentSuccess').then(m => ({ default: m.PaymentSuccess })));
const PaymentCancel = lazy(() => import('@/pages/PaymentCancel').then(m => ({ default: m.PaymentCancel })));

const ClientHome = lazy(() => import('@/pages/client/ClientHome').then(m => ({ default: m.ClientHome })));
const ClientWizard = lazy(() => import('@/pages/client/ClientWizard').then(m => ({ default: m.ClientWizard })));
const ClientTrack = lazy(() => import('@/pages/client/ClientTrack').then(m => ({ default: m.ClientTrack })));
const ClientProfile = lazy(() => import('@/pages/client/ClientProfile').then(m => ({ default: m.ClientProfile })));
const GuestListManager = lazy(() => import('@/pages/client/GuestListManager').then(m => ({ default: m.GuestListManager })));
const BudgetTracker = lazy(() => import('@/pages/client/BudgetTracker').then(m => ({ default: m.BudgetTracker })));
const VendorReviewsPage = lazy(() => import('@/pages/client/VendorReviewsPage').then(m => ({ default: m.VendorReviewsPage })));
const DigitalInvites = lazy(() => import('@/pages/client/DigitalInvites').then(m => ({ default: m.DigitalInvites })));
const CulturalGuide = lazy(() => import('@/pages/client/CulturalGuide').then(m => ({ default: m.CulturalGuide })));
const ConversationalPlanner = lazy(() => import('@/pages/client/ConversationalPlanner').then(m => ({ default: m.ConversationalPlanner })));
const ClientChat = lazy(() => import('@/pages/client/ClientChat').then(m => ({ default: m.ClientChat })));
const MyEvents = lazy(() => import('@/pages/client/MyEvents').then(m => ({ default: m.MyEvents })));

const VendorLogin = lazy(() => import('@/pages/vendor/VendorLogin').then(m => ({ default: m.VendorLogin })));
const VendorSignup = lazy(() => import('@/pages/vendor/VendorSignup').then(m => ({ default: m.VendorSignup })));
const VendorHome = lazy(() => import('@/pages/vendor/VendorHome').then(m => ({ default: m.VendorHome })));
const VendorQuotes = lazy(() => import('@/pages/vendor/VendorQuotes').then(m => ({ default: m.VendorQuotes })));
const VendorChat = lazy(() => import('@/pages/vendor/VendorChat').then(m => ({ default: m.VendorChat })));
const VendorEarnings = lazy(() => import('@/pages/vendor/VendorEarnings').then(m => ({ default: m.VendorEarnings })));
const VendorProfile = lazy(() => import('@/pages/vendor/VendorProfile').then(m => ({ default: m.VendorProfile })));
const VendorInventory = lazy(() => import('@/pages/vendor/VendorInventory').then(m => ({ default: m.VendorInventory })));
const VendorAnalytics = lazy(() => import('@/pages/vendor/VendorAnalytics').then(m => ({ default: m.VendorAnalytics })));
const VendorLeads = lazy(() => import('@/pages/vendor/VendorLeads').then(m => ({ default: m.VendorLeads })));

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminEventsMap = lazy(() => import('@/pages/admin/AdminEventsMap').then(m => ({ default: m.AdminEventsMap })));
const AdminVendors = lazy(() => import('@/pages/admin/AdminVendors').then(m => ({ default: m.AdminVendors })));
const AdminClients = lazy(() => import('@/pages/admin/AdminClients').then(m => ({ default: m.AdminClients })));
const AdminMarketing = lazy(() => import('@/pages/admin/AdminMarketing').then(m => ({ default: m.AdminMarketing })));
const AdminFinance = lazy(() => import('@/pages/admin/AdminFinance').then(m => ({ default: m.AdminFinance })));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminHealth = lazy(() => import('@/pages/admin/AdminHealth').then(m => ({ default: m.AdminHealth })));
const AdminConversions = lazy(() => import('@/pages/admin/AdminConversions').then(m => ({ default: m.AdminConversions })));

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
            <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:12}}><div className="spinner" style={{width:32,height:32,border:'3px solid #E2E8F0',borderTopColor:'#2BBCA8',borderRadius:'50%',animation:'spin 1s linear infinite'}}></div></div>}>
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
            </Suspense>
          </HashRouter>
        </AdminProvider>
      </UnifiedProvider>
    </LanguageProvider>
  );
}

export default App;
