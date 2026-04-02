import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, MapPin, ChevronDown, LogOut, ArrowRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { openCart } from '../../features/cart/cartSlice';
import { logout } from '../../features/auth/authSlice';
import { clearAdminData } from '../../features/admin/adminSlice';
import AnimatedLogo from './AnimatedLogo';
import LocationModal from './LocationModal';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const { orders, menuItems } = useAppSelector(state => state.admin);

  const activeOrderCount = orders.filter(o =>
    (!user?.id || o.customerId === user?.id) && !['DELIVERED', 'CANCELLED'].includes(o.status)
  ).length;

  const cartItemsCount = useAppSelector(state =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const locationState = useAppSelector(state => state.location);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      const filtered = menuItems
        .filter(item =>
          item.isAvailable && (
            item.name.toLowerCase().includes(q) ||
            (item.categoryName || item.category || '').toLowerCase().includes(q)
          )
        )
        .slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, menuItems]);

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const q = (customQuery || searchQuery).trim();
    if (q) {
      navigate(`/?q=${encodeURIComponent(q)}`);
      setShowSuggestions(false);
    } else {
      navigate('/');
    }
  };

  const selectSuggestion = (item: any) => {
    setSearchQuery(item.name);
    handleSearch(undefined, item.name);
  };

  const handleLogout = () => {
    localStorage.removeItem('foodieBuddyToken');
    localStorage.removeItem('foodieBuddyAuth');
    dispatch(clearAdminData());
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
    <header className="glass sticky top-0 z-40 shadow-sm border-b border-gray-200/50">
      {/* h-20 instead of h-24 — slightly slimmer navbar */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">

        {/* ── Left: Logo ── */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <AnimatedLogo />
          </Link>

          {/* Location — only xl+ so search gets maximum room */}
          <div
            onClick={() => setLocationOpen(true)}
            className="hidden xl:flex items-center gap-2 hover:bg-gray-100/80 p-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <div className="bg-primary-50 p-1.5 rounded-full text-primary-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {locationState.deliveryAddress ? 'Deliver to' : 'Set location'}
              </span>
              <div className="flex items-center gap-0.5">
                <span className="text-xs font-semibold text-gray-900 truncate max-w-[140px]">
                  {locationState.deliveryAddress || 'Tap to set address'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Centre: Search Bar — pill shape, slim, super wide ── */}
        <div className="hidden md:flex relative flex-1 min-w-0 mx-2 group">
          <form
            onSubmit={handleSearch}
            className="w-full relative flex items-center"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setTimeout(() => setShowSuggestions(false), 200);
              }
            }}
          >
            {/* Search icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>

            {/* Pill input — py-2.5 keeps it slim, rounded-full = pill */}
            <input
              type="text"
              placeholder="Search for food, dishes, categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
              className="block w-full pl-10 pr-36 py-2.5 bg-white border-2 border-orange-200 rounded-full text-gray-900 text-sm font-medium focus:outline-none focus:border-primary-500 transition-all shadow-sm"
            />

            {/* Pill search button sits flush inside the rounded-full */}
            <div className="absolute inset-y-0 right-1.5 flex items-center">
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 active:scale-95 px-7 py-[7px] rounded-full text-white text-xs font-black transition-all whitespace-nowrap"
              >
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl border border-gray-200 shadow-2xl p-2 z-50 overflow-hidden"
                style={{ background: '#ffffff' }}
              >
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2 mb-1">
                  Suggestions
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSuggestion(item)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-all text-left group/sug"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/sug:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
                        {item.categoryName || item.category}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover/sug:text-primary-500 group-hover/sug:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Mobile search */}
          <button className="md:hidden text-gray-700 hover:text-primary-600 transition-colors p-2 bg-gray-100/80 rounded-full">
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated && user ? (
            <div className="hidden sm:flex items-center gap-1.5 glass-premium p-1.5 rounded-full border border-white/60 shadow-lg">
              <button
                onClick={() => navigate('/my-orders')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm text-gray-800 border border-white/20 transition-all text-sm font-black shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                My Orders
                {activeOrderCount > 0 && (
                  <span className="min-w-[18px] h-[18px] rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-black animate-pulse">
                    {activeOrderCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 p-1.5 px-3 border-l border-gray-200">
                <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-orange-400 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-bold text-gray-800 max-w-[80px] truncate">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/10 transition-all text-sm font-black"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200">
              <Link
                to="/login"
                className="flex items-center gap-2 hover:bg-white p-1.5 px-3 rounded-full transition-all border border-transparent hover:shadow-sm"
              >
                <div className="bg-primary-100 p-1.5 rounded-full text-primary-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-800">Sign In</span>
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold text-primary-600 hover:text-primary-700 px-3 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Cart */}
          <button
            onClick={() => dispatch(openCart())}
            className="relative flex items-center justify-center btn-glass p-3 rounded-full group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(249,115,22,0.4)]">
                {cartItemsCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <button onClick={handleLogout} className="sm:hidden text-red-500 hover:text-red-600 p-2">
              <LogOut className="w-6 h-6" />
            </button>
          ) : (
            <button className="sm:hidden text-gray-700 hover:text-primary-600 p-2">
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>

      </div>
    </header>

    <LocationModal
      isOpen={locationOpen}
      onClose={() => setLocationOpen(false)}
    />
    </>
  );
}