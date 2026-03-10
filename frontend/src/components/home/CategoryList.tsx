import { CategorySkeleton } from '../common/LoadingSkeleton';

interface Category {
  id: string;
  name: string;
  image: string;
}

const CATEGORIES: Category[] = [
  { id: '1', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&auto=format&fit=crop&q=80' },
  { id: '5', name: 'Drinks', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=80' },
  { id: '6', name: 'Asian', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format&fit=crop&q=80' },
];

export default function CategoryList({ loading }: { loading: boolean }) {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight font-outfit">Inspiration for your first order</h2>
      </div>
      
      <div className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-6 hide-scrollbar snap-x">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`skel-cat-${i}`} className="flex-none snap-start">
              <CategorySkeleton />
            </div>
          ))
        ) : (
          CATEGORIES.map((category) => (
            <div key={category.id} className="flex flex-col items-center gap-4 cursor-pointer group flex-none snap-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 border-[3px] border-transparent group-hover:border-primary-500 p-1 relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 rounded-full"></div>
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <span className="font-bold text-gray-700 sm:text-lg group-hover:text-primary-600 transition-colors">
                {category.name}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
