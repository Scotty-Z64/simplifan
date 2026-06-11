import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePlans } from '@/context/PlansContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PreciseLocationInput } from '@/components/PreciseLocationInput';
import { ShareEvent } from '@/components/ShareEvent';
import { BudgetSection } from '@/components/BudgetSection';
import { ContributionTracker } from '@/components/ContributionTracker';
import { TaskManager } from '@/components/TaskManager';
import { VendorDirectory } from '@/components/VendorDirectory';
import { RSVPManager } from '@/components/RSVPManager';
import { PriceEstimator } from '@/components/PriceEstimator';
import { DigitalInvitation } from '@/components/DigitalInvitation';
import { EventChecklist } from '@/components/EventChecklist';
import { PaymentTracker } from '@/components/PaymentTracker';
import { SeatingPlanner } from '@/components/SeatingPlanner';
import { ThankYouNotes } from '@/components/ThankYouNotes';
import { AIAssistant } from '@/components/AIAssistant';
import { AIBudgetOptimizer } from '@/components/AIBudgetOptimizer';
import { AITimeline } from '@/components/AITimeline';
import { AISmartTips } from '@/components/AISmartTips';
import { AIInvitationGenerator } from '@/components/AIInvitationGenerator';
import { getCultureEventName } from '@/translations/cultureEvents';
import { WhatsAppBot } from '@/components/WhatsAppBot';
import { QRCodeCheckIn } from '@/components/QRCodeCheckIn';
import { SpeechGenerator } from '@/components/SpeechGenerator';
import { TaskAssignment } from '@/components/TaskAssignment';
import { FamilyChat } from '@/components/FamilyChat';
import { VendorMarketplace } from '@/components/VendorMarketplace';
import { DigitalRegistry } from '@/components/DigitalRegistry';
import { CateringCalculator } from '@/components/CateringCalculator';
import { WeatherForecast } from '@/components/WeatherForecast';
import { EmergencyContacts } from '@/components/EmergencyContacts';
import { StokvelManager } from '@/components/StokvelManager';
import { ReferralSystem } from '@/components/ReferralSystem';
import {
  Save,
  Wallet,
  Calendar,
  CheckCircle,
  CheckSquare,
  TrendingUp,
  Users,
  Store,
  ClipboardList,
  DollarSign,
  Clock,
  MapPin,
  Mail,
  ListChecks,
  CreditCard,
  Armchair,
  Heart,
  Sparkles,
  MessageCircle,
  QrCode,
  Mic,
  UserPlus,
  ShoppingBag,
  Gift,
  Utensils,
  Cloud,
  Shield,
  PiggyBank,
  Share2,
} from 'lucide-react';

const quotes = [
  '"Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill"',
  '"The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"',
  '"It always seems impossible until it is done. - Nelson Mandela"',
  '"The best way to predict the future is to create it. - Peter Drucker"',
];

type TabType = 'budget' | 'contributions' | 'tasks' | 'vendors' | 'guests' | 'estimator' | 'invitation' | 'checklist' | 'payments' | 'seating' | 'thankyou' | 'ai' | 'whatsapp' | 'qrcheckin' | 'speech' | 'taskassignment' | 'marketplace' | 'registry' | 'catering' | 'weather' | 'emergency' | 'stokvel' | 'referral';

export function Planner() {
  const { planId } = useParams<{ planId: string }>();
  const { isAuthenticated, user } = useAuth();
  const { t, language } = useLanguage();
  const {
    currentPlan,
    savePlan,
    loadPlan,
    updatePlan,
    addItem,
    updateItem,
    deleteItem,
    toggleItemComplete,
    toggleCategoryExpand,
    calculateTotal,
    calculateContributions,
    finalizePlan,
  } = usePlans();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('budget');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('planner.greeting') : hour < 17 ? t('planner.greeting.afternoon') : t('planner.greeting.evening');
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    if (planId === 'new') {
      // Will be handled by event type selection
    } else if (planId && !currentPlan) {
      const plan = loadPlan(planId);
      if (!plan) {
        navigate('/');
      }
    }
  }, [planId, currentPlan, loadPlan, navigate]);

  const handleSave = () => {
    if (currentPlan) {
      if (isAuthenticated && user) {
        savePlan({ ...currentPlan, userId: user.id });
      } else {
        const guestPlans = JSON.parse(localStorage.getItem('simpliflow_guest_plans') || '[]');
        const existingIndex = guestPlans.findIndex((p: any) => p.id === currentPlan.id);
        if (existingIndex >= 0) {
          guestPlans[existingIndex] = currentPlan;
        } else {
          guestPlans.push(currentPlan);
        }
        localStorage.setItem('simpliflow_guest_plans', JSON.stringify(guestPlans));
      }
      alert('Plan saved successfully!');
    }
  };

  const handleFinalize = () => {
    if (confirm('Are you sure you want to finalize this plan? You won\'t be able to make further changes.')) {
      finalizePlan(currentPlan!.id);
    }
  };

  const getDaysLeft = () => {
    if (!currentPlan?.eventDate) return 'N/A';
    const eventDate = new Date(currentPlan.eventDate);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getCompletedTasks = () => {
    if (!currentPlan) return { completed: 0, total: 0 };
    let completed = 0;
    let total = 0;
    currentPlan.categories.forEach((cat) => {
      cat.items.forEach((item) => {
        total++;
        if (item.completed) completed++;
      });
    });
    return { completed, total };
  };

  if (!currentPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading plan...</p>
        </div>
      </div>
    );
  }

  const tasks = getCompletedTasks();
  const totalContributed = calculateContributions(currentPlan);
  const totalBudget = calculateTotal(currentPlan);
  const remaining = totalBudget - totalContributed;

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'budget', label: t('tab.budget'), icon: Wallet },
    { id: 'ai', label: 'AI', icon: Sparkles },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'contributions', label: t('tab.contributions'), icon: TrendingUp },
    { id: 'stokvel', label: 'Stokvel', icon: PiggyBank },
    { id: 'tasks', label: t('tab.tasks'), icon: ClipboardList },
    { id: 'taskassignment', label: 'Assign', icon: UserPlus },
    { id: 'vendors', label: t('tab.vendors'), icon: Store },
    { id: 'guests', label: t('tab.guests'), icon: Users },
    { id: 'estimator', label: t('tab.priceGuide'), icon: DollarSign },
    { id: 'catering', label: 'Catering', icon: Utensils },
    { id: 'registry', label: 'Registry', icon: Gift },
    { id: 'invitation', label: t('tab.invite'), icon: Mail },
    { id: 'checklist', label: t('tab.checklist'), icon: ListChecks },
    { id: 'payments', label: t('tab.payments'), icon: CreditCard },
    { id: 'seating', label: t('tab.seating'), icon: Armchair },
    { id: 'thankyou', label: t('tab.thankYou'), icon: Heart },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'qrcheckin', label: 'QR Check', icon: QrCode },
    { id: 'speech', label: 'Speeches', icon: Mic },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'emergency', label: 'SOS', icon: Shield },
    { id: 'referral', label: 'Refer & Earn', icon: Share2 },
  ];

  return (
    <div className="min-h-screen py-6 px-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
            {greeting}, {isAuthenticated ? user?.knownAs : 'there'}!
          </h1>
          <p className="text-gray-400 mb-2">Let's get your planning done.</p>
          <p className="text-sm text-gray-500 italic">{quote}</p>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Event Details */}
          <Card className="glass border-gray-800/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  {getCultureEventName(language, currentPlan.eventType)} {t('planner.details')}
                </h2>
                {!isAuthenticated && (
                  <Button
                    onClick={() => navigate('/register')}
                    className="bg-teal-500 hover:bg-teal-600 text-white text-xs"
                  >
                    {t('planner.signUpToSave')}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {/* Plan Name & Share Row */}
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label className="text-sm text-gray-400">{t('planner.planName')}</Label>
                    <Input
                      value={currentPlan.name}
                      onChange={(e) => updatePlan({ ...currentPlan, name: e.target.value })}
                      placeholder={t('planner.planName.placeholder')}
                      className="mt-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-600 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                  <ShareEvent planId={currentPlan.id} />
                </div>

                {/* Precise Location */}
                <div>
                  <Label className="text-sm text-gray-400 mb-1 block">{t('planner.location')}</Label>
                  <PreciseLocationInput
                    value={currentPlan.preciseLocation}
                    onChange={(preciseLocation) => updatePlan({ ...currentPlan, preciseLocation })}
                  />
                </div>

                {/* Date, Time & Guests Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm text-gray-400">{t('planner.eventDate')}</Label>
                    <Input
                      type="date"
                      value={currentPlan.eventDate || ''}
                      onChange={(e) => updatePlan({ ...currentPlan, eventDate: e.target.value })}
                      className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-400">{t('planner.eventTime')}</Label>
                    <div className="relative mt-1">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="time"
                        value={currentPlan.eventTime || ''}
                        onChange={(e) => updatePlan({ ...currentPlan, eventTime: e.target.value })}
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white focus:border-teal-500 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-400">{t('planner.guests')}</Label>
                    <Input
                      type="number"
                      value={currentPlan.numberOfGuests || ''}
                      onChange={(e) => updatePlan({ ...currentPlan, numberOfGuests: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="mt-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-600 focus:border-teal-500 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard */}
          <Card className="glass border-gray-800/50">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">{t('planner.dashboard')}</h2>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center">
                    <Wallet className="w-5 h-5 text-teal-400 mr-3" />
                    <span className="text-sm font-medium text-gray-300">{t('planner.grandTotal')}</span>
                  </div>
                  <span className="text-lg font-bold text-white">
                    R {totalBudget.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mr-3" />
                    <span className="text-sm font-medium text-emerald-300">{t('planner.contributions')}</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-400">
                    R {totalContributed.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-amber-400 mr-3" />
                    <span className="text-sm font-medium text-amber-300">{t('planner.remaining')}</span>
                  </div>
                  <span className="text-lg font-bold text-amber-400">
                    R {remaining.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-teal-400 mr-3" />
                    <span className="text-sm font-medium text-gray-300">{t('planner.daysLeft')}</span>
                  </div>
                  <span className="text-lg font-bold text-white">{getDaysLeft()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center">
                    <CheckSquare className="w-5 h-5 text-teal-400 mr-3" />
                    <span className="text-sm font-medium text-gray-300">{t('planner.mustDos')}</span>
                  </div>
                  <span className="text-lg font-bold text-white">
                    {tasks.completed} / {tasks.total}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-teal-400 mr-3" />
                    <span className="text-sm font-medium text-gray-300">{t('planner.guestsCount')}</span>
                  </div>
                  <span className="text-lg font-bold text-white">
                    {currentPlan.guests.filter(g => g.status === 'attending').length} / {currentPlan.guests.length}
                  </span>
                </div>

                {/* Location Display */}
                {(currentPlan.preciseLocation?.venueName || currentPlan.location) && (
                  <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-medium text-teal-400">{t('planner.locationLabel')}</span>
                    </div>
                    <p className="text-sm text-white font-medium">
                      {currentPlan.preciseLocation?.venueName || currentPlan.location}
                    </p>
                    {currentPlan.preciseLocation?.fullAddress && (
                      <p className="text-xs text-gray-400">{currentPlan.preciseLocation.fullAddress}</p>
                    )}
                  </div>
                )}

                {/* Event Time Display */}
                {currentPlan.eventTime && (
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-teal-400 mr-3" />
                      <span className="text-sm font-medium text-gray-300">{t('planner.eventTimeLabel')}</span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {new Date(`2000-01-01T${currentPlan.eventTime}`).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mb-4 space-x-3">
          {!currentPlan.finalized && (
            <Button
              onClick={handleFinalize}
              variant="outline"
              className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {t('planner.finalize')}
            </Button>
          )}
          <Button
            onClick={handleSave}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {t('planner.savePlan')}
          </Button>
        </div>

        {/* Feature Tabs */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <Card className="glass border-gray-800/50">
          <CardContent className="p-4 md:p-6">
            {activeTab === 'budget' && (
              <BudgetSection
                plan={currentPlan}
                onAddItem={(categoryId, item) => addItem(currentPlan.id, categoryId, item)}
                onUpdateItem={(categoryId, itemId, updates) => updateItem(currentPlan.id, categoryId, itemId, updates)}
                onDeleteItem={(categoryId, itemId) => deleteItem(currentPlan.id, categoryId, itemId)}
                onToggleComplete={(categoryId, itemId) => toggleItemComplete(currentPlan.id, categoryId, itemId)}
                onToggleExpand={(categoryId) => toggleCategoryExpand(currentPlan.id, categoryId)}
                onAddFromVendor={(categoryId, name, price) => addItem(currentPlan.id, categoryId, { name, quantity: 1, price, completed: false })}
              />
            )}

            {activeTab === 'contributions' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Contribution Tracker</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Track family contributions and stokvel payments. See how much has been raised vs your total budget.
                </p>
                <ContributionTracker planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Task Manager</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Manage your event tasks and track progress. Stay organized with deadlines and priorities.
                </p>
                <TaskManager planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'vendors' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Vendor Directory</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Browse South African vendors and request quotes. Compare prices and services.
                </p>
                <VendorDirectory planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'guests' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Guest List & RSVP</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Manage your guest list, track RSVPs, and record dietary requirements.
                </p>
                <RSVPManager planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'estimator' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">SA Price Guide</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Realistic price estimates based on South African market data by province.
                </p>
                <PriceEstimator planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'invitation' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Digital Invitation</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Create beautiful digital invitations to share via WhatsApp, email, or download.
                </p>
                <DigitalInvitation planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'checklist' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Event Checklist & Timeline</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Pre-built checklist based on your event type. Track what needs to be done and when.
                </p>
                <EventChecklist planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Vendor Payment Tracker</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Track payments to vendors. Know exactly what you owe and what has been paid.
                </p>
                <PaymentTracker planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'seating' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Seating Planner</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Plan your table layout and assign guests to tables.
                </p>
                <SeatingPlanner planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'thankyou' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Thank You Notes</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Send personalized thank you messages to guests and contributors after your event.
                </p>
                <ThankYouNotes planId={currentPlan.id} />
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">AI Assistant</h3>
                  <p className="text-sm text-gray-400 mb-4">Your intelligent event planning companion</p>
                  <AIAssistant plan={currentPlan} culture={language} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Smart Tips</h3>
                  <p className="text-sm text-gray-400 mb-4">Personalized recommendations for your event</p>
                  <AISmartTips plan={currentPlan} culture={language} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Budget Optimizer</h3>
                  <p className="text-sm text-gray-400 mb-4">AI-powered budget allocation recommendations</p>
                  <AIBudgetOptimizer plan={currentPlan} culture={language} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Event Timeline</h3>
                  <p className="text-sm text-gray-400 mb-4">Smart milestone planning with reminders</p>
                  <AITimeline plan={currentPlan} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Invitation Generator</h3>
                  <p className="text-sm text-gray-400 mb-4">Auto-generated invitations in your cultural style</p>
                  <AIInvitationGenerator plan={currentPlan} culture={language} />
                </div>
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">SimpliPlan WhatsApp Bot</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Connect WhatsApp to receive automatic event updates, set reminders, and share quick updates with family.
                </p>
                <WhatsAppBot plan={currentPlan} />
              </div>
            )}

            {activeTab === 'qrcheckin' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">QR Code Check-In System</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Generate a QR code for your event. Guests scan it at the door for instant digital check-in.
                </p>
                <QRCodeCheckIn plan={currentPlan} />
              </div>
            )}

            {activeTab === 'speech' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Speech & Script Generator</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Generate MC scripts, father speeches, and thank-you notes in English, Zulu, or Xhosa style.
                </p>
                <SpeechGenerator plan={currentPlan} culture={language} />
              </div>
            )}

            {activeTab === 'taskassignment' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Task Assignment</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Assign specific tasks to family members. Everyone knows exactly what they are responsible for.
                </p>
                <TaskAssignment plan={currentPlan} />
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Vendor Marketplace</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Browse, compare and book verified South African vendors. Filter by category, province, and price range.
                </p>
                <VendorMarketplace />
              </div>
            )}

            {activeTab === 'registry' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Digital Gift Registry</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Create a gift wishlist for weddings, baby showers, and celebrations. Share with guests so they know exactly what to bring.
                </p>
                <DigitalRegistry />
              </div>
            )}

            {activeTab === 'catering' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Catering Calculator</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Calculate exact food and drink quantities for your event. Choose from formal, braai, traditional, or casual styles.
                </p>
                <CateringCalculator />
              </div>
            )}

            {activeTab === 'weather' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Event Weather Forecast</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Check the 7-day weather forecast for your event. Plan around rain, heat, and wind for outdoor events.
                </p>
                <WeatherForecast />
              </div>
            )}

            {activeTab === 'emergency' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Emergency Contacts</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Quick-access emergency numbers for event day. Police, ambulance, fire department, and private medical services.
                </p>
                <EmergencyContacts />
              </div>
            )}

            {activeTab === 'stokvel' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Stokvel Manager</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Manage savings groups, track member contributions, schedule rotation payouts, and build your event fund.
                </p>
                <StokvelManager />
              </div>
            )}

            {activeTab === 'referral' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Refer & Earn</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Invite friends to SimpliPlan and earn credits. Unlock premium rewards as more people join.
                </p>
                <ReferralSystem />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Family Chat Widget */}
      <FamilyChat plan={currentPlan} />
    </div>
  );
}
