import { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { UserCircle, Calendar, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Mail, Briefcase } from 'lucide-react';
import { ROLE_LABELS } from '../../utils/constants';

// Deterministic pseudo-random seeded by string
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
  h = (h ^ (h >>> 16)) >>> 0;
  return (h % 1000) / 1000;
}

interface AttendanceRecord {
  present: boolean;
  checkIn: string;
  checkOut: string;
  totalHours: number;
}

function generateAttendance(userId: string, date: Date): AttendanceRecord | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  // Future dates have no record
  if (d > today) return null;

  // Weekends — Sunday off
  if (d.getDay() === 0) return null;

  const seed = `${userId}-${d.toISOString().split('T')[0]}`;
  const rand = seededRandom(seed);

  // ~85% present on working days
  const present = rand > 0.15;

  if (!present) {
    return { present: false, checkIn: '--:--', checkOut: '--:--', totalHours: 0 };
  }

  // Generate realistic check-in/out times
  const checkInHour = 8 + Math.floor(seededRandom(seed + '-in') * 2); // 8-9 AM
  const checkInMin = Math.floor(seededRandom(seed + '-inm') * 50); // 0-49 min
  const shiftLength = 8 + Math.floor(seededRandom(seed + '-len') * 3); // 8-10 hours
  const checkOutHour = checkInHour + shiftLength;
  const checkOutMin = Math.floor(seededRandom(seed + '-outm') * 50);

  const formatTime = (h: number, m: number) =>
    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  return {
    present: true,
    checkIn: formatTime(checkInHour, checkInMin),
    checkOut: formatTime(Math.min(checkOutHour, 23), checkOutMin),
    totalHours: shiftLength + Math.round((checkOutMin - checkInMin) / 60 * 10) / 10,
  };
}

export default function ProfileAttendancePage() {
  const { user } = useAppSelector(state => state.auth);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Pre-calculate all attendance for the month
  const monthAttendance = useMemo(() => {
    const records: (AttendanceRecord | null)[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      records.push(generateAttendance(user?.id || '', new Date(year, month, d)));
    }
    return records;
  }, [user?.id, year, month, daysInMonth]);

  const presentDays = monthAttendance.filter(r => r?.present).length;
  const absentDays = monthAttendance.filter(r => r && !r.present).length;
  const workingDays = monthAttendance.filter(r => r !== null).length;

  const selectedRecord = selectedDay
    ? generateAttendance(user?.id || '', selectedDay)
    : null;

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-20">
      {/* Profile Card */}
      <div className="glass rounded-3xl p-8 border border-white/60 shadow-xl bg-white/40">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-orange-400 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-gray-900">{user?.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                <Mail size={14} className="text-primary-500" /> {user?.email}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                <Briefcase size={12} /> {ROLE_LABELS[user?.role || ''] || 'Staff'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40 text-center">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="text-emerald-600" size={20} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Present</p>
          <p className="text-2xl font-black text-emerald-600">{presentDays}</p>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40 text-center">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <XCircle className="text-red-500" size={20} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Absent</p>
          <p className="text-2xl font-black text-red-500">{absentDays}</p>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Calendar className="text-blue-600" size={20} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Working Days</p>
          <p className="text-2xl font-black text-blue-600">{workingDays}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="glass rounded-3xl p-6 border border-white/60 shadow-xl bg-white/40">
        {/* Month Nav */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="btn-glass p-2.5 rounded-xl">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-wider">{monthName}</h2>
          <button onClick={nextMonth} className="btn-glass p-2.5 rounded-xl">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const date = new Date(year, month, dayNum);
            const record = monthAttendance[i];
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDay?.toDateString() === date.toDateString();
            const isSunday = date.getDay() === 0;

            return (
              <button
                key={dayNum}
                onClick={() => record !== null ? setSelectedDay(date) : null}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-sm font-bold relative ${
                  isSelected
                    ? 'btn-glass-primary scale-105 shadow-lg'
                    : isToday
                      ? 'bg-primary-50 border-2 border-primary-300'
                      : isSunday
                        ? 'bg-gray-50 text-gray-300'
                        : 'hover:bg-white/60 text-gray-700'
                } ${record !== null ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className={isSelected ? 'text-white' : ''}>{dayNum}</span>
                {record !== null && (
                  <span className={`w-2 h-2 rounded-full ${
                    record.present ? 'bg-emerald-500' : 'bg-red-500'
                  } ${isSelected ? 'ring-2 ring-white' : ''}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> Present
          </span>
          <span className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <span className="w-3 h-3 rounded-full bg-red-500" /> Absent
          </span>
          <span className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <span className="w-3 h-3 rounded-full bg-gray-200" /> Holiday / Off
          </span>
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDay && selectedRecord && (
        <div className={`glass rounded-3xl p-6 border shadow-xl animate-fade-in ${
          selectedRecord.present ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={20} className={selectedRecord.present ? 'text-emerald-600' : 'text-red-500'} />
            <h3 className="text-lg font-black text-gray-900">
              {selectedDay.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              selectedRecord.present ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {selectedRecord.present ? 'Present' : 'Absent'}
            </span>
          </div>

          {selectedRecord.present ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/60 rounded-2xl p-4 border border-white/80">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Check In</span>
                </div>
                <p className="text-xl font-black text-gray-900">{selectedRecord.checkIn}</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-4 border border-white/80">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-red-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Check Out</span>
                </div>
                <p className="text-xl font-black text-gray-900">{selectedRecord.checkOut}</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-4 border border-white/80">
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hours</span>
                </div>
                <p className="text-xl font-black text-gray-900">{selectedRecord.totalHours}h</p>
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium text-red-500">No attendance record for this day. Marked as absent.</p>
          )}
        </div>
      )}
    </div>
  );
}
