import React from 'react';
import { UtensilsCrossed, User, ShoppingBag, Terminal, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { CustomerProfile, MealPeriod } from '../types';

interface NavbarProps {
  customer: CustomerProfile | null;
  mealPeriod: MealPeriod;
  onSelectPeriod: (period: MealPeriod) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenRegister: () => void;
  onOpenDevOps: () => void;
  activeOrderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  customer,
  mealPeriod,
  onSelectPeriod,
  cartCount,
  onOpenCart,
  onOpenProfile,
  onOpenRegister,
  onOpenDevOps,
  activeOrderCount,
}) => {
  const getPeriodLabel = (period: MealPeriod) => {
    switch (period) {
      case 'morning':
        return { title: 'Morning Tiffins', time: '6:00 AM - 11:30 AM', icon: '🌅' };
      case 'afternoon':
        return { title: 'Afternoon Meals', time: '11:30 AM - 4:30 PM', icon: '☀️' };
      case 'evening':
        return { title: 'Evening Tiffins', time: '4:30 PM - 11:00 PM', icon: '🌙' };
    }
  };

  const currentPeriodInfo = getPeriodLabel(mealPeriod);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900">
                  Tiffin<span className="text-amber-600">Hub</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> Unlimited Food
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 hidden sm:block">
                Unlimited Tiffins & Homestyle Meals Daily
              </p>
            </div>
          </div>

          {/* Time of Day Switcher Pills (Desktop) */}
          <div className="hidden lg:flex items-center bg-stone-100/80 p-1 rounded-xl border border-stone-200/80 text-xs font-medium">
            <button
              id="nav-period-morning"
              onClick={() => onSelectPeriod('morning')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mealPeriod === 'morning'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🌅</span> Morning (Tiffins)
            </button>
            <button
              id="nav-period-afternoon"
              onClick={() => onSelectPeriod('afternoon')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mealPeriod === 'afternoon'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>☀️</span> Afternoon (Meals)
            </button>
            <button
              id="nav-period-evening"
              onClick={() => onSelectPeriod('evening')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mealPeriod === 'evening'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🌙</span> Evening (Tiffins)
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* DevOps Practice Info Button */}
            <button
              id="btn-devops-info"
              onClick={onOpenDevOps}
              title="DevOps Architecture & API Guide"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium border border-stone-200 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-stone-600" />
              <span>DevOps Info</span>
            </button>

            {/* Customer Profile / Token Tag or Register Button */}
            {customer ? (
              <button
                id="btn-customer-profile"
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-stone-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1">
                    {customer.customerToken}
                    {activeOrderCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate max-w-[90px]">
                    {customer.name}
                  </div>
                </div>
              </button>
            ) : (
              <button
                id="btn-nav-register"
                onClick={onOpenRegister}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium transition-all shadow-xs"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Get Token / Register</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              id="btn-nav-cart"
              onClick={onOpenCart}
              className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-transform active:scale-95"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-bold ring-2 ring-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Period Sub-bar */}
        <div className="lg:hidden py-2 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-stone-700 font-medium">
            <span>{currentPeriodInfo.icon}</span>
            <span>{currentPeriodInfo.title}</span>
            <span className="text-stone-400 text-[10px]">({currentPeriodInfo.time})</span>
          </div>
          <button
            onClick={onOpenDevOps}
            className="text-[11px] text-amber-700 font-medium underline flex items-center gap-1"
          >
            <Terminal className="w-3 h-3" /> DevOps
          </button>
        </div>
      </div>
    </header>
  );
};
