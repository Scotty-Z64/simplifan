import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePlans } from '@/context/PlansContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ArrowRight, Calendar, Wallet, MapPin, Plus, Sparkles } from 'lucide-react';
import { getCultureEventName } from '@/translations/cultureEvents';

export function MyPlans() {
  const { isAuthenticated, user } = useAuth();
  const { language } = useLanguage();
  const { plans, deletePlan, createPlan } = usePlans();
  const navigate = useNavigate();

  const handleCreatePlan = () => {
    const plan = createPlan('wedding');
    navigate(`/planner/${plan.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Plans</h1>
            <p className="text-gray-400 text-sm mt-1">
              {isAuthenticated ? `Welcome back, ${user?.knownAs}` : 'Sign in to save your plans'}
            </p>
          </div>
          <Button onClick={handleCreatePlan}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-xl">
            <Plus className="w-4 h-4 mr-2" />Create New Plan
          </Button>
        </div>

        {/* Plans List */}
        {plans.length === 0 ? (
          <Card className="glass border-gray-800/50">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No plans yet</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                Start planning your first South African event. Choose from weddings, lobola, funerals, birthdays and more.
              </p>
              <Button onClick={handleCreatePlan}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-xl">
                <Plus className="w-4 h-4 mr-2" />Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => {
              const totalBudget = plan.categories.reduce(
                (sum, cat) => sum + cat.items.reduce((s, item) => s + item.price * item.quantity, 0), 0
              );
              return (
                <Card key={plan.id} className="glass border-gray-800/50 card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">{plan.name || 'Untitled Plan'}</h3>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 capitalize whitespace-nowrap">
                            {getCultureEventName(language, plan.eventType)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                          {plan.eventDate && (
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{plan.eventDate}</span>
                          )}
                          {plan.location && (
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{plan.location}</span>
                          )}
                          <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5" />
                            R {totalBudget.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => deletePlan(plan.id)}
                          className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Button onClick={() => navigate(`/planner/${plan.id}`)} size="sm"
                          className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 rounded-xl">
                          Open<ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
