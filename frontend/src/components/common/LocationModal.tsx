import { useState, useEffect } from 'react';
import { MapPin, X, Navigation, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string) => void;
}

const SAVED_ADDRESSES = [
  { label: 'Home', address: '123 Tech Park, Block B, Silicon Valley Apartments' },
  { label: 'Work', address: 'Floor 5, Innovation Hub, Downtown Square' },
];

export default function LocationModal({ isOpen, onClose, onSelectLocation }: LocationModalProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleDetect = () => {
    onSelectLocation('Marathahalli Bridge, Bangalore, 560037');
    onClose();
  };

  const handleSelect = (address: string) => {
    onSelectLocation(address);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 font-outfit">Set your delivery location</h2>
                    <p className="text-sm text-gray-500 font-medium">To see menu prices and delivery time</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 pt-4 space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Enter your delivery location"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                    autoFocus
                  />
                </div>

                {/* Detect Location */}
                <button
                  onClick={handleDetect}
                  className="w-full flex items-center gap-3 px-4 py-3.5 border-2 border-dashed border-gray-300 rounded-2xl hover:border-orange-400 hover:bg-orange-50/50 transition-all group"
                >
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <Navigation className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="font-bold text-gray-700 group-hover:text-orange-600 transition-colors">
                    Detect my current location
                  </span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Saved Addresses */}
                <div className="space-y-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Saved Addresses</p>
                  {SAVED_ADDRESSES.map((addr) => (
                    <button
                      key={addr.label}
                      onClick={() => handleSelect(addr.address)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left"
                    >
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm">{addr.label}</p>
                        <p className="text-xs text-gray-500 truncate">{addr.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
