import { useState } from 'react';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Globe, Facebook, Instagram, Star, BadgeCheck, Upload, Save, Store, FileText, Clock, CheckCircle } from 'lucide-react';

const saProvinces = ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Mpumalanga', 'Limpopo', 'Free State', 'North West', 'Northern Cape'];
const serviceCategories = ['Venue', 'Catering', 'Photography', 'Videography', 'Music & DJ', 'Decor & Flowers', 'Attire & Traditional Wear', 'Transport', 'Cakes & Desserts', 'Hair & Makeup', 'Event Planning', 'Security', 'Sound & Lighting', 'Tent & Equipment Hire', 'Invitations & Stationery', 'Bartending'];

export function VendorProfile() {
  const { vendor, updateProfile } = useVendorAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    businessName: vendor?.businessName || '',
    ownerName: vendor?.ownerName || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    website: vendor?.website || '',
    facebook: vendor?.facebook || '',
    instagram: vendor?.instagram || '',
    province: vendor?.province || '',
    city: vendor?.city || '',
    address: vendor?.address || '',
    description: vendor?.description || '',
    priceRange: vendor?.priceRange || '',
    yearsExperience: vendor?.yearsExperience || '',
    staffCount: vendor?.staffCount || '',
    categories: vendor?.categories || [] as string[],
  });

  if (!vendor) return null;

  const toggleCategory = (cat: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat],
    }));
  };

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const priceRanges = [
    { value: 'budget', label: 'Budget (Under R5,000)' },
    { value: 'mid', label: 'Mid-Range (R5,000 - R20,000)' },
    { value: 'premium', label: 'Premium (R20,000 - R50,000)' },
    { value: 'luxury', label: 'Luxury (R50,000+)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-3xl font-bold text-white">
              {vendor.businessName.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-all">
              <Upload className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{vendor.businessName}</h2>
              {vendor.verified && <BadgeCheck className="w-5 h-5 text-teal-400" />}
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm text-white font-medium">{vendor.rating}</span>
              <span className="text-xs text-gray-500">({vendor.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${vendor.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {vendor.status}
              </span>
              {vendor.premium && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">PREMIUM</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Business Info */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Store className="w-4 h-4 text-teal-400" /> Business Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Business Name</label>
              <Input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Owner Name</label>
              <Input value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white" /></div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phone</label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white" /></div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-400" /> Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Province</label>
              <select value={form.province} onChange={e => setForm({ ...form, province: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm px-3 py-2">
                <option value="">Select</option>
                {saProvinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">City</label>
              <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Address</label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white" />
            </div>
          </div>
        </div>

        {/* Online Presence */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-teal-400" /> Online Presence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Website</label>
              <div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white" /></div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Facebook</label>
              <div className="relative"><Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white" /></div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Instagram</label>
              <div className="relative"><Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white" /></div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Store className="w-4 h-4 text-teal-400" /> Service Categories</h3>
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map(cat => (
              <button key={cat} onClick={() => toggleCategory(cat)}
                className={`px-3 py-2 rounded-lg border text-xs transition-all ${
                  form.categories.includes(cat)
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                    : 'bg-gray-800/30 border-gray-700/30 text-gray-400 hover:border-gray-600'
                }`}>
                {form.categories.includes(cat) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-teal-400" /> Business Description</h3>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your business, services, and what makes you unique..." rows={4}
            className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-600 rounded-lg text-sm p-3 resize-none" />
        </div>

        {/* Pricing & Experience */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-teal-400" /> Pricing & Experience</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Price Range</label>
              <select value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm px-3 py-2">
                <option value="">Select</option>
                {priceRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Years in Business</label>
              <select value={form.yearsExperience} onChange={e => setForm({ ...form, yearsExperience: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm px-3 py-2">
                <option value="">Select</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1 - 3 years</option>
                <option value="3-5">3 - 5 years</option>
                <option value="5-10">5 - 10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Team Size</label>
              <select value={form.staffCount} onChange={e => setForm({ ...form, staffCount: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm px-3 py-2">
                <option value="">Select</option>
                <option value="1">Just me</option>
                <option value="2-5">2 - 5</option>
                <option value="6-15">6 - 15</option>
                <option value="16-50">16 - 50</option>
                <option value="50+">50+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Portfolio Upload */}
        <div className="glass rounded-2xl p-5 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-teal-400" /> Portfolio Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center hover:border-teal-500/30 transition-all cursor-pointer">
                <Upload className="w-6 h-6 text-gray-600 mb-1" />
                <span className="text-[10px] text-gray-600">Photo {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 glass rounded-2xl p-4 border border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saved && <><CheckCircle className="w-5 h-5 text-emerald-400" /><span className="text-sm text-emerald-400">Changes saved!</span></>}
        </div>
        <Button onClick={handleSave} className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-8">
          <Save className="w-4 h-4 mr-2" />Save Changes
        </Button>
      </div>
    </div>
  );
}
