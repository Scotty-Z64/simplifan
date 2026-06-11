import { useState } from 'react';
import { MessageCircle, Zap, Clock, Bell, Check, Users } from 'lucide-react';
import type { EventPlan } from '@/types';
import { Button } from '@/components/ui/button';

export function WhatsAppBot({ plan }: { plan: EventPlan }) {
  const [showSetup, setShowSetup] = useState(false);
  const [reminders, setReminders] = useState<string[]>(['budget', 'vendor', 'guests', 'timeline']);

  const reminderOptions = [
    { key: 'budget', label: 'Budget Alerts', desc: 'Get notified when approaching budget limits' },
    { key: 'vendor', label: 'Vendor Reminders', desc: 'Follow-up reminders for unpaid vendors' },
    { key: 'guests', label: 'RSVP Updates', desc: 'Daily guest count updates and pending RSVPs' },
    { key: 'timeline', label: 'Timeline Alerts', desc: 'Upcoming deadlines and overdue tasks' },
    { key: 'family', label: 'Family Updates', desc: 'Notify family when items are checked off' },
    { key: 'event', label: 'Event Day Alerts', desc: 'Day-of reminders and countdown messages' },
  ];

  const toggleReminder = (key: string) => {
    setReminders(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleSendUpdate = (type: string) => {
    const totalBudget = plan.categories.reduce((s, c) => s + c.items.reduce((sum, i) => sum + i.price * i.quantity, 0), 0);
    let text = '';
    if (type === 'budget') text = `Budget Update for ${plan.name}:\nTotal: R${totalBudget.toLocaleString('en-ZA')}\n${plan.guests.length} guests | ${plan.categories.length} categories\n\nView: ${window.location.origin}/planner/${plan.id}`;
    else if (type === 'guests') text = `Guest Update for ${plan.name}:\nAttending: ${plan.guests.filter(g => g.status === 'attending').length}\nPending: ${plan.guests.filter(g => g.status === 'pending').length}\nNot Attending: ${plan.guests.filter(g => g.status === 'not-attending').length}\n\nView: ${window.location.origin}/planner/${plan.id}`;
    else if (type === 'reminder') text = `Reminder: ${plan.name} is coming up!\nDate: ${plan.eventDate || 'TBA'}\nLocation: ${plan.location || 'TBA'}\nTotal Budget: R${totalBudget.toLocaleString('en-ZA')}\n\nCheck your plan: ${window.location.origin}/planner/${plan.id}`;

    if (text) window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Connect Section */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">SimpliPlan WhatsApp Bot</h3>
            <p className="text-sm text-gray-400">Get updates and send reminders via WhatsApp</p>
          </div>
        </div>

        {!showSetup ? (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-4">Connect WhatsApp to receive automatic event updates and send quick reminders to family</p>
            <Button onClick={() => setShowSetup(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl">
              <Zap className="w-4 h-4 mr-2" />Connect WhatsApp
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-sm text-emerald-300 flex items-center gap-2"><Check className="w-4 h-4" />SimpliPlan Bot would be connected to +27 60 123 4567</p>
            </div>

            <h4 className="text-sm font-semibold text-gray-300 mt-4">Choose Reminders</h4>
            <div className="space-y-2">
              {reminderOptions.map(opt => (
                <button key={opt.key} onClick={() => toggleReminder(opt.key)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    reminders.includes(opt.key)
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600'
                  }`}>
                  <div className="text-left">
                    <p className="text-sm text-white font-medium">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    reminders.includes(opt.key) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'
                  }`}>
                    {reminders.includes(opt.key) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {showSetup && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-300">Quick Share Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={() => handleSendUpdate('budget')}
              className="p-4 glass rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all text-left">
              <Zap className="w-5 h-5 text-teal-400 mb-2" />
              <p className="text-sm font-medium text-white">Budget Update</p>
              <p className="text-xs text-gray-500">Share budget summary</p>
            </button>
            <button onClick={() => handleSendUpdate('guests')}
              className="p-4 glass rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all text-left">
              <Users className="w-5 h-5 text-teal-400 mb-2" />
              <p className="text-sm font-medium text-white">Guest Status</p>
              <p className="text-xs text-gray-500">Share RSVP counts</p>
            </button>
            <button onClick={() => handleSendUpdate('reminder')}
              className="p-4 glass rounded-xl border border-gray-700/50 hover:border-teal-500/30 transition-all text-left">
              <Clock className="w-5 h-5 text-teal-400 mb-2" />
              <p className="text-sm font-medium text-white">Send Reminder</p>
              <p className="text-xs text-gray-500">Event day reminder</p>
            </button>
          </div>
        </div>
      )}

      {/* Auto-Reminder Schedule */}
      {showSetup && (
        <div className="glass rounded-2xl p-6 border border-gray-700/50">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" /> Auto-Reminder Schedule
          </h4>
          <div className="space-y-2">
            {[
              { time: 'Daily at 8 AM', action: 'Guest RSVP update', status: 'enabled' },
              { time: 'Weekly on Sunday', action: 'Budget summary to family', status: 'enabled' },
              { time: '7 days before event', action: 'Vendor confirmation alert', status: 'enabled' },
              { time: '1 day before event', action: 'Final headcount reminder', status: 'enabled' },
              { time: 'Event day, 6 AM', action: 'Day-of checklist', status: 'enabled' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-teal-400 font-mono">{item.time}</span>
                  <span className="text-sm text-gray-300">{item.action}</span>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
