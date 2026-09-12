import React from 'react';
import { Filter, X, RotateCcw, Check, Sparkles } from 'lucide-react';

export default function FiltersSidebar({
  selectedBrand,
  setSelectedBrand,
  selectedPlaystyle,
  setSelectedPlaystyle,
  selectedFlex,
  setSelectedFlex,
  selectedWeight,
  setSelectedWeight,
  priceRange,
  setPriceRange,
  onResetFilters,
  brands = [],
  totalResults = 0,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) {
  const playstyles = [
    { id: 'all', label: 'All Playstyles' },
    { id: 'power', label: '💥 Head Heavy (Power / Smashes)' },
    { id: 'speed', label: '⚡ Head Light (Speed / Drives)' },
    { id: 'control', label: '🎯 Even Balance (All-Around Control)' }
  ];

  const flexOptions = [
    { id: 'all', label: 'All Stiffness' },
    { id: 'Extra Stiff', label: 'Extra Stiff (Tournament Pro)' },
    { id: 'Stiff', label: 'Stiff (Power Repulsion)' },
    { id: 'Medium', label: 'Medium Flex (Easy Power)' },
    { id: 'Flexible', label: 'Flexible (High Whipping)' }
  ];

  const weightOptions = [
    { id: 'all', label: 'All Weights' },
    { id: '3U', label: '3U (88g - 90g Heavy Smash)' },
    { id: '4U', label: '4U (83g - 85g Global Standard)' },
    { id: '5U', label: '5U / 6U (75g - 80g Super Light)' }
  ];

  const filterContent = (
    <div className="space-y-6">
      {/* Brand Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Brand Manufacturer
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedBrand === 'all'
                ? 'bg-volt text-dark-950 shadow-glow-volt font-black'
                : 'bg-dark-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            All Brands
          </button>
          {['Yonex', 'Victor', 'Li-Ning', 'Mizuno', 'Apacs'].map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(selectedBrand === brand ? 'all' : brand)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedBrand === brand
                  ? 'bg-volt text-dark-950 shadow-glow-volt font-black'
                  : 'bg-dark-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Playstyle Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Balance / Playstyle
        </label>
        <div className="space-y-1.5">
          {playstyles.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedPlaystyle(style.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                selectedPlaystyle === style.id
                  ? 'bg-cyan/15 text-cyan border border-cyan/40 font-bold'
                  : 'bg-dark-900/60 text-slate-300 hover:bg-dark-900 hover:text-white border border-transparent'
              }`}
            >
              <span>{style.label}</span>
              {selectedPlaystyle === style.id && <Check className="w-4 h-4 text-cyan" />}
            </button>
          ))}
        </div>
      </div>

      {/* Weight Class */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Weight Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {weightOptions.map(w => (
            <button
              key={w.id}
              onClick={() => setSelectedWeight(w.id)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                selectedWeight === w.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-dark-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {w.id === 'all' ? 'All Weights' : w.id}
            </button>
          ))}
        </div>
      </div>

      {/* Shaft Flex */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Shaft Stiffness
        </label>
        <div className="space-y-1.5">
          {flexOptions.map(flx => (
            <button
              key={flx.id}
              onClick={() => setSelectedFlex(flx.id)}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                selectedFlex === flx.id
                  ? 'bg-volt/15 text-volt border border-volt/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{flx.label}</span>
              {selectedFlex === flx.id && <Check className="w-4 h-4 text-volt" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Max Budget:
          </label>
          <span className="text-sm font-extrabold text-volt font-mono">
            Rs {priceRange}
          </span>
        </div>
        <input
          type="range"
          min="60"
          max="320"
          step="10"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-volt"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Rs 60</span>
          <span>Rs 190</span>
          <span>Rs 320+</span>
        </div>
      </div>

      {/* Results Counter Badge */}
      <div className="pt-2 text-center text-xs font-medium text-slate-400">
        Showing <span className="font-bold text-white">{totalResults}</span> tournament rackets
      </div>
    </div>
  );

  // If Mobile Drawer Mode
  if (isMobileDrawer) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
        <div 
          onClick={onCloseMobileDrawer} 
          className="flex-1" 
        />
        <div className="bg-dark-950 border-t border-slate-800 rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
          
          {/* Drawer Handle & Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-volt/15 flex items-center justify-center text-volt">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Filter & Refine Weapons</h3>
                <p className="text-[11px] text-slate-400">Customize playstyle, balance & brands</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-volt px-2 py-1 rounded-lg hover:bg-white/5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Filters */}
          <div className="p-5 overflow-y-auto flex-1 space-y-6">
            {filterContent}
          </div>

          {/* Sticky Apply Button */}
          <div className="p-4 border-t border-slate-800 bg-dark-900/95 backdrop-blur-md shrink-0 flex items-center gap-3">
            <button
              onClick={onResetFilters}
              className="py-3 px-4 rounded-xl bg-dark-950 border border-slate-800 text-slate-300 font-bold text-xs hover:border-slate-600"
            >
              Reset
            </button>
            <button
              onClick={onCloseMobileDrawer}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-volt to-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wider shadow-glow-volt"
            >
              Apply & Show {totalResults} Rackets
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Standard Desktop Sidebar Mode
  return (
    <aside className="w-full lg:w-72 space-y-6">
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-volt" />
            <h3 className="font-extrabold text-base text-white">Refine Weapons</h3>
          </div>
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-volt transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {filterContent}
      </div>
    </aside>
  );
}
