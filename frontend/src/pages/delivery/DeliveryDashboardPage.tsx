import { useState, useRef, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Truck, MapPin, Package, CheckCircle2, Navigation, Phone, User, Clock, Bell, Calendar, ChevronLeft, ChevronRight, IndianRupee, Zap } from 'lucide-react';
import { updateOrderStatusApi, fetchAllOrders } from '../../features/admin/adminSlice';
import type { OrderData } from '../../features/admin/adminSlice';
import OrderDetailModal from '../../components/common/OrderDetailModal';
import toast from 'react-hot-toast';

export default function DeliveryDashboardPage() {
  const { orders } = useAppSelector(state => state.admin);
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  // Poll for new orders every 10 seconds (reflects manager/chef updates in real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchAllOrders());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [historyDate, setHistoryDate] = useState(new Date());

  // ========== NOTIFICATION SYSTEM ==========
  const prevWaitingCountRef = useRef(0);
  const [hasNewTasks, setHasNewTasks] = useState(false);

  // Task queue segments
  const waitingPickup = orders.filter(o =>
    o.assignedDeliveryId === user?.id && o.status === 'READY'
  );

  const inTransit = orders.filter(o =>
    o.assignedDeliveryId === user?.id &&
    (o.status === 'OUT_FOR_DELIVERY' || o.status === 'PICKED_UP')
  );

  // All orders for this rider
  const allMyOrders = orders.filter(o => o.assignedDeliveryId === user?.id);

  const deliveredToday = allMyOrders.filter(o => {
    const d = new Date(o.date);
    const today = new Date();
    return o.status === 'DELIVERED' && d.toDateString() === today.toDateString();
  });

  // Notification: detect new waiting orders
  useEffect(() => {
    if (waitingPickup.length > prevWaitingCountRef.current && prevWaitingCountRef.current > 0) {
      setHasNewTasks(true);
      toast('🔔 New delivery assigned to you!', {
        icon: '🚚',
        style: { fontWeight: 700, borderRadius: '16px' },
      });
    }
    prevWaitingCountRef.current = waitingPickup.length;
  }, [waitingPickup.length]);

  // ========== ACTIONS ==========
  const handleAcceptPickup = (orderId: string) => {
    dispatch(updateOrderStatusApi({ id: orderId, status: 'OUT_FOR_DELIVERY' }))
      .unwrap()
      .then(() => toast.success(`Order ${orderId} accepted! Heading to pick up.`))
      .catch(() => toast.error('Failed to accept delivery.'));
  };

  const handleConfirmDelivery = (orderId: string) => {
    dispatch(updateOrderStatusApi({ id: orderId, status: 'DELIVERED' }))
      .unwrap()
      .then(() => toast.success(`Order ${orderId} delivered successfully! 🎉`))
      .catch(() => toast.error('Failed to confirm delivery.'));
  };

  // ========== HISTORY ==========
  const historyOrders = useMemo(() => {
    return allMyOrders.filter(o => {
      const d = new Date(o.date);
      return d.toDateString() === historyDate.toDateString() &&
        o.status === 'DELIVERED';
    });
  }, [allMyOrders, historyDate]);

  const todayEarnings = deliveredToday.reduce((sum, o) => sum + o.charge, 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* ========== HEADER ========== */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
            <Truck className="text-emerald-600" size={32} /> Delivery Hub
          </h1>
          <p className="text-gray-500 font-medium mt-1">Welcome, {user?.name}. Your active delivery queue is below.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => setHasNewTasks(false)}
            className="relative btn-glass p-3 rounded-xl"
          >
            <Bell size={20} className={hasNewTasks ? 'text-emerald-400' : 'text-white'} />
            {hasNewTasks && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            )}
            {hasNewTasks && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
            )}
          </button>
          <div className="glass px-6 py-3 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
            <Navigation className="text-emerald-500" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Jobs</p>
              <p className="text-2xl font-black text-gray-800">
                {waitingPickup.length + inTransit.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== STATS BAR ========== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-blue-50/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Package className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Waiting Pickup</p>
            <p className="text-2xl font-black text-blue-600">{waitingPickup.length}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-purple-50/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Zap className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">In Transit</p>
            <p className="text-2xl font-black text-purple-600">{inTransit.length}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-emerald-50/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="text-emerald-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Delivered Today</p>
            <p className="text-2xl font-black text-emerald-600">{deliveredToday.length}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-green-50/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <IndianRupee className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Today's Value</p>
            <p className="text-2xl font-black text-green-600">₹{todayEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ========== WAITING PICKUP QUEUE (Accept & Pick Up) ========== */}
      {waitingPickup.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            Orders Packed — Waiting For Pickup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {waitingPickup.map(order => (
              <div
                key={order.id}
                className="glass rounded-3xl border-2 border-blue-300 shadow-xl overflow-hidden flex flex-col hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex justify-between items-center text-white">
                  <span className="font-black text-lg">{order.id}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Package size={10} /> PACKED & READY
                  </span>
                </div>

                <div className="p-5 flex-grow space-y-4">
                  {/* Destination */}
                  <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 flex items-start gap-3">
                    <MapPin className="text-red-500 shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                      <p className="font-bold text-gray-800 text-sm leading-snug">{order.deliveryAddress}</p>
                      <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                        <User size={12} /> {order.customerName}
                      </p>
                    </div>
                  </div>

                  {/* Utility Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={e => e.stopPropagation()}
                      className="flex-1 btn-glass p-3 rounded-2xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2"
                    >
                      <Phone size={14} /> Contact
                    </button>
                    <button
                      onClick={e => e.stopPropagation()}
                      className="flex-1 btn-glass p-3 rounded-2xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2"
                    >
                      <Navigation size={14} /> Map
                    </button>
                  </div>

                  {/* Order Value */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-black text-emerald-600">₹{order.charge}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Cash on Delivery</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock size={12} />
                      <span className="font-bold">
                        {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accept Button */}
                <div className="p-4 border-t border-blue-100">
                  <button
                    onClick={e => { e.stopPropagation(); handleAcceptPickup(order.id); }}
                    className="w-full btn-glass-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Package size={16} /> Accept & Pick Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== IN TRANSIT QUEUE (Confirm Delivery) ========== */}
      {inTransit.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            In Transit — Delivering Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {inTransit.map(order => (
              <div
                key={order.id}
                className="glass rounded-3xl border border-purple-200 shadow-xl overflow-hidden flex flex-col hover:shadow-2xl transition-all cursor-pointer relative"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-purple-500" />

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-gray-900">{order.id}</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                        <Zap size={10} /> On Route
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-400">
                      {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 flex items-start gap-3">
                    <MapPin className="text-red-500 shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivering To</p>
                      <p className="font-bold text-gray-800 text-sm">{order.deliveryAddress}</p>
                      <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                        <User size={12} /> {order.customerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-emerald-600">₹{order.charge}</p>
                    <button
                      onClick={e => { e.stopPropagation(); handleConfirmDelivery(order.id); }}
                      className="bg-emerald-600/80 backdrop-blur-md border border-white/20 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl transition-all shadow-lg flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Confirm Delivery
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {waitingPickup.length === 0 && inTransit.length === 0 && (
        <div className="text-center py-16 glass rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck size={32} className="text-gray-300" />
          </div>
          <p className="font-black text-gray-400 uppercase tracking-widest">No active deliveries</p>
          <p className="text-sm text-gray-500 mt-2 font-medium">New delivery assignments will appear here automatically.</p>
        </div>
      )}

      {/* ========== ORDER HISTORY ========== */}
      <div className="glass rounded-3xl p-6 border border-white/60 shadow-xl bg-white/40">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={20} className="text-emerald-500" /> Delivery History
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryDate(new Date(historyDate.getTime() - 86400000))}
              className="btn-glass p-2 rounded-xl"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 bg-white/80 rounded-xl font-black text-xs text-gray-800 border border-white/60 shadow-sm min-w-[140px] text-center">
              {historyDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <button
              onClick={() => setHistoryDate(new Date(historyDate.getTime() + 86400000))}
              className="btn-glass p-2 rounded-xl"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setHistoryDate(new Date())}
              className="btn-glass text-[10px] font-black uppercase px-3 py-2 rounded-xl"
            >
              Today
            </button>
          </div>
        </div>

        {historyOrders.length > 0 ? (
          <div className="space-y-3">
            {historyOrders.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="flex items-center justify-between bg-white/50 rounded-2xl p-4 border border-white/60 hover:bg-white/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-600" size={18} />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{order.id}</p>
                    <p className="text-xs text-gray-500 font-medium">{order.customerName} · {order.deliveryAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-emerald-600">₹{order.charge}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400 py-8 font-medium">
            No deliveries completed on this date.
          </p>
        )}
      </div>

      {/* ========== ORDER DETAIL MODAL ========== */}
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
