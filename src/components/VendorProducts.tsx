import { useState } from 'react';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Check, X, Power, PowerOff, Tag, DollarSign, Search } from 'lucide-react';

const categories = ['Venue', 'Catering', 'Photography', 'Music & DJ', 'Decor & Flowers', 'Transport', 'Attire', 'Cakes', 'Hair & Makeup', 'Other'];

export function VendorProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useVendorAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: 'Venue' });
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category: 'Venue', active: true });

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = products.filter(p => p.active).length;
  const inactiveCount = products.filter(p => !p.active).length;

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price) return;
    addProduct({
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      active: true,
    });
    setNewProduct({ name: '', description: '', price: '', category: 'Venue' });
    setShowAdd(false);
  };

  const startEdit = (product: typeof products[0]) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      active: product.active,
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateProduct(editingId, {
      name: editForm.name,
      description: editForm.description,
      price: parseFloat(editForm.price),
      category: editForm.category,
      active: editForm.active,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-teal-400">{products.length}</p>
          <p className="text-xs text-gray-500">Total Products</p>
        </div>
        <div className="glass rounded-xl p-4 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="glass rounded-xl p-4 border border-gray-700/50 text-center">
          <p className="text-2xl font-bold text-gray-400">{inactiveCount}</p>
          <p className="text-xs text-gray-500">Inactive</p>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..." className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" />Add Product
        </Button>
      </div>

      {/* Add Product Form */}
      {showAdd && (
        <div className="glass rounded-2xl p-5 border border-teal-500/20 space-y-4">
          <h3 className="text-base font-semibold text-white">Add New Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Product Name *</label>
              <Input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g. Wedding Venue Full Day" className="bg-gray-800/50 border-gray-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Price (R) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="35000" className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm px-3 py-2">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description</label>
            <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Describe your product..." rows={3}
              className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-600 rounded-lg text-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl">Save Product</Button>
            <Button onClick={() => setShowAdd(false)} variant="outline" className="border-gray-700 text-gray-300">Cancel</Button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="space-y-3">
        {filtered.map(product => (
          <div key={product.id} className={`glass rounded-xl p-4 border transition-all ${
            product.active ? 'border-gray-700/50' : 'border-gray-800/50 opacity-60'
          }`}>
            {editingId === product.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-gray-800/50 border-gray-700 text-white" />
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
                  </div>
                </div>
                <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm px-3 py-2">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  rows={2} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm p-3 resize-none" />
                <div className="flex gap-2">
                  <Button onClick={saveEdit} size="sm" className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg"><Check className="w-4 h-4 mr-1" />Save</Button>
                  <Button onClick={() => setEditingId(null)} size="sm" variant="outline" className="border-gray-700 text-gray-300"><X className="w-4 h-4" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white">{product.name}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${product.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{product.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="text-teal-400 font-medium">R {product.price.toLocaleString('en-ZA')}</span>
                    <span>{product.category}</span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => updateProduct(product.id, { active: !product.active })}
                    className={`p-2 rounded-lg transition-all ${product.active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-600 hover:bg-gray-800'}`}>
                    {product.active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(product)} className="p-2 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Delete this product?')) deleteProduct(product.id); }}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No products found. Add your first product above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
