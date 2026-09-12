import React from 'react';
import { Zap, Flame, Star, Layers, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ProductCard({
  product,
  onSelect,
  isCompared,
  onToggleCompare,
  onQuickAdd
}) {
  const isPower = product.specs?.playstyleCategory === 'power';
  const isSpeed = product.specs?.playstyleCategory === 'speed';

  return (
    <div className="group rounded-3xl glass-panel border border-slate-800 hover:border-slate-700 bg-gradient-to-b from-dark-900/90 to-dark-950/95 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between relative">
      
      {/* Top Badges */}
      <div className="p-4 pb-0 flex items-start justify-between gap-2 z-10">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            {product.brand}
          </span>
          {product.badge && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
              isPower 
                ? 'bg-crimson/15 text-crimson border-crimson/30' 
                : isSpeed 
                ? 'bg-cyan/15 text-cyan border-cyan/30' 
                : 'bg-volt/15 text-volt border-volt/30'
            }`}>
              <Flame className="w-3 h-3 fill-current" />
              {product.badge}
            </span>
          )}
        </div>

        {/* Compare Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product);
          }}
          title={isCompared ? "Remove from comparison" : "Add to spec comparison"}
          className={`p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
            isCompared 
              ? 'bg-emerald-500 text-dark-950 border-emerald-400 shadow-glow-volt' 
              : 'bg-dark-950/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="text-[10px]">{isCompared ? 'Compared' : 'Compare'}</span>
        </button>
      </div>

      {/* Racket Image Presentation */}
      <div 
        onClick={() => onSelect(product)}
        className="relative h-56 mx-4 my-2 rounded-2xl bg-gradient-to-b from-slate-900/60 to-dark-950/90 overflow-hidden flex items-center justify-center cursor-pointer group-hover:bg-slate-900/80 transition-colors"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-108 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-transparent opacity-80" />

        {/* Player Endorsement Pill */}
        {product.playerSignature && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-dark-950/80 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Player Choice:</span>
            <span className="font-bold text-slate-200 truncate ml-1">{product.playerSignature}</span>
          </div>
        )}
      </div>

      {/* Racket Info & Specs */}
      <div className="p-4 pt-1 space-y-3 flex-1 flex flex-col justify-between">
        <div 
          onClick={() => onSelect(product)}
          className="cursor-pointer space-y-1"
        >
          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-500 font-normal">({product.reviewCount})</span>
          </div>

          <h3 className="font-extrabold text-lg text-white group-hover:text-volt transition-colors leading-tight line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-xs text-slate-400 line-clamp-1">
            {product.tagline}
          </p>
        </div>

        {/* Spec Highlights Badges */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="p-1.5 rounded-lg bg-dark-950 border border-slate-800 text-slate-300">
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Balance</span>
            <span className="font-extrabold truncate block">{product.specs?.balance?.split(' ')[0]} {product.specs?.balance?.split(' ')[1]}</span>
          </div>
          <div className="p-1.5 rounded-lg bg-dark-950 border border-slate-800 text-slate-300">
            <span className="text-slate-500 block text-[9px] uppercase font-bold">Flexibility</span>
            <span className="font-extrabold truncate block">{product.specs?.flex}</span>
          </div>
        </div>

        {/* Power vs Speed Mini Bars */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>Smash Power</span>
            <span className="text-volt font-mono">{product.radar?.power || 88}%</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-volt h-full rounded-full"
              style={{ width: `${product.radar?.power || 88}%` }}
            />
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] line-through text-slate-500 font-mono">
              Rs {product.originalPrice}
            </span>
            <div className="text-xl font-black text-white font-mono leading-none">
              Rs {product.price}
            </div>
          </div>

          <button
            onClick={() => onSelect(product)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-volt to-emerald-500 text-dark-950 font-extrabold text-xs uppercase tracking-wide hover:shadow-glow-volt hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Customize</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
