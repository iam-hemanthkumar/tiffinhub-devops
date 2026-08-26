import React, { useState } from 'react';
import { Search, Filter, Sparkles, Sun, Moon, Sunrise, Utensils } from 'lucide-react';
import { MenuItem, MealPeriod } from '../types';
import { MenuItemCard } from './MenuItemCard';

interface MenuSectionProps {
  items: MenuItem[];
  selectedPeriod: MealPeriod;
  onSelectPeriod: (period: MealPeriod) => void;
  cart: { [itemId: string]: number };
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  selectedPeriod,
  onSelectPeriod,
  cart,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items
  const filteredItems = items.filter((item) => {
    // Match period
    if (item.mealPeriod !== selectedPeriod) return false;
    // Match food type
    if (filterType !== 'all' && item.foodType !== filterType) return false;
    // Match search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.shortDescription.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCategory) return false;
    }
    return true;
  });

  const periodHeader = {
    morning: {
      title: 'Morning Tiffins Menu',
      time: '6:00 AM – 11:30 AM',
      subtitle: 'Crispy Dosas, Steamed Idlis, Fluffy Pooris & South Indian Filter Coffee',
      icon: Sunrise,
      bannerColor: 'from-amber-500/10 to-orange-500/5',
      borderColor: 'border-amber-200',
    },
    afternoon: {
      title: 'Afternoon Meals Menu',
      time: '11:30 AM – 4:30 PM',
      subtitle: 'Unlimited Homestyle Thalis, Royal Biryanis & Coastal Specials',
      icon: Sun,
      bannerColor: 'from-orange-500/10 to-amber-500/5',
      borderColor: 'border-orange-200',
    },
    evening: {
      title: 'Evening Tiffins & Dinner',
      time: '4:30 PM – 11:00 PM',
      subtitle: 'Rava Dosas, Thatte Idlis, Spicy Kothu Parotta & Irani Dum Chai',
      icon: Moon,
      bannerColor: 'from-stone-700/5 to-amber-600/5',
      borderColor: 'border-stone-200',
    },
  }[selectedPeriod];

  const PeriodIcon = periodHeader.icon;

  return (
    <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Section Title & Time Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Utensils className="w-3.5 h-3.5" />
            <span>Time-of-Day Fresh Menu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Explore Available Food
          </h2>
        </div>

        {/* Meal Period Toggle Switch */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200/90 self-start md:self-auto">
          <button
            id="tab-period-morning"
            onClick={() => onSelectPeriod('morning')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedPeriod === 'morning'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sunrise className="w-4 h-4" />
            <span>Morning Tiffins</span>
          </button>

          <button
            id="tab-period-afternoon"
            onClick={() => onSelectPeriod('afternoon')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedPeriod === 'afternoon'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Afternoon Meals</span>
          </button>

          <button
            id="tab-period-evening"
            onClick={() => onSelectPeriod('evening')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedPeriod === 'evening'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Evening Tiffins</span>
          </button>
        </div>
      </div>

      {/* Period Header Banner */}
      <div
        className={`bg-gradient-to-r ${periodHeader.bannerColor} border ${periodHeader.borderColor} rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-amber-700 border border-amber-200/60 shadow-xs flex items-center justify-center shrink-0">
            <PeriodIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {periodHeader.title}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600">
                {periodHeader.time}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {periodHeader.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Veg / Non-Veg Filters */}
        <div className="flex items-center gap-1.5 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80">
          <button
            id="filter-all"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Items
          </button>
          <button
            id="filter-veg"
            onClick={() => setFilterType('veg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'veg'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-300" />
            <span>Pure Veg</span>
          </button>
          <button
            id="filter-non-veg"
            onClick={() => setFilterType('non-veg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'non-veg'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-red-300" />
            <span>Non-Veg</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="menu-search-input"
            type="text"
            placeholder="Search items (dosa, thali, coffee...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
          />
        </div>
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              cartQuantity={cart[item.id] || 0}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <div className="w-12 h-12 rounded-full bg-stone-200/80 text-stone-500 flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-base mb-1">No items found</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto mb-4">
            Try adjusting your search query or switch dietary filters to see available dishes.
          </p>
          <button
            onClick={() => {
              setFilterType('all');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
