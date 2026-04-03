import { useState, useRef, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { ChefHat, Clock, CheckCircle2, AlertCircle, Utensils, User, MapPin, Bell, Calendar, ChevronLeft, ChevronRight, Package, IndianRupee, Flame } from 'lucide-react';
import { updateOrderStatusApi, fetchAllOrders } from '../../features/admin/adminSlice';
import type { OrderData } from '../../features/admin/adminSlice';
import OrderDetailModal from '../../components/common/OrderDetailModal';
import toast from 'react-hot-toast';

export default function ChefDashboardPage() {
  const { orders } = useAppSelector(state => state.admin);
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  // Poll for new orders every 10 seconds (reflects manager assignments in real-time)
  useEffect(() => {
    dispatch(fetchAllOrders());
    const interval = setInterval(() => {
      dispatch(fetchAllOrders());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [historyDate, setHistoryDate] = useState(new Date());
  const [processingOrderIds, setProcessingOrderIds] = useState<Record<string, boolean>>({});

  // ========== NOTIFICATION SYSTEM ==========
  const prevPendingCountRef = useRef(0);
  const [hasNewTasks, setHasNewTasks] = useState(false);

  // Separate task queues
  const pendingOrders = orders.filter(o =>
    o.assignedChefId === user?.id &&
    (o.status === 'PLACED' || o.status === 'CONFIRMED')
  );

  const inProgressOrders = orders.filter(o =>
    o.assignedChefId === user?.id &&
    o.status === 'PREPARING'
  );

  // All completed orders for this chef (for history)
  const allMyOrders = orders.filter(o => o.assignedChefId === user?.id);

  const completedToday = allMyOrders.filter(o => {
    const d = new Date(o.date);
    const today = new Date();
    return o.status === 'READY' || o.status === 'OUT_FOR_DELIVERY' || o.status === 'DELIVERED'
      ? d.toDateString() === today.toDateString()
      : false;
  });

  // Notification: detect new pending orders
  useEffect(() => {
    if (pendingOrders.length > prevPendingCountRef.current && prevPendingCountRef.current > 0) {
      setHasNewTasks(true);
      toast('🔔 New order assigned to you!', {
        icon: '🍳',
        style: { fontWeight: 700, borderRadius: '16px' },
      });
    }
    prevPendingCountRef.current = pendingOrders.length;
  }, [pendingOrders.length]);

  // ========== ACTIONS ==========
  const handleAccept = (orderId: string) => {
    if (processingOrderIds[orderId]) return;
    setProcessingOrderIds(prev => ({ ...prev, [orderId]: true }));
    dispatch(updateOrderStatusApi({ id: orderId, status: 'PREPARING' }))
      .unwrap()
      .then(() => {
        toast.success(`Order ${orderId} accepted! Now preparing.`);
        dispatch(fetchAllOrders());
      })
      .catch((error) => toast.error(typeof error === 'string' ? error : 'Failed to accept order.'))
      .finally(() => {
        setProcessingOrderIds(prev => ({ ...prev, [orderId]: false }));
      });
  };

  const handleMarkReady = (orderId: string) => {
    if (processingOrderIds[orderId]) return;
    setProcessingOrderIds(prev => ({ ...prev, [orderId]: true }));
    dispatch(updateOrderStatusApi({ id: orderId, status: 'READY' }))
      .unwrap()
      .then(() => {
        toast.success(`Order ${orderId} marked as READY for dispatch!`);
        dispatch(fetchAllOrders());
      })
      .catch((error) => toast.error(typeof error === 'string' ? error : 'Failed to update order status.'))
      .finally(() => {
        setProcessingOrderIds(prev => ({ ...prev, [orderId]: false }));
      });
  };

  // ========== HISTORY ==========
  const historyOrders = useMemo(() => {
    return allMyOrders.filter(o => {
      const d = new Date(o.date);
      return d.toDateString() === historyDate.toDateString() &&
        (o.status === 'READY' || o.status === 'OUT_FOR_DELIVERY' || o.status === 'DELIVERED');
    });
  }, [allMyOrders, historyDate]);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* ========== HEADER ========== */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
            <ChefHat className="text-orange-600" size={32} /> Kitchen Command Center
          </h1>
          <p className="text-gray-500 font-medium mt-1">Welcome, Chef {user?.name}. Your live ticket queue is below.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => setHasNewTasks(false)}
            className="relative btn-glass p-3 rounded-xl"
          >
            <Bell size={20} className={hasNewTasks ? 'text-orange-400' : 'text-white'} />
            {hasNewTasks && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            )}
            {hasNewTasks && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
            )}
          </button>
          <div className="glass px-6 py-3 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
            <Flame className="text-orange-500" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Queue</p>
              <p className="text-2xl font-black text-gray-800">
                {pendingOrders.length + inProgressOrders.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== STATS BAR ========== */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-yellow-50/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <AlertCircle className="text-yellow-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Awaiting Accept</p>
            <p className="text-2xl font-black text-yellow-600">{pendingOrders.length}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-orange-50/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Utensils className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Preparing</p>
            <p className="text-2xl font-black text-orange-600">{inProgressOrders.length}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-emerald-50/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="text-emerald-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Completed Today</p>
            <p className="text-2xl font-black text-emerald-600">{completedToday.length}</p>
          </div>
        </div>
      </div>

      {/* ========== PENDING QUEUE (Accept) ========== */}
      {pendingOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
            Incoming Orders — Awaiting Your Acceptance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingOrders.map(order => (
              <div
                key={order.id}
                className="glass rounded-3xl border-2 border-yellow-300 shadow-xl overflow-hidden flex flex-col hover:shadow-2xl transition-all cursor-pointer animate-pulse-slow group"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 flex justify-between items-center text-white">
                  <span className="font-black text-lg">{order.id}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg">
                    NEW
                  </span>
                </div>
              <div className="p-5 flex-grow space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-gray-400" />
                    <span className="font-bold text-gray-800">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-red-400" />
                    <span className="font-medium text-gray-500 truncate">{order.deliveryAddress}</span>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <Utensils size={12} /> Items to Prepare
                      </div>
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="bg-orange-100 text-orange-700 font-black px-1.5 py-0.5 rounded text-[10px]">{item.quantity}x</span>
                              <span className="font-bold text-gray-800">{item.menuItemName}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400">₹{item.totalPrice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee size={14} className="text-emerald-500" />
                      <span className="font-black text-gray-800">₹{order.totalAmount ?? order.charge}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="p-4 border-t border-yellow-100">
                  <button
                    onClick={e => { e.stopPropagation(); handleAccept(order.id); }}
                    disabled={Boolean(processingOrderIds[order.id])}
                    className="w-full btn-glass-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={16} /> {processingOrderIds[order.id] ? 'Accepting...' : 'Accept Order'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== IN PROGRESS QUEUE (Mark Ready) ========== */}
      {inProgressOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            Currently Preparing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inProgressOrders.map(order => (
              <div
                key={order.id}
                className="glass rounded-3xl border border-orange-200 shadow-xl overflow-hidden flex flex-col hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex justify-between items-center text-white">
                  <span className="font-black text-lg">{order.id}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Flame size={10} /> COOKING
                  </span>
                </div>
                <div className="p-5 flex-grow space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-gray-400" />
                    <span className="font-bold text-gray-800">{order.customerName}</span>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                        <Utensils size={12} /> Cooking Checklist
                      </div>
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <span className="bg-orange-100 text-orange-700 font-black px-1.5 py-0.5 rounded text-[10px]">{item.quantity}x</span>
                              <span className="font-bold text-gray-800">{item.menuItemName}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400">₹{item.totalPrice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={12} />
                    <span className="font-bold">
                      {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white/10 border-t border-white/10">
                  <button
                    onClick={e => { e.stopPropagation(); handleMarkReady(order.id); }}
                    disabled={Boolean(processingOrderIds[order.id])}
                    className="w-full bg-emerald-600/80 backdrop-blur-md border border-white/20 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Package size={16} /> {processingOrderIds[order.id] ? 'Updating...' : 'Mark as Ready'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingOrders.length === 0 && inProgressOrders.length === 0 && (
        <div className="text-center py-16 glass rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat size={32} className="text-gray-300" />
          </div>
          <p className="font-black text-gray-400 uppercase tracking-widest">No active tickets</p>
          <p className="text-sm text-gray-500 mt-2 font-medium">Sit tight! New orders will appear here when assigned.</p>
        </div>
      )}

      {/* ========== ORDER HISTORY ========== */}
      <div className="glass rounded-3xl p-6 border border-white/60 shadow-xl bg-white/40">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={20} className="text-primary-500" /> Order History
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
                    <p className="text-xs text-gray-500 font-medium">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-emerald-600">₹{order.charge}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400 py-8 font-medium">
            No completed orders for this date.
          </p>
        )}
      </div>

      {/* ========== ORDER DETAIL MODAL ========== */}
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
