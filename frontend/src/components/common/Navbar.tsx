import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, MapPin, ChevronDown } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { openCart } from '../../features/cart/cartSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const cartItemsCount = useAppSelector(state => 
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <header className="glass sticky top-0 z-40 shadow-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left Section: Logo & Location */}
        <div className="flex items-center gap-4 sm:gap-8 cursor-pointer">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-2.5 rounded-xl shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
              <span className="font-black text-2xl leading-none font-outfit">F</span>
            </div>
            <span className="font-black text-2xl tracking-tight text-gray-900 hidden sm:block font-outfit">Foodie</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-2 hover:bg-gray-100/80 p-2 rounded-xl transition-colors">
            <div className="bg-primary-50 p-1.5 rounded-full text-primary-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Home</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                  123 Tech Park, Block B...
                </span>
                <ChevronDown className="w-4 h-4 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: Large Search */}
        <div className="hidden md:flex relative flex-1 max-w-2xl mx-8 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search for restaurants, cuisines, or dishes..." 
            className="block w-full pl-11 pr-4 py-3.5 bg-gray-100/80 border border-transparent rounded-2xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white focus:border-primary-500 transition-all shadow-inner group-focus-within:shadow-md"
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-200 text-xs font-bold text-gray-600 hover:text-primary-600 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button className="md:hidden text-gray-700 hover:text-primary-600 transition-colors p-2 bg-gray-100/80 rounded-full">
            <Search className="w-5 h-5" />
          </button>
          
          <button className="hidden sm:flex items-center gap-2 hover:bg-white p-2 rounded-full transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
            <div className="bg-gray-100 p-2 rounded-full text-gray-700">
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-gray-800 pr-2">Sign In</span>
          </button>

          <button 
            onClick={() => dispatch(openCart())}
            className="relative flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-full transition-all group shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                {cartItemsCount}
              </span>
            )}
          </button>

          <button className="sm:hidden text-gray-700 hover:text-primary-600 p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
