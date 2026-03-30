import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { CalendarDays, Clock, CheckCircle, XCircle, User } from 'lucide-react';

interface ShiftEntry {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  checkIn: string;
  checkOut: string;
}

export default function ManagerStaffPage() {
  const { users } = useAppSelector(state => state.admin);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const onDutyCount = shifts.filter(s => s.status === 'On Duty').length;
  const onLeaveCount = shifts.filter(s => s.status === 'On Leave').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Duty': return 'bg-green-100 text-green-700 border-green-200';
      case 'Off Duty': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'On Leave': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Duty': return <CheckCircle size={14} className="text-green-600" />;
      case 'Off Duty': return <Clock size={14} className="text-gray-400" />;
      case 'On Leave': return <XCircle size={14} className="text-red-500" />;
      default: return null;
    }
  };

  // Weekly calendar 
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
          <CalendarDays className="text-teal-600" size={32} /> Staff Roster
        </h1>
        <p className="text-gray-500 font-medium mt-1">View team schedules, attendance, and shift assignments.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">On Duty Now</p>
            <p className="text-2xl font-black text-gray-900">{onDutyCount}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <XCircle className="text-red-500" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">On Leave</p>
            <p className="text-2xl font-black text-gray-900">{onLeaveCount}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Staff</p>
            <p className="text-2xl font-black text-gray-900">{staffMembers.length}</p>
          </div>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="glass rounded-3xl p-6 border border-white/60 shadow-lg bg-white/30">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Roster History Browsing</h3>
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}
                className="p-2.5 rounded-xl btn-glass font-black hover:text-white"
              >
                &larr; Prev
              </button>
              <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-xl font-black text-xs text-slate-700 border border-white/20 shadow-inner">
                {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button 
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 86400000))}
                className="p-2.5 rounded-xl btn-glass font-black hover:text-white"
              >
                Next &rarr;
              </button>
              <button 
                onClick={() => setSelectedDate(new Date())}
                className="ml-2 text-[10px] font-black uppercase btn-glass px-4 py-2.5 rounded-xl hover:btn-glass-primary"
              >
                Today
              </button>
           </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            // Calculate day of week relative to Monday of the week of selectedDate
            const baseDate = new Date(selectedDate);
            const dayOfWeek = baseDate.getDay(); // 0 is Sun
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
                className={`text-center py-3 rounded-2xl font-black text-sm transition-all group ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                    : 'bg-white/50 text-gray-600 border border-white/60 hover:bg-white/80'
                }`}
              >
                <p className="text-[10px] uppercase tracking-widest opacity-70 group-hover:opacity-100">{day}</p>
                <p className="text-lg mt-1 flex items-center justify-center gap-1">
                  {thisDay.getDate()}
                  {isActuallyToday && !isSelected && <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shift Table */}
      <div className="glass shadow-xl rounded-3xl border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-gray-100/50 flex justify-between items-center">
          <h2 className="text-lg font-black text-gray-800">
            {selectedDate.toDateString() === new Date().toDateString() ? "Today's" : selectedDate.toLocaleDateString()} Shift Assignments
          </h2>
          <span className="text-[10px] font-black uppercase text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            History Mode Active
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Staff Member</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Shift</th>
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
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-orange-400 rounded-full flex items-center justify-center text-white font-black text-sm">
                        {shift.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-800">{shift.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-black uppercase tracking-wider bg-primary-100 text-primary-700 px-2 py-1 rounded-lg">
                      {shift.role}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-600 text-sm">{shift.shift}</td>
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
  );
}
