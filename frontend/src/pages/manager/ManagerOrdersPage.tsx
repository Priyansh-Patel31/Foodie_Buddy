import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  ClipboardList, CheckCircle2, Clock, ChefHat, Truck, MapPin, User,
  Star, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { assignChefApi, assignDeliveryApi, fetchAllOrders } from '../../features/admin/adminSlice';
import { OrderData } from '../../features/admin/adminSlice';
import toast from 'react-hot-toast';

type AssignMode = 'chef' | 'delivery';

interface AssignModal {
  order: OrderData;
  mode: AssignMode;
}

export default function ManagerOrdersPage() {
  const { orders, users } = useAppSelector(state => state.admin);
  const dispatch = useAppDispatch();
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');
  const [assignModal, setAssignModal] = useState<AssignModal | null>(null);
  
  // Track previous count for push notifications
  const prevOrderCountRef = useRef<number>(0);

  // Audio Context (must be initialized after user interaction in some browsers, but fine for MVP)
  const playNewOrderSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch(e) {}
  };

  // Poll for order updates every 10 seconds (reflects chef/delivery status changes)
  useEffect(() => {
    const fetchOrders = async () => {
      const action = await dispatch(fetchAllOrders());
      if (fetchAllOrders.fulfilled.match(action)) {
        const newCount = action.payload.length;
        if (prevOrderCountRef.current !== 0 && newCount > prevOrderCountRef.current) {
          // New order arrived!
          playNewOrderSound();
          toast.success('🔔 New Order Received!', { duration: 4000, style: { fontWeight: 'bold', fontSize: '16px' } });
        }
        prevOrderCountRef.current = newCount;
      }
    };
    
    // Initial fetch
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const chefs = users.filter(u => u.role === 'ROLE_CHEF');
  const riders = users.filter(u => u.role === 'ROLE_DELIVERY');

  // Count active orders per role — chefs only count chef assignments, riders only delivery
  const getChefLoad = (userId: string) => {
    return orders.filter(o =>
      o.assignedChefId === userId &&
      !['DELIVERED', 'CANCELLED'].includes(o.status)
    ).length;
  };
  const getRiderLoad = (userId: string) => {
    return orders.filter(o =>
      o.assignedDeliveryId === userId &&
      !['DELIVERED', 'CANCELLED'].includes(o.status)
    ).length;
  };

  const activeOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'DELIVERED');

  const needsChefOrders = activeOrders.filter(o =>
    (o.status === 'PLACED' || o.status === 'CONFIRMED' || o.status === 'PENDING' || o.status === 'PREPARING') && !o.assignedChefId
  );
  const needsDeliveryOrders = activeOrders.filter(o => o.status === 'READY' && !o.assignedDeliveryId);

  const filteredOrders = statusFilter === 'ACTIVE' ? activeOrders
    : statusFilter === 'COMPLETED' ? completedOrders
    : orders;

  const statusCounts = {
    ACTIVE: activeOrders.length,
    COMPLETED: completedOrders.length,
    ALL: orders.length,
  };

  const filters = [
    { value: 'ACTIVE', label: '🔴 Active', count: statusCounts.ACTIVE },
    { value: 'COMPLETED', label: '✅ Completed', count: statusCounts.COMPLETED },
    { value: 'ALL', label: 'All Orders', count: statusCounts.ALL },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PLACED': case 'CONFIRMED': case 'PENDING': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'PREPARING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'READY': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OUT_FOR_DELIVERY': case 'PICKED_UP': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLACED': case 'CONFIRMED': case 'PENDING': return <Clock size={13} />;
      case 'PREPARING': return <ChefHat size={13} />;
      case 'READY': return <CheckCircle2 size={13} />;
      case 'OUT_FOR_DELIVERY': case 'PICKED_UP': return <Truck size={13} />;
      case 'DELIVERED': return <CheckCircle2 size={13} />;
      default: return <Clock size={13} />;
    }
  };

  const handleAssign = (userId: string) => {
    if (!assignModal) return;
    const { order, mode } = assignModal;
    const worker = users.find(u => u.id === userId);
    if (!worker) return;

    if (mode === 'chef') {
      dispatch(assignChefApi({ orderId: order.id, userId, userName: worker.name }))
        .unwrap()
        .then(() => {
          toast.success(`👨‍🍳 ${worker.name} assigned as Chef for ${order.id}.`);
          dispatch(fetchAllOrders());
          // Order stays in current status — chef must accept from their dashboard
        })
        .catch((error) => toast.error(typeof error === 'string' ? error : `Failed to assign chef for ${order.id}.`));
    } else {
      dispatch(assignDeliveryApi({ orderId: order.id, userId, userName: worker.name }))
        .unwrap()
        .then(() => {
          dispatch(fetchAllOrders());
          // Don't auto-change status! Rider must accept from their dashboard.
          if (order.status === 'READY') {
            toast.success(`🛵 ${worker.name} dispatched for ${order.id}. Waiting for rider to pick up.`);
          } else {
            toast.success(`🛵 ${worker.name} pre-assigned as rider for ${order.id}. They'll see it when food is ready.`);
          }
        })
        .catch((error) => toast.error(typeof error === 'string' ? error : `Failed to assign rider for ${order.id}.`));
    }
    setAssignModal(null);
  };

  const openAssign = (order: OrderData, mode: AssignMode) => {
    setAssignModal({ order, mode });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
          <ClipboardList className="text-green-600" size={32} /> Order Dispatch
        </h1>
        <p className="text-gray-500 font-medium mt-1">Assign kitchen staff and riders. Monitor all active order queues in real-time.</p>
      </div>

      {/* Urgent Alerts */}
      {(needsChefOrders.length > 0 || needsDeliveryOrders.length > 0) && (
        <div className="space-y-3">
          {needsChefOrders.map(o => (
            <div key={o.id + '-chef'} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-5 py-4 shadow-sm animate-pulse-once">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                <div>
                  <p className="font-black text-red-700 text-sm">⚠️ {o.id} — New Order! Assign a Chef</p>
                  <p className="text-xs text-red-500">{o.customerName} · {o.deliveryAddress}</p>
                </div>
              </div>
              <button
                onClick={() => openAssign(o, 'chef')}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest px-5 py-2 rounded-xl transition-all shadow-lg shadow-red-200"
              >
                Assign Chef →
              </button>
            </div>
          ))}
          {needsDeliveryOrders.map(o => (
            <div key={o.id + '-delivery'} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 shadow-sm animate-pulse-once">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-blue-500 shrink-0" />
                <div>
                  <p className="font-black text-blue-700 text-sm">🍽️ {o.id} — Ready for Dispatch! Assign a Rider</p>
                  <p className="text-xs text-blue-500">{o.customerName} · {o.deliveryAddress}</p>
                </div>
              </div>
              <button
                onClick={() => openAssign(o, 'delivery')}
                className="ml-4 bg-blue-600/80 backdrop-blur-md border border-white/20 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest px-5 py-2 rounded-xl transition-all shadow-lg"
              >
                Dispatch Rider →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Worker Load Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-sm">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><ChefHat size={14} /> Kitchen Team</p>
          <div className="space-y-2">
            {chefs.map(c => {
              const load = getChefLoad(c.id);
              return (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">{c.name}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${load > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {load > 0 ? `${load} active order${load > 1 ? 's' : ''}` : 'Available'}
                  </span>
                </div>
              );
            })}
            {chefs.length === 0 && <p className="text-xs text-gray-400">No chefs on roster.</p>}
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-sm">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Truck size={14} /> Delivery Team</p>
          <div className="space-y-2">
            {riders.map(r => {
              const load = getRiderLoad(r.id);
              return (
                <div key={r.id} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">{r.name}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${load > 0 ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {load > 0 ? `${load} active order${load > 1 ? 's' : ''}` : 'Available'}
                  </span>
                </div>
              );
            })}
            {riders.length === 0 && <p className="text-xs text-gray-400">No riders on roster.</p>}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              statusFilter === f.value
                ? 'btn-glass-primary shadow-lg shadow-primary-500/20'
                : 'btn-glass hover:shadow-sm'
            }`}
          >
            {f.label} <span className="ml-1 opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOrders.map(order => {
          const needsChef = ['PLACED', 'CONFIRMED', 'PENDING', 'PREPARING'].includes(order.status) && !order.assignedChefId;
          const canChangeChef = ['PLACED', 'CONFIRMED', 'PENDING', 'PREPARING'].includes(order.status);
          const needsRider = order.status === 'READY' && !order.assignedDeliveryId;
          // Rider can be pre-assigned during PREPARING, assigned at READY, or changed during delivery
          const canAssignRider = ['PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'PICKED_UP'].includes(order.status);
          const canChangeRider = canAssignRider;
          return (
            <div
              key={order.id}
              className={`glass rounded-3xl p-6 border shadow-xl bg-white/40 hover:shadow-2xl transition-all group ${
                needsChef ? 'border-red-300 shadow-red-100' : needsRider ? 'border-blue-300 shadow-blue-100' : 'border-white/60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-gray-900">{order.id}</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusBadge(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-xs font-bold text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User size={13} className="text-blue-400 shrink-0" />
                  <span className="font-bold text-gray-700">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={13} className="text-red-400 shrink-0" />
                  <span className="font-medium text-gray-500 truncate">{order.deliveryAddress}</span>
                </div>
              </div>

              {/* Assignments */}
              <div className="bg-gray-50/60 rounded-2xl p-3 space-y-2 mb-4">
                {/* Chef Assignment */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <ChefHat size={12} className="text-yellow-500" /> Chef
                  </div>
                  {order.assignedChefName ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-gray-800">{order.assignedChefName}</span>
                      {canChangeChef && (
                        <button onClick={() => openAssign(order, 'chef')} className="text-gray-400 hover:text-primary-500 transition-colors" title="Re-assign">
                          <RefreshCw size={11} />
                        </button>
                      )}
                    </div>
                  ) : (
                    needsChef ? (
                      <button
                        onClick={() => openAssign(order, 'chef')}
                        className="text-[10px] font-black uppercase bg-red-600/80 backdrop-blur-sm border border-white/10 text-white px-3 py-1 rounded-lg animate-pulse hover:bg-red-600 transition-all"
                      >
                        Assign Now!
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400">—</span>
                    )
                  )}
                </div>
                {/* Rider Assignment */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <Truck size={12} className="text-purple-500" /> Rider
                  </div>
                  {order.assignedDeliveryName ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-gray-800">{order.assignedDeliveryName}</span>
                      {!['PLACED', 'CONFIRMED', 'PENDING'].includes(order.status) && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-600 border border-green-100">
                          {order.status === 'PREPARING' ? 'Pre-assigned' : 'Assigned'}
                        </span>
                      )}
                      {canChangeRider && (
                        <button onClick={() => openAssign(order, 'delivery')} className="text-gray-400 hover:text-primary-500 transition-colors" title="Re-assign">
                          <RefreshCw size={11} />
                        </button>
                      )}
                    </div>
                  ) : (
                    needsRider ? (
                      <button
                        onClick={() => openAssign(order, 'delivery')}
                        className="text-[10px] font-black uppercase bg-blue-600/80 backdrop-blur-sm border border-white/10 text-white px-3 py-1 rounded-lg animate-pulse hover:bg-blue-600 transition-all"
                      >
                        Dispatch!
                      </button>
                    ) : canAssignRider && !order.assignedDeliveryId ? (
                      <button
                        onClick={() => openAssign(order, 'delivery')}
                        className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg hover:bg-blue-100 transition-all"
                      >
                        Pre-assign Rider
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400">—</span>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xl font-black text-primary-600">₹{order.charge}</p>
                  <p className="text-[10px] font-bold text-green-500 uppercase">Profit: +₹{order.profit}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {order.orderRating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-xl border border-yellow-100">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-black text-sm text-gray-800">{order.orderRating}.0</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center font-bold text-gray-400 p-12 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
          No orders matching this filter.
        </div>
      )}

      {/* Assignment Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setAssignModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {assignModal.mode === 'chef' ? '👨‍🍳 Assign Chef' : '🛵 Dispatch Rider'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Order: <span className="font-bold text-gray-800">{assignModal.order.id}</span> · {assignModal.order.customerName}</p>
              </div>
              <button onClick={() => setAssignModal(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              {(assignModal.mode === 'chef' ? chefs : riders).map(worker => {
                const load = assignModal.mode === 'chef' ? getChefLoad(worker.id) : getRiderLoad(worker.id);
                const isCurrent = assignModal.mode === 'chef'
                  ? assignModal.order.assignedChefId === worker.id
                  : assignModal.order.assignedDeliveryId === worker.id;
                return (
                  <button
                    key={worker.id}
                    onClick={() => handleAssign(worker.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all hover:shadow-md ${
                      isCurrent ? 'border-primary-400 bg-primary-50' :
                      load === 0 ? 'border-green-200 bg-green-50 hover:border-green-400' :
                      'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        load === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {worker.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-black text-gray-900 text-sm">{worker.name}</p>
                        <p className="text-xs text-gray-500">{isCurrent ? 'Currently assigned' : load === 0 ? 'Free & available' : `${load} active order${load > 1 ? 's' : ''}`}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      isCurrent ? 'bg-primary-100 text-primary-700' :
                      load === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {isCurrent ? 'Assigned' : load === 0 ? 'Available' : 'Busy'}
                    </span>
                  </button>
                );
              })}
              {(assignModal.mode === 'chef' ? chefs : riders).length === 0 && (
                <p className="text-center text-gray-500 py-4">No {assignModal.mode === 'chef' ? 'chefs' : 'riders'} found in the system.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
