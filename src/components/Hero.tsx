import React from 'react';
import { Sparkles, Utensils, Award, Clock, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { CustomerProfile, MealPeriod } from '../types';

interface HeroProps {
  customer: CustomerProfile | null;
  mealPeriod: MealPeriod;
  onOpenRegister: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  customer,
  mealPeriod,
  onOpenRegister,
  onExploreMenu,
}) => {
  const periodDetails = {
    morning: {
      badge: 'Morning Special',
      title: 'Crispy Dosas, Hot Idlis & Vadas',
      desc: 'Start your morning with piping hot unlimited tiffins, authentic filter coffee, and fresh coconut chutneys.',
      timing: '6:00 AM – 11:30 AM',
      highlight: 'Unlimited Tiffins Platter @ ₹120',
      icon: '🌅',
    },
    afternoon: {
      badge: 'Afternoon Feast',
      title: 'Unlimited Homestyle Thalis & Biryanis',
      desc: 'Relish hearty unlimited south & north Indian thalis with unlimited rice, sambar, rasam, curries & sweets.',
      timing: '11:30 AM – 4:30 PM',
      highlight: 'Unlimited South Veg Thali @ ₹150',
      icon: '☀️',
    },
    evening: {
      badge: 'Evening Tiffin & Dinner',
      title: 'Rava Dosas, Thatte Idlis & Kothu Parotta',
      desc: 'Relax with freshly made evening tiffins, spicy chicken kothu, crispy dosas, and hot Irani dum chai.',
      timing: '4:30 PM – 11:00 PM',
      highlight: 'Unlimited Evening Tiffins @ ₹140',
      icon: '🌙',
    },
  }[mealPeriod];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-white pt-6 pb-10 border-b border-stone-200/60">
      {/* Background Subtle Shapes */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-semibold">
              <span>{periodDetails.icon}</span>
              <span>{periodDetails.badge}</span>
              <span className="text-amber-400">•</span>
              <span className="text-amber-700">{periodDetails.timing}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-[1.15]">
              Eat All You Want. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Unlimited Tiffins & Meals
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
              Welcome to <strong className="text-stone-900 font-semibold">TiffinHub</strong>! We serve delicious, hot, and hygienic tiffins and full meals with unlimited refills. Register in 5 seconds to get your customer token and enjoy fast counter pickup.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Unlimited Refills</h4>
                  <p className="text-[11px] text-stone-500">Eat till you're satisfied</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Token-Based Queue</h4>
                  <p className="text-[11px] text-stone-500">Live order tracking</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Veg & Non-Veg</h4>
                  <p className="text-[11px] text-stone-500">Separate clean kitchens</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-menu-btn"
                onClick={onExploreMenu}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View Today's Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!customer && (
                <button
                  id="hero-register-btn"
                  onClick={onOpenRegister}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-all shadow-xs"
                >
                  <span>Register for Token</span>
                </button>
              )}

              {customer && (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Logged in as <strong>{customer.name}</strong> ({customer.customerToken})</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Card / Current Slot Special */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  {periodDetails.badge}
                </span>
                <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" /> {periodDetails.timing}
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 mb-2">
                {periodDetails.title}
              </h3>
              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                {periodDetails.desc}
              </p>

              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase font-bold text-stone-400">Featured Special</div>
                    <div className="text-sm font-bold text-stone-900">{periodDetails.highlight}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    UNLIMITED
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Homestyle Hygiene
                </span>
                <button
                  onClick={onExploreMenu}
                  className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  Order Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
