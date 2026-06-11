import { useState } from 'react';
import { UserPlus, CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';
import type { EventPlan } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  title: string;
  assignee: string;
  completed: boolean;
  dueDate: string;
}

export function TaskAssignment({ plan: _plan }: { plan: EventPlan }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Book venue', assignee: 'Dad', completed: true, dueDate: '2026-04-01' },
    { id: '2', title: 'Confirm caterer', assignee: 'Mom', completed: false, dueDate: '2026-04-15' },
    { id: '3', title: 'Order traditional attire', assignee: 'Aunt Grace', completed: false, dueDate: '2026-04-20' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: `task-${Date.now()}`,
      title: newTask,
      assignee: newAssignee || 'Unassigned',
      completed: false,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    }]);
    setNewTask('');
    setNewAssignee('');
    setShowAdd(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Task Assignment</h3>
              <p className="text-sm text-gray-400">Assign tasks to family members</p>
            </div>
          </div>
          <span className="text-sm text-emerald-400">{completedCount}/{tasks.length} Done</span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className={`glass rounded-xl p-4 border transition-all ${
            task.completed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-gray-700/50'
          }`}>
            <div className="flex items-start gap-3">
              <button onClick={() => toggleTask(task.id)}
                className={`mt-0.5 flex-shrink-0 ${task.completed ? 'text-emerald-400' : 'text-gray-500 hover:text-teal-400'}`}>
                {task.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs bg-gray-800/50 text-gray-400 px-2 py-0.5 rounded-full">{task.assignee}</span>
                  <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task */}
      {showAdd ? (
        <div className="glass rounded-xl p-4 border border-gray-700/50 space-y-3">
          <Input value={newTask} onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task description..."
            className="bg-gray-800/50 border-gray-700 text-white" />
          <Input value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)}
            placeholder="Assign to (e.g., Aunt Grace, Dad)..."
            className="bg-gray-800/50 border-gray-700 text-white" />
          <div className="flex gap-2">
            <Button onClick={addTask} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl flex-1">Add Task</Button>
            <Button onClick={() => setShowAdd(false)} variant="outline" className="border-gray-700 text-gray-300">Cancel</Button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-teal-500/50 hover:text-teal-400 transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />Assign New Task
        </button>
      )}
    </div>
  );
}