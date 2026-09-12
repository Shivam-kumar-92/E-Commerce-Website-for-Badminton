import React from 'react';
import { X, Layers, Trash2, Zap, ArrowRight, Check } from 'lucide-react';
import RadarChart from './RadarChart.jsx';

export default function CompareModal({
  compareList = [],
  onClose,
  onRemoveFromCompare,
  onClearCompare,
  onSelectProduct
}) {
  if (!compareList.length) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="glass-panel bg-dark-900 border border-slate-700 max-w-md w-full rounded-3xl p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-dark-950 border border-slate-800 flex items-center justify-center mx-auto text-volt">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">No Rackets Selected for Comparison</h3>
          <p className="text-xs text-slate-400">
            Click the "Compare" button on any racket card in the catalog to compare up to 4 tournament weapons side-by-side.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-volt text-dark-950 font-black text-xs uppercase"
          >
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-6xl glass-panel bg-dark-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/70 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-volt" />
            <div>
              <h2 className="text-lg font-black text-white">Side-by-Side Weapon Comparison Matrix</h2>
              <p className="text-xs text-slate-400">Comparing {compareList.length} tournament racket{compareList.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearCompare}
              className="text-xs text-slate-400 hover:text-crimson transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-dark-900 text-slate-400 hover:text-white border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <div className="min-w-[700px]">
            
            {/* Top Product Cards in Grid */}
            <div className={`grid grid-cols-${compareList.length} gap-4 pb-6 border-b border-slate-800`}>
              {compareList.map(item => (
                <div key={item.id} className="relative p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-3">
                  <button
                    onClick={() => onRemoveFromCompare(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-dark-900 text-slate-400 hover:text-crimson border border-slate-800"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-32 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-volt">{item.brand}</span>
                    <h4 className="font-extrabold text-sm text-white line-clamp-1">{item.name}</h4>
                    <p className="text-lg font-black text-white font-mono mt-1">Rs {item.price}</p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectProduct(item);
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-volt text-dark-950 font-black text-xs uppercase flex items-center justify-center gap-1 hover:shadow-glow-volt transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" /> Customize
                  </button>
                </div>
              ))}
            </div>

            {/* Spec Attributes Comparison Rows */}
            <div className="divide-y divide-slate-800/80 text-xs">
              
              {/* Playstyle / Balance */}
              <div className="py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Balance & Playstyle</span>
                <div className={`grid grid-cols-${compareList.length} gap-4`}>
                  {compareList.map(item => (
                    <div key={item.id} className="font-bold text-white bg-dark-950 p-2.5 rounded-xl border border-slate-800">
                      {item.specs?.balance}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flex Stiffness */}
              <div className="py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Shaft Stiffness</span>
                <div className={`grid grid-cols-${compareList.length} gap-4`}>
                  {compareList.map(item => (
                    <div key={item.id} className="font-semibold text-slate-200 bg-dark-950 p-2.5 rounded-xl border border-slate-800">
                      {item.specs?.flex}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weight Options */}
              <div className="py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Weight Classes</span>
                <div className={`grid grid-cols-${compareList.length} gap-4`}>
                  {compareList.map(item => (
                    <div key={item.id} className="font-semibold text-slate-200 bg-dark-950 p-2.5 rounded-xl border border-slate-800">
                      {item.specs?.weightClass?.join(' / ')}
                    </div>
                  ))}
                </div>
              </div>

              {/* Max Tension */}
              <div className="py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Max Tension Limit</span>
                <div className={`grid grid-cols-${compareList.length} gap-4`}>
                  {compareList.map(item => (
                    <div key={item.id} className="font-mono font-bold text-volt bg-dark-950 p-2.5 rounded-xl border border-slate-800">
                      {item.specs?.maxTension}
                    </div>
                  ))}
                </div>
              </div>

              {/* Smash Power Rating */}
              <div className="py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Smash Power Score</span>
                <div className={`grid grid-cols-${compareList.length} gap-4`}>
                  {compareList.map(item => (
                    <div key={item.id} className="bg-dark-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between font-mono font-bold text-volt">
                        <span>{item.radar?.power}/100</span>
                      </div>
                      <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-volt h-full rounded-full" style={{ width: `${item.radar?.power}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speed / Reflex Rating */}
              <div className="py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Speed & Reflex Score</span>
                <div className={`grid grid-cols-${compareList.length} gap-4`}>
                  {compareList.map(item => (
                    <div key={item.id} className="bg-dark-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between font-mono font-bold text-cyan">
                        <span>{item.radar?.speed}/100</span>
                      </div>
                      <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-cyan h-full rounded-full" style={{ width: `${item.radar?.speed}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Control & Precision Rating */}
              <div className="py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Control & Precision</span>
                <div className={`grid grid-cols-${compareList.length} gap-4`}>
                  {compareList.map(item => (
                    <div key={item.id} className="bg-dark-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex justify-between font-mono font-bold text-emerald-400">
                        <span>{item.radar?.control}/100</span>
                      </div>
                      <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${item.radar?.control}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Player Endorsement */}
              <div className="py-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Athlete Signature</span>
                <div className={`grid grid-cols-${compareList.length} gap-4`}>
                  {compareList.map(item => (
                    <div key={item.id} className="font-semibold text-slate-300 bg-dark-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                      {item.playerSignature || 'Tournament Pro Edition'}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
