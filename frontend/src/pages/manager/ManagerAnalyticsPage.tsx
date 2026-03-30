import { useAppSelector } from '../../store/hooks';
import { BarChart3, TrendingUp, IndianRupee, CalendarDays } from 'lucide-react';

export default function ManagerAnalyticsPage() {
  const { orders, transactions } = useAppSelector(state => state.admin);

  const totalRevenue = orders.reduce((sum, o) => sum + o.charge, 0);
  const totalProfit = orders.reduce((sum, o) => sum + o.profit, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Monthly breakdown
  const monthlyData: Record<string, { revenue: number; orders: number; profit: number }> = {};
  orders.forEach(o => {
    const month = new Date(o.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, orders: 0, profit: 0 };
    monthlyData[month].revenue += o.charge;
    monthlyData[month].orders += 1;
    monthlyData[month].profit += o.profit;
  });

  const revenueTransactions = transactions.filter(t => t.type === 'REVENUE' || t.type === 'ORDER_REVENUE');
  const topRevenueDay = revenueTransactions.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
          <BarChart3 className="text-blue-600" size={32} /> Sales Analytics
        </h1>
        <p className="text-gray-500 font-medium mt-1">Revenue performance, order trends, and profit analysis.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-xl bg-white/40 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-green-600 group-hover:scale-125 transition-transform"><IndianRupee size={100} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-green-600 font-bold mt-2 uppercase flex items-center gap-1"><TrendingUp size={12} /> All time</p>
        </div>
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50/50 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-green-600 group-hover:scale-125 transition-transform"><TrendingUp size={100} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-green-700 mb-1">Total Profit</p>
          <p className="text-3xl font-black text-green-700">₹{totalProfit.toLocaleString()}</p>
          <p className="text-[10px] text-green-500 font-bold mt-2 uppercase">{profitMargin}% margin</p>
        </div>
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-xl bg-white/40 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-blue-600 group-hover:scale-125 transition-transform"><BarChart3 size={100} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Avg Order Value</p>
          <p className="text-3xl font-black text-gray-900">₹{avgOrderValue.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Per order average</p>
        </div>
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-xl bg-white/40 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-orange-600 group-hover:scale-125 transition-transform"><CalendarDays size={100} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Orders</p>
          <p className="text-3xl font-black text-gray-900">{orders.length}</p>
          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Lifetime processed</p>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="glass shadow-xl rounded-3xl border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-gray-100/50">
          <h2 className="text-lg font-black text-gray-800">Monthly Revenue Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Month</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Revenue (₹)</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Profit (₹)</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {Object.entries(monthlyData).map(([month, data]) => (
                <tr key={month} className="hover:bg-white/40 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{month}</td>
                  <td className="p-4 font-bold text-gray-600">{data.orders}</td>
                  <td className="p-4 font-black text-gray-900">₹{data.revenue.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg">+₹{data.profit.toLocaleString()}</span>
                  </td>
                  <td className="p-4 font-bold text-gray-600">
                    {data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : '0'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Revenue Event */}
      {topRevenueDay && (
        <div className="glass rounded-3xl p-6 border border-white/60 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-yellow-600" size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700">Best Revenue Event</p>
              <p className="text-xl font-black text-gray-900">{topRevenueDay.description}</p>
              <p className="text-sm font-bold text-gray-500">₹{topRevenueDay.amount.toLocaleString()} on {new Date(topRevenueDay.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
