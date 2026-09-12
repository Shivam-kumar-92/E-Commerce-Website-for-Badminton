import React from 'react';
import { 
  Home, 
  Sparkles, 
  SlidersHorizontal, 
  ShoppingBag, 
  Layers, 
  Flame 
} from 'lucide-react';

export default function MobileBottomNav({
  cartCount = 0,
  onOpenCart,
  compareCount = 0,
  onOpenCompare,
  onOpenQuiz,
  onOpenMobileFilters,
  activeFilterCount = 0
}) {
  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 safe-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0.6rem))' }}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-around gap-1">
        
        {/* Home */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 active:text-volt hover:text-slate-200 transition-colors group"
        >
          <Home className="w-5 h-5 mb-0.5 group-active:scale-110 transition-transform" />
          <span className="text-[10px] font-bold tracking-tight">Home</span>
        </button>

        {/* Catalog */}
        <button
          onClick={scrollToCatalog}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 active:text-volt hover:text-slate-200 transition-colors group"
        >
          <Flame className="w-5 h-5 mb-0.5 group-active:scale-110 transition-transform" />
          <span className="text-[10px] font-bold tracking-tight">Rackets</span>
        </button>

        {/* Mobile Filter Sheet Trigger */}
        <button
          onClick={onOpenMobileFilters}
          className="relative flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 active:text-volt hover:text-slate-200 transition-colors group"
        >
          <div className="relative">
            <SlidersHorizontal className="w-5 h-5 mb-0.5 group-active:scale-110 transition-transform" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-volt text-dark-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-glow-volt">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Filters</span>
        </button>

        {/* Matchmaker Quiz */}
        <button
          onClick={onOpenQuiz}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-cyan active:text-cyan/80 transition-colors group"
        >
          <Sparkles className="w-5 h-5 mb-0.5 group-active:scale-110 transition-transform" />
          <span className="text-[10px] font-bold tracking-tight">Quiz</span>
        </button>

        {/* Workshop Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-1 rounded-xl text-volt active:text-emerald-400 transition-colors group"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 group-active:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-volt text-dark-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-glow-volt animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">Cart</span>
        </button>

      </div>
    </nav>
  );
}
