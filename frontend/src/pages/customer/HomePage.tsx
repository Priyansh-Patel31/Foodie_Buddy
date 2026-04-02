import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Star, Clock, Tag } from 'lucide-react';
import UserMenuCard from '../../components/restaurant/UserMenuCard';
import ItemCustomizeModal from '../../components/restaurant/ItemCustomizeModal';
import LocationModal from '../../components/common/LocationModal';
import { motion } from 'framer-motion';

const RESTAURANT_META = {
  name: 'Foodie Buddy',
  tagline: 'Main Course · Starters · Desserts · Beverages',
  rating: 4.5,
  totalRatings: '12K+',
  deliveryTime: '25-35 min',
  offer: 'Flat 30% OFF on your first order!',
  coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80',
};

// Generate pseudo-random rating/votes for each item based on the item id
function getItemMeta(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i);
  const rating = 4.0 + (Math.abs(hash % 10) / 10);
  const votes = 500 + Math.abs(hash % 2000);
  const isBestseller = Math.abs(hash) % 3 === 0;
  return { rating: Math.round(rating * 10) / 10, votes, isBestseller };
}

export default function HomePage() {
  const { menuItems } = useAppSelector(state => state.admin);

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [customizeItem, setCustomizeItem] = useState<any>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [showLocationFirst, setShowLocationFirst] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Show location modal on first visit
  useEffect(() => {
    const hasSetLocation = localStorage.getItem('foodieBuddyLocation');
    if (!hasSetLocation) {
      const timer = setTimeout(() => setShowLocationFirst(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Group available menu items by category
  const availableItems = menuItems.filter(item => item.isAvailable);
  const groupedMenu = availableItems.reduce((acc, item) => {
    const cat = item.categoryName || item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const categories = Object.keys(groupedMenu);

  // Set first category as active on load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Intersection observer for sticky category highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace('section-', ''));
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [categories, menuItems]);

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    const el = sectionRefs.current[cat];
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleLocationSelect = (address: string) => {
    localStorage.setItem('foodieBuddyLocation', address);
    setShowLocationFirst(false);
  };

  return (
    <div className="w-full pb-20 bg-gray-50 min-h-screen">
      {/* ========== HERO BANNER ========== */}
      <div className="relative w-full h-52 md:h-64 lg:h-72 overflow-hidden">
        <img
          src={RESTAURANT_META.coverImage}
          alt="Foodie Buddy Kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/30" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-white font-outfit tracking-tight drop-shadow-lg"
          >
            {RESTAURANT_META.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm md:text-base font-medium mt-1"
          >
            {RESTAURANT_META.tagline}
          </motion.p>
        </div>
      </div>

      {/* ========== INFO STRIP ========== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-3 -mt-6 relative z-10 flex flex-wrap items-center gap-4 sm:gap-6"
        >
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded-lg text-sm font-black shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              {RESTAURANT_META.rating}
            </div>
            <span className="text-xs font-medium text-gray-500">{RESTAURANT_META.totalRatings} ratings</span>
          </div>

          {/* Separator */}
          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Delivery Time */}
          <div className="flex items-center gap-1.5 text-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold">{RESTAURANT_META.deliveryTime}</span>
          </div>

          {/* Separator */}
          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Offer */}
          <div className="flex items-center gap-1.5 text-orange-600">
            <Tag className="w-4 h-4" />
            <span className="text-sm font-bold">{RESTAURANT_META.offer}</span>
          </div>
        </motion.div>

        {/* ========== MAIN CONTENT: SIDEBAR + MENU ========== */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 mt-8">
          
          {/* ===== LEFT SIDEBAR — Category Navigation ===== */}
          <div className="hidden md:block w-56 lg:w-64 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Menu</h3>
                </div>
                <nav className="p-2 space-y-0.5 max-h-[60vh] overflow-y-auto hide-scrollbar">
                  {categories.map(cat => {
                    const count = groupedMenu[cat].length;
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => scrollToCategory(cat)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group
                          ${isActive
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full transition-colors
                          ${isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                          }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* ===== MOBILE — Horizontal Category Scroller ===== */}
          <div className="md:hidden sticky top-[80px] z-30 bg-gray-50/95 backdrop-blur-md -mx-4 px-4 py-3 shadow-sm border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x">
              {categories.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={`mobile-${cat}`}
                    onClick={() => scrollToCategory(cat)}
                    className={`snap-start px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm shadow-sm transition-all border
                      ${isActive
                        ? 'bg-orange-500 text-white border-orange-500 shadow-orange-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ===== RIGHT — Menu Sections ===== */}
          <div className="flex-1 space-y-10">
            {categories.map((category, sIdx) => {
              const items = groupedMenu[category];
              return (
                <div
                  key={category}
                  id={`section-${category}`}
                  ref={(el) => { sectionRefs.current[category] = el; }}
                  className="scroll-mt-36"
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-xl lg:text-2xl font-black text-gray-900 font-outfit tracking-tight">
                      {category}
                    </h2>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                      {items.length} item{items.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {items.map((item) => {
                      const meta = getItemMeta(item.id);
                      return (
                        <UserMenuCard
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          description={item.description}
                          price={item.price}
                          image={item.imageUrl}
                          isVegetarian={item.isVegetarian}
                          isBestseller={meta.isBestseller}
                          rating={meta.rating}
                          votes={meta.votes}
                          onCustomize={() => setCustomizeItem({
                            ...item,
                            image: item.imageUrl,
                            ...meta,
                          })}
                        />
                      );
                    })}
                  </div>

                  {/* Divider between sections */}
                  {sIdx !== categories.length - 1 && (
                    <div className="mt-8 h-px w-full bg-gray-200 max-w-xs mx-auto opacity-40" />
                  )}
                </div>
              );
            })}

            {/* Empty state */}
            {categories.length === 0 && (
              <div className="h-60 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-5xl mb-4">🍽️</div>
                <p className="text-gray-400 font-bold text-lg">No dishes available right now</p>
                <p className="text-gray-300 text-sm mt-1">The kitchen is setting things up!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== MODALS ========== */}
      <ItemCustomizeModal
        isOpen={!!customizeItem}
        onClose={() => setCustomizeItem(null)}
        item={customizeItem}
      />
      <LocationModal
        isOpen={locationOpen || showLocationFirst}
        onClose={() => { setLocationOpen(false); setShowLocationFirst(false); }}
        onSelectLocation={handleLocationSelect}
      />
    </div>
  );
}
