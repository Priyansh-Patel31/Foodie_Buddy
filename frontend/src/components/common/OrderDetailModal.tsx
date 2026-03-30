import { X, User, MapPin, ChefHat, Truck, Clock, IndianRupee, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import type { OrderData } from '../../features/admin/adminSlice';

interface OrderDetailModalProps {
  order: OrderData | null;
  onClose: () => void;
}

const STATUS_FLOW = ['PLACED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];

function getStatusColor(status: string) {
  switch (status) {
    case 'PLACED': return 'bg-yellow-500';
    case 'PREPARING': return 'bg-orange-500';
    case 'READY': return 'bg-blue-500';
    case 'OUT_FOR_DELIVERY': return 'bg-purple-500';
    case 'DELIVERED': return 'bg-emerald-500';
    case 'CANCELLED': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PLACED': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'PREPARING': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'READY': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'OUT_FOR_DELIVERY': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const currentIdx = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg glass rounded-3xl border border-white/60 shadow-2xl overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-orange-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <Package size={28} />
            <div>
              <h2 className="text-2xl font-black">{order.id}</h2>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
                {new Date(order.date).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full border ${getStatusBadge(order.status)}`}>
              <CheckCircle2 size={12} /> {order.status.replace(/_/g, ' ')}
            </span>
            {order.orderRating && (
              <span className="text-yellow-500 font-black text-sm">★ {order.orderRating}/5</span>
            )}
          </div>

          {/* Status Progress */}
          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Order Timeline</p>
            <div className="flex items-center gap-1">
              {STATUS_FLOW.map((s, i) => {
                const reached = i <= currentIdx;
                return (
                  <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      reached ? `${getStatusColor(order.status)} border-transparent` : 'border-gray-300 bg-white'
                    }`}>
                      {reached && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                    <span className={`text-[8px] font-bold uppercase tracking-wider text-center leading-tight ${
                      reached ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      {s.replace(/_/g, ' ')}
                    </span>
                    {i < STATUS_FLOW.length - 1 && (
                      <div className={`hidden ${reached ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Details</p>
            <div className="flex items-center gap-2.5">
              <User size={14} className="text-blue-400 shrink-0" />
              <span className="font-bold text-gray-800 text-sm">{order.customerName}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-red-400 shrink-0 mt-0.5" />
              <span className="font-medium text-gray-600 text-sm leading-snug">{order.deliveryAddress}</span>
            </div>
          </div>

          {/* Assignments */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-2">
                <ChefHat size={14} className="text-yellow-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Chef</span>
              </div>
              <p className="font-black text-gray-800 text-sm">
                {order.assignedChefName || <span className="text-gray-300 italic font-medium">Unassigned</span>}
              </p>
            </div>
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Truck size={14} className="text-purple-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rider</span>
              </div>
              <p className="font-black text-gray-800 text-sm">
                {order.assignedDeliveryName || <span className="text-gray-300 italic font-medium">Unassigned</span>}
              </p>
            </div>
          </div>

          {/* Financials */}
          <div className="flex items-center justify-between bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2">
              <IndianRupee size={16} className="text-emerald-500" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Value</p>
                <p className="text-xl font-black text-gray-900">₹{order.charge.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Profit</p>
              <p className="text-lg font-black text-emerald-600">₹{order.profit.toLocaleString()}</p>
            </div>
          </div>

          {/* Managed By */}
          {order.manager && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <AlertCircle size={12} />
              <span className="font-bold">Managed by: {order.manager}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white/30">
          <button onClick={onClose} className="w-full btn-glass py-3 rounded-xl font-black text-xs uppercase tracking-widest">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
