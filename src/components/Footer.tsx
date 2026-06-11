import { Link } from 'react-router-dom';
import { Facebook, Twitter, Music, Phone, User, MapPin, Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">SimpliPlan</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              South Africa's most trusted event planning platform. 
              From Lobola to uMemulo, we help you plan every celebration.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/SimpliPlanApp" target="_blank" rel="noopener noreferrer" 
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-teal-400 hover:border-teal-500/30 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://x.com/PlanSimpli21515" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-teal-400 hover:border-teal-500/30 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@simpli_plan" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-teal-400 hover:border-teal-500/30 transition-all">
                <Music className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="text-sm text-gray-500 hover:text-teal-400 transition-colors">Home</Link>
              <Link to="/pricing" className="text-sm text-gray-500 hover:text-teal-400 transition-colors">Pricing</Link>
              <Link to="/about" className="text-sm text-gray-500 hover:text-teal-400 transition-colors">About Us</Link>
              <Link to="/register" className="text-sm text-gray-500 hover:text-teal-400 transition-colors">Sign Up</Link>
              <Link to="/vendor-join" className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium">For Vendors</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-teal-400 transition-colors">Terms</Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-teal-400 transition-colors">Privacy</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <User className="w-4 h-4 text-teal-400" />
                <span>Head of Marketing</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-teal-400" />
                <a href="tel:0818430771" className="hover:text-teal-400 transition-colors">081 843 0771</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>South Africa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {currentYear} SimpliPlan. All rights reserved. Made with love for South Africa.
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-xs text-gray-600 hover:text-teal-400 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-xs text-gray-600 hover:text-teal-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
