import React, { useEffect, useState } from 'react';
import { X, User, Phone, ShoppingBag, Clock, CheckCircle2, ChevronRight, LogOut, RefreshCw, ChefHat } from 'lucide-react';
import { CustomerProfile, Order, OrderStatus } from '../types';
import { fetchCustomerProfile, maskMobile, advanceOrderStatus } from '../lib/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProfile | null;
  onLogout: () => void;
  onSelectOrder: (order: Order) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  customer,
  onLogout,
  onSelectOrder,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProfile = async () => {
    if (!customer) return;
    try {
      setIsLoading(true);
      const data = await fetchCustomerProfile(customer.customerToken);
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && customer) {
      loadProfile();
    }
  }, [isOpen, customer]);

  if (!isOpen || !customer) return null;

  const activeOrders = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const pastOrders = orders.filter((o) => o.status === 'COMPLETED' || o.status === 'CANCELLED');

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'RECEIVED':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Placed</span>;
      case 'PREPARING':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">In Kitchen</span>;
      case 'READY':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold animate-pulse">Ready at Counter</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">Served</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          id="btn-close-profile-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-stone-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-stone-900">{customer.name}</h3>
              <button
                onClick={loadProfile}
                title="Refresh"
                className="p-1 text-stone-400 hover:text-amber-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3 h-3 text-stone-400" />
              <span>{maskMobile(customer.mobile)}</span>
            </div>
          </div>
        </div>

        {/* Customer Token Spotlight */}
        <div className="my-4 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
              Customer Token ID
            </div>
            <div className="text-2xl font-black text-amber-950 font-mono mt-0.5">
              {customer.customerToken}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-stone-400">Total Orders</div>
            <div className="text-xl font-black text-stone-800">{orders.length}</div>
          </div>
        </div>

        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                <span>Active Order ({activeOrders.length})</span>
              </h4>
            </div>

            <div className="space-y-2.5">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => {
                    onSelectOrder(order);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-300 hover:border-amber-500 cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-black text-sm text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                      Token: {order.orderToken}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-xs text-stone-700 mb-1">
                    {order.items.map((it) => `${it.quantity}x ${it.menuItem.name}`).join(', ')}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-amber-200/50">
                    <span>₹{order.totalAmount} • {order.paymentMethod === 'ONLINE_SIMULATED' ? 'Online Paid' : 'Counter Pay'}</span>
                    <span className="font-bold text-amber-800 flex items-center gap-0.5">
                      Track Live Progress <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Order History */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
            Order History
          </h4>

          {pastOrders.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => {
                    onSelectOrder(order);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <span>Token {order.orderToken}</span>
                      <span className="text-[10px] font-normal text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 truncate max-w-xs mt-0.5">
                      {order.items.map((it) => `${it.quantity}x ${it.menuItem.name}`).join(', ')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-stone-900">₹{order.totalAmount}</div>
                    <span className="text-[10px] text-emerald-700 font-semibold">Served</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-stone-50 rounded-xl text-stone-400 text-xs">
              No completed orders yet.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            id="btn-logout-profile"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch / Logout</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
