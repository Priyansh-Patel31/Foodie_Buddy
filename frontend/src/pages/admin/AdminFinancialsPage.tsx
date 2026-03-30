import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { ArrowUpRight, ArrowDownRight, Wallet, Receipt, TrendingUp, CalendarDays } from 'lucide-react';

type TimeFilter = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'ALL' | string;

export default function AdminFinancialsPage() {
  const { transactions, totalBalance, orders } = useAppSelector(state => state.admin);
  const [filter, setFilter] = useState<TimeFilter>('ALL');

  // Generate dynamic unique historic months from the transactions array
  const historicMonths = Array.from(new Set(transactions.map(t => {
     const d = new Date(t.date);
     return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
  }))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Filter transactions
  const now = new Date();
  const filteredTxns = transactions.filter(txn => {
    if (filter === 'ALL') return true;
    
    // Check if the filter is an exact historic month string (e.g., 'February 2026')
    if (historicMonths.includes(filter)) {
       const tDate = new Date(txn.date);
       const txnstr = `${tDate.toLocaleString('default', { month: 'long' })} ${tDate.getFullYear()}`;
       return txnstr === filter;
    }

    const tDate = new Date(txn.date);
    const monthsDiff = (now.getFullYear() - tDate.getFullYear()) * 12 + (now.getMonth() - tDate.getMonth());
    
    if (filter === '1M') return monthsDiff <= 1;
    if (filter === '3M') return monthsDiff <= 3;
    if (filter === '6M') return monthsDiff <= 6;
    if (filter === '1Y') return monthsDiff <= 12;
    if (filter === '3Y') return monthsDiff <= 36;
    if (filter === '5Y') return monthsDiff <= 60;
    return true;
  });

  // Calculate Metrics based on filtered data
  let periodRevenue = 0;
  let periodPayroll = 0;
  
  filteredTxns.forEach(t => {
    if (t.type === 'REVENUE' || t.type === 'ORDER_REVENUE') periodRevenue += t.amount;
    if (t.type === 'PAYROLL') periodPayroll += Math.abs(t.amount);
  });

  // Global historical profit from orders (mock logic for pure profit metrics)
  const totalPureProfit = orders.reduce((sum, o) => sum + o.profit, 0);
  
  // Graph Data logic (simple percentages relative to max value)
  const maxVal = Math.max(periodRevenue, periodPayroll, 1);
  const revHeight = (periodRevenue / maxVal) * 100;
  const payHeight = (periodPayroll / maxVal) * 100;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
            <Wallet className="text-primary-600" size={32} /> Operational Accounts
          </h1>
          <p className="text-gray-500 font-medium">Track overarching financial history, pure profit, and filtered charts.</p>
        </div>
        
        <div className="flex gap-4 items-end">
           <div>
             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 mb-1"><CalendarDays size={12}/> Time Filter</label>
             <select 
               value={filter} 
               onChange={e => setFilter(e.target.value as TimeFilter)}
               className="bg-white/60 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-primary-500 block p-2.5 outline-none font-bold min-w-[140px] shadow-sm"
             >
                <optgroup label="Broad Timeline">
                  <option value="1M">Past Month</option>
                  <option value="3M">Past Quarter</option>
                  <option value="6M">Past Half-Year</option>
                  <option value="1Y">Past Year</option>
                  <option value="3Y">Past 3-Years</option>
                  <option value="5Y">Past 5-Years</option>
                  <option value="ALL">All Time Data</option>
                </optgroup>
                <optgroup label="Exact Historic Months">
                  {historicMonths.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </optgroup>
             </select>
           </div>
           
          <div className="glass shadow-xl p-4 md:px-6 rounded-3xl border border-white/60 flex items-center gap-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 justify-between">
                Total Balance
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              </p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-gray-900">₹{totalBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Graph & Metrics Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Metric Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass shadow-lg p-6 rounded-3xl border border-white/60 relative overflow-hidden group hover:shadow-xl transition-all">
             <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 text-green-500"><TrendingUp size={120} /></div>
             <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Selected Period Revenue</p>
             <p className="text-3xl font-black text-green-600 mt-2 relative z-10">₹{periodRevenue.toLocaleString()}</p>
          </div>
          <div className="glass shadow-lg p-6 rounded-3xl border border-white/60 relative overflow-hidden group hover:shadow-xl transition-all">
             <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:translate-y-2 transition-transform duration-500 text-red-500"><TrendingUp size={120} className="rotate-180" /></div>
             <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Selected Period Expenses</p>
             <p className="text-3xl font-black text-red-500 mt-2 relative z-10">₹{periodPayroll.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl p-6 rounded-3xl border border-gray-700 relative overflow-hidden">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Pure Profit Margin</p>
             <p className="text-4xl font-black text-white mt-1 relative z-10">₹{totalPureProfit.toLocaleString()}</p>
             <p className="text-[10px] mt-2 text-gray-500 font-bold uppercase tracking-widest leading-none">Total extracted profit metric from historic database.</p>
          </div>
        </div>

        {/* CSS Chart */}
        <div className="lg:col-span-2 glass shadow-xl rounded-3xl border border-white/60 p-6 flex flex-col pt-8 bg-white/40">
           <div className="flex items-center justify-between mb-8">
             <h3 className="font-black text-gray-800 flex items-center gap-2 uppercase tracking-wide text-sm"><TrendingUp size={16} className="text-primary-600"/> Cash Flow Visualization</h3>
             <div className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-100 px-3 py-1 rounded-lg border border-primary-200">Filtered: {filter}</div>
           </div>
           
           <div className="flex-1 flex items-end justify-center gap-12 sm:gap-24 relative pb-8 mt-12 bg-white/40 rounded-2xl border border-white border-dashed">
              <div className="absolute bottom-8 left-10 right-10 h-px bg-gray-200"></div>
              
              <div className="relative group w-24 sm:w-32 flex flex-col items-center justify-end h-[200px] z-10">
                 {periodRevenue > 0 && <span className="absolute -top-8 font-black text-green-600 text-sm opacity-0 group-hover:-translate-y-2 group-hover:opacity-100 transition-all duration-300">₹{(periodRevenue/1000).toFixed(1)}k</span>}
                 <div className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-xl transition-all duration-1000 ease-out shadow-lg border-t border-x border-green-200/50" style={{ height: `${revHeight}%`, minHeight: periodRevenue > 0 ? '6px' : '0' }}></div>
                 <span className="absolute -bottom-7 font-black text-[10px] text-green-700 bg-green-100/50 px-2 py-0.5 rounded uppercase tracking-widest border border-green-200/50">Revenue</span>
              </div>
              
              <div className="relative group w-24 sm:w-32 flex flex-col items-center justify-end h-[200px] z-10">
                 {periodPayroll > 0 && <span className="absolute -top-8 font-black text-red-500 text-sm opacity-0 group-hover:-translate-y-2 group-hover:opacity-100 transition-all duration-300">₹{(periodPayroll/1000).toFixed(1)}k</span>}
                 <div className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-xl transition-all duration-1000 ease-out shadow-lg border-t border-x border-red-300/50" style={{ height: `${payHeight}%`, minHeight: periodPayroll > 0 ? '6px' : '0' }}></div>
                 <span className="absolute -bottom-7 font-black text-[10px] text-red-700 bg-red-100/50 px-2 py-0.5 rounded uppercase tracking-widest border border-red-200/50">Payroll</span>
              </div>
           </div>
        </div>
      </div>

      <div className="glass shadow-xl rounded-3xl border border-white/50 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100/80 bg-white/40">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2"><Receipt size={20} className="text-primary-600" /> Filtered Ledger Records ({filteredTxns.length})</h2>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm">
              <tr>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">Date & Ref</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">Transaction Type</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200">Description</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-200 text-right">Registered Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80 bg-white/20">
              {filteredTxns.slice().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((txn) => {
                const isRevenue = txn.type === 'REVENUE' || txn.type === 'ORDER_REVENUE';
                return (
                <tr key={txn.id} className="hover:bg-white/80 transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{new Date(txn.date).toLocaleDateString()}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5 font-bold">{txn.id}</p>
                  </td>
                  <td className="p-4">
                     <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded border ${
                      isRevenue ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' : 'bg-red-50 text-red-700 border-red-200 shadow-sm'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-700 font-bold max-w-md line-clamp-2">
                    {txn.description}
                  </td>
                  <td className="p-4 text-right">
                    <div className={`text-lg font-black flex items-center justify-end gap-1 ${
                      isRevenue ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {isRevenue ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      ₹{Math.abs(txn.amount).toLocaleString()}
                    </div>
                  </td>
                </tr>
              )})}
              {filteredTxns.length === 0 && (
                 <tr>
                    <td colSpan={4} className="p-16 text-center text-gray-400 font-black uppercase tracking-widest text-sm bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl m-6 inline-block w-[calc(100%-3rem)] relative left-6">
                       No financial records found mapped to this filter.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
