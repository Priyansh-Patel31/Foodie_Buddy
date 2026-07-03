import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginSuccess } from '../../features/auth/authSlice';
import { fetchAdminData } from '../../features/admin/adminSlice';
import { ROLES, UserRole } from '../../utils/constants';
import apiClient from '../../api/apiClient';
import AnimatedLogo from '../../components/common/AnimatedLogo';
import { Mail, Lock, ArrowRight, ShieldCheck, ChefHat, Users, Truck, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const QUICK_ACCOUNTS = [
  { email: 'admin@foodie.com', password: 'Admin@123', role: ROLES.ADMIN, name: 'Admin', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { email: 'manager@foodie.com', password: 'Manager@123', role: ROLES.MANAGER, name: 'Manager', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { email: 'kitchen@foodie.com', password: 'Kitchen@123', role: ROLES.CHEF, name: 'Kitchen', icon: ChefHat, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { email: 'delivery@foodie.com', password: 'Delivery@123', role: ROLES.DELIVERY, name: 'Delivery', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { email: 'staff@foodie.com', password: 'Staff@123', role: ROLES.WAITER, name: 'Staff', icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];
const customerRegistrationEnabled = import.meta.env.VITE_CUSTOMER_REGISTRATION_ENABLED !== 'false';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const userRole = useAppSelector(state => state.auth.user?.role);

  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === ROLES.CUSTOMER) navigate('/');
      else if (userRole === ROLES.ADMIN) navigate('/admin');
      else if (userRole === ROLES.MANAGER) navigate('/manager');
      else if (userRole === ROLES.CHEF) navigate('/kitchen');
      else if (userRole === ROLES.DELIVERY) navigate('/delivery');
      else if (userRole === ROLES.WAITER || userRole === ROLES.CLEANER) navigate('/profile');
      else navigate('/dashboard');
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);

    try {
      // Try the REAL Spring Boot API first
      const response = await apiClient.post('/auth/login', { email, password });
      const loginData = response.data.data;

      if (loginData) {
        localStorage.setItem('foodieBuddyToken', loginData.token);
        dispatch(loginSuccess({
          user: {
            id: loginData.userId,
            name: loginData.name,
            email: loginData.email,
            role: loginData.role as UserRole,
          },
          token: loginData.token,
        }));

        dispatch(fetchAdminData());
        toast.success(`Welcome back, ${loginData.name}!`);
      }
    } catch (error: any) {
      if (error?.response) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Login failed. Please try again.';
        toast.error(message);
      } else {
        toast.error('Unable to reach the server. Please try again shortly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDummy = (emailStr: string, passStr: string) => {
    setEmail(emailStr);
    setPassword(passStr);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-400/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-400/20 rounded-full blur-[100px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <AnimatedLogo />
        </div>
        <h2 className="mt-2 text-center text-3xl font-black text-gray-900 font-outfit">
          Sign In to Your Account
        </h2>
        {customerRegistrationEnabled && (
          <p className="mt-2 text-center text-sm text-gray-600 font-medium">
            Ordering for yourself?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
              Create a customer account
            </Link>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass shadow-2xl rounded-3xl p-8 border border-white/40">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-gray-700">Email address</label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-white/50"
                  placeholder="admin@foodie.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow bg-white/50"
                  placeholder="********"
                  required
                  disabled={isSubmitting}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-primary-500 focus:outline-none">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-bold text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-glass-primary py-4 rounded-xl shadow-xl transition-all flex justify-center items-center gap-2 group relative overflow-hidden"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> <span>Authenticating...</span></>
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Quick Login Accounts */}
          <div className="mt-8 pt-8 border-t border-gray-200/50">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider text-center mb-4">
              Demo Accounts
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => fillDummy(acc.email, acc.password)}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 p-2 rounded-xl border border-transparent hover:border-gray-200 transition-colors text-left ${acc.bg} group disabled:opacity-50`}
                >
                  <div className={`p-1.5 rounded-lg bg-white ${acc.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <acc.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{acc.role.replace('ROLE_', '')}</span>
                    <span className="text-[11px] font-semibold text-gray-900 truncate">{acc.email}</span>
                    <span className="text-[10px] text-gray-500">{acc.password}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
