import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../features/auth/authSlice';
import { fetchAdminData, clearAdminData } from '../features/admin/adminSlice';
import { ROLES, ROLE_LABELS } from '../utils/constants';
import AnimatedLogo from '../components/common/AnimatedLogo';
import { MetalButton } from '../components/ui/liquid-glass-button';
import { 
  Menu as MenuIcon, X, LogOut,
  ChefHat, Truck, ArrowLeft, CalendarDays
} from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Always fetch fresh data on mount & refresh periodically
  useEffect(() => {
    if (user) {
      dispatch(fetchAdminData());
      const interval = setInterval(() => dispatch(fetchAdminData()), 30000);
      return () => clearInterval(interval);
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('foodieBuddyToken');
    localStorage.removeItem('foodieBuddyAuth');
    dispatch(clearAdminData());
    dispatch(logout());
    navigate('/login');
  };

  const isImmersive = true; // All roles use immersive layout — no sidebar
  const dashboardHome = user?.role === ROLES.ADMIN ? '/admin' 
    : user?.role === ROLES.MANAGER ? '/manager'
    : user?.role === ROLES.CHEF ? '/kitchen'
    : user?.role === ROLES.DELIVERY ? '/delivery'
    : '/';
  const headerBadge = user?.role === ROLES.ADMIN ? 'System Override Config' 
    : user?.role === ROLES.MANAGER ? 'Operations Command Center'
    : user?.role === ROLES.CHEF ? 'Kitchen Command Center'
    : user?.role === ROLES.DELIVERY ? 'Delivery Operations Hub'
    : 'Staff Panel';

  const getLinksForRole = (role: string) => {
    switch (role) {
      case ROLES.CHEF:
        return [
          { path: '/kitchen', label: 'Kitchen View', icon: ChefHat },
          { path: '/profile', label: 'My Attendance', icon: CalendarDays },
        ];
      case ROLES.DELIVERY:
        return [
          { path: '/delivery', label: 'Deliveries', icon: Truck },
          { path: '/profile', label: 'My Attendance', icon: CalendarDays },
        ];
      default:
        return [];
    }
  };

  const links = getLinksForRole(user?.role || '');

  return (
    <div className="min-h-screen bg-gray-50 font-sans font-medium overflow-hidden relative">
      {/* Background Ornaments matching Customer UI */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-400/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-400/20 rounded-full blur-[100px] pointer-events-none z-0" />

      {isImmersive ? (
        // ==========================================
        // IMMERSIVE LAYOUT (ADMIN + MANAGER)
        // ==========================================
        <div className="flex-1 w-full h-screen overflow-y-auto flex flex-col relative z-10 transition-all duration-500">
          <header className="print-hide glass bg-white/40 border-b border-gray-200/50 p-4 sticky top-0 z-40 flex items-center justify-between shadow-sm backdrop-blur-xl transition-all">
            <div className="flex items-center gap-4">
              <AnimatedLogo />
              <div className="hidden lg:flex bg-primary-100/50 px-3 py-1 rounded-full border border-primary-200 shadow-inner">
                 <span className="text-xs font-black text-primary-700 tracking-wider uppercase">{headerBadge}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {location.pathname !== dashboardHome && (
                <MetalButton variant="default" onClick={() => navigate(dashboardHome)}>
                   <span className="flex items-center gap-2"><ArrowLeft size={16} /> Back</span>
                </MetalButton>
              )}
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-orange-400 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all"
                title="My Profile & Attendance"
              >
                {user?.name?.charAt(0) || 'U'}
              </button>
              <MetalButton variant="error" onClick={handleLogout}>
                 <span className="flex items-center gap-2"><LogOut size={16} /> Log Out</span>
              </MetalButton>
            </div>
          </header>
          
          <main className="flex-1 w-full p-4 md:p-8 lg:p-12 overflow-x-hidden relative h-full"> 
             <Outlet />
          </main>
        </div>
      ) : (
        // ==========================================
        // STAFF LAYOUT (SIDEBAR RETAINED)
        // ==========================================
        <div className="flex w-full min-h-screen relative z-10">
          {/* Sidebar */}
          <aside className={`print-hide fixed inset-y-0 left-0 z-40 w-72 glass border-r border-white/40 shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b border-gray-200/50 flex flex-col items-center">
              <AnimatedLogo />
              <div className="mt-4 bg-primary-100/50 px-3 py-1 rounded-full border border-primary-200 shadow-inner">
                <span className="text-xs font-black text-primary-700 tracking-wider uppercase">
                  {ROLE_LABELS[user?.role || ''] || 'Staff'} Panel
                </span>
              </div>
            </div>

            <nav className="p-4 flex-1 space-y-2 overflow-y-auto">
              {links.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      active 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20 transform scale-105' 
                        : 'text-gray-600 hover:bg-white/60 hover:text-primary-600 hover:shadow-sm'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-white' : ''} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200/50 bg-white/30 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-white/50 border border-white">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-orange-400 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-800 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 font-semibold truncate">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-red-500 bg-red-50/50 hover:bg-red-100/50 border border-red-100 rounded-xl transition-all hover:shadow-sm"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </aside>

          {/* Main content area */}
          <div className="flex-1 lg:ml-72 flex flex-col w-full h-screen overflow-y-auto overflow-x-hidden">
            {/* Mobile Header */}
            <header className="print-hide lg:hidden glass border-b border-gray-200/50 p-4 flex items-center justify-between sticky top-0 z-30">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="p-2 bg-white/50 hover:bg-white rounded-xl shadow-sm border border-gray-200 transition-colors"
              >
                {sidebarOpen ? <X size={24} className="text-gray-700" /> : <MenuIcon size={24} className="text-gray-700" />}
              </button>
              <AnimatedLogo />
              <div className="w-10" />
            </header>

            {/* Overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden" 
                onClick={() => setSidebarOpen(false)} 
              />
            )}

            {/* Dashboard Pages Output */}
            <main className="flex-1 p-6 lg:p-10 w-full">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
