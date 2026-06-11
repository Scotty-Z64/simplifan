import { useState, useEffect } from 'react';
import { usePlans } from '@/context/PlansContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckSquare, Square, Plus, Trash2, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  planId: string;
}

interface ChecklistItem {
  id: string;
  task: string;
  deadline: string; // weeks before event
  completed: boolean;
  category: string;
  isOverdue?: boolean;
}

const defaultChecklists: Record<string, ChecklistItem[]> = {
  wedding: [
    { id: 'w1', task: 'Set a budget and start saving', deadline: '52', completed: false, category: 'Planning' },
    { id: 'w2', task: 'Create guest list', deadline: '48', completed: false, category: 'Guests' },
    { id: 'w3', task: 'Book venue', deadline: '48', completed: false, category: 'Venue' },
    { id: 'w4', task: 'Hire photographer/videographer', deadline: '44', completed: false, category: 'Vendors' },
    { id: 'w5', task: 'Book caterer', deadline: '40', completed: false, category: 'Vendors' },
    { id: 'w6', task: 'Order wedding dress/suit', deadline: '36', completed: false, category: 'Attire' },
    { id: 'w7', task: 'Send save-the-dates', deadline: '32', completed: false, category: 'Communication' },
    { id: 'w8', task: 'Book florist and decor', deadline: '28', completed: false, category: 'Vendors' },
    { id: 'w9', task: 'Book DJ/Band', deadline: '28', completed: false, category: 'Vendors' },
    { id: 'w10', task: 'Order wedding cake', deadline: '24', completed: false, category: 'Catering' },
    { id: 'w11', task: 'Send formal invitations', deadline: '20', completed: false, category: 'Communication' },
    { id: 'w12', task: 'Final dress fitting', deadline: '8', completed: false, category: 'Attire' },
    { id: 'w13', task: 'Confirm RSVPs', deadline: '4', completed: false, category: 'Guests' },
    { id: 'w14', task: 'Final vendor confirmations', deadline: '2', completed: false, category: 'Vendors' },
    { id: 'w15', task: 'Pick up attire', deadline: '1', completed: false, category: 'Attire' },
  ],
  funeral: [
    { id: 'f1', task: 'Register death and obtain death certificate', deadline: '4', completed: false, category: 'Legal' },
    { id: 'f2', task: 'Choose funeral home and coffin', deadline: '4', completed: false, category: 'Arrangements' },
    { id: 'f3', task: 'Book venue (church/hall)', deadline: '3', completed: false, category: 'Venue' },
    { id: 'f4', task: 'Arrange transport (hearse)', deadline: '3', completed: false, category: 'Logistics' },
    { id: 'f5', task: 'Notify family and friends', deadline: '3', completed: false, category: 'Communication' },
    { id: 'f6', task: 'Arrange catering', deadline: '2', completed: false, category: 'Catering' },
    { id: 'f7', task: 'Order flowers and decor', deadline: '2', completed: false, category: 'Decor' },
    { id: 'f8', task: 'Prepare program/order of service', deadline: '2', completed: false, category: 'Program' },
    { id: 'f9', task: 'Arrange grave/tombstone', deadline: '1', completed: false, category: 'Burial' },
    { id: 'f10', task: 'Confirm all arrangements', deadline: '1', completed: false, category: 'Final' },
  ],
  umemulo: [
    { id: 'u1', task: 'Consult with elders on requirements', deadline: '24', completed: false, category: 'Traditional' },
    { id: 'u2', task: 'Book venue', deadline: '20', completed: false, category: 'Venue' },
    { id: 'u3', task: 'Arrange traditional attire and beads', deadline: '16', completed: false, category: 'Attire' },
    { id: 'u4', task: 'Purchase traditional items (umhlambi, etc.)', deadline: '12', completed: false, category: 'Traditional' },
    { id: 'u5', task: 'Book caterer', deadline: '12', completed: false, category: 'Catering' },
    { id: 'u6', task: 'Arrange entertainment (singers/dancers)', deadline: '10', completed: false, category: 'Entertainment' },
    { id: 'u7', task: 'Send invitations', deadline: '8', completed: false, category: 'Communication' },
    { id: 'u8', task: 'Confirm RSVPs', deadline: '2', completed: false, category: 'Guests' },
  ],
  umgidi: [
    { id: 'm1', task: 'Consult with elders on ritual requirements', deadline: '20', completed: false, category: 'Traditional' },
    { id: 'm2', task: 'Book venue', deadline: '16', completed: false, category: 'Venue' },
    { id: 'm3', task: 'Arrange traditional attire', deadline: '12', completed: false, category: 'Attire' },
    { id: 'm4', task: 'Purchase ritual items', deadline: '10', completed: false, category: 'Traditional' },
    { id: 'm5', task: 'Book caterer', deadline: '10', completed: false, category: 'Catering' },
    { id: 'm6', task: 'Arrange gifts/presents', deadline: '8', completed: false, category: 'Gifts' },
    { id: 'm7', task: 'Send invitations', deadline: '6', completed: false, category: 'Communication' },
    { id: 'm8', task: 'Confirm arrangements', deadline: '1', completed: false, category: 'Final' },
  ],
};

export function EventChecklist({ planId: _planId }: Props) {
  const { currentPlan, updatePlan } = usePlans();
  const [newTask, setNewTask] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (currentPlan && (!currentPlan.checklist || currentPlan.checklist.length === 0)) {
      const defaultItems = defaultChecklists[currentPlan.eventType] || [];
      updatePlan({ ...currentPlan, checklist: defaultItems });
    }
  }, [currentPlan]);

  if (!currentPlan) return null;

  const checklist = (currentPlan as any).checklist || [];

  const toggleItem = (itemId: string) => {
    const updated = checklist.map((item: ChecklistItem) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updatePlan({ ...currentPlan, checklist: updated });
  };

  const addItem = () => {
    if (newTask) {
      const updated = [
        ...checklist,
        {
          id: `custom-${Date.now()}`,
          task: newTask,
          deadline: newDeadline || '4',
          completed: false,
          category: 'Custom',
        },
      ];
      updatePlan({ ...currentPlan, checklist: updated });
      setNewTask('');
      setNewDeadline('');
    }
  };

  const deleteItem = (itemId: string) => {
    const updated = checklist.filter((item: ChecklistItem) => item.id !== itemId);
    updatePlan({ ...currentPlan, checklist: updated });
  };

  const getWeeksUntilEvent = () => {
    if (!currentPlan.eventDate) return null;
    const eventDate = new Date(currentPlan.eventDate);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  };

  const weeksUntil = getWeeksUntilEvent();

  const checklistTyped = checklist as ChecklistItem[];

  const filteredChecklist = selectedCategory === 'All'
    ? checklistTyped
    : checklistTyped.filter((item) => item.category === selectedCategory);

  const categories: string[] = ['All', ...Array.from(new Set(checklistTyped.map((item) => item.category)))];

  const completedCount = checklistTyped.filter((item) => item.completed).length;
  const totalCount = checklistTyped.length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{completedCount}/{totalCount} completed</span>
        <span className="text-teal-600 font-medium">
          {totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(0) : 0}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      {/* Weeks until event */}
      {weeksUntil !== null && (
        <div className={`p-3 rounded-lg ${weeksUntil <= 2 ? 'bg-red-50 text-red-700' : weeksUntil <= 4 ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'}`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {weeksUntil > 0 ? `${weeksUntil} weeks until event` : weeksUntil === 0 ? 'Event is this week!' : 'Event has passed'}
            </span>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Custom Task */}
      <div className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a custom task..."
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <Input
          type="number"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          placeholder="Weeks before"
          className="w-28"
        />
        <Button onClick={addItem} className="bg-teal-500 hover:bg-teal-600 text-white">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredChecklist.map((item: ChecklistItem) => {
          const isUrgent = weeksUntil !== null && parseInt(item.deadline) >= weeksUntil && !item.completed;
          
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                item.completed
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : isUrgent
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-800/50 border-gray-700/50'
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={`mt-0.5 ${item.completed ? 'text-green-500' : isUrgent ? 'text-red-500' : 'text-gray-400'}`}
              >
                {item.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
              </button>
              <div className="flex-1">
                <p className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                  {item.task}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.deadline} weeks before
                  </span>
                  {isUrgent && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Due soon!
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
