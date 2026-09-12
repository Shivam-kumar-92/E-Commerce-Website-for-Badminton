import React from 'react';
import { ShieldCheck, Zap, Award, Truck, Heart, Sparkles } from 'lucide-react';

export default function Footer({ onOpenQuiz, onOpenTracking, onFilterBrand }) {
  return (
    <footer className="border-t border-slate-800 bg-dark-950 pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top 4 Value Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl glass-panel border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-volt/10 text-volt flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">Electronic Stringing</h4>
              <p className="text-[11px] text-slate-400">4-Knot 20–35 LBS Calibrated</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan/10 text-cyan flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">100% Genuine Rackets</h4>
              <p className="text-[11px] text-slate-400">Official Hologram Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">Global Pro Dispatch</h4>
              <p className="text-[11px] text-slate-400">Free VIP Courier on Rs 150+</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-crimson/10 text-crimson flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">30-Day Frame Warranty</h4>
              <p className="text-[11px] text-slate-400">Tournament Ready Quality</p>
            </div>
          </div>
        </div>

        {/* Middle Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-volt p-0.5 flex items-center justify-center">
                <span className="text-dark-950 font-black text-sm">🏸</span>
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                SMASH<span className="text-volt">PRO</span> HQ
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The international destination for tournament-grade badminton rackets, precision stringing tension calibration, and racket customizer workshops.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-3">
              Official Brands
            </h4>
            <ul className="space-y-2 text-xs">
              {['Yonex', 'Victor', 'Li-Ning', 'Mizuno', 'Apacs'].map(brand => (
                <li key={brand}>
                  <button
                    onClick={() => onFilterBrand(brand)}
                    className="hover:text-volt transition-colors"
                  >
                    {brand} Tournament Series
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-3">
              Interactive Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenQuiz} className="text-cyan hover:underline flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Racket Matchmaker Quiz
                </button>
              </li>
              <li>
                <button onClick={onOpenTracking} className="hover:text-white">
                  Live Stringing Studio Tracker
                </button>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white">
                  Side-by-Side Racket Spec Matrix
                </a>
              </li>
              <li>
                <span className="text-slate-500">Tension Calibration Calculator (20-35 LBS)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider">
              Smash Club VIP Newsletter
            </h4>
            <p className="text-xs text-slate-400">
              Get exclusive early access to limited edition colorways and stringing discounts.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="player@badminton.com"
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-volt"
              />
              <button className="px-3 py-2 rounded-xl bg-volt text-dark-950 font-black uppercase text-xs hover:shadow-glow-volt">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} SMASHPRO Badminton HQ. Built for tournament competitors worldwide.
          </div>
          <div className="flex items-center gap-4">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>BWF International Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
