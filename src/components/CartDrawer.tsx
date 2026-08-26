import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Banknote, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { CustomerProfile, MenuItem, Order, PaymentMethod, MealPeriod } from '../types';
import { placeOrder } from '../lib/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { [itemId: string]: number };
  menuItems: MenuItem[];
  customer: CustomerProfile | null;
  selectedPeriod: MealPeriod;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  onOpenRegister: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  menuItems,
  customer,
  selectedPeriod,
  onUpdateQuantity,
  onClearCart,
  onOpenRegister,
  onOrderSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONLINE_SIMULATED');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Build items array
  const cartItems: { item: MenuItem; quantity: number; total: number }[] = Object.entries(cart)
    .filter(([_, qty]) => Number(qty) > 0)
    .map(([itemId, qty]) => {
      const item = menuItems.find((m) => m.id === itemId);
      const quantity = Number(qty);
      return {
        item: item!,
        quantity,
        total: (item?.price || 0) * quantity,
      };
    })
    .filter((entry) => entry.item !== undefined);

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    setError('');

    if (!customer) {
      onOpenRegister();
      return;
    }

    if (cartItems.length === 0) {
      setError('Please add at least one item to your order.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await placeOrder({
        customerToken: customer.customerToken,
        items: cartItems.map((ci) => ({
          menuItemId: ci.item.id,
          quantity: ci.quantity,
        })),
        paymentMethod,
        mealPeriod: selectedPeriod,
        notes: notes.trim(),
      });

      onClearCart();
      onClose();
      onOrderSuccess(res.order);
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-lg sm:text-xl text-stone-900">
              Your Order Summary
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              {totalCount} {totalCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            id="btn-close-cart"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Customer Profile Banner */}
          {customer ? (
            <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700">Ordering As</span>
                <div className="font-bold text-stone-900">{customer.name}</div>
                <div className="text-stone-500 font-mono">Token: {customer.customerToken}</div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-amber-300/80 font-bold text-amber-900 shadow-2xs">
                Verified
              </span>
            </div>
          ) : (
            <div className="bg-stone-900 text-white rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold">No Customer Token</div>
                <div className="text-[11px] text-stone-400">Register to get a unique token for your order</div>
              </div>
              <button
                id="btn-cart-quick-register"
                onClick={onOpenRegister}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-xs shrink-0"
              >
                Register Now
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Items List */}
          {cartItems.length > 0 ? (
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Selected Dishes
              </div>

              {cartItems.map(({ item, quantity, total }) => {
                const isVeg = item.foodType === 'veg';
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80 gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-3 h-3 rounded-xs border flex items-center justify-center shrink-0 ${
                            isVeg ? 'border-emerald-600 bg-emerald-50' : 'border-red-600 bg-red-50'
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isVeg ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                          />
                        </div>
                        <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                          {item.name}
                        </h4>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        ₹{item.price} each {item.isUnlimited && '• Unlimited Refill'}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white border border-stone-300 rounded-lg shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-extrabold text-stone-900 text-xs sm:text-sm min-w-[50px] text-right">
                        ₹{total}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="text-right pt-1">
                <button
                  onClick={onClearCart}
                  className="text-[11px] text-stone-400 hover:text-red-600 flex items-center gap-1 ml-auto"
                >
                  <Trash2 className="w-3 h-3" /> Clear Cart
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-stone-700">Your cart is currently empty</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Select delicious tiffins or meals to begin</p>
            </div>
          )}

          {/* Kitchen Notes Input */}
          {cartItems.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Kitchen Instructions <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                id="cart-notes-input"
                type="text"
                placeholder="e.g. Extra spicy, less oil, warm sambar"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 focus:bg-white"
              />
            </div>
          )}

          {/* Payment Method Selector */}
          {cartItems.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Choose Payment Option <span className="text-amber-600 font-normal">(Demo)</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Simulated Online Payment */}
                <button
                  type="button"
                  id="pay-online-option"
                  onClick={() => setPaymentMethod('ONLINE_SIMULATED')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'ONLINE_SIMULATED'
                      ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className={`w-4 h-4 ${paymentMethod === 'ONLINE_SIMULATED' ? 'text-amber-700' : 'text-stone-500'}`} />
                    <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Demo Instant
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Online Payment</div>
                    <div className="text-[10px] text-stone-500">UPI / Cards simulation</div>
                  </div>
                </button>

                {/* Pay at Counter */}
                <button
                  type="button"
                  id="pay-counter-option"
                  onClick={() => setPaymentMethod('COUNTER_PAY')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'COUNTER_PAY'
                      ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/20'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className={`w-4 h-4 ${paymentMethod === 'COUNTER_PAY' ? 'text-amber-700' : 'text-stone-500'}`} />
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                      Desk Pay
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Pay at Counter</div>
                    <div className="text-[10px] text-stone-500">Cash / Card on token</div>
                  </div>
                </button>
              </div>

              {/* DevOps Notice */}
              <div className="mt-2.5 flex items-start gap-1.5 p-2 rounded-lg bg-stone-100 text-[10px] text-stone-600">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>
                  <strong>DevOps Note:</strong> Payment is purely simulated for testing. No real transaction gateway is triggered.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Bar */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">Subtotal</span>
              <span className="text-sm font-semibold text-stone-700">₹{subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">Taxes & Unlimited Refills Service</span>
              <span className="text-xs font-bold text-emerald-700">FREE</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <span className="font-extrabold text-sm sm:text-base text-stone-900">Total Payable</span>
              <span className="font-black text-xl text-stone-900">₹{subtotal}</span>
            </div>

            <button
              id="btn-submit-order"
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {isSubmitting ? (
                'Generating Order Token...'
              ) : customer ? (
                <>
                  <span>Place Order & Get Token</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                'Register & Place Order'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
