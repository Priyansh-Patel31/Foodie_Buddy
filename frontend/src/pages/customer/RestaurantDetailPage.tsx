import { useState } from 'react';
import { Star, Clock, Info, Heart } from 'lucide-react';
import FoodItemCard from '../../components/restaurant/FoodItemCard';

// Mock Data
const MOCK_RESTAURANT = {
  id: 'r1',
  name: 'Pizza Hut',
  image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1600&auto=format&fit=crop&q=80',
  rating: 4.2,
  reviews: '5K+',
  deliveryTime: '30-40 min',
  location: 'Downtown Square',
  tags: ['Pizza', 'Fast Food', 'Italian', 'Beverages'],
  offer: '50% OFF up to ₹100'
};

const MOCK_MENU = [
  {
    category: 'Recommended',
    items: [
      {
        id: 'f1',
        restaurantId: 'r1',
        name: 'Margherita Pizza',
        description: 'Classic delight with 100% real mozzarella cheese. A favorite for cheese lovers seeking a pure taste experience.',
        price: 249,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80',
        isVegetarian: true,
        isBestseller: true,
        rating: 4.5,
        votes: 1205
      },
      {
        id: 'f2',
        restaurantId: 'r1',
        name: 'Pepperoni Pizza',
        description: 'American classic with spicy pepperoni and gooey cheese. Perfect balance of spice and texture.',
        price: 349,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80',
        isVegetarian: false,
        isBestseller: true,
        rating: 4.8,
        votes: 856
      }
    ]
  },
  {
    category: 'Sides & Beverages',
    items: [
      {
        id: 'f3',
        restaurantId: 'r1',
        name: 'Garlic Breadsticks',
        description: 'Freshly baked breadsticks topped with garlic butter and herbs.',
        price: 149,
        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=80',
        isVegetarian: true
      },
      {
        id: 'f4',
        restaurantId: 'r1',
        name: 'Cold Coffee',
        description: 'Creamy cold coffee to beat the heat. Made with premium espresso.',
        price: 129,
        image: 'https://images.unsplash.com/photo-1461023058943-07cb1ce91abc?w=500&auto=format&fit=crop&q=80',
        isVegetarian: true
      }
    ]
  }
];

export default function RestaurantDetailPage() {
  const [activeCategory, setActiveCategory] = useState(MOCK_MENU[0].category);
  const [isLiked, setIsLiked] = useState(false);

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
              <div className="space-y-1">
                {MOCK_MENU.map(category => (
                  <button
                    key={category.category}
                    onClick={() => {
                       setActiveCategory(category.category);
                       document.getElementById(category.category)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all text-sm
                      ${activeCategory === category.category 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {category.category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Category Navigation (Horizontal Scroll) */}
          <div className="md:hidden sticky top-20 z-30 bg-gray-50/95 backdrop-blur-md py-4 -mx-4 px-4 shadow-sm">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x">
              {MOCK_MENU.map(category => (
                <button
                  key={`mobile-${category.category}`}
                  onClick={() => {
                     setActiveCategory(category.category);
                     const el = document.getElementById(category.category);
                     if (el) {
                       const y = el.getBoundingClientRect().top + window.pageYOffset - 140;
                       window.scrollTo({top: y, behavior: 'smooth'});
                     }
                  }}
                  className={`snap-start px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm shadow-sm transition-all
                    ${activeCategory === category.category 
                      ? 'bg-primary-600 text-white border-primary-600' 
                      : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Contents - Menu Sections */}
          <div className="flex-1 space-y-10 lg:space-y-16">
            {MOCK_MENU.map((section, sIdx) => (
              <div key={section.category} id={section.category} className="scroll-mt-36">
                <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-6 font-outfit tracking-tight">
                  {section.category}
                </h2>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                  {section.items.map((item) => (
                    <FoodItemCard key={item.id} {...item} />
                  ))}
                </div>
                
                {sIdx !== MOCK_MENU.length - 1 && (
                  <div className="mt-10 h-px w-full bg-gray-200 max-w-sm mx-auto opacity-50 block xl:hidden" />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
