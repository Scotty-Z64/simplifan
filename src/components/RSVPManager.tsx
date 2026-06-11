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
import { Plus, Trash2, Users, CheckCircle, XCircle, HelpCircle, Mail, Utensils } from 'lucide-react';

interface Props {
  planId: string;
}

export function RSVPManager({ planId }: Props) {
  const { currentPlan, addGuest, updateGuest, deleteGuest } = usePlans();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [plusOnes, setPlusOnes] = useState(0);
  const [children, setChildren] = useState(0);
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [notes, setNotes] = useState('');

  if (!currentPlan) return null;

  const attending = currentPlan.guests.filter(g => g.status === 'attending').length;
  const notAttending = currentPlan.guests.filter(g => g.status === 'not-attending').length;
  const maybe = currentPlan.guests.filter(g => g.status === 'maybe').length;
  const pending = currentPlan.guests.filter(g => g.status === 'pending').length;
  const totalGuests = currentPlan.guests.reduce((sum, g) => sum + 1 + g.plusOnes + g.children, 0);

  const handleAdd = () => {
    if (name) {
      addGuest(planId, {
        name,
        contact: contact || undefined,
        status: 'pending',
        plusOnes,
        children,
        dietaryRequirements: dietaryRequirements || undefined,
        notes: notes || undefined,
        inviteSent: false,
      });
      setName('');
      setContact('');
      setPlusOnes(0);
      setChildren(0);
      setDietaryRequirements('');
      setNotes('');
      setDialogOpen(false);
    }
  };

  const statusConfig = {
    attending: { label: 'Attending', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    'not-attending': { label: 'Not Attending', color: 'bg-red-100 text-red-700', icon: XCircle },
    maybe: { label: 'Maybe', color: 'bg-amber-100 text-amber-700', icon: HelpCircle },
    pending: { label: 'Pending', color: 'bg-gray-100 text-gray-400', icon: Mail },
  };

  const cycleStatus = (guestId: string, currentStatus: string) => {
    const statuses: Array<'pending' | 'attending' | 'not-attending' | 'maybe'> = ['pending', 'attending', 'not-attending', 'maybe'];
    const currentIndex = statuses.indexOf(currentStatus as any);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateGuest(planId, guestId, { status: nextStatus });
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-emerald-500/10 p-2 rounded-lg text-center">
          <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-700">{attending}</p>
          <p className="text-xs text-gray-400">Yes</p>
        </div>
        <div className="bg-red-50 p-2 rounded-lg text-center">
          <XCircle className="w-4 h-4 text-red-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-red-700">{notAttending}</p>
          <p className="text-xs text-gray-400">No</p>
        </div>
        <div className="bg-amber-50 p-2 rounded-lg text-center">
          <HelpCircle className="w-4 h-4 text-amber-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-amber-700">{maybe}</p>
          <p className="text-xs text-gray-400">Maybe</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg text-center">
          <Mail className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-300">{pending}</p>
          <p className="text-xs text-gray-400">Pending</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400 flex items-center gap-1">
          <Users className="w-4 h-4" />
          Total People: {totalGuests}
        </span>
        <span className="text-teal-600 font-medium">
          {currentPlan.guests.length} guests
        </span>
      </div>

      {/* Add Guest Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Guest
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Guest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Guest Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label>Contact (WhatsApp/Cell)</Label>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="081 234 5678"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plus Ones</Label>
                <Input
                  type="number"
                  value={plusOnes}
                  onChange={(e) => setPlusOnes(parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
              <div>
                <Label>Children</Label>
                <Input
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Utensils className="w-4 h-4" />
                Dietary Requirements
              </Label>
              <Input
                value={dietaryRequirements}
                onChange={(e) => setDietaryRequirements(e.target.value)}
                placeholder="e.g., Halal, Vegetarian, Allergies..."
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional info..."
              />
            </div>
            <Button onClick={handleAdd} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              Add Guest
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guests List */}
      {currentPlan.guests.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No guests added yet.</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {currentPlan.guests.map((guest) => {
            const config = statusConfig[guest.status];
            const StatusIcon = config.icon;
            return (
              <div key={guest.id} className="p-3 glass border-gray-700/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{guest.name}</p>
                      <button
                        onClick={() => cycleStatus(guest.id, guest.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                      {guest.contact && <span>{guest.contact}</span>}
                      {guest.plusOnes > 0 && <span>+{guest.plusOnes} guests</span>}
                      {guest.children > 0 && <span>{guest.children} children</span>}
                    </div>
                    {guest.dietaryRequirements && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <Utensils className="w-3 h-3" />
                        {guest.dietaryRequirements}
                      </p>
                    )}
                    {guest.notes && (
                      <p className="text-xs text-gray-500 mt-1">{guest.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteGuest(planId, guest.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
