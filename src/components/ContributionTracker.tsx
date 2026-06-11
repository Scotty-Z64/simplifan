import { useState } from 'react';
import { usePlans } from '@/context/PlansContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, TrendingUp, Users, Wallet } from 'lucide-react';

interface Props {
  planId: string;
}

export function ContributionTracker({ planId }: Props) {
  const { currentPlan, addContribution, deleteContribution, calculateTotal, calculateContributions } = usePlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contributorName, setContributorName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'eft' | 'mobile'>('cash');
  const [notes, setNotes] = useState('');

  if (!currentPlan) return null;

  const totalBudget = calculateTotal(currentPlan);
  const totalContributed = calculateContributions(currentPlan);
  const remaining = totalBudget - totalContributed;
  const progressPercent = totalBudget > 0 ? (totalContributed / totalBudget) * 100 : 0;

  const handleAdd = () => {
    if (contributorName && amount) {
      addContribution(planId, {
        contributorName,
        amount: parseFloat(amount),
        paymentMethod,
        date: new Date().toISOString(),
        notes: notes || undefined,
      });
      setContributorName('');
      setAmount('');
      setPaymentMethod('cash');
      setNotes('');
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-teal-50 p-3 rounded-lg text-center">
          <Wallet className="w-5 h-5 text-teal-600 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Total Budget</p>
          <p className="text-sm font-bold text-white">R {totalBudget.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-emerald-500/10 p-3 rounded-lg text-center">
          <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Raised</p>
          <p className="text-sm font-bold text-green-700">R {totalContributed.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg text-center">
          <Users className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <p className="text-xs text-gray-400">Remaining</p>
          <p className="text-sm font-bold text-amber-700">R {remaining.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-teal-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>
      <p className="text-xs text-center text-gray-400">{progressPercent.toFixed(1)}% funded</p>

      {/* Add Contribution Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Contribution
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Contribution</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Contributor Name</Label>
              <Input
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder="e.g., Uncle John"
              />
            </div>
            <div>
              <Label>Amount (R)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <div className="flex gap-2 mt-1">
                {(['cash', 'eft', 'mobile'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      paymentMethod === method
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {method === 'cash' ? 'Cash' : method === 'eft' ? 'EFT' : 'Mobile'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional info..."
              />
            </div>
            <Button onClick={handleAdd} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              Record Contribution
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contributions List */}
      {currentPlan.contributions.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No contributions recorded yet.</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {currentPlan.contributions.map((contrib) => (
            <div key={contrib.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{contrib.contributorName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(contrib.date).toLocaleDateString()} • {contrib.paymentMethod.toUpperCase()}
                  {contrib.notes && ` • ${contrib.notes}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-teal-600">
                  R {contrib.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => deleteContribution(planId, contrib.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
