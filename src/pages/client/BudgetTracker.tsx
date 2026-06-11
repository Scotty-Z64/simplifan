import { useNavigate, useParams } from 'react-router-dom';
import { useUnified } from '@/context/UnifiedContext';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';

export function BudgetTracker() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { getEventBudget, getBudgetSummary } = useUnified();
  const budget = eventId ? getEventBudget(eventId) : [];
  const summary = eventId ? getBudgetSummary(eventId) : { totalBudgeted: 0, totalActual: 0, remaining: 0 };
  const overBudget = summary.totalActual > summary.totalBudgeted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Budget Tracker</h1>
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-xl p-3 border border-gray-700/50 text-center"><DollarSign className="w-4 h-4 text-teal-400 mx-auto mb-1" /><p className="text-sm font-bold text-white">R{summary.totalBudgeted.toLocaleString('en-ZA')}</p><p className="text-[9px] text-gray-500">Budgeted</p></div>
          <div className="glass rounded-xl p-3 border border-gray-700/50 text-center"><Wallet className="w-4 h-4 text-amber-400 mx-auto mb-1" /><p className="text-sm font-bold text-white">R{summary.totalActual.toLocaleString('en-ZA')}</p><p className="text-[9px] text-gray-500">Spent</p></div>
          <div className={`glass rounded-xl p-3 border text-center ${overBudget ? 'border-red-500/30' : 'border-emerald-500/30'}`}>{overBudget ? <TrendingUp className="w-4 h-4 text-red-400 mx-auto mb-1" /> : <TrendingDown className="w-4 h-4 text-emerald-400 mx-auto mb-1" />}<p className={`text-sm font-bold ${overBudget ? 'text-red-400' : 'text-emerald-400'}`}>R{Math.abs(summary.remaining).toLocaleString('en-ZA')}</p><p className="text-[9px] text-gray-500">{overBudget ? 'Over' : 'Remaining'}</p></div>
        </div>
        {overBudget && (
          <div className="glass rounded-xl p-4 border border-red-500/20 bg-red-500/5 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" /><p className="text-sm text-red-400">You are R {(summary.totalActual - summary.totalBudgeted).toLocaleString('en-ZA')} over budget. Consider adjusting some categories.</p></div>
        )}
        {/* Budget Progress */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50 space-y-4">
          <h3 className="text-sm font-semibold text-white">Budget Breakdown</h3>
          {budget.map(entry => {
            const pct = entry.budgeted > 0 ? (entry.actual / entry.budgeted) * 100 : 0;
            const isOver = entry.actual > entry.budgeted;
            return (
              <div key={entry.id}>
                <div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-400">{entry.category}</span><span className="text-xs text-gray-400">R{entry.actual.toLocaleString('en-ZA')} / R{entry.budgeted.toLocaleString('en-ZA')}</span></div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-gradient-to-r from-teal-500 to-emerald-400'}`} style={{ width: `${Math.min(100, pct)}%` }} /></div>
                {entry.vendorName && <p className="text-[10px] text-gray-500 mt-0.5">{entry.vendorName}</p>}
              </div>
            );
          })}
          {budget.length === 0 && <p className="text-sm text-gray-500 text-center py-6">No budget entries yet.</p>}
        </div>
      </div>
    </div>
  );
}
