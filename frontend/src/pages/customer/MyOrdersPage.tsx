import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchAllOrders } from '../../features/admin/adminSlice';
import { Package, Clock, ChefHat, Truck, CheckCircle2, XCircle, ArrowRight, ShoppingBag, Star } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  PLACED:           { label: 'Order Placed',      color: 'text-orange-600', icon: Clock,        bg: 'bg-orange-50 border-orange-200' },
  CONFIRMED:        { label: 'Confirmed',         color: 'text-blue-600',   icon: CheckCircle2, bg: 'bg-blue-50 border-blue-200' },
  PREPARING:        { label: 'Preparing',         color: 'text-yellow-600', icon: ChefHat,      bg: 'bg-yellow-50 border-yellow-200' },
  READY:            { label: 'Ready',             color: 'text-emerald-600',icon: Package,      bg: 'bg-emerald-50 border-emerald-200' },
  PICKED_UP:        { label: 'Picked Up',         color: 'text-purple-600', icon: Truck,        bg: 'bg-purple-50 border-purple-200' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery',  color: 'text-indigo-600', icon: Truck,        bg: 'bg-indigo-50 border-indigo-200' },
  DELIVERED:        { label: 'Delivered',          color: 'text-green-600',  icon: CheckCircle2, bg: 'bg-green-50 border-green-200' },
  CANCELLED:        { label: 'Cancelled',         color: 'text-red-600',    icon: XCircle,      bg: 'bg-red-50 border-red-200' },
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(state => state.admin);
  const { user } = useAppSelector(state => state.auth);
  const [tab, setTab] = useState<'active' | 'past'>('active');

  // Poll for order updates
  useEffect(() => {
    dispatch(fetchAllOrders());
    const interval = setInterval(() => dispatch(fetchAllOrders()), 8000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Filter orders for this user
  const myOrders = orders.filter(o => {
    if (user?.id) return o.customerId === user.id;
    return true; // Show all orders if no user ID (fallback/demo mode)
  });

  const activeOrders = myOrders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const pastOrders = myOrders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));
  const displayedOrders = tab === 'active' ? activeOrders : pastOrders;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 font-outfit tracking-tight flex items-center gap-3">
          <ShoppingBag className="text-orange-500" size={32} />
          My Orders
        </h1>
        <p className="text-gray-500 font-medium mt-1">Track your current orders and view past order history.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('active')}
          className={`px-5 py-2.5 rounded-full text-sm font-black transition-all ${
            tab === 'active'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Active ({activeOrders.length})
        </button>
        <button
          onClick={() => setTab('past')}
          className={`px-5 py-2.5 rounded-full text-sm font-black transition-all ${
            tab === 'past'
              ? 'btn-glass shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
          }`}
        >
          Past Orders ({pastOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayedOrders.map(order => {
          const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PLACED;
          const Icon = config.icon;
          const isActive = !['DELIVERED', 'CANCELLED'].includes(order.status);

          return (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all p-5 cursor-pointer group ${
                isActive ? 'border-orange-100 hover:border-orange-200' : 'border-gray-100 hover:border-gray-200'
              }`}
              onClick={() => navigate(`/order-tracking/${order.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg} border`}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{order.id}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.color}`}>
                  {config.label}
                </div>
              </div>

              {/* Order Details */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-lg font-black text-gray-900">₹{order.charge}</p>
                  {order.deliveryAddress && (
                    <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">{order.deliveryAddress}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-orange-500 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-bold hidden sm:inline">
                    {isActive ? 'Track Order' : 'View Details'}
                  </span>
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* Live pulse for active orders */}
              {isActive && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                  </span>
                  <span className="text-xs font-bold text-orange-600">Live tracking</span>
                </div>
              )}

              {/* Order Rating for Past Orders */}
              {!isActive && order.status === 'DELIVERED' && order.isRated && (() => {
                const avgRating = order.deliveryRating && order.foodRating 
                  ? Math.round((order.deliveryRating + order.foodRating) / 2) 
                  : (order.orderRating || 0);
                return (
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2 justify-between bg-orange-50/50 p-2 rounded-xl">
                    <span className="text-xs font-bold text-gray-500">Your Rating</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={`hst-${s}`} className={`w-4 h-4 ${avgRating >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}

        {/* Empty state */}
        {displayedOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">{tab === 'active' ? '🚀' : '📋'}</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              {tab === 'active' ? 'No active orders' : 'No past orders yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {tab === 'active' ? 'Place a new order from the menu!' : 'Your order history will appear here.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md"
            >
              Browse Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
