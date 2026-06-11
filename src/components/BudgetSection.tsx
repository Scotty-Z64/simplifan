import { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Building,
  Shirt,
  Utensils,
  Truck,
  Cross,
  Flower,
  Star,
  Music,
  Gift,
  Camera,
  FileText,
  Sparkles,
  Lightbulb,
  Package,
  Search,
  X,
  Check,
  Zap,
  Pencil,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { EventPlan, BudgetItem, EventType } from '@/types';
import { getSuggestionsForCategory, getCulturalNote } from '@/translations/cultureTemplates';
import { languageNames } from '@/types/language';
import { VendorPriceDropdown } from './VendorPriceDropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const iconMap: Record<string, React.ElementType> = {
  building: Building,
  shirt: Shirt,
  utensils: Utensils,
  heart: Sparkles,
  truck: Truck,
  cross: Cross,
  flower: Flower,
  star: Star,
  music: Music,
  gift: Gift,
  camera: Camera,
  file: FileText,
};

// Culture-aware smart suggestions
function getSmartSuggestions(categoryName: string, eventType: EventType, culture: string): string[] {
  // First check culture-specific templates
  const cultureSuggestions = getSuggestionsForCategory(culture as 'en' | 'zu' | 'xh', categoryName);
  if (cultureSuggestions.length > 0) {
    return cultureSuggestions;
  }

  // Fallback to event-type specific defaults
  const fallbackMap: Record<string, Record<string, string[]>> = {
    'Venue': {
      wedding: ['Venue Hire', 'Marquee Rental', 'Venue Deposit', 'Security', 'Parking'],
      lobola: ['Home Venue Setup', 'Tent Rental', 'Chairs & Tables', 'Security'],
      funeral: ['Church Hall', 'Tent Rental', 'Chairs', 'Sound System'],
      default: ['Venue Hire', 'Venue Deposit', 'Venue Cleaning', 'Security', 'Parking'],
    },
    'Attire': {
      wedding: ['Wedding Dress', 'Groom Suit', 'Bridesmaid Dresses', 'Accessories', 'Hair & Makeup'],
      lobola: ['Traditional Dress', 'Accessories', 'Headwrap', 'Jewelry'],
      umemulo: ['Traditional Beads', 'Outfit', 'Headpiece', 'Accessories'],
      default: ['Main Outfit', 'Accessories', 'Shoes', 'Hair & Makeup'],
    },
    'Catering': {
      wedding: ['Wedding Cake', 'Main Meal', 'Drinks', 'Desserts', 'Late Night Snack'],
      funeral: ['Funeral Meal', 'Tea & Coffee', 'Plates & Cups', 'Water'],
      birthday: ['Birthday Cake', 'Snacks', 'Drinks', 'Party Food'],
      default: ['Main Meal', 'Drinks & Beverages', 'Cake', 'Plates & Cutlery'],
    },
    'Photography': {
      wedding: ['Photographer (Full Day)', 'Videographer', 'Photo Album', 'Engagement Shoot'],
      default: ['Photographer', 'Videographer', 'Photo Album', 'Extra Prints'],
    },
    'Music & Entertainment': {
      wedding: ['DJ/MC', 'Sound System', 'Live Band', 'Dance Floor Setup'],
      lobola: ['Traditional Singers', 'DJ', 'Sound System'],
      default: ['DJ', 'Sound System', 'Live Band', 'Dance Floor'],
    },
    'Decor & Flowers': {
      wedding: ['Bridal Bouquet', 'Table Centerpieces', 'Arch/Backdrop', 'Aisle Decor'],
      funeral: ['Wreaths', 'Flower Arrangements', 'Program Boards'],
      default: ['Flowers', 'Table Decor', 'Lighting', 'Balloons'],
    },
    'Transport': {
      wedding: ['Bridal Car', 'Guest Shuttle', 'Family Transport'],
      funeral: ['Hearse', 'Family Cars', 'Guest Transport'],
      default: ['Guest Transport', 'Family Transport', 'Parking'],
    },
    'Gifts & Favours': {
      lobola: ['Dowry Cattle (Imali)', 'Blankets', 'Groceries', 'Cash Gift'],
      wedding: ['Bridesmaid Gifts', 'Groomsmen Gifts', 'Guest Favours'],
      default: ['Guest Favours', 'Thank You Gifts', 'Packaging'],
    },
    'Dowry (Lobola)': {
      default: ['Cash Payment', 'Cattle', 'Groceries', 'Blankets', 'Clothing'],
    },
    'Dowry & Gifts': {
      default: ['Cash Payment', 'Livestock', 'Blankets', 'Groceries'],
    },
    'Ceremony Items': {
      default: ['Traditional Beads', 'Snuff', 'Traditional Beer', 'Goat/Cow'],
    },
    'Ritual Items': {
      default: ['Impepho', 'Snuff', 'Traditional Beer', 'Goat'],
    },
  };

  const catKey = Object.keys(fallbackMap).find(k =>
    categoryName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(categoryName.toLowerCase())
  );
  if (!catKey) return [];

  const templates = fallbackMap[catKey];
  const eventKey = eventType === 'traditional_wedding' ? 'wedding' : eventType;
  return templates[eventKey] || templates.default || [];
}

interface BudgetSectionProps {
  plan: EventPlan;
  onAddItem: (categoryId: string, item: Omit<BudgetItem, 'id'>) => void;
  onUpdateItem: (categoryId: string, itemId: string, updates: Partial<BudgetItem>) => void;
  onDeleteItem: (categoryId: string, itemId: string) => void;
  onToggleComplete: (categoryId: string, itemId: string) => void;
  onToggleExpand: (categoryId: string) => void;
  onAddFromVendor: (categoryId: string, name: string, price: number) => void;
}

export function BudgetSection({
  plan,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleComplete,
  onToggleExpand,
  onAddFromVendor,
}: BudgetSectionProps) {
  const { t, language } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState('');
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<{catId: string, itemId: string} | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState(1);
  const [editPrice, setEditPrice] = useState('');

  const totalBudget = useMemo(() => {
    return plan.categories.reduce((sum, cat) => 
      sum + cat.items.reduce((s, item) => s + item.price * item.quantity, 0), 0
    );
  }, [plan.categories]);

  const handleAddItem = (categoryId: string) => {
    if (newItemName && newItemPrice) {
      onAddItem(categoryId, {
        name: newItemName,
        quantity: newItemQuantity,
        price: parseFloat(newItemPrice),
        completed: false,
      });
      setNewItemName('');
      setNewItemQuantity(1);
      setNewItemPrice('');
      setDialogOpen(false);
    }
  };

  const handleQuickAdd = (categoryId: string, suggestion: string) => {
    onAddItem(categoryId, {
      name: suggestion,
      quantity: 1,
      price: 0,
      completed: false,
    });
  };

  const toggleSuggestions = (categoryId: string) => {
    setShowSuggestions(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const openAddDialog = (categoryId: string) => {
    setActiveCategory(categoryId);
    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemPrice('');
    setDialogOpen(true);
  };

  const openEditDialog = (catId: string, item: BudgetItem) => {
    setEditingItem({catId, itemId: item.id});
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditPrice(item.price.toString());
  };

  const saveEdit = () => {
    if (editingItem && editName) {
      onUpdateItem(editingItem.catId, editingItem.itemId, {
        name: editName,
        quantity: editQuantity,
        price: parseFloat(editPrice) || 0,
      });
      setEditingItem(null);
    }
  };

  const filteredCategories = searchQuery
    ? plan.categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : plan.categories;

  const activeCatName = activeCategory ? plan.categories.find(c => c.id === activeCategory)?.name : '';
  const activeSuggestions = activeCategory ? getSmartSuggestions(activeCatName || '', plan.eventType, language) : [];

  return (
    <div className="space-y-4">
      {/* Budget Overview */}
      <div className="glass rounded-2xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">{t('budget.overview')}</h3>
          <span className="text-2xl font-bold gradient-text">
            R {totalBudget.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="space-y-2">
          {plan.categories.map((cat) => {
            const catTotal = cat.items.reduce((s, item) => s + item.price * item.quantity, 0);
            const percentage = totalBudget > 0 ? (catTotal / totalBudget) * 100 : 0;
            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{cat.name}</span>
                  <span className="text-gray-500">{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 0.5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cultural Note Banner */}
      {language !== 'en' && (
        <div className="glass rounded-xl p-3 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm">★</span>
            <span className="text-sm text-amber-300">
              <strong>{languageNames[language]}:</strong> {getCulturalNote(language)}
            </span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder={t('budget.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-600"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Cards */}
      <div className="space-y-3">
        {filteredCategories.map((category) => {
          const Icon = iconMap[category.icon] || Package;
          const categoryTotal = category.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const completedCount = category.items.filter(i => i.completed).length;
          const suggestions = getSmartSuggestions(category.name, plan.eventType, language);
          const hasSuggestions = suggestions.length > 0;

          return (
            <div key={category.id} className="glass rounded-2xl border border-gray-700/50 overflow-hidden">
              {/* Category Header Row */}
              <div
                className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => onToggleExpand(category.id)}
              >
                {/* Expand Chevron */}
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleExpand(category.id); }}
                  className="text-gray-500 hover:text-teal-400 transition-colors flex-shrink-0"
                >
                  {category.expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-teal-400" />
                </div>

                {/* Name & Item Count */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate text-base">{category.name}</p>
                  <p className="text-sm text-gray-500">{category.items.length} items</p>
                </div>

                {/* Price Pill */}
                <span className="text-sm font-bold text-teal-400 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 flex-shrink-0">
                  R {categoryTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </span>

                {/* Add Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); openAddDialog(category.id); }}
                  className="w-10 h-10 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                >
                  <Plus className="w-5 h-5 text-teal-400" />
                </button>
              </div>

              {/* Expanded Dropdown Content */}
              {category.expanded && (
                <div className="border-t border-gray-700/50">
                  {/* Smart Suggestions */}
                  {hasSuggestions && category.items.length === 0 && (
                    <div className="p-4 bg-amber-500/5 border-b border-amber-500/10">
                      <button
                        onClick={() => toggleSuggestions(category.id)}
                        className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 w-full"
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span className="font-medium">Smart Suggestions</span>
                        <span className="text-gray-500 text-xs">({suggestions.length})</span>
                        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showSuggestions[category.id] ? 'rotate-180' : ''}`} />
                      </button>
                      {showSuggestions[category.id] && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {suggestions.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => handleQuickAdd(category.id, s)}
                              className="flex items-center gap-1 text-xs bg-gray-800 hover:bg-teal-500/20 text-gray-300 hover:text-teal-400 px-3 py-2 rounded-xl border border-gray-700 transition-all"
                            >
                              <Plus className="w-3 h-3" />{s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Items Table Header */}
                  {category.items.length > 0 && (
                    <div className="px-4 py-2 grid grid-cols-12 gap-2 text-xs text-gray-500 uppercase">
                      <div className="col-span-1"></div>
                      <div className="col-span-4">Item</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-2 text-right">Price</div>
                      <div className="col-span-2 text-right">Total</div>
                      <div className="col-span-1"></div>
                    </div>
                  )}

                  {/* Items List */}
                  {category.items.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 text-sm">{t('budget.noItems')}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-700/30">
                      {category.items.map((item) => (
                        <div key={item.id} className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-800/20 group">
                          {/* Checkbox */}
                          <div className="col-span-1 flex justify-center">
                            {!plan.finalized ? (
                              <button onClick={() => onToggleComplete(category.id, item.id)} className="text-teal-400">
                                {item.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                              </button>
                            ) : (
                              item.completed ? <CheckSquare className="w-5 h-5 text-teal-400" /> : <Square className="w-5 h-5 text-gray-600" />
                            )}
                          </div>

                          {/* Item Name */}
                          <div className="col-span-4 min-w-0">
                            <p className={`text-sm truncate ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                              {item.name}
                            </p>
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2 text-center">
                            <span className="text-sm text-gray-400">{item.quantity}</span>
                          </div>

                          {/* Unit Price */}
                          <div className="col-span-2 text-right">
                            <span className="text-sm text-gray-400">R {item.price.toFixed(2)}</span>
                          </div>

                          {/* Total */}
                          <div className="col-span-2 text-right">
                            <span className="text-sm font-semibold text-teal-400">
                              R {(item.quantity * item.price).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex justify-end gap-1">
                            {!plan.finalized && (
                              <>
                                <button
                                  onClick={() => openEditDialog(category.id, item)}
                                  className="p-1 text-gray-600 hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteItem(category.id, item.id)}
                                  className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Category Footer */}
                  {category.items.length > 0 && (
                    <div className="px-4 py-3 bg-gray-800/30 border-t border-gray-700/30 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{category.items.length} items</span>
                        {completedCount > 0 && <span className="text-emerald-400">{completedCount} completed</span>}
                      </div>
                      <span className="text-sm font-bold text-white">
                        Total: R {categoryTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  {/* Add from Vendor */}
                  <div className="px-4 py-3 border-t border-gray-700/30">
                    <VendorPriceDropdown
                      categoryName={category.name}
                      onSelectPrice={(price, vendorName, service) => {
                        onAddFromVendor(category.id, `${service} (${vendorName})`, price);
                      }}
                    />
                  </div>

                  {/* Quick Add More Button */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => openAddDialog(category.id)}
                      className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-teal-500/50 hover:text-teal-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">{t('budget.addItem')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Item Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-400" />
              {t('budget.addTo')} {activeCatName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label className="text-gray-400">{t('budget.itemName')}</Label>
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={t('budget.itemName.placeholder')}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">{t('budget.quantity')}</Label>
                <Input type="number" value={newItemQuantity} onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)} min={1} className="bg-gray-800 border-gray-700 text-white mt-1" />
              </div>
              <div>
                <Label className="text-gray-400">{t('budget.priceR')}</Label>
                <Input type="number" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} placeholder="0.00" className="bg-gray-800 border-gray-700 text-white mt-1" />
              </div>
            </div>
            {activeSuggestions.length > 0 && (
              <div>
                <Label className="text-gray-400 flex items-center gap-1 mb-2">
                  <Zap className="w-3 h-3 text-amber-400" />{t('budget.quickAdd')}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {activeSuggestions.slice(0, 5).map((s, i) => (
                    <button key={i} onClick={() => setNewItemName(s)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={() => activeCategory && handleAddItem(activeCategory)} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-4 h-4 mr-2" />{t('budget.addItem')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Pencil className="w-5 h-5 text-teal-400" />
              {t('budget.editItem')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label className="text-gray-400">Item Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-gray-800 border-gray-700 text-white mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Quantity</Label>
                <Input type="number" value={editQuantity} onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)} min={1} className="bg-gray-800 border-gray-700 text-white mt-1" />
              </div>
              <div>
                <Label className="text-gray-400">Price (R)</Label>
                <Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="bg-gray-800 border-gray-700 text-white mt-1" />
              </div>
            </div>
            <Button onClick={saveEdit} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              <Check className="w-4 h-4 mr-2" />{t('budget.saveChanges')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
