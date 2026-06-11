import { useState } from 'react';
import { Gift, Plus, Trash2, Check, Share2, Heart, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RegistryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  purchased: boolean;
  purchasedBy?: string;
  link?: string;
}

const defaultItems: RegistryItem[] = [
  { id: '1', name: 'Linen Set - King Size', description: 'Egyptian cotton 1000 thread count', price: 3500, image: '🛏️', category: 'Home', purchased: false, link: 'https://mrphome.com' },
  { id: '2', name: 'Dinnerware Set', description: '32-piece porcelain dinner set', price: 2800, image: '🍽️', category: 'Kitchen', purchased: false, link: 'https://home.co.za' },
  { id: '3', name: 'Smart TV - 55"', description: 'Samsung 4K UHD Smart TV', price: 12000, image: '📺', category: 'Electronics', purchased: false, link: 'https://makro.co.za' },
  { id: '4', name: 'Vacuum Cleaner', description: 'Dyson V15 Detect cordless', price: 15000, image: '🧹', category: 'Home', purchased: true, purchasedBy: 'Aunt Sarah', link: 'https://dionwired.co.za' },
  { id: '5', name: 'Air Fryer', description: 'Philips XXL Digital Air Fryer', price: 4500, image: '🍳', category: 'Kitchen', purchased: false, link: 'https://takealot.com' },
  { id: '6', name: 'Honeymoon Fund', description: 'Contribution towards Zanzibar trip', price: 5000, image: '✈️', category: 'Experience', purchased: false },
  { id: '7', name: 'Microwave Oven', description: 'Samsung 32L grill microwave', price: 3200, image: '♨️', category: 'Kitchen', purchased: false, link: 'https://makro.co.za' },
  { id: '8', name: 'Coffee Machine', description: 'Nespresso Vertuo Plus', price: 4500, image: '☕', category: 'Kitchen', purchased: true, purchasedBy: 'Cousin Thabo', link: 'https://takealot.com' },
];

const categories = ['All', 'Home', 'Kitchen', 'Electronics', 'Experience'];

export function DigitalRegistry() {
  const [items, setItems] = useState<RegistryItem[]>(defaultItems);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'Home', link: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copied, setCopied] = useState(false);

  const filtered = selectedCategory === 'All' ? items : items.filter(i => i.category === selectedCategory);
  const totalValue = items.reduce((s, i) => s + i.price, 0);
  const purchasedValue = items.filter(i => i.purchased).reduce((s, i) => s + i.price, 0);
  const remainingValue = totalValue - purchasedValue;

  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    setItems(prev => [...prev, {
      id: `reg-${Date.now()}`,
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      image: '🎁',
      category: newItem.category,
      purchased: false,
      link: newItem.link || undefined,
    }]);
    setNewItem({ name: '', description: '', price: '', category: 'Home', link: '' });
    setShowAdd(false);
  };

  const togglePurchased = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !i.purchased, purchasedBy: !i.purchased ? 'Guest' : undefined } : i));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleShare = () => {
    const url = `${window.location.origin}/registry`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const unclaimed = items.filter(i => !i.purchased).map(i => `• ${i.name} - R${i.price.toLocaleString('en-ZA')}`).join('\n');
    const text = encodeURIComponent(`*Our Gift Registry* 🎁\n\nHere are items we'd love:\n${unclaimed}\n\nView full registry: ${window.location.origin}/registry`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Digital Gift Registry</h3>
            <p className="text-sm text-gray-400">Share with guests so they know exactly what to gift</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gray-800/50 rounded-xl">
            <p className="text-lg font-bold text-teal-400">R {totalValue.toLocaleString('en-ZA')}</p>
            <p className="text-xs text-gray-500">Total Value</p>
          </div>
          <div className="text-center p-3 bg-emerald-500/10 rounded-xl">
            <p className="text-lg font-bold text-emerald-400">R {purchasedValue.toLocaleString('en-ZA')}</p>
            <p className="text-xs text-gray-500">Claimed</p>
          </div>
          <div className="text-center p-3 bg-amber-500/10 rounded-xl">
            <p className="text-lg font-bold text-amber-400">R {remainingValue.toLocaleString('en-ZA')}</p>
            <p className="text-xs text-gray-500">Still Needed</p>
          </div>
        </div>
      </div>

      {/* Share */}
      <div className="flex gap-2">
        <Button onClick={handleShareWhatsApp} variant="outline"
          className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl">
          <Share2 className="w-4 h-4 mr-2" />Share on WhatsApp
        </Button>
        <Button onClick={handleShare} variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat ? 'bg-pink-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700/50'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(item => (
          <div key={item.id} className={`glass rounded-xl p-4 border transition-all ${
            item.purchased ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-gray-700/50'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{item.image}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-semibold ${item.purchased ? 'line-through text-gray-500' : 'text-white'}`}>{item.name}</h4>
                  {item.purchased && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-teal-400">R {item.price.toLocaleString('en-ZA')}</span>
                  <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{item.category}</span>
                </div>
                {item.purchased && item.purchasedBy && (
                  <p className="text-xs text-emerald-400 mt-1">Claimed by {item.purchasedBy} <Heart className="w-3 h-3 inline" /></p>
                )}
                <div className="flex gap-2 mt-2">
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-teal-400 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />View Store
                    </a>
                  )}
                  <button onClick={() => togglePurchased(item.id)}
                    className={`text-xs flex items-center gap-1 ${item.purchased ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {item.purchased ? 'Unclaim' : 'Mark Claimed'}
                  </button>
                </div>
              </div>
              <button onClick={() => deleteItem(item.id)} className="text-gray-600 hover:text-red-400 p-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item */}
      {showAdd ? (
        <div className="glass rounded-xl p-4 border border-gray-700/50 space-y-3">
          <h4 className="text-sm font-semibold text-white">Add Registry Item</h4>
          <Input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Item name..." className="bg-gray-800/50 border-gray-700 text-white" />
          <Input value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}
            placeholder="Description..." className="bg-gray-800/50 border-gray-700 text-white" />
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })}
              placeholder="Price (R)" className="bg-gray-800/50 border-gray-700 text-white" />
            <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
              className="bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm px-3">
              {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input value={newItem.link} onChange={e => setNewItem({ ...newItem, link: e.target.value })}
            placeholder="Store link (optional)..." className="bg-gray-800/50 border-gray-700 text-white" />
          <div className="flex gap-2">
            <Button onClick={addItem} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl flex-1">Add Item</Button>
            <Button onClick={() => setShowAdd(false)} variant="outline" className="border-gray-700 text-gray-300">Cancel</Button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-pink-500/50 hover:text-pink-400 transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />Add Gift to Registry
        </button>
      )}
    </div>
  );
}
