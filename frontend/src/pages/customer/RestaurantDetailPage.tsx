import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Star, Clock, Info, Heart } from 'lucide-react';
import FoodItemCard from '../../components/restaurant/FoodItemCard';

// Restaurant Metdata (Static layout wrapper)
const MOCK_RESTAURANT = {
  id: 'r1',
  name: 'Foodie Buddy Kitchen',
  image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1600&auto=format&fit=crop&q=80',
  rating: 4.8,
  reviews: '5K+',
  deliveryTime: '25-35 min',
  location: 'Downtown Square',
  tags: ['Premium Kitchen', 'Global Cuisines', 'Beverages'],
  offer: '50% OFF up to ₹100'
};

export default function RestaurantDetailPage() {
  const { menuItems } = useAppSelector(state => state.admin);
  const [activeCategory, setActiveCategory] = useState<string>('Main Course');
  const [isLiked, setIsLiked] = useState(false);

  // Group Dynamic Redux Admin Data by Category
  const groupedMenu = menuItems.filter(item => item.isAvailable).reduce((acc, item) => {
    const cat = item.categoryName || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({
      id: item.id,
      restaurantId: MOCK_RESTAURANT.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.imageUrl,
      toppings: [],
      isVegetarian: item.isVegetarian ?? true,
      isBestseller: false 
    });
    return acc;
  }, {} as Record<string, any[]>);

  const categories = Object.keys(groupedMenu);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-24">
      {/* Huge Cover Image Header */}
      <div className="w-full h-64 md:h-80 lg:h-96 relative">
        <img 
          src={MOCK_RESTAURANT.image} 
          alt={MOCK_RESTAURANT.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10">
        
        {/* Info Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 sm:mb-12 border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 font-outfit tracking-tight">
                {MOCK_RESTAURANT.name}
              </h1>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`md:hidden p-3 rounded-full bg-gray-50 border border-gray-100 transition-colors ${isLiked ? 'text-primary-500 bg-primary-50 border-primary-100' : 'text-gray-400 hover:text-primary-500'}`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <p className="text-gray-600 text-lg mb-4 font-medium">{MOCK_RESTAURANT.tags.join(', ')}</p>
            
            <div className="flex flex-wrap items-center gap-6 py-4 border-t border-b border-gray-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-green-600 text-white p-2 rounded-xl shadow-sm">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{MOCK_RESTAURANT.rating}</div>
                  <div className="text-xs text-gray-500 font-medium">{MOCK_RESTAURANT.reviews} ratings</div>
                </div>
              </div>
              
              <div className="h-10 w-px bg-gray-200 hidden sm:block" />
              
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-primary-50 text-primary-600 p-2 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{MOCK_RESTAURANT.deliveryTime}</div>
                  <div className="text-xs text-gray-500 font-medium">Delivery Time</div>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-primary-600 bg-primary-50 px-4 py-2.5 rounded-xl font-bold text-sm border border-primary-100">
              <Info className="w-5 h-5" />
              {MOCK_RESTAURANT.offer}
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end gap-4 min-w-[200px]">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all shadow-sm
                ${isLiked 
                  ? 'border-primary-200 bg-primary-50 text-primary-600 font-bold' 
                  : 'border-gray-200 bg-white text-gray-600 font-semibold hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Favorited' : 'Favorite'}
            </button>
          </div>
        </div>

        {/* Layout Split: Categories Sidebar & Menu Items */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Left Sidebar - Sticky Navigation */}
          <div className="hidden md:block w-1/4 shrink-0">
            <div className="sticky top-28 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 px-4 font-outfit uppercase tracking-wider">Top Menu</h3>
              {categories.length === 0 ? (
                <p className="text-sm p-4 text-gray-400 font-bold">Menu is currently empty.</p>
              ) : (
                <div className="space-y-1">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                         setActiveCategory(category);
                         document.getElementById(category)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all text-sm
                        ${activeCategory === category 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Category Navigation (Horizontal Scroll) */}
          <div className="md:hidden sticky top-20 z-30 bg-gray-50/95 backdrop-blur-md py-4 -mx-4 px-4 shadow-sm">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x">
              {categories.map(category => (
                <button
                  key={`mobile-${category}`}
                  onClick={() => {
                     setActiveCategory(category);
                     const el = document.getElementById(category);
                     if (el) {
                       const y = el.getBoundingClientRect().top + window.pageYOffset - 140;
                       window.scrollTo({top: y, behavior: 'smooth'});
                     }
                  }}
                  className={`snap-start px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm shadow-sm transition-all
                    ${activeCategory === category 
                      ? 'bg-primary-600 text-white border-primary-600' 
                      : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Contents - Menu Sections */}
          <div className="flex-1 space-y-10 lg:space-y-16">
            {categories.map((category, sIdx) => (
              <div key={category} id={category} className="scroll-mt-36">
                <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-6 font-outfit tracking-tight">
                  {category}
                </h2>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                  {groupedMenu[category].map((item: any) => (
                    <FoodItemCard key={item.id} {...item} />
                  ))}
                </div>
                
                {sIdx !== categories.length - 1 && (
                  <div className="mt-10 h-px w-full bg-gray-200 max-w-sm mx-auto opacity-50 block xl:hidden" />
                )}
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="h-40 flex items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                 <p className="text-gray-400 font-bold">The Admin has not added any dishes to the menu yet.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
