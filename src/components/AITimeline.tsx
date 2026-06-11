import { Calendar, Clock, AlertTriangle, CalendarDays } from 'lucide-react';
import type { EventPlan } from '@/types';
import { generateTimeline } from '@/ai/engine';

interface Props {
  plan: EventPlan;
}

export function AITimeline({ plan }: Props) {
  const events = generateTimeline(plan);
  const completed = events.filter(e => !e.isOverdue || e.title === 'Event Day').length;

  if (!plan.eventDate) {
    return (
      <div className="glass rounded-2xl p-8 border border-gray-700/50 text-center">
        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">No Event Date Set</h3>
        <p className="text-gray-400 text-sm">Add your event date in the Details tab to generate a smart timeline.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Event Timeline</h3>
            <p className="text-sm text-gray-400">Smart planning milestones with reminders</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
              style={{ width: `${Math.min((completed / events.length) * 100, 100)}%` }} />
          </div>
          <span className="text-sm text-gray-400">{completed}/{events.length}</span>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="relative pl-6">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-800" />

        {events.map((event, i) => (
          <div key={i} className="relative mb-4">
            {/* Dot */}
            <div className={`absolute -left-6 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              event.title === 'Event Day'
                ? 'bg-gradient-to-br from-teal-500 to-emerald-500 border-teal-400'
                : event.isOverdue && event.title !== 'Event Day'
                ? 'bg-red-500/20 border-red-500'
                : 'bg-gray-900 border-gray-600'
            }`}>
              {event.isOverdue && event.title !== 'Event Day' ? (
                <AlertTriangle className="w-3 h-3 text-red-400" />
              ) : event.title === 'Event Day' ? (
                <Calendar className="w-3 h-3 text-white" />
              ) : (
                <Clock className="w-3 h-3 text-gray-500" />
              )}
            </div>

            {/* Card */}
            <div className={`glass rounded-xl p-4 border ${
              event.title === 'Event Day'
                ? 'border-teal-500/30 bg-teal-500/5'
                : event.isOverdue
                ? 'border-red-500/20 bg-red-500/5'
                : 'border-gray-700/50'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-semibold ${
                      event.isOverdue ? 'text-red-400' : event.title === 'Event Day' ? 'text-teal-400' : 'text-white'
                    }`}>
                      {event.title}
                    </span>
                    {event.isOverdue && event.title !== 'Event Day' && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Overdue</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{event.description}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{event.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
