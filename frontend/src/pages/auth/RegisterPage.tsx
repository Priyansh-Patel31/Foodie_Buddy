import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AnimatedLogo from '../../components/common/AnimatedLogo';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../api/apiClient';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/register', {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.mobile,
      });
      toast.success('Customer account created. Please sign in.');
      navigate('/login');
    } catch (error: any) {
      if (error.response?.data?.data && typeof error.response.data.data === 'object') {
        const fieldErrors = Object.values(error.response.data.data).join(' | ');
        toast.error(`Validation failed: ${fieldErrors}`);
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please check your details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ornaments matching Customer UI */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary-400/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-orange-400/20 rounded-full blur-[100px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="flex justify-center mb-6">
          <AnimatedLogo />
        </div>
        <h2 className="mt-2 text-center text-3xl font-black text-gray-900 font-outfit">
          Join Foodie-Buddy
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
            Sign In here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="glass shadow-2xl rounded-3xl p-8 border border-white/40">
          <form className="space-y-6" onSubmit={handleRegister}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700">First Name</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text" name="firstName" required
                    value={formData.firstName} onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                    placeholder="John"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700">Last Name</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text" name="lastName" required
                    value={formData.lastName} onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700">Email Address</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                    placeholder="johndoe@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Mobile Number</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel" name="mobile" required
                    value={formData.mobile} onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Address</label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="address" required rows={2}
                  value={formData.address} onChange={handleChange}
                  className="block w-full pl-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50 resize-none"
                  placeholder="123 Tech Park, Block B..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" required
                    value={formData.password} onChange={handleChange}
                    className="block w-full pl-10 pr-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-primary-500 focus:outline-none">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Must include uppercase, lowercase, number, and special char.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Confirm Password</label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required
                    value={formData.confirmPassword} onChange={handleChange}
                    className="block w-full pl-10 pr-10 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-primary-500 focus:outline-none">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 btn-glass-primary py-4 rounded-xl shadow-xl transition-all flex justify-center items-center gap-2 group relative overflow-hidden"
            >
              {isSubmitting ? 'Creating account…' : 'Create Customer Account'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
