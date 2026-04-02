import { useState, useEffect } from 'react';
import { Star, X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '../../store/hooks';
import { addItem } from '../../features/cart/cartSlice';

interface Addon {
  name: string;
  price: number;
}

interface ItemCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isVegetarian?: boolean;
    isBestseller?: boolean;
    rating?: number;
    votes?: number;
    categoryName?: string;
    toppings?: any[];
    ingredients?: any[];
  } | null;
}


export default function ItemCustomizeModal({ isOpen, onClose, item }: ItemCustomizeModalProps) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedAddons(new Set());
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!item) return null;

  const toggleAddon = (name: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const availableToppings: Addon[] = (item?.toppings || item?.ingredients || []).map((t: any) => ({
    name: t.name || t.inventoryItemName || 'Extra',
    price: Number(t.price || t.quantityRequired || 0)
  }));

  const addonTotal = availableToppings
    .filter(a => selectedAddons.has(a.name))
    .reduce((sum, a) => sum + a.price, 0);

  const totalPrice = (item.price + addonTotal) * quantity;

  const handleAddToCart = () => {
    // Append chosen addons to the item name so they are recorded in the final order
    const addonList = Array.from(selectedAddons);
    const finalName = addonList.length > 0 
      ? `${item.name} (w/ ${addonList.join(', ')})`
      : item.name;

    for (let i = 0; i < quantity; i++) {
      dispatch(addItem({
        id: item.id + (addonList.length > 0 ? `-${addonList.join('-')}` : ''), // Append unique sub-id so different customizations don't group incorrectly if quantity matters
        restaurantId: 'foodie-buddy',
        name: finalName,
        price: item.price + addonTotal,
        image: item.image,
      }));
    }
    onClose();
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Image */}
              <div className="w-full md:w-[45%] h-56 md:h-auto relative shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Right: Details */}
              <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 md:relative md:top-0 md:right-0 md:self-end p-2 rounded-full bg-white/90 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors shadow-sm z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 border flex items-center justify-center rounded-sm ${item.isVegetarian !== false ? 'border-green-600' : 'border-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${item.isVegetarian !== false ? 'bg-green-600' : 'bg-red-600'}`} />
                  </div>
                  {item.isBestseller && (
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-amber-200">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Name & Price */}
                <h2 className="text-2xl font-black text-gray-900 font-outfit mb-1">{item.name}</h2>
                <p className="text-xl font-black text-gray-800 mb-2">₹{item.price}</p>

                {/* Rating */}
                {item.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-green-700 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                    {item.votes && (
                      <span className="text-gray-400 text-xs font-medium">({item.votes} ratings)</span>
                    )}
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.description}</p>

                {/* Add-ons */}
                {availableToppings.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                      What would you like to add?
                    </h3>
                    <div className="space-y-2">
                      {availableToppings.map((addon) => (
                        <label
                          key={addon.name}
                          className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer transition-all hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedAddons.has(addon.name)}
                              onChange={() => toggleAddon(addon.name)}
                              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">{addon.name}</span>
                          </div>
                          {addon.price > 0 ? (
                            <span className="text-sm font-bold text-gray-500">+₹{addon.price}</span>
                          ) : (
                            <span className="text-sm font-bold text-green-600">Free</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Quantity</h3>
                  <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-black text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:shadow-orange-500/30 text-base"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart — ₹{totalPrice}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
