import { useEffect } from 'react';
import { ShoppingBag, X, Minus, Plus, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateQuantity, clearCart } from '../../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee } = useAppSelector(state => state.cart);

  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 w-full max-w-md h-[100dvh] bg-white z-50 shadow-2xl flex flex-col overflow-hidden border-l border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-primary-50 p-2.5 rounded-2xl text-primary-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-black text-xl text-gray-900 font-outfit">Your Cart</h2>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{items.length} items</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button 
                    onClick={() => dispatch(clearCart())}
                    className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase px-2 py-1"
                  >
                    Clear
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-2.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/50">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-5 animate-in fade-in duration-500">
                  <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 font-outfit mb-2">Cart is empty</h3>
                    <p className="text-gray-500 text-sm max-w-[250px] mx-auto leading-relaxed">
                      Looks like you haven't added anything delicious yet. Let's fix that!
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="mt-4 px-8 py-3.5 bg-primary-50 text-primary-600 font-black rounded-2xl hover:bg-primary-100 hover:scale-105 transition-all w-full sm:w-auto mt-auto sm:mt-8 shadow-sm"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                        className="flex gap-4 items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 shadow-inner">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
                          <div>
                            <h4 className="font-extrabold text-gray-900 line-clamp-2 text-sm md:text-base leading-tight font-outfit mb-1">{item.name}</h4>
                            <div className="text-primary-600 font-black text-base">₹{item.price}</div>
                          </div>
                          
                          <div className="flex items-center mt-2">
                            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200 shadow-sm">
                              <button 
                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-red-500 hover:shadow-sm rounded-lg transition-all"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <div className="w-8 text-center text-sm font-black text-gray-900">{item.quantity}</div>
                              <button 
                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-green-500 hover:shadow-sm rounded-lg transition-all"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-500 font-medium text-sm">
                    <span>Item Total</span>
                    <span className="text-gray-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium text-sm">
                    <span>Delivery Fee</span>
                    <span className="text-gray-900">₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-black text-xl pt-4 border-t border-dashed border-gray-200 font-outfit text-gray-900">
                    <span>To Pay</span>
                    <span>₹{total}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:shadow-primary-500/30 group"
                >
                  <span className="uppercase tracking-widest text-sm">Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
