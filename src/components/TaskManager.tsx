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
import { Plus, Trash2, CheckSquare, Square, User, Calendar, MessageSquare } from 'lucide-react';

interface Props {
  planId: string;
}

export function TaskManager({ planId }: Props) {
  const { currentPlan, addTask, deleteTask, toggleTaskComplete } = usePlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [assigneeContact, setAssigneeContact] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!currentPlan) return null;

  const completedTasks = currentPlan.tasks.filter(t => t.completed).length;
  const totalTasks = currentPlan.tasks.length;

  const handleAdd = () => {
    if (title && assigneeName) {
      addTask(planId, {
        title,
        assigneeName,
        assigneeContact: assigneeContact || undefined,
        completed: false,
        dueDate: dueDate || undefined,
        notes: notes || undefined,
      });
      setTitle('');
      setAssigneeName('');
      setAssigneeContact('');
      setDueDate('');
      setNotes('');
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Tasks: {completedTasks}/{totalTasks} completed</span>
        <span className="text-teal-600 font-medium">
          {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0}%
        </span>
      </div>

      {/* Add Task Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Assign Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign a Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Task Description</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Book venue, Arrange transport..."
              />
            </div>
            <div>
              <Label>Assign To</Label>
              <Input
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                placeholder="e.g., Aunt Sarah"
              />
            </div>
            <div>
              <Label>Contact (WhatsApp/Cell)</Label>
              <Input
                value={assigneeContact}
                onChange={(e) => setAssigneeContact(e.target.value)}
                placeholder="081 234 5678"
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional details..."
              />
            </div>
            <Button onClick={handleAdd} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              Assign Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tasks List */}
      {currentPlan.tasks.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No tasks assigned yet.</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {currentPlan.tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-lg border ${task.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-gray-800/50 border-gray-700/50'}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskComplete(planId, task.id)}
                  className="mt-0.5 text-teal-500"
                >
                  {task.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {task.assigneeName}
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {task.assigneeContact && (
                    <p className="text-xs text-gray-500 mt-1">{task.assigneeContact}</p>
                  )}
                  {task.notes && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {task.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(planId, task.id)}
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
