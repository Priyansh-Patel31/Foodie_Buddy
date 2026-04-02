import { useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import RadialOrbitalTimeline, { TimelineItem } from '../../components/ui/radial-orbital-timeline';
import { 
  Package, ReceiptText, Wallet, Users, HandCoins,
  TrendingUp, Activity, ShieldCheck, Zap, UserCog, CalendarDays
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAppSelector(state => state.auth);
  const { users } = useAppSelector(state => state.admin);

  const staffMembers = users.filter(u => u.role !== 'ROLE_CUSTOMER' && u.role !== 'ROLE_ADMIN');
  const totalStaff = staffMembers.length;

  const onDutyCount = useMemo(() => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    return staffMembers.filter(staff => {
      let hash = 0;
      const str = staff.id + dateStr;
      for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(i);
          hash |= 0;
      }
      const seed = Math.abs(hash);
      return seed % 3 !== 0;
    }).length;
  }, [staffMembers]);
  
  const timelineData: TimelineItem[] = [
    {
      id: 1,
      title: "Menu & Dish System",
      date: "ACTIVE",
      content: "Modify global dish parameters, sync toppings, and manipulate restaurant pricing dynamically.",
      category: "Architecture",
      path: "/admin/menu",
      icon: Package,
      relatedIds: [2],
      status: "completed",
      energy: 95,
    },
    {
      id: 2,
      title: "Order Fulfillment Stack",
      date: "ACTIVE",
      content: "Deep link directly into the ledger to analyze real-time delivery matrices and active kitchen load.",
      category: "Operations",
      path: "/admin/orders",
      icon: ReceiptText,
      relatedIds: [1, 3, 4],
      status: "in-progress",
      energy: 80,
    },
    {
      id: 3,
      title: "Financial Ledger",
      date: "AUDITING",
      content: "Access pure operational balance charts and global historic profit mapping spanning years of data.",
      category: "Finance",
      path: "/admin/accounts",
      icon: Wallet,
      relatedIds: [2, 5],
      status: "completed",
      energy: 100,
    },
    {
      id: 4,
      title: "Global CRM Hub",
      date: "ACTIVE",
      content: "Analyze total platform users, deep-dive into delivery driver reviews, and scan individual order ratings.",
      category: "Client Data",
      path: "/admin/customers",
      icon: Users,
      relatedIds: [2],
      status: "pending",
      energy: 45,
    },
    {
      id: 5,
      title: "Staff Payroll OS",
      date: "MANAGEMENT",
      content: "Execute mass-deduction algorithms, override leave bounds, and dispatch multi-node salary executions.",
      category: "HR Framework",
      path: "/admin/payroll",
      icon: HandCoins,
      relatedIds: [3],
      status: "in-progress",
      energy: 65,
    },
    {
      id: 6,
      title: "Role & Access Matrix",
      date: "SECURITY",
      content: "Dictate granular access protocols and instantly elevate or revoke core user privileges.",
      category: "Access Control",
      path: "/admin/users",
      icon: UserCog,
      relatedIds: [4, 5],
      status: "completed",
      energy: 90,
    },
    {
      id: 7,
      title: "Staff Roster Console",
      date: "GLOBAL",
      content: "Deep link into the historical shift matrix to monitor check-ins and audit attendance logs.",
      category: "Workforce",
      path: "/admin/roster",
      icon: CalendarDays,
      relatedIds: [6, 5],
      status: "in-progress",
      energy: 85,
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in relative max-w-7xl mx-auto pb-24">
      {/* Top OS Header & Stats Layer */}
      <div className="flex flex-col gap-6 relative z-10 w-full mb-8 pt-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <ShieldCheck className="text-primary-600" size={32} />
               <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-outfit uppercase tracking-tighter shadow-sm text-shadow">
                 Admin Central
               </h1>
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
               Welcome back, Commander {user?.name}
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </p>
          </div>
          
          <div className="glass px-6 py-3 rounded-2xl border border-white/60 shadow-xl flex items-center gap-4 bg-white/50 backdrop-blur-xl">
             <Activity className="text-primary-500" size={20}/>
             <div>
               <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">System Load</p>
               <p className="text-xl font-black text-gray-900">Optimal</p>
             </div>
          </div>
        </div>

        {/* Glassmorphic Cyber Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass min-h-32 rounded-3xl p-6 border border-white/80 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform bg-white/40">
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-primary-600 group-hover:scale-125 transition-transform"><Zap size={100} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Global Users</p>
            <p className="text-4xl font-black text-gray-900 shadow-sm text-shadow-sm">18,241</p>
            <p className="text-[10px] text-green-600 font-bold mt-2 uppercase flex items-center gap-1">+2.4% this week</p>
          </div>
          <div className="glass min-h-32 rounded-3xl p-6 border border-white/80 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform bg-gradient-to-br from-primary-50 to-orange-50/50">
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-primary-600 group-hover:scale-125 transition-transform"><TrendingUp size={100} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-700 mb-1">Weekly Volume</p>
            <p className="text-4xl font-black text-primary-600 shadow-sm text-shadow-sm">₹84.2K</p>
            <p className="text-[10px] text-primary-500 font-bold mt-2 uppercase flex items-center gap-1">Exceeding projections</p>
          </div>
          <div className="glass min-h-32 rounded-3xl p-6 border border-white/80 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform bg-white/40">
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-primary-600 group-hover:scale-125 transition-transform"><CalendarDays size={100} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Staff On Duty</p>
            <p className="text-4xl font-black text-gray-900 shadow-sm text-shadow-sm">{onDutyCount}/{totalStaff}</p>
            <p className="text-[10px] text-primary-500 font-bold mt-2 uppercase flex items-center gap-1">Across all roles</p>
          </div>
          <div className="bg-gray-900 min-h-32 rounded-3xl p-6 border border-gray-700 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-white group-hover:scale-125 transition-transform"><ShieldCheck size={100} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Server Status</p>
            <p className="text-4xl font-black text-white shadow-sm text-shadow-sm">100%</p>
            <p className="text-[10px] text-green-400 font-bold mt-2 uppercase flex items-center gap-1">All nodes responding</p>
          </div>
        </div>

      </div>

      {/* Radial Orbital System Layer */}
      <div className="relative z-20 w-full mt-20">
         <div className="text-center mb-8 relative z-30">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-800">
               Orbital Module Navigation
            </h2>
            <p className="text-sm font-bold text-gray-500 mt-1">Select a core node to view status and initialize connection.</p>
         </div>
         
         {/* The Timeline Hub */}
         <RadialOrbitalTimeline timelineData={timelineData} />
      </div>

    </div>
  );
}
