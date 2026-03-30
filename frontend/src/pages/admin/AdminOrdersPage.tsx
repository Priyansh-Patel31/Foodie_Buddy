import { useAppSelector } from '../../store/hooks';
import { Package, MapPin, CheckCircle2, DollarSign, TrendingUp, ChefHat, Truck } from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders } = useAppSelector(state => state.admin);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 font-outfit">Order History Log</h1>
          <p className="text-gray-500 font-medium">Track all fulfilled orders, assigned workers, and profit margins.</p>
        </div>
        <div className="glass px-6 py-3 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
          <TrendingUp className="text-primary-500" />
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Accrued Profit</p>
            <p className="text-2xl font-black text-gray-800">
              ₹{orders.reduce((acc, order) => acc + order.profit, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="glass shadow-xl rounded-3xl border border-white/50 overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Order Ref</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Customer & Location</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Fulfilled By</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Financials (₹)</th>
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800 flex items-center gap-2"><Package size={16} className="text-primary-500"/> {order.id}</p>
                    <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-700">{order.customerName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12} /> {order.deliveryAddress}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <ChefHat size={12} className="text-yellow-500"/> 
                        <span>{order.assignedChefName || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <Truck size={12} className="text-purple-500"/> 
                        <span>{order.assignedDeliveryName || 'Unassigned'}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Mgr: {order.manager}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-500">Charged: <span className="text-gray-800 font-black">₹{order.charge}</span></span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-flex w-max items-center gap-1">
                        <DollarSign size={10} /> Profit: ₹{order.profit}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status === 'DELIVERED' && <CheckCircle2 size={14} />} {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
