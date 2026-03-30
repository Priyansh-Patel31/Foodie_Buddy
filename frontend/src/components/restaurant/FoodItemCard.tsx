import { Star, Plus, Minus, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addItem, updateQuantity } from '../../features/cart/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Topping } from '../../features/admin/adminSlice';

export interface FoodItemCardProps {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVegetarian?: boolean;
  isBestseller?: boolean;
  rating?: number;
  votes?: number;
  toppings?: Topping[];
}

export default function FoodItemCard({
  id,
  restaurantId,
  name,
  description,
  price,
  image,
  isVegetarian = true,
  isBestseller,
  rating,
  votes,
  toppings = []
}: FoodItemCardProps) {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(state => state.cart.items.find(item => item.id === id));
  
  const handleAddToCart = () => {
    dispatch(addItem({ id, restaurantId, name, price, image }));
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 group">
      
      {/* Info Section */}
      <div className="flex-1 min-w-0 order-2 sm:order-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-4 h-4 border flex items-center justify-center rounded-sm ${isVegetarian ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isVegetarian ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
          {isBestseller && (
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-200">
              Bestseller
            </span>
          )}
        </div>
        
        <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl mb-1 group-hover:text-primary-600 transition-colors font-outfit">{name}</h3>
        <div className="font-black text-gray-800 mb-2">₹{price}</div>
        
        {rating && votes && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-1 text-green-700 font-bold text-xs bg-green-50 px-1.5 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400 text-xs font-medium">({votes})</span>
          </div>
        )}
        
        <p className="text-gray-500 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed mt-1">
          {description}
        </p>

        {toppings.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 border-dashed">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Available Toppings</p>
            <div className="flex flex-wrap gap-1.5">
              {toppings.map((t, idx) => (
                 <span key={idx} className="flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg">
                   <Check size={10} className="text-green-500"/> {t.name} <span className="text-primary-600 opacity-80">(+₹{t.price})</span>
                 </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Image & Action Section */}
      <div className="w-full sm:w-44 flex-shrink-0 flex flex-col items-center order-1 sm:order-2">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-[-24px] shadow-md group-hover:shadow-lg transition-shadow">
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <div className="relative z-10 w-32 bg-white rounded-full shadow-lg border border-gray-100 overflow-hidden font-bold text-primary-600 h-11 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!cartItem ? (
              <motion.button 
                key="add-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="w-full h-full hover:bg-primary-50 transition-colors uppercase tracking-wider text-sm font-black text-primary-600"
              >
                Add
              </motion.button>
            ) : (
              <motion.div 
                key="qty-ctrl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between w-full h-full"
              >
                <button 
                  onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                  className="w-1/3 h-full flex items-center justify-center hover:bg-primary-50 text-gray-600 transition-colors bg-white hover:text-primary-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-1/3 text-center text-sm font-black text-primary-600">{cartItem.quantity}</span>
                <button 
                  onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                  className="w-1/3 h-full flex items-center justify-center hover:bg-primary-50 transition-colors bg-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
