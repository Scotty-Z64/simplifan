import { useState } from 'react';
import { usePlans } from '@/context/PlansContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Users, Armchair } from 'lucide-react';

interface Props {
  planId: string;
}

interface Table {
  id: string;
  name: string;
  seats: number;
  guests: string[];
}

export function SeatingPlanner({ planId: _planId }: Props) {
  const { currentPlan, updatePlan } = usePlans();
  const [newTableName, setNewTableName] = useState('');
  const [newTableSeats, setNewTableSeats] = useState(8);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [newGuestName, setNewGuestName] = useState('');

  if (!currentPlan) return null;

  const tables = (currentPlan as any).tables || [];

  const addTable = () => {
    if (newTableName) {
      const newTable: Table = {
        id: `table-${Date.now()}`,
        name: newTableName,
        seats: newTableSeats,
        guests: [],
      };
      updatePlan({ ...currentPlan, tables: [...tables, newTable] });
      setNewTableName('');
      setNewTableSeats(8);
    }
  };

  const deleteTable = (tableId: string) => {
    const updated = tables.filter((t: Table) => t.id !== tableId);
    updatePlan({ ...currentPlan, tables: updated });
    if (selectedTable === tableId) setSelectedTable(null);
  };

  const addGuestToTable = (tableId: string) => {
    if (!newGuestName) return;
    const updated = tables.map((t: Table) => {
      if (t.id === tableId && t.guests.length < t.seats) {
        return { ...t, guests: [...t.guests, newGuestName] };
      }
      return t;
    });
    updatePlan({ ...currentPlan, tables: updated });
    setNewGuestName('');
  };

  const removeGuestFromTable = (tableId: string, guestIndex: number) => {
    const updated = tables.map((t: Table) => {
      if (t.id === tableId) {
        return { ...t, guests: t.guests.filter((_, i) => i !== guestIndex) };
      }
      return t;
    });
    updatePlan({ ...currentPlan, tables: updated });
  };

  const totalSeats = tables.reduce((sum: number, t: Table) => sum + t.seats, 0);
  const totalAssigned = tables.reduce((sum: number, t: Table) => sum + t.guests.length, 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400 flex items-center gap-1">
          <Armchair className="w-4 h-4" />
          {tables.length} tables
        </span>
        <span className="text-gray-400">
          {totalAssigned} / {totalSeats} seats assigned
        </span>
      </div>

      {/* Add Table */}
      <div className="flex gap-2">
        <Input
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
          placeholder="Table name (e.g., Table 1, Family Table)"
          className="flex-1"
        />
        <Input
          type="number"
          value={newTableSeats}
          onChange={(e) => setNewTableSeats(parseInt(e.target.value) || 8)}
          placeholder="Seats"
          className="w-20"
        />
        <Button onClick={addTable} className="bg-teal-500 hover:bg-teal-600 text-white">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No tables created yet. Add tables to start planning seating.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {tables.map((table: Table) => {
            const isFull = table.guests.length >= table.seats;
            return (
              <div
                key={table.id}
                className={`p-4 border rounded-lg ${
                  isFull ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-gray-700/50 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-teal-500" />
                    <h4 className="text-sm font-semibold text-white">{table.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isFull ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {table.guests.length}/{table.seats}
                    </span>
                  </div>
                  <button onClick={() => deleteTable(table.id)} className="p-1 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Guest List */}
                <div className="space-y-1 mb-3 min-h-[60px]">
                  {table.guests.map((guest, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-700/30">
                      <span className="text-sm text-gray-300 flex items-center gap-2">
                        <Users className="w-3 h-3 text-gray-400" />
                        {guest}
                      </span>
                      <button
                        onClick={() => removeGuestFromTable(table.id, index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {table.guests.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">No guests assigned</p>
                  )}
                </div>

                {/* Add Guest */}
                {!isFull && (
                  <div className="flex gap-2">
                    <Input
                      value={selectedTable === table.id ? newGuestName : ''}
                      onChange={(e) => {
                        setSelectedTable(table.id);
                        setNewGuestName(e.target.value);
                      }}
                      placeholder="Guest name"
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addGuestToTable(table.id);
                      }}
                    />
                    <Button
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                      onClick={() => addGuestToTable(table.id)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
