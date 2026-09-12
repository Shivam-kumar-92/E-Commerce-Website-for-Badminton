import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Layers, 
  Truck, 
  ShieldCheck, 
  Zap,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
  compareCount = 0,
  onOpenCompare,
  onOpenQuiz,
  onOpenTracking,
  onOpenAdmin,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-dark-900 to-cyan-950 border-b border-emerald-500/20 px-3 py-1.5 text-[11px] sm:text-xs text-center text-slate-300 flex items-center justify-center gap-2 sm:gap-3">
        <span className="inline-flex items-center gap-1 font-bold text-volt whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 text-volt animate-bounce" />
          <span className="hidden sm:inline">TOURNAMENT SEASON DROP:</span>
        </span>
        <span className="truncate">Use code <code className="bg-volt/10 text-volt px-1.5 py-0.5 rounded font-mono font-bold border border-volt/30">SMASH20</code> for 20% OFF + Free Pro Stringing</span>
        <span className="hidden md:inline-block text-slate-500">•</span>
        <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan" /> 100% Genuine Rackets
        </span>
      </div>

      {/* Main Glass Navbar */}
      <nav className="glass-panel border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-volt via-emerald-400 to-cyan p-0.5 shadow-glow-volt group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                {/* Custom Badminton Shuttlecock Vector Icon */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-volt group-hover:rotate-12 transition-transform duration-300 fill-current">
                  <path d="M12 2L9.5 8.5H14.5L12 2Z" fill="#00FF66"/>
                  <path d="M7 10L5 15H19L17 10H7Z" fill="rgba(0, 255, 102, 0.4)"/>
                  <circle cx="12" cy="18.5" r="3.5" fill="#00F0FF"/>
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-volt transition-colors">
                  SMASH<span className="text-volt">PRO</span>
                </span>
                <span className="text-[10px] font-extrabold bg-volt/20 text-volt px-1.5 py-0.5 rounded uppercase tracking-wider border border-volt/30">
                  HQ
                </span>
              </div>
              <p className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
                Elite Badminton Engineering
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Astrox 100ZZ, Ryuga II, 3U, Axelsen, Speed..."
              className="w-full bg-dark-900/80 border border-slate-700/60 focus:border-volt rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-volt/20 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Desktop Navigation Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'shop' 
                  ? 'bg-white/10 text-volt border border-volt/30' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Rackets Catalog
            </button>

            <button
              onClick={onOpenQuiz}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-cyan hover:bg-cyan/10 border border-cyan/30 flex items-center gap-1.5 transition-all group"
            >
              <Sparkles className="w-4 h-4 text-cyan group-hover:rotate-12 transition-transform" />
              Matchmaker Quiz
            </button>

            <button
              onClick={onOpenCompare}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 relative transition-all"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              Compare
              {compareCount > 0 && (
                <span className="bg-volt text-dark-950 text-xs font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenTracking}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 transition-all"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              Track Order
            </button>

            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
            >
              Admin
            </button>
          </div>

          {/* Cart Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-volt text-dark-950 font-bold px-4 py-2 rounded-xl hover:shadow-glow-volt hover:scale-105 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-dark-950" />
              <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wide">Workshop Cart</span>
              <span className="bg-dark-950 text-volt text-xs px-2 py-0.5 rounded-lg font-black border border-volt/30">
                {cartCount}
              </span>
              {cartTotal > 0 && (
                <span className="hidden md:inline text-xs font-black text-dark-950 border-l border-dark-950/20 pl-2">
                  Rs {cartTotal.toFixed(2)}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-dark-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search & Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 space-y-3 pb-2 animate-in fade-in slide-in-from-top-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rackets..."
                className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setActiveTab('shop'); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-left text-sm font-semibold text-white"
              >
                🏸 Catalog
              </button>
              <button
                onClick={() => { onOpenQuiz(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-dark-900 border border-cyan/30 text-left text-sm font-semibold text-cyan flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Quiz Match
              </button>
              <button
                onClick={() => { onOpenCompare(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-left text-sm font-semibold text-emerald-400 flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4" /> Compare ({compareCount})
              </button>
              <button
                onClick={() => { onOpenTracking(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-left text-sm font-semibold text-amber-400 flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" /> Track Order
              </button>
            </div>
            
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="w-full py-2 text-xs font-semibold text-slate-400 bg-dark-900/50 rounded-lg text-center"
            >
              Inventory Management Portal
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
