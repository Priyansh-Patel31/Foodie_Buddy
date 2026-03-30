import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { MetalButton } from '../../components/ui/liquid-glass-button';
import {
  BarChart3, ClipboardList, UtensilsCrossed, CalendarDays,
  MessageSquareText, FileBarChart, TrendingUp, Package,
  Users, IndianRupee, ArrowRight, Activity, ShieldCheck
} from 'lucide-react';

interface ModuleCard {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  path: string;
  iconBg: string;
  iconColor: string;
  variant: 'primary' | 'default' | 'success' | 'gold' | 'bronze' | 'error';
}

export default function ManagerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const { orders, menuItems, users } = useAppSelector(state => state.admin);

  const activeOrders = orders.filter(o => o.status !== 'DELIVERED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.charge, 0);
  const totalCustomers = users.filter(u => u.role === 'ROLE_CUSTOMER').length;
  const totalStaff = users.filter(u => u.role !== 'ROLE_CUSTOMER' && u.role !== 'ROLE_ADMIN').length;

  const modules: ModuleCard[] = [
    {
      title: 'Sales Analytics',
      subtitle: 'View revenue reports and performance graphs',
      icon: BarChart3,
      path: '/manager/analytics',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      variant: 'primary',
    },
    {
      title: 'Order Dispatch',
      subtitle: 'Manage live order queues and kitchen tickets',
      icon: ClipboardList,
      path: '/manager/orders',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      variant: 'success',
    },
    {
      title: 'Menu Controls',
      subtitle: 'Toggle item availability and pricing',
      icon: UtensilsCrossed,
      path: '/manager/menu',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      variant: 'bronze',
    },
    {
      title: 'Staff Roster',
      subtitle: 'View shifts, attendance and team schedules',
      icon: CalendarDays,
      path: '/manager/staff',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      variant: 'default',
    },
    {
      title: 'Customer Hub',
      subtitle: 'Handle feedback, reviews and refund requests',
      icon: MessageSquareText,
      path: '/manager/crm',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      variant: 'gold',
    },
    {
      title: 'EOD Reports',
      subtitle: 'Generate end-of-day operational summaries',
      icon: FileBarChart,
      path: '/manager/reports',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      variant: 'error',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-primary-600" size={32} />
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-outfit uppercase tracking-tighter">
              Manager Hub
            </h1>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            Welcome back, {user?.name}
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </p>
        </div>

        <div className="glass px-6 py-3 rounded-2xl border border-white/60 shadow-xl flex items-center gap-4 bg-white/50 backdrop-blur-xl">
          <Activity className="text-primary-500" size={20} />
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">System Status</p>
            <p className="text-xl font-black text-gray-900">All Clear</p>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Package className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active Orders</p>
              <p className="text-2xl font-black text-gray-900">{activeOrders}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <IndianRupee className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Revenue</p>
              <p className="text-2xl font-black text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Customers</p>
              <p className="text-2xl font-black text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Staff On Duty</p>
              <p className="text-2xl font-black text-gray-900">{totalStaff}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-800 mb-2">
          Select a Module
        </h2>
        <p className="text-sm font-bold text-gray-500 mb-8">Click on any module to manage that area of operations.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className="glass rounded-3xl p-8 border border-white/60 shadow-xl bg-white/40 
                  hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group flex flex-col"
                onClick={() => navigate(mod.path)}
              >
                {/* Icon Bubble */}
                <div className={`w-16 h-16 ${mod.iconBg} rounded-2xl flex items-center justify-center mb-6 
                  group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                  <Icon size={28} className={mod.iconColor} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-gray-900 mb-1">{mod.title}</h3>
                <p className="text-sm font-medium text-gray-500 mb-6 flex-1">{mod.subtitle}</p>

                {/* Access Button */}
                <MetalButton
                  variant={mod.variant}
                  onClick={(e) => { e.stopPropagation(); navigate(mod.path); }}
                  className="w-full !h-12 text-sm tracking-wider uppercase"
                >
                  <span className="flex items-center gap-2">
                    Access <ArrowRight size={16} className="animate-pulse" />
                  </span>
                </MetalButton>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Summary Footer */}
      <div className="glass rounded-3xl p-6 border border-white/60 shadow-lg bg-white/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="text-primary-500" size={24} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Menu Items Live</p>
            <p className="text-lg font-black text-gray-900">{menuItems.length} dishes active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ClipboardList className="text-green-500" size={24} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Today's Orders</p>
            <p className="text-lg font-black text-gray-900">{orders.length} total processed</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <TrendingUp className="text-blue-500" size={24} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Avg. Profit Margin</p>
            <p className="text-lg font-black text-gray-900">
              ₹{orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.profit, 0) / orders.length) : 0}/order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
