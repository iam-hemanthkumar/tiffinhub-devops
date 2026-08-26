import React, { useState } from 'react';
import { X, CheckCircle2, ChefHat, BellRing, Play, Receipt } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { advanceOrderStatus } from '../lib/api';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onViewAllOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onViewAllOrders,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order);
  const [isAdvancing, setIsAdvancing] = useState(false);

  React.useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  if (!isOpen || !currentOrder) return null;

  const handleAdvanceStatus = async () => {
    try {
      setIsAdvancing(true);
      const res = await advanceOrderStatus(currentOrder.id);
      setCurrentOrder(res.order);
    } catch (err) {
      console.error('Failed to advance status', err);
    } finally {
      setIsAdvancing(false);
    }
  };

  const statusSteps: { key: OrderStatus; label: string; icon: any; desc: string }[] = [
    {
      key: 'RECEIVED',
      label: 'Order Placed',
      icon: Receipt,
      desc: 'Token generated & sent to kitchen display',
    },
    {
      key: 'PREPARING',
      label: 'Kitchen Cooking',
      icon: ChefHat,
      desc: 'Chefs preparing hot tiffins & meals',
    },
    {
      key: 'READY',
      label: 'Ready at Counter',
      icon: BellRing,
      desc: 'Token called at the pickup counter',
    },
    {
      key: 'COMPLETED',
      label: 'Served / Enjoyed',
      icon: CheckCircle2,
      desc: 'Order collected & unlimited refills active',
    },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === currentOrder.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          id="btn-close-order-success"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-stone-900">
            Order Confirmed!
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Your food is queued in the kitchen. Please keep your token handy.
          </p>
        </div>

        {/* Big Highlight Token Display Card */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-md text-center relative overflow-hidden mb-6">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="text-xs font-bold uppercase tracking-widest text-amber-100 mb-1">
            Order Token Number
          </div>
          <div className="text-5xl sm:text-6xl font-black tracking-wider my-1 drop-shadow-xs font-mono">
            #{currentOrder.orderToken}
          </div>
          <div className="flex items-center justify-center gap-3 text-xs text-amber-100 mt-2 font-medium">
            <span>Customer Token: <strong className="font-mono">#{currentOrder.customerToken}</strong></span>
            <span>•</span>
            <span>Est: <strong>{currentOrder.estimatedReadyTime}</strong></span>
          </div>
        </div>

        {/* Live Order Status Flow Tracker */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Kitchen Status
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
              {currentOrder.status}
            </span>
          </div>

          <div className="space-y-3">
            {statusSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex items-start gap-3 relative">
                  {/* Vertical connector line */}
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 bottom-0 w-0.5 -mb-3 ${
                        idx < currentStepIndex ? 'bg-emerald-500' : 'bg-stone-200'
                      }`}
                    />
                  )}

                  {/* Icon Node */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      isPast
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                        : isCurrent
                        ? 'bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-amber-900'
                            : isPast
                            ? 'text-emerald-900'
                            : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details List */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-2 mb-6">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
            Order Summary
          </div>
          {currentOrder.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-0.5">
              <span className="text-stone-800">
                <strong className="text-stone-900">{item.quantity}x</strong> {item.menuItem.name}
              </span>
              <span className="font-semibold text-stone-900">₹{item.itemTotal}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-black text-sm text-stone-900">
            <span>Total Paid</span>
            <span>₹{currentOrder.totalAmount}</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="space-y-2.5">
          {currentOrder.status !== 'COMPLETED' && (
            <button
              id="btn-advance-status"
              onClick={handleAdvanceStatus}
              disabled={isAdvancing}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Kitchen Next Step ({currentOrder.status} → Next)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-view-all-orders"
              onClick={onViewAllOrders}
              className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
            >
              View Order History
            </button>
            <button
              id="btn-done-ordering"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
