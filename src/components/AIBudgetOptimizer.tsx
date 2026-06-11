import { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import type { EventPlan } from '@/types';
import type { Language } from '@/types/language';
import { optimizeBudget } from '@/ai/engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  plan: EventPlan;
  culture: Language;
}

export function AIBudgetOptimizer({ plan, culture }: Props) {
  const [totalBudget, setTotalBudget] = useState(
    plan.categories.reduce((s, c) => s + c.items.reduce((sum, i) => sum + i.price * i.quantity, 0), 0) || 50000
  );
  const [guestCount, setGuestCount] = useState(plan.numberOfGuests || 100);
  const [showOptimizer, setShowOptimizer] = useState(false);

  const allocation = useMemo(
    () => optimizeBudget(plan.eventType, totalBudget, guestCount, culture),
    [plan.eventType, totalBudget, guestCount, culture]
  );

  const currentTotal = plan.categories.reduce(
    (s, c) => s + c.items.reduce((sum, i) => sum + i.price * i.quantity, 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Budget Optimizer</h3>
            <p className="text-sm text-gray-400">Smart allocation based on SA market data</p>
          </div>
        </div>

        {!showOptimizer ? (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-4">Let AI recommend the best budget allocation for your {plan.eventType.replace(/_/g, ' ')}</p>
            <Button onClick={() => setShowOptimizer(true)}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-xl">
              <Sparkles className="w-4 h-4 mr-2" />Get AI Recommendations
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-400">Total Budget (R)</Label>
                <Input type="number" value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="mt-1 bg-gray-800/50 border-gray-700 text-white" />
              </div>
              <div>
                <Label className="text-sm text-gray-400">Number of Guests</Label>
                <Input type="number" value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="mt-1 bg-gray-800/50 border-gray-700 text-white" />
              </div>
            </div>

            {/* Per-person analysis */}
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-300">Per Person</span>
                <span className="text-lg font-bold text-teal-400">R{Math.round(totalBudget / Math.max(guestCount, 1))}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-400">Current Spent</span>
                <span className={`text-sm font-semibold ${currentTotal > totalBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                  R{currentTotal.toLocaleString('en-ZA')} {currentTotal > totalBudget ? '(Over budget!)' : ''}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Allocation Table */}
      {showOptimizer && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Recommended Allocation</h4>
          {allocation.map((item, i) => {
            const currentCat = plan.categories.find(c =>
              c.name.toLowerCase().includes(item.category.toLowerCase()) ||
              item.category.toLowerCase().includes(c.name.toLowerCase())
            );
            const currentSpent = currentCat?.items.reduce((s, it) => s + it.price * it.quantity, 0) || 0;
            const isOver = currentSpent > item.recommendedAmount;

            return (
              <div key={i} className={`glass rounded-xl p-4 border ${isOver ? 'border-red-500/20 bg-red-500/5' : 'border-gray-700/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{item.category}</span>
                    <span className="text-xs bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full">{item.recommendedPercentage}%</span>
                  </div>
                  <span className="text-lg font-bold text-white">R{item.recommendedAmount.toLocaleString('en-ZA')}</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${Math.min((currentSpent / item.recommendedAmount) * 100, 100)}%` }} />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{item.reasoning}</span>
                  {currentSpent > 0 && (
                    <span className={isOver ? 'text-red-400' : 'text-gray-500'}>
                      Spent: R{currentSpent.toLocaleString('en-ZA')} {isOver && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  SA Average: R{item.saAverage.toLocaleString('en-ZA')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
