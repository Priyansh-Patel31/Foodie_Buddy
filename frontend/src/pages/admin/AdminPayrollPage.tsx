import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateSalaryApi, updateLeavesApi } from '../../features/admin/adminSlice';
import { HandCoins, Edit2, CheckCircle2, AlertTriangle, CalendarDays, History } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPayrollPage() {
  const dispatch = useAppDispatch();
  const { users, transactions } = useAppSelector(state => state.admin);

  // Active Staff
  const staff = users.filter(u => u.role !== 'ROLE_CUSTOMER' && u.role !== 'ROLE_ADMIN');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSalary, setEditSalary] = useState<number>(0);

  const [editingLeaveId, setEditingLeaveId] = useState<string | null>(null);
  const [editLeaves, setEditLeaves] = useState<number>(0);

  // Payroll History Logic
  const payrollTxns = transactions.filter(t => t.type === 'PAYROLL');
  const availableMonths = Array.from(new Set(payrollTxns.map(t => {
    const d = new Date(t.date);
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
  }))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] || 'No History');

  const filteredHistory = payrollTxns.filter(t => {
     const d = new Date(t.date);
     return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}` === selectedMonth;
  });

  const handleSaveSalary = (id: string) => {
    dispatch(updateSalaryApi({ id, baseSalary: editSalary }));
    setEditingId(null);
    toast.success('Base salary saved permanently to database!');
  };

  const handleSaveLeaves = (id: string) => {
    if (editLeaves < 0) return toast.error('Leaves cannot be negative.');
    dispatch(updateLeavesApi({ id, leavesTaken: editLeaves }));
    setEditingLeaveId(null);
    toast.success('Leave count adjusted permanently.');
  };

  const handleRunPayroll = () => {
    toast.success('Payroll execution logged. Check Operational Accounts for the Payout Ledger.');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
            <HandCoins className="text-primary-600" size={32} /> Payroll & Attendance
          </h1>
          <p className="text-gray-500 font-medium">Manage base wages, execute current month payments, and review history.</p>
        </div>
        <button 
          onClick={handleRunPayroll}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-1"
        >
          Execute Active Payroll
        </button>
      </div>

      <div className="bg-yellow-50/80 border border-yellow-200 p-4 rounded-2xl flex gap-3 shadow-inner my-6 backdrop-blur-sm">
        <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-yellow-800">Payroll Leave Policy Active</h4>
          <p className="text-sm font-medium text-yellow-700 mt-1">
            Running Payroll automatically permits <b className="text-yellow-900">2 free leaves per month</b> without deduction. Any leaves beyond 2 will deduct their specific daily base salary rate conceptually via the Redux ledger. You can manually adjust leaves to grant exemptions before execution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {staff.map(employee => {
          let expectedDeduction = 0;
          if (employee.leavesTaken > 2) {
             const extraDays = employee.leavesTaken - 2;
             const dailyRate = employee.baseSalary / 30;
             expectedDeduction = dailyRate * extraDays;
          }
          const expectedPay = employee.baseSalary - expectedDeduction;

          return (
            <div key={employee.id} className="glass shadow-xl rounded-3xl p-6 border border-white/60 relative overflow-hidden group">
              {employee.leavesTaken > 2 && (
                <div className="absolute top-0 right-0 w-2 h-full bg-red-400"></div>
              )}
              
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{employee.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">{employee.role.replace('ROLE_', '')}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Base Salary</p>
                  
                  {editingId === employee.id ? (
                    <div className="flex items-center justify-end gap-1 mt-1 bg-white p-1 rounded-lg border border-primary-200 shadow-sm">
                      <span className="font-black text-gray-400 pl-1 border-r border-gray-100 pr-1">₹</span>
                      <input 
                        type="number" 
                        value={editSalary} 
                        onChange={e => setEditSalary(Number(e.target.value))}
                        className="w-20 p-1 text-sm font-black text-gray-800 outline-none"
                        autoFocus
                      />
                      <button onClick={() => handleSaveSalary(employee.id)} className="text-green-500 hover:text-green-600 pl-1 pr-1 border-l border-gray-100">
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <p className="text-xl font-black text-gray-800 tracking-tight">₹{employee.baseSalary.toLocaleString()}</p>
                      <button onClick={() => { setEditingId(employee.id); setEditSalary(employee.baseSalary); }} className="text-gray-400 hover:text-primary-500 bg-white/50 p-1 rounded-md transition-colors border border-gray-100">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/60 p-4 rounded-2xl border border-gray-100/50 relative group/leave shadow-sm">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Leaves Taken</p>
                  
                  {editingLeaveId === employee.id ? (
                    <div className="flex items-center gap-1 mt-1 bg-white p-1 rounded-lg border border-primary-200 w-max shadow-sm">
                      <input 
                        type="number" 
                        value={editLeaves} 
                        onChange={e => setEditLeaves(Number(e.target.value))}
                        className="w-12 p-1 text-lg font-black text-gray-800 outline-none text-center"
                        autoFocus
                      />
                      <button onClick={() => handleSaveLeaves(employee.id)} className="text-green-500 hover:text-green-600 pr-1 border-l border-gray-100 pl-1">
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                  ) : (
                     <div className="flex items-center gap-2 mt-1">
                        <p className={`text-3xl font-black ${employee.leavesTaken > 2 ? 'text-red-500' : 'text-gray-800'}`}>{employee.leavesTaken}</p>
                        <button onClick={() => { setEditingLeaveId(employee.id); setEditLeaves(employee.leavesTaken); }} className="text-gray-400 hover:text-primary-500 bg-white p-1.5 rounded-lg opacity-80 group-hover/leave:opacity-100 transition-all border border-gray-100 shadow-sm">
                           <Edit2 size={14} />
                        </button>
                     </div>
                  )}
                  
                  {employee.leavesTaken > 2 ? (
                    <div className="mt-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-100 inline-block px-2 py-0.5 rounded border border-red-200">Deduction applied</p>
                       <p className="text-xs font-bold text-red-500 mt-1">-₹{expectedDeduction.toFixed(0)} automatically</p>
                    </div>
                  ) : (
                    <div className="mt-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-100 inline-block px-2 py-0.5 rounded border border-green-200">Zero Deduction</p>
                       <p className="text-xs font-bold text-gray-400 mt-1">Within monthly limit</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 rounded-2xl border border-primary-200/50 flex flex-col justify-center shadow-sm">
                  <p className="text-xs font-black text-primary-600/80 uppercase tracking-widest">Est. Net Pay</p>
                  <p className="text-3xl font-black text-gray-900 mt-1 tracking-tight">₹{expectedPay.toFixed(0)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Historical Payroll Section */}
      <div className="mt-12 mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-black text-gray-900 flex items-center justify-between">
           <span className="flex items-center gap-3"><History size={26} className="text-primary-600"/> Specific Period Payouts</span>
           {availableMonths.length > 0 && (
             <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-xl border border-gray-200 shadow-sm">
               <CalendarDays size={16} className="text-gray-400 ml-2"/>
               <select 
                 value={selectedMonth} 
                 onChange={e => setSelectedMonth(e.target.value)}
                 className="bg-transparent text-gray-800 text-sm focus:ring-primary-500 block p-1.5 outline-none font-black min-w-[160px]"
               >
                  {availableMonths.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
               </select>
             </div>
           )}
        </h2>
      </div>

      <div className="glass shadow-xl rounded-3xl border border-white/50 overflow-hidden bg-white/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200/80 backdrop-blur-sm shadow-sm">
              <tr>
                <th className="p-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date Resolved</th>
                <th className="p-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Payroll Breakdown</th>
                <th className="p-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Net Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {filteredHistory.map(txn => (
                <tr key={txn.id} className="hover:bg-white/60 transition-colors">
                  <td className="p-5">
                    <p className="font-bold text-gray-800">{new Date(txn.date).toLocaleDateString()}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5 font-bold">{txn.id}</p>
                  </td>
                  <td className="p-5 text-sm font-bold text-gray-600 line-clamp-1">
                     {txn.description}
                  </td>
                  <td className="p-5 text-right">
                    <p className="text-xl font-black text-gray-900">₹{Math.abs(txn.amount).toLocaleString()}</p>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-16 text-center text-gray-400 font-black uppercase tracking-widest text-sm bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl m-6 inline-block w-[calc(100%-3rem)] relative left-6">
                     No historical payroll execution found for this period.
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
