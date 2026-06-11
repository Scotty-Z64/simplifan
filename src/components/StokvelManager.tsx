import { useState } from 'react';
import { Users, Wallet, Calendar, TrendingUp, Plus, Check, ArrowRight, PiggyBank, HandCoins, RotateCcw, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StokvelMember {
  id: string;
  name: string;
  contact: string;
  joinedDate: string;
  totalContributed: number;
  hasReceived: boolean;
  receiveDate?: string;
  position: number;
}

interface StokvelPayout {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  status: 'scheduled' | 'completed' | 'pending';
}

const defaultMembers: StokvelMember[] = [
  { id: '1', name: 'Thandi Mokoena', contact: '082 123 4567', joinedDate: '2025-01-15', totalContributed: 15000, hasReceived: true, receiveDate: '2025-03-01', position: 1 },
  { id: '2', name: 'Sibusiso Ndlovu', contact: '073 234 5678', joinedDate: '2025-01-15', totalContributed: 15000, hasReceived: false, position: 2 },
  { id: '3', name: 'Nomsa Dlamini', contact: '084 345 6789', joinedDate: '2025-02-01', totalContributed: 15000, hasReceived: false, position: 3 },
  { id: '4', name: 'Bongani Zulu', contact: '071 456 7890', joinedDate: '2025-02-01', totalContributed: 15000, hasReceived: false, position: 4 },
  { id: '5', name: 'Lerato Khumalo', contact: '076 567 8901', joinedDate: '2025-03-01', totalContributed: 10000, hasReceived: false, position: 5 },
  { id: '6', name: 'Themba Nkosi', contact: '079 678 9012', joinedDate: '2025-03-01', totalContributed: 10000, hasReceived: false, position: 6 },
];

const defaultPayouts: StokvelPayout[] = [
  { id: '1', memberId: '1', memberName: 'Thandi Mokoena', amount: 60000, date: '2025-03-01', status: 'completed' },
  { id: '2', memberId: '2', memberName: 'Sibusiso Ndlovu', amount: 75000, date: '2025-04-01', status: 'scheduled' },
  { id: '3', memberId: '3', memberName: 'Nomsa Dlamini', amount: 75000, date: '2025-05-01', status: 'pending' },
];

export function StokvelManager() {
  const [members, setMembers] = useState<StokvelMember[]>(defaultMembers);
  const [payouts, setPayouts] = useState<StokvelPayout[]>(defaultPayouts);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', contact: '' });
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'schedule'>('overview');

  const totalPool = members.reduce((s, m) => s + m.totalContributed, 0);
  const totalPayouts = payouts.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const nextPayout = payouts.find(p => p.status === 'scheduled');
  const avgContribution = totalPool / (members.length || 1);

  const addMember = () => {
    if (!newMember.name || !newMember.contact) return;
    setMembers(prev => [...prev, {
      id: `mem-${Date.now()}`,
      name: newMember.name,
      contact: newMember.contact,
      joinedDate: new Date().toISOString().split('T')[0],
      totalContributed: 0,
      hasReceived: false,
      position: prev.length + 1,
    }]);
    setNewMember({ name: '', contact: '' });
    setShowAddMember(false);
  };

  const contribute = (memberId: string) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, totalContributed: m.totalContributed + monthlyAmount } : m
    ));
  };

  const markReceived = (memberId: string) => {
    setMembers(prev => prev.map(m =>
      m.id === memberId ? { ...m, hasReceived: true, receiveDate: new Date().toISOString().split('T')[0] } : m
    ));
    setPayouts(prev => prev.map(p =>
      p.memberId === memberId ? { ...p, status: 'completed' as const } : p
    ));
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: TrendingUp },
    { key: 'members', label: 'Members', icon: Users },
    { key: 'schedule', label: 'Payout Schedule', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Stokvel Manager</h3>
            <p className="text-sm text-gray-400">Manage savings groups, contributions & payouts</p>
          </div>
        </div>

        {/* Monthly Contribution Setting */}
        <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
          <HandCoins className="w-5 h-5 text-teal-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Monthly Contribution per Member</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">R</span>
              <Input type="number" value={monthlyAmount}
                onChange={e => setMonthlyAmount(parseInt(e.target.value) || 0)}
                className="w-28 bg-gray-800/50 border-gray-700 text-white text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-teal-400">R {totalPool.toLocaleString('en-ZA')}</p>
          <p className="text-xs text-gray-500">Total Pool</p>
        </div>
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-emerald-400">{members.length}</p>
          <p className="text-xs text-gray-500">Members</p>
        </div>
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-amber-400">R {avgContribution.toLocaleString('en-ZA')}</p>
          <p className="text-xs text-gray-500">Avg Contributed</p>
        </div>
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-purple-400">R {totalPayouts.toLocaleString('en-ZA')}</p>
          <p className="text-xs text-gray-500">Paid Out</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-teal-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
            }`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Next Payout */}
          {nextPayout && (
            <div className="glass rounded-2xl p-6 border border-teal-500/30 bg-teal-500/5">
              <div className="flex items-center gap-3 mb-3">
                <Banknote className="w-8 h-8 text-teal-400" />
                <div>
                  <p className="text-sm text-teal-400">Next Payout</p>
                  <p className="text-2xl font-bold text-white">R {nextPayout.amount.toLocaleString('en-ZA')}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Recipient: <span className="text-white font-medium">{nextPayout.memberName}</span></span>
                <span className="text-gray-400">Date: <span className="text-white font-medium">{nextPayout.date}</span></span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-xl p-4 border border-gray-700/50 text-center">
              <RotateCcw className="w-6 h-6 text-teal-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-white">{members.filter(m => !m.hasReceived).length} Members</p>
              <p className="text-xs text-gray-500">Awaiting payout</p>
            </div>
            <div className="glass rounded-xl p-4 border border-gray-700/50 text-center">
              <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-white">{members.filter(m => m.hasReceived).length} Members</p>
              <p className="text-xs text-gray-500">Received payout</p>
            </div>
          </div>

          {/* How It Works */}
          <div className="glass rounded-2xl p-5 border border-gray-700/50">
            <h4 className="text-sm font-semibold text-white mb-3">How Stokvel Works</h4>
            <div className="space-y-3">
              {[
                { step: 1, title: 'Members Join', desc: 'Each member commits to monthly contributions' },
                { step: 2, title: 'Pool Grows', desc: `Every month, R${monthlyAmount * members.length} is added to the collective pool` },
                { step: 3, title: 'Rotation Payout', desc: 'Each member receives the full pool on their turn' },
                { step: 4, title: 'Event Fund', desc: 'Use your payout for weddings, lobola, or any big event' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-3">
          {members.map(member => (
            <div key={member.id} className={`glass rounded-xl p-4 border transition-all ${
              member.hasReceived ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-gray-700/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-teal-400">
                    {member.position}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${member.hasReceived ? 'line-through text-gray-500' : 'text-white'}`}>{member.name}</p>
                    <p className="text-xs text-gray-500">{member.contact}</p>
                  </div>
                </div>
                <div className="text-right">
                  {member.hasReceived ? (
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />Received
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">Waiting</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
                <span className="text-sm text-teal-400 font-medium">R {member.totalContributed.toLocaleString('en-ZA')} contributed</span>
                <div className="flex gap-2">
                  <Button onClick={() => contribute(member.id)} size="sm"
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-xs">
                    <Wallet className="w-3 h-3 mr-1" />+R{monthlyAmount}
                  </Button>
                  {!member.hasReceived && (
                    <Button onClick={() => markReceived(member.id)} size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs">
                      <Banknote className="w-3 h-3 mr-1" />Payout
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {showAddMember ? (
            <div className="glass rounded-xl p-4 border border-gray-700/50 space-y-3">
              <h4 className="text-sm font-semibold text-white">Add Member</h4>
              <Input value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Full name..." className="bg-gray-800/50 border-gray-700 text-white" />
              <Input value={newMember.contact} onChange={e => setNewMember({ ...newMember, contact: e.target.value })}
                placeholder="Phone number..." className="bg-gray-800/50 border-gray-700 text-white" />
              <div className="flex gap-2">
                <Button onClick={addMember} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl flex-1">Add Member</Button>
                <Button onClick={() => setShowAddMember(false)} variant="outline" className="border-gray-700 text-gray-300">Cancel</Button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddMember(true)}
              className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-teal-500/50 hover:text-teal-400 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />Add Member
            </button>
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-400" /> Payout Rotation Schedule
          </h4>
          {payouts.map(payout => (
            <div key={payout.id} className={`glass rounded-xl p-4 border ${
              payout.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5' :
              payout.status === 'scheduled' ? 'border-teal-500/20 bg-teal-500/5' :
              'border-gray-700/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    payout.status === 'completed' ? 'bg-emerald-500/20' :
                    payout.status === 'scheduled' ? 'bg-teal-500/20' :
                    'bg-gray-800'
                  }`}>
                    {payout.status === 'completed' ? <Check className="w-4 h-4 text-emerald-400" /> :
                     payout.status === 'scheduled' ? <ArrowRight className="w-4 h-4 text-teal-400" /> :
                     <Calendar className="w-4 h-4 text-gray-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{payout.memberName}</p>
                    <p className="text-xs text-gray-500">{payout.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-teal-400">R {payout.amount.toLocaleString('en-ZA')}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    payout.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    payout.status === 'scheduled' ? 'bg-teal-500/20 text-teal-400' :
                    'bg-gray-800 text-gray-500'
                  }`}>{payout.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
