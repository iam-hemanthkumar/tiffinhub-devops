import React from 'react';
import { Plus, Minus, Check, Clock, Sparkles, Flame } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  cartQuantity: number;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const isVeg = item.foodType === 'veg';

  return (
    <div
      id={`menu-item-${item.id}`}
      className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 group relative"
    >
      <div>
        {/* Top Header: Veg/Non-Veg icon + Unlimited Tag + Prep Time */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            {/* Standard Food Type Symbol */}
            <div
              className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                isVeg ? 'border-emerald-600 bg-emerald-50/50' : 'border-red-600 bg-red-50/50'
              }`}
              title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isVeg ? 'bg-emerald-600' : 'bg-red-600'
                }`}
              />
            </div>
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isVeg ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {item.isUnlimited && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 text-[10px] font-black border border-amber-200">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" /> UNLIMITED
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-stone-400" /> {item.prepTimeMinutes}m
            </span>
          </div>
        </div>

        {/* Item Title & Price */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-stone-900 text-base sm:text-lg leading-snug group-hover:text-amber-800 transition-colors">
            {item.name}
          </h3>
          <span className="font-extrabold text-stone-900 text-base sm:text-lg whitespace-nowrap">
            ₹{item.price}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
          {item.shortDescription}
        </p>
      </div>

      {/* Footer: Category / Calories + Order Button */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-[11px] text-stone-500">
          <span className="px-2 py-0.5 rounded bg-stone-100 font-medium">
            {item.category}
          </span>
          {item.calories && (
            <span className="hidden sm:inline-flex items-center gap-0.5 text-stone-400">
              <Flame className="w-3 h-3 text-orange-400" /> {item.calories} kcal
            </span>
          )}
        </div>

        {/* Order / Quantity Button */}
        <div>
          {cartQuantity > 0 ? (
            <div className="flex items-center bg-amber-600 text-white rounded-xl shadow-xs overflow-hidden">
              <button
                id={`btn-dec-${item.id}`}
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-amber-700 active:bg-amber-800 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-bold min-w-[24px] text-center">
                {cartQuantity}
              </span>
              <button
                id={`btn-inc-${item.id}`}
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-amber-700 active:bg-amber-800 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`btn-add-${item.id}`}
              onClick={() => onAddToCart(item)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-600 text-amber-900 hover:text-white border border-amber-300/80 hover:border-amber-600 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
