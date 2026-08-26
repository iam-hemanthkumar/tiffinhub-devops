import React, { useEffect, useState } from 'react';
import { CustomerProfile, MenuItem, Order, MealPeriod } from './types';
import { fetchMenu, fetchCustomerProfile } from './lib/api';
import { AuthScreen } from './components/AuthScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { RegisterModal } from './components/RegisterModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProfileModal } from './components/ProfileModal';
import { ActiveOrderFloatingBar } from './components/ActiveOrderFloatingBar';
import { UtensilsCrossed } from 'lucide-react';

const STORAGE_KEY_CUSTOMER = 'tiffinhub_customer';
const STORAGE_KEY_ACTIVE_ORDER = 'tiffinhub_active_order';

export default function App() {
  // Determine initial meal period based on current local hour
  const getInitialPeriod = (): MealPeriod => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11.5) return 'morning';
    if (hour >= 11.5 && hour < 16.5) return 'afternoon';
    return 'evening';
  };

  const [selectedPeriod, setSelectedPeriod] = useState<MealPeriod>(getInitialPeriod);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  
  // Customer authentication state
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOMER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ORDER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

  // Load Menu Data
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchMenu();
        setMenuItems(data.items);
      } catch (err) {
        console.error('Failed to load menu', err);
      }
    };
    loadMenu();
  }, []);

  // Sync active order periodically if customer is logged in
  useEffect(() => {
    if (!customer) return;

    const checkActiveOrders = async () => {
      try {
        const data = await fetchCustomerProfile(customer.customerToken);
        const latest = data.orders.find(
          (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
        );
        if (latest) {
          setActiveOrder(latest);
          localStorage.setItem(STORAGE_KEY_ACTIVE_ORDER, JSON.stringify(latest));
        } else if (activeOrder && activeOrder.status === 'COMPLETED') {
          // Keep completed or clear if finished
        }
      } catch (err) {
        console.error('Failed to sync customer profile', err);
      }
    };

    checkActiveOrders();
    const interval = setInterval(checkActiveOrders, 10000);
    return () => clearInterval(interval);
  }, [customer]);

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  const cartTotalCount = Object.values(cart).reduce<number>((sum, qty) => sum + Number(qty), 0);

  // Customer Auth
  const handleCustomerSuccess = (cust: CustomerProfile) => {
    setCustomer(cust);
    localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(cust));
  };

  const handleLogout = () => {
    setCustomer(null);
    setActiveOrder(null);
    setCart({});
    localStorage.removeItem(STORAGE_KEY_CUSTOMER);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_ORDER);
  };

  // Order Placement
  const handleOrderSuccess = (order: Order) => {
    setActiveOrder(order);
    localStorage.setItem(STORAGE_KEY_ACTIVE_ORDER, JSON.stringify(order));
    setIsOrderSuccessOpen(true);
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // IF NOT LOGGED IN: Render ONLY TiffinHub logo with Login or Register options
  if (!customer) {
    return <AuthScreen onAuthSuccess={handleCustomerSuccess} />;
  }

  // IF LOGGED IN: Render full ordering experience
  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 text-stone-900 font-sans antialiased selection:bg-amber-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        customer={customer}
        mealPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
        activeOrderCount={activeOrder && activeOrder.status !== 'COMPLETED' ? 1 : 0}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Welcome / Hero Banner */}
        <Hero
          customer={customer}
          mealPeriod={selectedPeriod}
          onExploreMenu={scrollToMenu}
        />

        {/* Dynamic Time-of-Day Food Menu */}
        <MenuSection
          items={menuItems}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </main>

      {/* Floating Active Order Tracker */}
      {activeOrder && activeOrder.status !== 'COMPLETED' && (
        <ActiveOrderFloatingBar
          order={activeOrder}
          onClick={() => setIsOrderSuccessOpen(true)}
        />
      )}

      {/* Modals & Drawers */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleCustomerSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        menuItems={menuItems}
        customer={customer}
        selectedPeriod={selectedPeriod}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        order={activeOrder}
        onClose={() => setIsOrderSuccessOpen(false)}
        onViewAllOrders={() => {
          setIsOrderSuccessOpen(false);
          setIsProfileOpen(true);
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        customer={customer}
        onLogout={handleLogout}
        onSelectOrder={(order) => {
          setActiveOrder(order);
          setIsOrderSuccessOpen(true);
        }}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-800">
            {/* Column 1: Restaurant Info */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  Tiffin<span className="text-amber-500">Hub</span>
                </span>
              </div>
              <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                TiffinHub is dedicated to authentic, piping hot unlimited tiffins and hearty homestyle thalis with unlimited refills throughout the day.
              </p>
              <div className="flex items-center gap-3 text-xs text-amber-400 font-semibold pt-1">
                <span>🌅 Morning Tiffins</span>
                <span>•</span>
                <span>☀️ Afternoon Meals</span>
                <span>•</span>
                <span>🌙 Evening Tiffins</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Ordering Slots
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button
                    onClick={() => {
                      setSelectedPeriod('morning');
                      scrollToMenu();
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Morning (6:00 AM – 11:30 AM)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedPeriod('afternoon');
                      scrollToMenu();
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Afternoon (11:30 AM – 4:30 PM)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedPeriod('evening');
                      scrollToMenu();
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Evening (4:30 PM – 11:00 PM)
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} TiffinHub. Authentic Unlimited Tiffins & Homestyle Meals.</p>
            <p className="flex items-center gap-1">
              Token Queue System • Daily 12:00 AM Reset
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
