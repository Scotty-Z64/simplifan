import { useState } from 'react';
import { Share2, Users, Gift, Copy, Check, MessageCircle, Mail, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Referral {
  id: string;
  name: string;
  date: string;
  status: 'joined' | 'pending' | 'upgraded';
  reward: number;
}

const mockReferrals: Referral[] = [
  { id: '1', name: 'Aunt Sarah', date: '2026-03-15', status: 'upgraded', reward: 50 },
  { id: '2', name: 'Cousin Thabo', date: '2026-03-20', status: 'joined', reward: 10 },
  { id: '3', name: 'Friend Lerato', date: '2026-04-01', status: 'pending', reward: 0 },
  { id: '4', name: 'Neighbor Mr. Jones', date: '2026-04-05', status: 'joined', reward: 10 },
];

export function ReferralSystem() {
  const [referrals] = useState<Referral[]>(mockReferrals);
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const referralCode = 'SIMPLI-SA-2026';
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const stats = {
    totalReferrals: referrals.length,
    joined: referrals.filter(r => r.status === 'joined' || r.status === 'upgraded').length,
    upgraded: referrals.filter(r => r.status === 'upgraded').length,
    totalEarnings: referrals.reduce((s, r) => s + r.reward, 0),
    nextMilestone: 5,
    progress: referrals.filter(r => r.status === 'joined' || r.status === 'upgraded').length,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      customMessage ||
      `Hey! I've been using SimpliPlan to plan events and it's amazing! 🎉\n\nIt's the ultimate SA event planning app - budget tracking, vendor directory, WhatsApp sharing, AI assistant & more.\n\nSign up with my link and we both get rewards:\n${referralLink}\n\n#SimpliPlan #SAEvents`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const shareEmail = () => {
    const subject = encodeURIComponent('Check out SimpliPlan - SA Event Planning App');
    const body = encodeURIComponent(
      customMessage ||
      `Hi there!\n\nI've been using SimpliPlan to plan events and it's been a game-changer. It's South Africa's ultimate event planning platform with budget tracking, vendor directory, WhatsApp sharing, AI assistant, and so much more.\n\nSign up using my referral link:\n${referralLink}\n\nLet's plan something amazing together!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const milestones = [
    { count: 3, reward: 'R 50 credit', achieved: stats.joined >= 3 },
    { count: 5, reward: 'R 100 credit + Premium 1 month', achieved: stats.joined >= 5 },
    { count: 10, reward: 'R 250 credit + Premium 3 months', achieved: stats.joined >= 10 },
    { count: 25, reward: 'R 500 credit + Premium 6 months', achieved: stats.joined >= 25 },
    { count: 50, reward: 'R 1,000 credit + Premium 1 year', achieved: stats.joined >= 50 },
    { count: 100, reward: 'Lifetime Premium + R 2,500 credit', achieved: stats.joined >= 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Refer & Earn</h3>
            <p className="text-sm text-gray-400">Invite friends, earn credits, unlock rewards</p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Your Referral Code</p>
          <p className="text-2xl font-bold text-purple-400 font-mono tracking-wider">{referralCode}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.totalReferrals}</p>
          <p className="text-xs text-gray-500">Invited</p>
        </div>
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.joined}</p>
          <p className="text-xs text-gray-500">Joined</p>
        </div>
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.upgraded}</p>
          <p className="text-xs text-gray-500">Upgraded</p>
        </div>
        <div className="glass rounded-xl p-3 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-teal-400">R {stats.totalEarnings}</p>
          <p className="text-xs text-gray-500">Earned</p>
        </div>
      </div>

      {/* Progress to Next Milestone */}
      <div className="glass rounded-2xl p-5 border border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Next Milestone</span>
          <span className="text-sm font-semibold text-purple-400">
            {stats.progress}/{stats.nextMilestone} friends
          </span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${Math.min(100, (stats.progress / stats.nextMilestone) * 100)}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {stats.nextMilestone - stats.progress} more friends to unlock: <span className="text-purple-400 font-medium">R 100 credit + Premium 1 month</span>
        </p>
      </div>

      {/* Share Options */}
      <div className="glass rounded-2xl p-5 border border-gray-700/50 space-y-4">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-400" /> Share Your Link
        </h4>

        <Input value={referralLink} readOnly
          className="bg-gray-800/50 border-gray-700 text-white text-sm font-mono" />

        <textarea
          value={customMessage}
          onChange={e => setCustomMessage(e.target.value)}
          placeholder="Add a personal message (optional)..."
          rows={3}
          className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-600 rounded-lg text-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
        />

        <div className="grid grid-cols-3 gap-3">
          <Button onClick={shareWhatsApp}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
            <MessageCircle className="w-4 h-4 mr-2" />WhatsApp
          </Button>
          <Button onClick={shareEmail}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
            <Mail className="w-4 h-4 mr-2" />Email
          </Button>
          <Button onClick={handleCopy} variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl">
            {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" /> Milestone Rewards
        </h4>
        {milestones.map((m, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
            m.achieved ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gray-800/30 border-gray-700/30'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              m.achieved ? 'bg-emerald-500/20' : 'bg-gray-800'
            }`}>
              {m.achieved ? <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" /> :
               <span className="text-xs text-gray-500">{m.count}</span>}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${m.achieved ? 'text-emerald-400 font-medium' : 'text-gray-400'}`}>
                {m.count} friends joined
              </p>
              <p className="text-xs text-gray-500">{m.reward}</p>
            </div>
            {m.achieved && <Check className="w-4 h-4 text-emerald-400" />}
          </div>
        ))}
      </div>

      {/* Referred Friends */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-400" /> Your Referrals
        </h4>
        {referrals.map(ref => (
          <div key={ref.id} className="flex items-center justify-between p-3 glass rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-xs text-gray-400">{ref.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm text-white">{ref.name}</p>
                <p className="text-xs text-gray-500">{ref.date}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                ref.status === 'upgraded' ? 'bg-amber-500/20 text-amber-400' :
                ref.status === 'joined' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-gray-800 text-gray-500'
              }`}>{ref.status}</span>
              {ref.reward > 0 && (
                <p className="text-xs text-teal-400 mt-0.5">+R {ref.reward}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
