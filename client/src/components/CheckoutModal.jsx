import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Zap, 
  Lock, 
  Sparkles,
  QrCode
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  appliedVoucher,
  onOrderSuccess,
  onOpenTracking
}) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success Receipt
  const [formData, setFormData] = useState({
    name: 'Lin Dan Jr.',
    email: 'lindan.player@badmintonhq.com',
    phone: '+1 (555) 234-5678',
    address: '77 Smash Court Way, Apt 12B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States',
    paymentMethod: 'card', // 'card' | 'applepay' | 'upi'
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888'
  });

  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isOpen) return null;

  // Compute pricing
  const subtotal = cartItems.reduce((sum, item) => sum + ((item.itemTotal || item.basePrice) * item.quantity), 0);
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountPercent) {
      discountAmount = (subtotal * appliedVoucher.discountPercent) / 100;
    } else if (appliedVoucher.discountAmount) {
      discountAmount = appliedVoucher.discountAmount;
    }
  }
  const shippingFee = subtotal >= 150 || (appliedVoucher?.code === 'FREESHIP') ? 0.00 : 15.00;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`
        },
        items: cartItems,
        voucher: appliedVoucher ? appliedVoucher.code : null,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        paymentMethod: formData.paymentMethod === 'card' 
          ? `Credit Card (${formData.cardNumber})` 
          : formData.paymentMethod === 'applepay' 
          ? 'Apple Pay' 
          : 'UPI / NetBanking Instant'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCreatedOrder(data.order);
        setStep(3); // Receipt step
        onOrderSuccess();
      }
    } catch (err) {
      console.error('Order submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl glass-panel bg-dark-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-dark-950/70">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-volt" />
            <h2 className="text-base sm:text-lg font-black text-white">
              {step === 3 ? '🎉 Order Confirmed & Calibrated!' : 'SMASHPRO Secure Checkout'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-dark-900 text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicators */}
        {step < 3 && (
          <div className="grid grid-cols-2 text-center text-xs font-bold border-b border-slate-800">
            <div className={`py-3 border-b-2 flex items-center justify-center gap-2 ${
              step === 1 ? 'border-volt text-volt bg-volt/5' : 'border-transparent text-slate-400'
            }`}>
              <Truck className="w-4 h-4" /> 1. Athlete Shipping Address
            </div>
            <div className={`py-3 border-b-2 flex items-center justify-center gap-2 ${
              step === 2 ? 'border-volt text-volt bg-volt/5' : 'border-transparent text-slate-400'
            }`}>
              <CreditCard className="w-4 h-4" /> 2. Payment & Verification
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Recipient & Delivery Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Email Address (For Stringing Updates)</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1 font-semibold">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">State / Province</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt"
                    />
                  </div>
                </div>
              </div>

              {/* Order Mini Summary */}
              <div className="p-3 rounded-2xl bg-dark-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{cartItems.length} Racket Configuration(s)</span>
                <span className="font-mono font-black text-volt text-sm">${total.toFixed(2)}</span>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-volt text-dark-950 font-black text-xs uppercase tracking-wide flex items-center gap-2 hover:shadow-glow-volt transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Simulation */}
          {step === 2 && (
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Select Payment Method
                </h3>

                {/* Method Radio Pills */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'applepay', label: 'Apple Pay', icon: Zap },
                    { id: 'upi', label: 'Instant UPI / QR', icon: QrCode }
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        formData.paymentMethod === method.id
                          ? 'bg-volt/15 text-volt border-volt shadow-glow-volt'
                          : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <method.icon className="w-4 h-4" />
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-2xl bg-dark-950 border border-slate-800 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Card Number (Simulated)</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-volt"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold">Expiry Date</label>
                      <input
                        type="text"
                        value={formData.cardExp}
                        onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                        className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-volt"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold">Security CVC</label>
                      <input
                        type="password"
                        value={formData.cardCvc}
                        onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                        className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-volt"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Price Final Tally */}
              <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-volt">
                    <span>Discount Coupon</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VIP Pro Courier Delivery</span>
                  <span className="font-mono">{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-volt font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  ← Back to Address
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-volt to-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wide flex items-center gap-2 hover:shadow-glow-volt transition-all"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-dark-950 border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize Payment of ${total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Order Success & Digital Receipt */}
          {step === 3 && createdOrder && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-volt/20 border-2 border-volt flex items-center justify-center mx-auto text-volt shadow-glow-volt animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Payment Authorized & Queued!</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                  Your customized badminton weapons are currently scheduled for electronic stringing tension calibration.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Order Reference ID</span>
                  <span className="font-mono font-black text-volt text-sm">{createdOrder.id}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Recipient</span>
                  <p className="font-semibold text-white">{createdOrder.customer.name}</p>
                  <p className="text-slate-400 text-[11px]">{createdOrder.customer.address}</p>
                </div>

                <div className="space-y-1 border-t border-slate-800 pt-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Rackets in Stringing Studio</span>
                  {createdOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-200">
                      <span>{it.quantity}x {it.productName} ({it.string ? `${it.string.tension} lbs` : 'Standard'})</span>
                      <span className="font-mono">${((it.itemTotal || it.basePrice) * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between border-t border-slate-800 pt-2 font-black text-white text-sm">
                  <span>Total Paid</span>
                  <span className="text-volt font-mono">${createdOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenTracking(createdOrder.id);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase flex items-center justify-center gap-1.5 hover:shadow-glow-cyan transition-all"
                >
                  <Truck className="w-4 h-4" /> Live Stringing & Order Tracker
                </button>

                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
