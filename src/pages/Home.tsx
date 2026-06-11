import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { usePlans } from '@/context/PlansContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles,
  Users,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  HandCoins,
  Crown,
  Store,
} from 'lucide-react';
import type { EventType } from '@/types';
import { getCultureEvents } from '@/translations/cultureEvents';
import type { Language } from '@/types/language';

export function Home() {
  const { t, language } = useLanguage();
  const { createPlan } = usePlans();
  const navigate = useNavigate();

  // Get culture-specific events
  const cultureEvents = getCultureEvents(language as Language);

  const handleEventClick = (eventType: EventType) => {
    const plan = createPlan(eventType);
    navigate(`/planner/${plan.id}`);
  };

  const stats = [
    { value: '50K+', icon: Crown, labelKey: 'stats.events' },
    { value: '25K+', icon: Users, labelKey: 'stats.users' },
    { value: '500+', icon: TrendingUp, labelKey: 'stats.vendors' },
    { value: 'R10M+', icon: Zap, labelKey: 'stats.saved' },
  ];

  const features = [
    { icon: Shield, titleKey: 'feature.budget', descKey: 'feature.budget.desc' },
    { icon: TrendingUp, titleKey: 'feature.contributions', descKey: 'feature.contributions.desc' },
    { icon: Users, titleKey: 'feature.vendors', descKey: 'feature.vendors.desc' },
    { icon: Zap, titleKey: 'feature.invitations', descKey: 'feature.invitations.desc' },
  ];

  // Culture display label
  const cultureLabels: Record<string, string> = {
    en: 'English (SA General)',
    zu: 'Zulu Heritage',
    xh: 'Xhosa Heritage',
  };

  return (
    <div className="min-h-screen animated-gradient">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto text-center">
          <Link to="/concierge" className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-teal-400 mb-8 animate-float hover:border-teal-500/30 transition-all">
            <Sparkles className="w-4 h-4" />
            AI-Powered Event Planning for South Africa
          </Link>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Plan Your Perfect</span>
            <br />
            <span className="gradient-text glow-text">South African Event</span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Our AI concierge plans your entire event - finds vendors, gets quotes, and fits everything within your budget
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/concierge">
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-8 py-6 text-lg rounded-xl glow">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Plan My Event
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 px-8 py-6 text-lg rounded-xl">
                Pricing
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">Tell us your budget and guests - our AI finds vendors and fits everything in</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="glass border-0">
              <CardContent className="p-6 text-center">
                <stat.icon className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-400">{t(stat.labelKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Vendor CTA Banner */}
      <section className="px-4 -mt-2 mb-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/vendor-join" className="block">
            <div className="glass rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                      Are you an event vendor? Join our marketplace
                    </p>
                    <p className="text-xs text-gray-500">
                      Reach 25,000+ event planners. Zero commission. Get verified.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Culture Banner */}
      <section className="px-4 -mt-2 mb-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-xl p-3 border border-teal-500/20 flex items-center justify-center gap-3">
            <HandCoins className="w-4 h-4 text-teal-400" />
            <p className="text-sm text-gray-300">
              Showing events for <span className="text-teal-400 font-semibold">{cultureLabels[language] || 'English (SA General)'}</span>
            </p>
            <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full">
              {cultureEvents.filter(e => e.isTraditional).length} Traditional
            </span>
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Event
            </h2>
            <p className="text-gray-400">
              {language === 'en' && 'Select the type of event you want to plan'}
              {language === 'zu' && 'Khetha uhlobo lwemcimbi ofuna ukululungiselela'}
              {language === 'xh' && 'Khetha uhlobo lomcimbi ofuna ukululungiselela'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {cultureEvents.map((event) => {
              const EventIcon = event.icon;
              return (
                <button
                  key={event.type}
                  onClick={() => handleEventClick(event.type)}
                  className="group relative overflow-hidden rounded-xl glass card-hover p-6 text-left transition-all duration-300 hover:scale-105"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.color} p-2.5`}>
                        <EventIcon className="w-full h-full text-white" />
                      </div>
                      {event.isTraditional && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          Traditional
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {event.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose SimpliPlan
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to plan the perfect South African event, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass border-0 card-hover">
                <CardContent className="p-6">
                  <feature.icon className="w-10 h-10 text-teal-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-400">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-8 md:p-12 border border-teal-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let AI Plan Your Next Event
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Just tell us your budget and guest count. Our AI connects to vendors, sends quotes, and delivers a complete package - all within budget.
            </p>
            <Link to="/concierge">
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-10 py-6 text-lg rounded-xl glow">
                <Sparkles className="w-5 h-5 mr-2" />
                Start AI Planning
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
