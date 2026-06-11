import { useMemo } from 'react';
import { Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import type { EventPlan } from '@/types';
import type { Language } from '@/types/language';
import { generateSmartTips } from '@/ai/engine';

interface Props {
  plan: EventPlan;
  culture: Language;
}

const priorityStyles = {
  high: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: AlertTriangle },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: Lightbulb },
  low: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', icon: CheckCircle },
};

export function AISmartTips({ plan, culture }: Props) {
  const tips = useMemo(() => generateSmartTips(plan, culture), [plan, culture]);

  if (tips.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 border border-gray-700/50 text-center">
        <Lightbulb className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">No Tips Yet</h3>
        <p className="text-gray-400 text-sm">Add more details to your plan to get personalized AI tips.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Smart Tips</h3>
            <p className="text-sm text-gray-400">{tips.length} personalized recommendations</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      {tips.map((tip, i) => {
        const style = priorityStyles[tip.priority];
        return (
          <div key={i} className={`glass rounded-xl p-4 border ${style.bg} ${style.border}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <style.icon className={`w-5 h-5 ${style.text}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold ${style.text}`}>{tip.title}</span>
                  <span className="text-xs bg-gray-800/50 text-gray-500 px-2 py-0.5 rounded-full capitalize">{tip.category}</span>
                </div>
                <p className="text-sm text-gray-300">{tip.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
