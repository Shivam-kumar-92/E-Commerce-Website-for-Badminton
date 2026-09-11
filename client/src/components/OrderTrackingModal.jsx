import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck,
  Package,
  Activity
} from 'lucide-react';

export default function OrderTrackingModal({
  isOpen,
  onClose,
  initialOrderId = 'SMASH-98241'
}) {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || 'SMASH-98241');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${id.trim()}`);
      if (!res.ok) {
        throw new Error('Order not found. Check your reference code.');
      }
      const data = await res.json();
      setOrderData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch order');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialOrderId) {
        setOrderIdInput(initialOrderId);
        fetchOrder(initialOrderId);
      } else {
        fetchOrder('SMASH-98241');
      }
    }
  }, [isOpen, initialOrderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl glass-panel bg-dark-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/70">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white">
              Live Stringing Studio & Courier Tracker
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-dark-900 text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Order Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrder(orderIdInput);
            }} 
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Enter Order Code (e.g. SMASH-98241)"
                className="w-full bg-dark-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-volt"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-volt text-dark-950 font-black text-xs uppercase hover:shadow-glow-volt transition-all"
            >
              Track
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-crimson/15 border border-crimson/30 text-crimson text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-10 h-10 border-3 border-volt border-t-transparent animate-spin rounded-full mx-auto" />
              <p className="text-xs text-slate-400">Locating workshop status...</p>
            </div>
          ) : orderData ? (
            <div className="space-y-6">
              
              {/* Order Status Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-dark-950 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Current Workshop Stage
                  </span>
                  <h3 className="text-lg font-black text-white">{orderData.status}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Order ID: {orderData.id}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="space-y-3 p-4 rounded-2xl bg-dark-950 border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Stringing & Fulfillment Pipeline
                </span>

                <div className="space-y-4 relative pl-4 border-l-2 border-slate-800 ml-2">
                  {(orderData.statusSteps || []).map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        step.done 
                          ? 'bg-volt border-volt text-dark-950 shadow-glow-volt' 
                          : 'bg-dark-900 border-slate-700 text-transparent'
                      }`}>
                        {step.done && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="text-xs">
                        <h4 className={`font-bold ${step.done ? 'text-white' : 'text-slate-500'}`}>
                          {step.label}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {step.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Package Specifications */}
              <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                  Configured Racket Details
                </span>

                {orderData.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-dark-900/60 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-white">{it.productName}</p>
                      <span className="text-[11px] text-volt font-mono">
                        {it.string ? `String: ${it.string.name} (${it.string.tension} LBS)` : 'Unstrung'} • {it.weightClass}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-white">${((it.itemTotal || it.basePrice) * it.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="pt-2 flex justify-between text-slate-400 font-mono">
                  <span>Payment Method:</span>
                  <span className="text-slate-200">{orderData.paymentMethod}</span>
                </div>
              </div>

            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
}
