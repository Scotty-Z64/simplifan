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
import { Plus, Trash2, CreditCard, AlertTriangle, CheckCircle, Clock, Wallet } from 'lucide-react';

interface Props {
  planId: string;
}

interface Payment {
  id: string;
  vendorName: string;
  itemDescription: string;
  totalAmount: number;
  amountPaid: number;
  dueDate?: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  notes?: string;
}

export function PaymentTracker({ planId: _planId }: Props) {
  const { currentPlan, updatePlan } = usePlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!currentPlan) return null;

  const payments = (currentPlan as any).payments || [];

  const addPayment = () => {
    if (vendorName && totalAmount) {
      const total = parseFloat(totalAmount);
      const paid = parseFloat(amountPaid) || 0;
      const status: Payment['status'] = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'pending';

      const newPayment: Payment = {
        id: `payment-${Date.now()}`,
        vendorName,
        itemDescription: itemDescription || 'Services',
        totalAmount: total,
        amountPaid: paid,
        dueDate: dueDate || undefined,
        status,
        notes: notes || undefined,
      };

      updatePlan({ ...currentPlan, payments: [...payments, newPayment] });
      setVendorName('');
      setItemDescription('');
      setTotalAmount('');
      setAmountPaid('');
      setDueDate('');
      setNotes('');
      setDialogOpen(false);
    }
  };

  const updatePaymentStatus = (paymentId: string, newPaid: number) => {
    const updated = payments.map((p: Payment) => {
      if (p.id === paymentId) {
        const status: Payment['status'] = newPaid >= p.totalAmount ? 'paid' : newPaid > 0 ? 'partial' : 'pending';
        return { ...p, amountPaid: newPaid, status };
      }
      return p;
    });
    updatePlan({ ...currentPlan, payments: updated });
  };

  const deletePayment = (paymentId: string) => {
    const updated = payments.filter((p: Payment) => p.id !== paymentId);
    updatePlan({ ...currentPlan, payments: updated });
  };

  const totalOwed = payments.reduce((sum: number, p: Payment) => sum + p.totalAmount, 0);
  const totalPaid = payments.reduce((sum: number, p: Payment) => sum + p.amountPaid, 0);
  const remaining = totalOwed - totalPaid;

  const statusConfig = {
    paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    partial: { label: 'Partial', color: 'bg-amber-100 text-amber-700', icon: Clock },
    pending: { label: 'Pending', color: 'bg-gray-100 text-gray-400', icon: Clock },
    overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-800/30 p-3 rounded-lg text-center">
          <Wallet className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Total Owed</p>
          <p className="text-sm font-bold text-white">R {totalOwed.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-emerald-500/10 p-3 rounded-lg text-center">
          <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Paid</p>
          <p className="text-sm font-bold text-green-700">R {totalPaid.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg text-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="text-sm font-bold text-red-700">R {remaining.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Add Payment Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor Payment
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Track Vendor Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Vendor Name</Label>
              <Input value={vendorName} onChange={(e) => setVendorName(e.target.value)} placeholder="e.g., Mzansi Caterers" />
            </div>
            <div>
              <Label>Service/Item</Label>
              <Input value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="e.g., Wedding Catering" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Total Amount (R)</Label>
                <Input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Amount Paid (R)</Label>
                <Input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div>
              <Label>Payment Due Date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, reference number..." />
            </div>
            <Button onClick={addPayment} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              Add Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payments List */}
      {payments.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No vendor payments tracked yet.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {payments.map((payment: Payment) => {
            const config = statusConfig[payment.status];
            const StatusIcon = config.icon;
            const progressPercent = (payment.amountPaid / payment.totalAmount) * 100;

            return (
              <div key={payment.id} className="p-4 glass border-gray-700/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">{payment.vendorName}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{payment.itemDescription}</p>
                  </div>
                  <button onClick={() => deletePayment(payment.id)} className="p-1 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      payment.status === 'paid' ? 'bg-emerald-500/100' : payment.status === 'partial' ? 'bg-amber-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    R {payment.amountPaid.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} / R {payment.totalAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-gray-500">{progressPercent.toFixed(0)}%</span>
                </div>

                {/* Quick Payment Update */}
                {payment.status !== 'paid' && (
                  <div className="mt-3 flex gap-2">
                    <Input
                      type="number"
                      placeholder="Add payment amount"
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          updatePaymentStatus(payment.id, payment.amountPaid + parseFloat(input.value));
                          input.value = '';
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).closest('div')?.querySelector('input') as HTMLInputElement;
                        if (input?.value) {
                          updatePaymentStatus(payment.id, payment.amountPaid + parseFloat(input.value));
                          input.value = '';
                        }
                      }}
                    >
                      <CreditCard className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {payment.dueDate && (
                  <p className="text-xs text-gray-500 mt-2">Due: {new Date(payment.dueDate).toLocaleDateString('en-ZA')}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
