import React from 'react';
import { Sparkles, Zap, Award, Flame, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export default function Hero({ onOpenQuiz, onSelectFeatured, featuredProducts = [] }) {
  const spotlightRacket = featuredProducts[0] || {
    id: "yonex-astrox-100zz",
    name: "Yonex Astrox 100ZZ",
    tagline: "Unleash Devastating Continuous Smash Power",
    price: 249.99,
    originalPrice: 289.99,
    badge: "Tour Winner's Choice",
    specs: { balance: "Head Heavy (305mm)", flex: "Extra Stiff", playstyle: "Head Heavy" }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/5">
      {/* Dynamic Background Ambient Glows & Court Lines */}
      <div className="absolute inset-0 bg-court-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-volt/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-crimson/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-dark-900/90 border border-volt/40 shadow-glow-volt text-xs font-bold text-volt tracking-wide">
              <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
              <span>THE GLOBAL DESTINATION FOR SERIOUS BADMINTON WARRIORS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              DOMINATE THE COURT WITH <span className="text-gradient-volt">ELITE SPEED</span> & RAW POWER.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Explore tournament-grade badminton weapons from <span className="text-white font-semibold">Yonex, Victor, Li-Ning, and Mizuno</span>. Custom-calibrated with electronic tension stringing, 3D spec comparison, and personalized grip customization.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenQuiz}
                className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-volt to-emerald-400 text-dark-950 font-extrabold text-base shadow-glow-volt hover:scale-105 active:scale-95 transition-all group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                Find My Perfect Racket Quiz
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#catalog"
                className="flex items-center gap-2.5 px-6 py-4 rounded-2xl glass-panel border border-slate-700 hover:border-slate-500 text-white font-bold text-base hover:bg-white/5 transition-all"
              >
                Browse All Rackets
              </a>
            </div>

            {/* Value Props Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-volt font-bold text-sm sm:text-base">
                  <Zap className="w-4 h-4" /> 565 km/h
                </div>
                <p className="text-xs text-slate-400">World Smash Record Series in Stock</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-cyan font-bold text-sm sm:text-base">
                  <Activity className="w-4 h-4" /> Pro Stringing
                </div>
                <p className="text-xs text-slate-400">Electronic 4-Knot 20–35 LBS Calibrated</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm sm:text-base">
                  <ShieldCheck className="w-4 h-4" /> 100% Genuine
                </div>
                <p className="text-xs text-slate-400">Official Brand Hologram Guarantee</p>
              </div>
            </div>

          </div>

          {/* Right Hero Spotlight Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-1 bg-gradient-to-br from-volt/40 via-cyan/30 to-crimson/30 shadow-2xl">
              <div className="bg-dark-900/95 rounded-[22px] p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden space-y-6">
                
                {/* Floating Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson/20 border border-crimson/40 text-crimson text-xs font-black uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5 fill-crimson" /> Featured Weapon
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Stock: <span className="text-volt font-bold">{spotlightRacket.stock || 18} Left</span>
                  </span>
                </div>

                {/* Product Spotlight Visual */}
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-dark-950 flex items-center justify-center p-4 border border-white/10 group cursor-pointer"
                  onClick={() => onSelectFeatured(spotlightRacket)}
                >
                  <img
                    src={spotlightRacket.image || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80"}
                    alt={spotlightRacket.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <p className="text-xs text-volt font-bold uppercase tracking-wider">{spotlightRacket.brand}</p>
                      <h3 className="text-lg sm:text-xl font-black">{spotlightRacket.name}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs line-through text-slate-400">${spotlightRacket.originalPrice}</span>
                      <p className="text-xl font-extrabold text-volt">${spotlightRacket.price}</p>
                    </div>
                  </div>
                </div>

                {/* Mini Spec Matrix */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Balance</span>
                    <span className="font-extrabold text-white">{spotlightRacket.specs?.balance || "Head Heavy"}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Flex</span>
                    <span className="font-extrabold text-white">{spotlightRacket.specs?.flex || "Extra Stiff"}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Max Tension</span>
                    <span className="font-extrabold text-volt">29+ LBS</span>
                  </div>
                </div>

                {/* Customizer Direct CTA */}
                <button
                  onClick={() => onSelectFeatured(spotlightRacket)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm uppercase tracking-wide hover:shadow-glow-cyan hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Configure Custom Stringing & Grip
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
