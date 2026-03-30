import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateUserRoleApi } from '../../features/admin/adminSlice';
import { ShieldCheck, UserCog, Lock, AlertOctagon, Loader2, X, CalendarDays, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShiftEntry {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  checkIn: string;
  checkOut: string;
}

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(state => state.admin);

  const [confirmingAction, setConfirmingAction] = useState<{id: string, newRole: string} | null>(null);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const availableRoles = [
    { value: 'ROLE_ADMIN', label: 'Administrator' },
    { value: 'ROLE_MANAGER', label: 'Manager' },
    { value: 'ROLE_CHEF', label: 'Head Chef' },
    { value: 'ROLE_DELIVERY', label: 'Delivery Partner' },
    { value: 'ROLE_CUSTOMER', label: 'Customer' },
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- Roster Logic Ported From Manager View ---
  const staffMembers = users.filter(u => u.role !== 'ROLE_CUSTOMER' && u.role !== 'ROLE_ADMIN');

  // Helper to generate deterministic shifts based on common seed (staff ID + selected date)
  const getSeed = (id: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    let hash = 0;
    const str = id + dateStr;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
  };

  const shifts: ShiftEntry[] = staffMembers.map((staff) => {
    const seed = getSeed(staff.id, selectedDate);
    const isOnDuty = seed % 3 !== 0;
    const isOnLeave = !isOnDuty && seed % 7 === 0;
    
    return {
      id: staff.id,
      name: staff.name,
      role: staff.role.replace('ROLE_', ''),
      shift: seed % 2 === 0 ? 'Morning (6AM - 2PM)' : 'Evening (2PM - 10PM)',
      status: isOnLeave ? 'On Leave' : (isOnDuty ? 'On Duty' : 'Off Duty'),
      checkIn: !isOnDuty ? '--' : seed % 2 === 0 ? '06:05 AM' : '02:10 PM',
      checkOut: !isOnDuty ? '--' : seed % 2 === 0 ? '02:15 PM' : '10:05 PM',
    };
  });
  const getStatusBadge = (status: string) => {
    if(status === 'On Duty') return 'bg-green-100 text-green-700 border-green-200';
    if(status === 'On Leave') return 'bg-red-100 text-red-600 border-red-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };
  const getStatusIcon = (status: string) => {
    if(status === 'On Duty') return <CheckCircle size={14} className="text-green-600" />;
    if(status === 'On Leave') return <XCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-gray-400" />;
  };
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleRoleSelect = (id: string, newRole: string) => {
    // Intercept dropdown change
    setConfirmingAction({ id, newRole });
    setPassword('');
  };

  const handleExecuteChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return toast.error('Admin password strictly required.');
    
    setIsProcessing(true);
    
    // Simulate secure backend API processing delay
    await new Promise(r => setTimeout(r, 1200));

    if (confirmingAction) {
       dispatch(updateUserRoleApi({ id: confirmingAction.id, newRole: confirmingAction.newRole }));
       toast.success('Security Clearance Granted: User role upgraded permanently!');
    }
    
    setIsProcessing(false);
    setConfirmingAction(null);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
            <UserCog className="text-primary-600" size={32} /> Role Assignments
          </h1>
          <p className="text-gray-500 font-medium mt-1">Upgrade registered normal users into specific Staff roles instantly.</p>
        </div>
      </div>

      <div className="mt-8 glass shadow-xl rounded-3xl border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">User Details</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Current Role</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">ID: {user.id}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-gray-600">{user.email}</p>
                  </td>
                  <td className="p-4">
                     <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                      user.role === 'ROLE_CUSTOMER' ? 'bg-gray-100 text-gray-600' : 'bg-primary-100 text-primary-700'
                    }`}>
                      {user.role === 'ROLE_ADMIN' && <ShieldCheck size={12}/>} {user.role.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="p-4 text-right cursor-pointer relative group">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleSelect(user.id, e.target.value)}
                      className="bg-white/60 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 outline-none font-bold transition-all hover:bg-white"
                    >
                      {availableRoles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inserted Staff Roster Overview */}
      <div className="mt-16 pt-8 border-t border-gray-200/50">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <CalendarDays className="text-teal-600" size={28} /> Global Roster Timeline
        </h2>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
           <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Selected Period</p>
              <p className="text-xl font-black text-gray-800 font-outfit">
                {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
           </div>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}
                className="p-2.5 rounded-xl btn-glass font-black hover:text-white"
              >
                &larr; Prev
              </button>
              <button 
                onClick={() => setSelectedDate(new Date())}
                className="btn-glass text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:btn-glass-primary shadow-md"
              >
                Today
              </button>
              <button 
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 86400000))}
                className="p-2.5 rounded-xl btn-glass font-black hover:text-white"
              >
                Next &rarr;
              </button>
           </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 glass rounded-3xl p-6 border border-white/60 shadow-lg bg-orange-50/20">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-6 flex items-center gap-2">
                 <Clock size={12}/> Weekly Snapshot
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, i) => {
                  const baseDate = new Date(selectedDate);
                  const dayOfWeek = baseDate.getDay(); 
                  const diff = baseDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
                  const monday = new Date(baseDate.setDate(diff));
                  
                  const thisDay = new Date(monday);
                  thisDay.setDate(monday.getDate() + i);
                  
                  const isSelected = thisDay.toDateString() === selectedDate.toDateString();
                  const isActuallyToday = thisDay.toDateString() === new Date().toDateString();

                  return (
                    <button 
                      key={day} 
                      onClick={() => setSelectedDate(thisDay)}
                      className={`text-center py-3 rounded-xl font-black text-xs transition-all group ${
                        isSelected ? 'bg-primary-600 text-white shadow-xl scale-110 z-10' : 'bg-white/60 text-gray-400 border border-white/80 hover:bg-white hover:text-gray-700'
                      }`}
                    >
                      <p className="text-[8px] uppercase tracking-tighter opacity-70">{day}</p>
                      <p className="text-base mt-0.5">
                         {thisDay.getDate()}
                      </p>
                      {isActuallyToday && !isSelected && <div className="mx-auto mt-1 w-1 h-1 bg-primary-500 rounded-full"></div>}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 p-4 bg-white/60 border border-white/80 rounded-2xl">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Note</p>
                 <p className="text-xs font-medium text-gray-600 leading-relaxed">
                    Showing staff assignments for {selectedDate.toDateString()}. Historical logs are locked for modifications.
                 </p>
              </div>
           </div>

           <div className="lg:col-span-2 glass shadow-xl rounded-3xl border border-white/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100/50">
                      <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Staff Member</th>
                      <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Check In</th>
                      <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Check Out</th>
                      <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50">
                    {shifts.map(shift => (
                      <tr key={shift.id} className="hover:bg-white/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-800">{shift.name}</span>
                            <span className="text-[10px] bg-primary-50 text-primary-700 px-2 rounded-full uppercase font-black">{shift.role}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-gray-700 text-sm">{shift.checkIn}</td>
                        <td className="p-4 font-bold text-gray-700 text-sm">{shift.checkOut}</td>
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusBadge(shift.status)}`}>
                            {getStatusIcon(shift.status)} {shift.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>

      {/* Security Override Modal */}
      {confirmingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => !isProcessing && setConfirmingAction(null)}></div>
          
          <div className="glass shadow-2xl rounded-3xl w-full max-w-md border border-white p-8 relative z-10 animate-fade-in">
            {!isProcessing && (
              <button onClick={() => setConfirmingAction(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            )}
            
            <div className="flex justify-center mb-6">
               <div className="w-16 h-16 bg-red-100 text-red-600 flex items-center justify-center rounded-full animate-bounce">
                  <AlertOctagon size={32} />
               </div>
            </div>
            
            <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Security Authorization</h2>
            <p className="text-sm font-medium text-center text-gray-500 mb-6 px-4">
              You are about to modify core system permissions. Please authenticate this action.
            </p>

            <form onSubmit={handleExecuteChange} className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-2"><Lock size={12}/> Admin Password</label>
                  <input 
                     type="password" 
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     disabled={isProcessing}
                     className="w-full relative z-10 p-3.5 rounded-xl bg-white/80 border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none font-medium transition-all text-center tracking-[0.3em] text-lg"
                     placeholder="••••••••"
                     autoFocus
                  />
               </div>

               <button 
                  type="submit"
                  disabled={isProcessing || !password}
                  className="w-full mt-4 btn-glass-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-xl transition-all flex justify-center items-center gap-2 relative overflow-hidden"
               >
                  {isProcessing ? (
                     <><Loader2 className="animate-spin" size={20} /> <span>Executing Override...</span></>
                  ) : (
                     <><ShieldCheck size={20} /> <span>Confirm Role Assignment</span></>
                  )}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
