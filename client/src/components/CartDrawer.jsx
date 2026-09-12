import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Zap, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  Minus,
  CheckCircle2
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  appliedVoucher,
  onApplyVoucher,
  onRemoveVoucher
}) {
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);

  if (!isOpen) return null;

  // Compute Subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + ((item.itemTotal || item.basePrice) * item.quantity), 0);
  
  // Compute Discount
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountPercent) {
      discountAmount = (subtotal * appliedVoucher.discountPercent) / 100;
    } else if (appliedVoucher.discountAmount) {
      discountAmount = appliedVoucher.discountAmount;
    }
  }

  const shippingFee = subtotal >= 150 || (appliedVoucher?.code === 'FREESHIP') ? 0.00 : 15.00;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;
    setVoucherLoading(true);
    setVoucherError('');

    try {
      const res = await fetch('/api/voucher/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCodeInput.trim() })
      });
      const data = await res.json();
      if (data.valid && data.voucher) {
        onApplyVoucher(data.voucher);
        setVoucherCodeInput('');
      } else {
        setVoucherError(data.message || 'Invalid promo voucher code');
      }
    } catch (err) {
      setVoucherError('Failed to validate voucher');
    } finally {
      setVoucherLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-dark-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md glass-panel bg-dark-900 border-l border-slate-700/80 flex flex-col justify-between shadow-2xl">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-dark-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-volt" />
              <h2 className="text-base font-extrabold text-white">Workshop Stringing Cart</h2>
              <span className="bg-volt/20 text-volt text-xs px-2 py-0.5 rounded-full font-bold">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-dark-900 text-slate-400 hover:text-white border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-dark-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Your Workshop Cart is Empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Browse our high-performance rackets, configure custom tension and strings, and add them here!
                </p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="p-3.5 rounded-2xl bg-dark-950 border border-slate-800 space-y-3 relative group"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-extrabold text-xs text-white truncate leading-snug">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(index)}
                          className="text-slate-500 hover:text-crimson p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-0.5 mt-1 font-mono">
                        <div>
                          <span className="text-volt font-semibold">{item.weightClass}</span> • {item.gripSize}
                        </div>
                        {item.string && (
                          <div className="text-cyan truncate">
                            🏸 {item.string.name} @ <span className="font-bold">{item.string.tension} LBS</span>
                          </div>
                        )}
                        {item.grip && (
                          <div className="text-slate-400 truncate">
                            🎯 Grip: {item.grip.name}
                          </div>
                        )}
                        {item.stencil && item.stencil.id !== 'none' && (
                          <div className="text-emerald-400 truncate">
                            ✨ Stencil: {item.stencil.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 bg-dark-900 px-2 py-1 rounded-lg border border-slate-700">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-white px-1.5">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-sm text-white font-mono">
                        Rs {((item.itemTotal || item.basePrice) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Checkout & Voucher Section */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-dark-950/90 space-y-3">
              
              {/* Voucher Input */}
              {appliedVoucher ? (
                <div className="p-2.5 rounded-xl bg-volt/10 border border-volt/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-volt font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Coupon '{appliedVoucher.code}' Applied ({appliedVoucher.description})</span>
                  </div>
                  <button
                    onClick={onRemoveVoucher}
                    className="text-[11px] text-slate-400 hover:text-white underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value)}
                      placeholder="Promo code (e.g. SMASH20)"
                      className="w-full bg-dark-900 border border-slate-700 rounded-xl pl-8 pr-2 py-2 text-xs text-white placeholder-slate-500 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={voucherLoading}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase"
                  >
                    Apply
                  </button>
                </form>
              )}

              {voucherError && (
                <p className="text-[11px] text-crimson font-medium">{voucherError}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                <div className="flex justify-between">
                  <span>Workshop Subtotal</span>
                  <span className="font-mono text-white">Rs {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-volt">
                    <span>Voucher Discount</span>
                    <span className="font-mono">-Rs {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Delivery</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE (VIP Pro)</span> : `Rs ${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Due</span>
                  <span className="text-xl font-mono text-volt">Rs {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-volt via-emerald-400 to-cyan text-dark-950 font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:shadow-glow-volt hover:scale-101 active:scale-98 transition-all"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan" />
                <span>256-Bit SSL Encrypted • 30-Day Frame Warranty</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
