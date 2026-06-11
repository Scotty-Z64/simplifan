import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/context/AdminContext';
import { ArrowLeft, TrendingUp, Users, Target, Megaphone, MessageCircle, Share2, Eye, MousePointer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminMarketing() {
  const navigate = useNavigate();
  const { campaigns, weeklySignups } = useAdmin();

  const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="sticky top-0 z-30 glass border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-lg font-semibold text-white flex-1">Marketing Center</h1>
      </div>
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass rounded-xl p-3 border border-gray-700/50 text-center"><Eye className="w-4 h-4 text-blue-400 mx-auto mb-1" /><p className="text-lg font-bold text-white">{(totalReach / 1000).toFixed(0)}k</p><p className="text-[9px] text-gray-500">Total Reach</p></div>
          <div className="glass rounded-xl p-3 border border-gray-700/50 text-center"><MousePointer className="w-4 h-4 text-purple-400 mx-auto mb-1" /><p className="text-lg font-bold text-white">{totalClicks.toLocaleString('en-ZA')}</p><p className="text-[9px] text-gray-500">Clicks</p></div>
          <div className="glass rounded-xl p-3 border border-gray-700/50 text-center"><Target className="w-4 h-4 text-emerald-400 mx-auto mb-1" /><p className="text-lg font-bold text-white">{totalConversions}</p><p className="text-[9px] text-gray-500">Conversions</p></div>
          <div className="glass rounded-xl p-3 border border-gray-700/50 text-center"><TrendingUp className="w-4 h-4 text-amber-400 mx-auto mb-1" /><p className="text-lg font-bold text-white">{totalReach > 0 ? ((totalConversions / totalReach) * 100).toFixed(2) : 0}%</p><p className="text-[9px] text-gray-500">Conv. Rate</p></div>
        </div>

        {/* Campaigns */}
        <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Megaphone className="w-4 h-4 text-purple-400" />Active Campaigns</h3>
        <div className="space-y-3">
          {campaigns.map(camp => {
            const pct = camp.budget > 0 ? (camp.spent / camp.budget) * 100 : 0;
            return (
              <div key={camp.id} className="glass rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${camp.status === 'active' ? 'bg-emerald-500' : camp.status === 'paused' ? 'bg-amber-500' : 'bg-gray-500'}`} /><p className="text-sm font-semibold text-white">{camp.name}</p></div>
                  <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{camp.type}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <div className="text-center"><p className="text-xs text-gray-500">Reach</p><p className="text-sm text-white">{(camp.reach / 1000).toFixed(0)}k</p></div>
                  <div className="text-center"><p className="text-xs text-gray-500">Clicks</p><p className="text-sm text-white">{camp.clicks.toLocaleString('en-ZA')}</p></div>
                  <div className="text-center"><p className="text-xs text-gray-500">Conv.</p><p className="text-sm text-emerald-400">{camp.conversions}</p></div>
                  <div className="text-center"><p className="text-xs text-gray-500">CTR</p><p className="text-sm text-blue-400">{camp.reach > 0 ? ((camp.clicks / camp.reach) * 100).toFixed(1) : 0}%</p></div>
                </div>
                <div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-500">Budget</span><span className="text-gray-400">R{camp.spent.toLocaleString('en-ZA')} / R{camp.budget.toLocaleString('en-ZA')}</span></div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${Math.min(100, pct)}%` }} /></div>
              </div>
            );
          })}
        </div>

        {/* Weekly Signups Chart */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-teal-400" />Signups This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklySignups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="clients" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Clients" />
              <Bar dataKey="vendors" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Vendors" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Marketing Tools */}
        <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Share2 className="w-4 h-4 text-teal-400" />Quick Tools</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'WhatsApp Broadcast', desc: 'Send to segments', icon: MessageCircle, color: 'text-green-400' },
            { label: 'Create Promo Code', desc: 'Discount codes', icon: Target, color: 'text-amber-400' },
            { label: 'Referral Links', desc: 'Track invites', icon: Share2, color: 'text-blue-400' },
            { label: 'Social Content', desc: 'Auto-generate posts', icon: Megaphone, color: 'text-purple-400' },
          ].map((tool, i) => (
            <button key={i} className="glass rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all text-left">
              <tool.icon className={`w-6 h-6 ${tool.color} mb-2`} />
              <p className="text-sm text-white">{tool.label}</p>
              <p className="text-[10px] text-gray-500">{tool.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
