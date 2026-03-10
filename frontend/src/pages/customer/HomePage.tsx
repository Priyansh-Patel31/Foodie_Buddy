import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setRestaurants, setLoading } from '../../features/restaurant/restaurantSlice';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import { RestaurantSkeleton } from '../../components/common/LoadingSkeleton';
import HeroSection from '../../components/home/HeroSection';
import CategoryList from '../../components/home/CategoryList';
import PromotionBanners from '../../components/home/PromotionBanners';

const MOCK_RESTAURANTS = [
  {
    id: 'r1',
    name: 'Pizza Hut',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80',
    rating: 4.2,
    deliveryTime: '30-40 min',
    tags: ['Pizza', 'Fast Food', 'Italian'],
    offer: '50% OFF up to ₹100',
    isPromoted: true
  },
  {
    id: 'r2',
    name: 'The Burger Joint',
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    deliveryTime: '25-35 min',
    tags: ['Burger', 'American', 'Beverages']
  },
  {
    id: 'r3',
    name: 'Green Bowl Recipes',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    deliveryTime: '20-30 min',
    tags: ['Healthy', 'Salads', 'Juices'],
    offer: 'Free Delivery'
  },
  {
    id: 'r4',
    name: 'Sweet Tooth Bakery',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872507?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    deliveryTime: '40-50 min',
    tags: ['Desserts', 'Bakery', 'Cakes']
  },
  {
    id: 'r5',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    deliveryTime: '35-45 min',
    tags: ['Asian', 'Sushi', 'Japanese'],
    offer: 'Flat ₹200 OFF'
  },
  {
    id: 'r6',
    name: 'Spicy Indian Curry',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    rating: 4.4,
    deliveryTime: '40-50 min',
    tags: ['Indian', 'Curry', 'Spicy']
  }
];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { restaurants, loading } = useAppSelector(state => state.restaurant);

  useEffect(() => {
    // Simulate API call
    dispatch(setLoading(true));
    const timer = setTimeout(() => {
      dispatch(setRestaurants(MOCK_RESTAURANTS));
      dispatch(setLoading(false));
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="w-full pb-20">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Category Chips Section */}
      <CategoryList loading={loading} />

      {/* 3. Promotional Banners */}
      <PromotionBanners />

      {/* 4. Main Restaurant Grid */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight font-outfit">
            Popular restaurants nearby
          </h2>
          <button className="text-primary-600 font-bold hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-xl transition-colors text-sm">
            View All
          </button>
        </div>
        
        {/* Updated Grid Layout: 1 col on mobile, 2 on tablet, 3 on lg, 4 on xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <RestaurantSkeleton key={`skel-rest-${i}`} />
            ))
          ) : (
            restaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
