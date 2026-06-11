import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, CheckCircle, ArrowRight, ArrowLeft, BadgeCheck, MapPin, Phone, Mail, Globe, Upload, Star, DollarSign, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Step = 1 | 2 | 3 | 4 | 5;

const saProvinces = ['Gauteng', 'KwaZulu-Natal', 'Western Cape', 'Eastern Cape', 'Mpumalanga', 'Limpopo', 'Free State', 'North West', 'Northern Cape'];

const serviceCategories = [
  'Venue', 'Catering', 'Photography', 'Videography', 'Music & DJ',
  'Decor & Flowers', 'Attire & Traditional Wear', 'Transport',
  'Cakes & Desserts', 'Hair & Makeup', 'Event Planning',
  'Security', 'Sound & Lighting', 'Tent & Equipment Hire',
  'Invitations & Stationery', 'Bartending',
];

export function VendorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    website: '',
    categories: [] as string[],
    description: '',
    priceRange: '',
    yearsExperience: '',
    staffCount: '',
    facebook: '',
    instagram: '',
    idNumber: '',
    businessReg: '',
    taxNumber: '',
    agreeTerms: false,
  });

  const toggleCategory = (cat: string) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const canProceed = () => {
    if (step === 1) return form.businessName && form.ownerName && form.email && form.phone;
    if (step === 2) return form.province && form.city && form.address;
    if (step === 3) return form.categories.length > 0 && form.description && form.priceRange;
    if (step === 4) return form.yearsExperience && form.idNumber;
    if (step === 5) return form.agreeTerms;
    return false;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Store in localStorage for demo
    const vendors = JSON.parse(localStorage.getItem('simpliflow_pending_vendors') || '[]');
    vendors.push({ ...form, id: `vendor-${Date.now()}`, status: 'pending_review', submittedAt: new Date().toISOString() });
    localStorage.setItem('simpliflow_pending_vendors', JSON.stringify(vendors));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
          <p className="text-gray-400 mb-2">Thank you for joining SimpliPlan's Vendor Marketplace.</p>
          <p className="text-gray-500 text-sm mb-6">Our team will review your application within 24-48 hours. You'll receive an email at {form.email} once approved.</p>

          <div className="glass rounded-2xl p-5 border border-teal-500/20 mb-6 text-left">
            <p className="text-sm text-gray-400 mb-1">Application Reference</p>
            <p className="text-lg font-mono text-teal-400">SPL-VEN-{Date.now().toString().slice(-6)}</p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl py-5">
              Back to Home
            </Button>
            <Button onClick={() => window.open(`https://wa.me/?text=Hi, I just submitted my vendor application for ${form.businessName} on SimpliPlan.`, '_blank')}
              variant="outline" className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-xl">
              Contact Us on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Become a SimpliPlan Vendor</h1>
          <p className="text-gray-400 text-sm">Join South Africa's fastest-growing event marketplace</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {([1, 2, 3, 4, 5] as Step[]).map(s => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s === step ? 'bg-teal-500 text-white' :
                  s < step ? 'bg-emerald-500 text-white' :
                  'bg-gray-800 text-gray-500 border border-gray-700'
                }`}>
                  {s < step ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 5 && <div className={`w-8 sm:w-16 h-0.5 mx-1 ${s < step ? 'bg-emerald-500' : 'bg-gray-800'}`} />}
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-gray-500">
            {step === 1 && 'Business Details'}
            {step === 2 && 'Location & Contact'}
            {step === 3 && 'Services & Pricing'}
            {step === 4 && 'Experience & Documents'}
            {step === 5 && 'Review & Submit'}
          </p>
        </div>

        {/* Step Content */}
        <div className="glass rounded-2xl p-6 border border-gray-700/50">

          {/* STEP 1: Business Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Tell us about your business</h2>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Business Name *</label>
                <Input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })}
                  placeholder="e.g. Royal Events SA" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Owner/Manager Full Name *</label>
                <Input value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })}
                  placeholder="e.g. John Mokoena" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="info@business.co.za" className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="082 123 4567" className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Business Website (optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
                    placeholder="https://yourbusiness.co.za" className="pl-10 bg-gray-800/50 border-gray-700 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Where are you based?</h2>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Province *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select value={form.province} onChange={e => setForm({ ...form, province: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    <option value="">Select Province</option>
                    {saProvinces.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">City/Town *</label>
                <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Sandton, Durban, Gqeberha" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Street Address *</label>
                <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. 123 Main Street" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Facebook (optional)</label>
                  <Input value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })}
                    placeholder="@page name" className="bg-gray-800/50 border-gray-700 text-white" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Instagram (optional)</label>
                  <Input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })}
                    placeholder="@handle" className="bg-gray-800/50 border-gray-700 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Services & Pricing */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">What services do you offer?</h2>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Service Categories * (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceCategories.map(cat => (
                    <button key={cat} onClick={() => toggleCategory(cat)}
                      className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
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

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Business Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your services, experience, and what makes your business special..."
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-600 rounded-lg text-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Price Range *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm">
                      <option value="">Select Range</option>
                      <option value="budget">Budget (Under R5,000)</option>
                      <option value="mid">Mid-Range (R5,000 - R20,000)</option>
                      <option value="premium">Premium (R20,000 - R50,000)</option>
                      <option value="luxury">Luxury (R50,000+)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Years in Business *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select value={form.yearsExperience} onChange={e => setForm({ ...form, yearsExperience: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm">
                      <option value="">Select</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1 - 3 years</option>
                      <option value="3-5">3 - 5 years</option>
                      <option value="5-10">5 - 10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Team Size</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select value={form.staffCount} onChange={e => setForm({ ...form, staffCount: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg text-sm">
                    <option value="">Select</option>
                    <option value="1">Just me</option>
                    <option value="2-5">2 - 5 people</option>
                    <option value="6-15">6 - 15 people</option>
                    <option value="16-50">16 - 50 people</option>
                    <option value="50+">50+ people</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Portfolio Photos (optional)</label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-teal-500/30 transition-all cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Drag photos here or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 10MB each</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Documents */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Verification Documents</h2>
              <p className="text-sm text-gray-500 mb-4">We verify all vendors to maintain quality and trust on our platform.</p>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">ID Number *</label>
                <Input value={form.idNumber} onChange={e => setForm({ ...form, idNumber: e.target.value })}
                  placeholder="South African ID Number" className="bg-gray-800/50 border-gray-700 text-white" />
                <p className="text-xs text-gray-600 mt-1">Required for identity verification</p>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Business Registration Number (optional)</label>
                <Input value={form.businessReg} onChange={e => setForm({ ...form, businessReg: e.target.value })}
                  placeholder="CIPC Registration Number" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Tax Number (optional)</label>
                <Input value={form.taxNumber} onChange={e => setForm({ ...form, taxNumber: e.target.value })}
                  placeholder="SARS Tax Number" className="bg-gray-800/50 border-gray-700 text-white" />
              </div>

              <div className="glass rounded-xl p-4 border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-400 font-medium mb-1">Why we verify vendors</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>Protect our users from scams and poor service</li>
                      <li>Ensure quality standards across the marketplace</li>
                      <li>Build trust between vendors and event planners</li>
                      <li>Verified vendors get a <BadgeCheck className="w-3 h-3 inline text-teal-400" /> badge on their profile</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Review your application</h2>

              <div className="space-y-3">
                <ReviewItem label="Business Name" value={form.businessName} />
                <ReviewItem label="Owner" value={form.ownerName} />
                <ReviewItem label="Email" value={form.email} />
                <ReviewItem label="Phone" value={form.phone} />
                <ReviewItem label="Location" value={`${form.city}, ${form.province}`} />
                <ReviewItem label="Address" value={form.address} />
                <ReviewItem label="Categories" value={form.categories.join(', ')} />
                <ReviewItem label="Price Range" value={form.priceRange} />
                <ReviewItem label="Experience" value={form.yearsExperience} />
                <ReviewItem label="Team Size" value={form.staffCount} />
              </div>

              <label className="flex items-start gap-3 p-4 glass rounded-xl border border-gray-700/50 cursor-pointer hover:border-teal-500/30 transition-all">
                <input type="checkbox" checked={form.agreeTerms} onChange={e => setForm({ ...form, agreeTerms: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-teal-500 mt-0.5" />
                <p className="text-sm text-gray-400">
                  I agree to the SimpliPlan Vendor Terms & Conditions. I confirm that all information provided is accurate and I have the authority to register this business.
                </p>
              </label>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button onClick={() => setStep((s: number) => (s - 1) as Step)} variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />Back
              </Button>
            )}
            <div className="flex-1" />
            {step < 5 ? (
              <Button onClick={() => setStep((s: number) => (s + 1) as Step)} disabled={!canProceed()}
                className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                Next<ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed()}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-xl disabled:opacity-50">
                <BadgeCheck className="w-4 h-4 mr-2" />Submit Application
              </Button>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Users, title: 'Reach 25K+ Users', desc: 'Get discovered by event planners across SA' },
            { icon: BadgeCheck, title: 'Verified Badge', desc: 'Stand out with our trust badge' },
            { icon: DollarSign, title: 'Zero Commission', desc: 'Keep 100% of your earnings' },
          ].map((b, i) => (
            <div key={i} className="glass rounded-xl p-4 border border-gray-700/50 text-center">
              <b.icon className="w-6 h-6 text-teal-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">{b.title}</p>
              <p className="text-xs text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-700/30">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-white text-right">{value}</span>
    </div>
  );
}
