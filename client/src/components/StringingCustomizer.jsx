import React, { useState } from 'react';
import { Zap, ShieldAlert, Sparkles, Check, Info } from 'lucide-react';

export default function StringingCustomizer({
  product,
  options,
  onAddToCart
}) {
  const availableStrings = options?.strings || [];
  const availableGrips = options?.grips || [];
  const availableStencils = options?.stencils || [];

  // Selected Customization State
  const [weightClass, setWeightClass] = useState(product?.specs?.weightClass?.[0] || '4U (83g)');
  const [gripSize, setGripSize] = useState(product?.specs?.gripSize?.[0] || 'G5');
  const [selectedString, setSelectedString] = useState(availableStrings[0] || { id: 'yonex-bg80-power', name: 'Yonex BG80 Power', price: 18 });
  const [tension, setTension] = useState(27);
  const [selectedGrip, setSelectedGrip] = useState(availableGrips[0] || { id: 'yonex-super-grap-white', name: 'Yonex Super Grap (Classic White)', price: 3.5 });
  const [selectedStencil, setSelectedStencil] = useState(availableStencils[0] || { id: 'none', name: 'No Stencil', price: 0 });
  const [rushService, setRushService] = useState(false);

  // Price Calculation
  const basePrice = product.price || 0;
  const stringPrice = selectedString?.price || 0;
  const gripPrice = selectedGrip?.price || 0;
  const stencilPrice = selectedStencil?.price || 0;
  const rushPrice = rushService ? 9.99 : 0;
  const totalPrice = basePrice + stringPrice + gripPrice + stencilPrice + rushPrice;

  const handleAdd = () => {
    onAddToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      brand: product.brand,
      basePrice,
      quantity: 1,
      weightClass,
      gripSize,
      string: {
        ...selectedString,
        tension: selectedString.id === 'unstrung-frame-only' ? 0 : tension
      },
      grip: selectedGrip,
      stencil: selectedStencil,
      rushService,
      itemTotal: totalPrice
    });
  };

  const getTensionGuide = (lbs) => {
    if (lbs <= 23) return { level: 'Beginner / Casual', desc: 'Huge sweet spot, high trampoline repulsion, low arm stress', color: 'text-emerald-400' };
    if (lbs <= 26) return { level: 'Intermediate / Club', desc: 'Balanced repulsion, crisp feel, solid power control', color: 'text-cyan' };
    if (lbs <= 28) return { level: 'Advanced / Competitive', desc: 'High accuracy, sharp shuttle bite, requires clean wrist snap', color: 'text-volt' };
    return { level: 'Tournament Pro / Master', desc: 'Surgical accuracy, explosive power on center hits, extreme rigidity', color: 'text-crimson' };
  };

  const tensionGuide = getTensionGuide(tension);

  return (
    <div className="space-y-6">
      
      {/* 1. Weight & Grip Size Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Weight Class
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(product?.specs?.weightClass || ['3U (88g)', '4U (83g)']).map(wc => (
              <button
                key={wc}
                type="button"
                onClick={() => setWeightClass(wc)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  weightClass === wc 
                    ? 'bg-volt/15 text-volt border-volt shadow-glow-volt' 
                    : 'bg-dark-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {wc}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Handle Grip Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(product?.specs?.gripSize || ['G5', 'G6']).map(gs => (
              <button
                key={gs}
                type="button"
                onClick={() => setGripSize(gs)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  gripSize === gs 
                    ? 'bg-cyan/15 text-cyan border-cyan shadow-glow-cyan' 
                    : 'bg-dark-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {gs} (Standard Pro)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. String Model Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tournament String Model
          </label>
          <span className="text-xs text-volt font-bold">
            {selectedString.price > 0 ? `+$${selectedString.price.toFixed(2)}` : 'Included'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {availableStrings.map(str => (
            <button
              key={str.id}
              type="button"
              onClick={() => setSelectedString(str)}
              className={`p-3 rounded-xl text-left border transition-all relative ${
                selectedString?.id === str.id
                  ? 'bg-dark-900 border-volt shadow-glow-volt text-white'
                  : 'bg-dark-950/60 border-slate-800/80 text-slate-300 hover:bg-dark-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold leading-tight">{str.name}</span>
                {selectedString?.id === str.id && <Check className="w-3.5 h-3.5 text-volt ml-1 shrink-0" />}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{str.type}</span>
                <span className="font-mono text-volt font-semibold">
                  {str.price === 0 ? 'Free' : `$${str.price}`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Stringing Tension Slider */}
      {selectedString?.id !== 'unstrung-frame-only' && (
        <div className="space-y-3 p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Electronic Tension Calibration:
              </span>
              <p className="text-[11px] text-slate-400">4-knot precision electronic machine pulled</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-volt">{tension}</span>
              <span className="text-xs font-bold text-slate-400 ml-1">LBS</span>
            </div>
          </div>

          <input
            type="range"
            min="20"
            max="32"
            step="1"
            value={tension}
            onChange={(e) => setTension(Number(e.target.value))}
            className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-volt"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>20 lbs (Casual)</span>
            <span>26 lbs (Club Standard)</span>
            <span>32 lbs (Tournament Elite)</span>
          </div>

          {/* Dynamic Tension Guide Pill */}
          <div className="p-2.5 rounded-xl bg-dark-900 border border-slate-800/80 flex items-start gap-2">
            <Info className="w-4 h-4 text-volt mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className={`font-bold ${tensionGuide.color}`}>{tensionGuide.level}: </span>
              <span className="text-slate-300">{tensionGuide.desc}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Grip Wrap & Stencil Customizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Overgrip Wrap */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Custom Overgrip Wrap
          </label>
          <div className="space-y-1.5">
            {availableGrips.map(grp => (
              <button
                key={grp.id}
                type="button"
                onClick={() => setSelectedGrip(grp)}
                className={`w-full text-left p-2 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                  selectedGrip?.id === grp.id
                    ? 'bg-dark-900 border-cyan text-cyan'
                    : 'bg-dark-950/60 border-slate-800 text-slate-300 hover:bg-dark-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: grp.colorHex || '#FFF' }}
                  />
                  <span className="truncate">{grp.name}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {grp.price > 0 ? `+$${grp.price}` : 'Free'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stencil Logo */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            String Bed Stencil Logo
          </label>
          <div className="space-y-1.5">
            {availableStencils.map(stc => (
              <button
                key={stc.id}
                type="button"
                onClick={() => setSelectedStencil(stc)}
                className={`w-full text-left p-2 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                  selectedStencil?.id === stc.id
                    ? 'bg-dark-900 border-volt text-volt'
                    : 'bg-dark-950/60 border-slate-800 text-slate-300 hover:bg-dark-900'
                }`}
              >
                <span className="truncate">{stc.name}</span>
                <span className="font-mono text-[10px] text-slate-400">
                  {stc.price > 0 ? `+$${stc.price}` : 'Free'}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Priority Workshop Stringing Option */}
      <div 
        onClick={() => setRushService(!rushService)}
        className="p-3.5 rounded-2xl bg-dark-950/90 border border-slate-800 hover:border-volt/40 cursor-pointer flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
            rushService ? 'bg-volt border-volt text-dark-950' : 'border-slate-600 bg-dark-900'
          }`}>
            {rushService && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Priority VIP Same-Day Stringing</span>
            <span className="text-[11px] text-slate-400">Calibrated & boxed within 4 hours by Master Stringer</span>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-volt">+$9.99</span>
      </div>

      {/* 6. Total Summary & Add To Cart Button */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Configured Weapon Total:</span>
          <div className="text-3xl font-black font-mono text-white flex items-baseline gap-2">
            <span>${totalPrice.toFixed(2)}</span>
            <span className="text-xs text-slate-500 font-normal font-sans">(Tax incl.)</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-volt via-emerald-400 to-cyan text-dark-950 font-black text-sm uppercase tracking-wide hover:shadow-glow-volt hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xl"
        >
          <Zap className="w-4 h-4 fill-current" />
          Add Custom Racket to Cart
        </button>
      </div>

    </div>
  );
}
