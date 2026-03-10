import { Star, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  tags: string[];
  offer?: string;
  isPromoted?: boolean;
}

export default function RestaurantCard({
  id,
  name,
  image,
  rating,
  deliveryTime,
  tags,
  offer,
  isPromoted
}: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${id}`} className="block group outline-none h-full">
      <div className="relative rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
        
        {/* Cover Image & Overlays */}
        <div className="relative h-48 sm:h-56 lg:h-64 w-full overflow-hidden shrink-0">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Top Tags */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-start">
            <div>
              {isPromoted && (
                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg">
                  Promoted
                </span>
              )}
            </div>
            <button 
              className="bg-white/30 hover:bg-white backdrop-blur-md p-2 rounded-full text-white hover:text-primary-500 transition-all shadow-sm focus:outline-none hover:scale-110" 
              onClick={(e) => { e.preventDefault(); }}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          {/* Bottom Tags */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end gap-2">
            {offer ? (
              <span className="bg-primary-600 text-white font-black text-sm sm:text-base lg:text-lg px-3 py-1.5 rounded-xl shadow-lg truncate max-w-[70%] border border-primary-500/50">
                {offer}
              </span>
            ) : <div/>}
            <div className="bg-white/95 backdrop-blur-sm text-gray-900 font-bold px-2.5 py-1.5 rounded-xl text-xs shadow-sm flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5 text-primary-600" /> {deliveryTime}
            </div>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col bg-white glass relative">
          <div className="flex justify-between items-start mb-2 gap-3">
            <h3 className="font-black text-xl text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 flex-1 font-outfit">
              {name}
            </h3>
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-lg shadow-sm shrink-0">
              <span className="text-xs font-black">{rating.toFixed(1)}</span>
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
          
          <div className="text-gray-500 text-sm mb-4 line-clamp-1 font-medium">
            {tags.join(', ')}
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100 border-dashed flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gray-50 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                <span className="text-gray-400 text-xs font-bold font-serif">₹</span>
              </div>
              <span className="text-gray-500 text-sm font-semibold truncate">₹200 for two</span>
            </div>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary-100 transition-all -translate-y-1 group-hover:translate-y-0">
              Order Now
            </span>
          </div>
        </div>
        
      </div>
    </Link>
  );
}
