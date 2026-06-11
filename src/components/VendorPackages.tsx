import { useState } from 'react';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Check, X, Package, DollarSign, ListChecks, Flame } from 'lucide-react';

const packageCategories = ['Wedding', 'Corporate', 'Birthday', 'Traditional', 'Baby Shower', 'Other'];

export function VendorPackages() {
  const { packages, addPackage, updatePackage, deletePackage } = useVendorAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');
  const [newPkg, setNewPkg] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'Wedding', popular: false, includes: [] as string[],
  });
  const [editForm, setEditForm] = useState({
    name: '', description: '', price: '', originalPrice: '', category: 'Wedding', popular: false, active: true, includes: [] as string[],
  });

  const activeCount = packages.filter(p => p.active).length;
  const popularCount = packages.filter(p => p.popular).length;

  const addIncludeItem = (items: string[], setter: (items: string[]) => void) => {
    if (!newItem.trim()) return;
    setter([...items, newItem.trim()]);
    setNewItem('');
  };

  const removeIncludeItem = (index: number, items: string[], setter: (items: string[]) => void) => {
    setter(items.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (!newPkg.name || !newPkg.price) return;
    addPackage({
      name: newPkg.name,
      description: newPkg.description,
      price: parseFloat(newPkg.price),
      originalPrice: newPkg.originalPrice ? parseFloat(newPkg.originalPrice) : undefined,
      category: newPkg.category,
      includes: newPkg.includes,
      active: true,
      popular: newPkg.popular,
    });
    setNewPkg({ name: '', description: '', price: '', originalPrice: '', category: 'Wedding', popular: false, includes: [] });
    setShowAdd(false);
  };

  const startEdit = (pkg: typeof packages[0]) => {
    setEditingId(pkg.id);
    setEditForm({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      originalPrice: pkg.originalPrice?.toString() || '',
      category: pkg.category,
      popular: pkg.popular || false,
      active: pkg.active,
      includes: [...pkg.includes],
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    updatePackage(editingId, {
      name: editForm.name,
      description: editForm.description,
      price: parseFloat(editForm.price),
      originalPrice: editForm.originalPrice ? parseFloat(editForm.originalPrice) : undefined,
      category: editForm.category,
      popular: editForm.popular,
      active: editForm.active,
      includes: editForm.includes,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-teal-400">{packages.length}</p>
          <p className="text-xs text-gray-500">Packages</p>
        </div>
        <div className="glass rounded-xl p-4 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="glass rounded-xl p-4 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-amber-400">{popularCount}</p>
          <p className="text-xs text-gray-500">Popular</p>
        </div>
      </div>

      <Button onClick={() => setShowAdd(true)} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl">
        <Plus className="w-4 h-4 mr-2" />Create Package
      </Button>

      {/* Add Form */}
      {showAdd && (
        <div className="glass rounded-2xl p-5 border border-teal-500/20 space-y-4">
          <h3 className="text-base font-semibold text-white">Create New Package</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input value={newPkg.name} onChange={e => setNewPkg({ ...newPkg, name: e.target.value })}
              placeholder="Package name..." className="bg-gray-800/50 border-gray-700 text-white" />
            <select value={newPkg.category} onChange={e => setNewPkg({ ...newPkg, category: e.target.value })}
              className="bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm px-3 py-2">
              {packageCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input type="number" value={newPkg.price} onChange={e => setNewPkg({ ...newPkg, price: e.target.value })}
                placeholder="Price (R)" className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input type="number" value={newPkg.originalPrice} onChange={e => setNewPkg({ ...newPkg, originalPrice: e.target.value })}
                placeholder="Original price (optional)" className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
            </div>
          </div>
          <textarea value={newPkg.description} onChange={e => setNewPkg({ ...newPkg, description: e.target.value })}
            placeholder="Package description..." rows={2}
            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm p-3 resize-none" />
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={newPkg.popular} onChange={e => setNewPkg({ ...newPkg, popular: e.target.checked })}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-teal-500" />
            <span className="text-sm text-gray-400">Mark as Popular</span>
          </div>
          {/* Includes builder */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">What's Included</label>
            <div className="flex gap-2 mb-2">
              <Input value={newItem} onChange={e => setNewItem(e.target.value)}
                placeholder="Add an item..." className="bg-gray-800/50 border-gray-700 text-white"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIncludeItem(newPkg.includes, (items) => setNewPkg({ ...newPkg, includes: items })))} />
              <Button onClick={() => addIncludeItem(newPkg.includes, (items) => setNewPkg({ ...newPkg, includes: items }))}
                size="sm" className="bg-gray-800 hover:bg-gray-700 text-white"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newPkg.includes.map((item, i) => (
                <span key={i} className="flex items-center gap-1 text-xs bg-teal-500/10 text-teal-400 px-2 py-1 rounded-full">
                  {item} <button onClick={() => removeIncludeItem(i, newPkg.includes, (items) => setNewPkg({ ...newPkg, includes: items }))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl">Create Package</Button>
            <Button onClick={() => setShowAdd(false)} variant="outline" className="border-gray-700 text-gray-300">Cancel</Button>
          </div>
        </div>
      )}

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map(pkg => (
          <div key={pkg.id} className={`glass rounded-2xl p-5 border transition-all ${
            pkg.active ? 'border-gray-700/50' : 'border-gray-800/50 opacity-60'
          } ${pkg.popular ? 'ring-1 ring-amber-500/20' : ''}`}>
            {editingId === pkg.id ? (
              <div className="space-y-3">
                <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white" />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white" />
                  <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    className="bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm px-3 py-2">
                    {packageCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveEdit} size="sm" className="bg-teal-500 text-white rounded-lg"><Check className="w-4 h-4 mr-1" />Save</Button>
                  <Button onClick={() => setEditingId(null)} size="sm" variant="outline" className="border-gray-700 text-gray-300"><X className="w-4 h-4" /></Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{pkg.name}</h4>
                        {pkg.popular && <span className="flex items-center gap-0.5 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full"><Flame className="w-3 h-3" />POPULAR</span>}
                      </div>
                      <span className="text-xs text-gray-500">{pkg.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(pkg)} className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { if (confirm('Delete?')) deletePackage(pkg.id); }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">{pkg.description}</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold text-teal-400">R {pkg.price.toLocaleString('en-ZA')}</span>
                  {pkg.originalPrice && <span className="text-sm text-gray-500 line-through">R {pkg.originalPrice.toLocaleString('en-ZA')}</span>}
                </div>
                <div className="space-y-1 mb-3">
                  {pkg.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                      <ListChecks className="w-3 h-3 text-teal-400" />{item}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${pkg.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>{pkg.active ? 'Active' : 'Inactive'}</span>
                  <button onClick={() => updatePackage(pkg.id, { active: !pkg.active })}
                    className={`text-xs ${pkg.active ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {pkg.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
