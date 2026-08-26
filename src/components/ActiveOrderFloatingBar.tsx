import React from 'react';
import { ChefHat, BellRing, Receipt, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface ActiveOrderFloatingBarProps {
  order: Order;
  onClick: () => void;
}

export const ActiveOrderFloatingBar: React.FC<ActiveOrderFloatingBarProps> = ({
  order,
  onClick,
}) => {
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'RECEIVED':
        return <Receipt className="w-4 h-4 text-blue-400" />;
      case 'PREPARING':
        return <ChefHat className="w-4 h-4 text-amber-400 animate-bounce" />;
      case 'READY':
        return <BellRing className="w-4 h-4 text-emerald-400 animate-pulse" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'RECEIVED':
        return 'Order Received by Kitchen';
      case 'PREPARING':
        return 'Chefs are Preparing Your Tiffins';
      case 'READY':
        return 'Food Ready! Please Collect at Counter';
      default:
        return 'Order in Progress';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-40 sm:max-w-md">
      <div
        onClick={onClick}
        className="bg-stone-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-xl border border-stone-700/80 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-800 transition-all hover:scale-[1.02] active:scale-98 animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0">
            {getStatusIcon(order.status)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-amber-400 text-xs sm:text-sm bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                {order.orderToken}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Active Order
              </span>
            </div>
            <p className="text-xs text-stone-200 truncate mt-0.5 font-medium">
              {getStatusText(order.status)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
          <span className="hidden sm:inline">Track</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
