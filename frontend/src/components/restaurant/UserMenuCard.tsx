import { Star } from 'lucide-react';

export interface UserMenuCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVegetarian?: boolean;
  isBestseller?: boolean;
  rating?: number;
  votes?: number;
  onCustomize: () => void;
}

export default function UserMenuCard({
  name,
  description,
  price,
  image,
  isVegetarian = true,
  isBestseller,
  rating,
  votes,
  onCustomize,
}: UserMenuCardProps) {
  return (
    <div className="flex gap-4 sm:gap-5 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-orange-100 transition-all duration-300 group">
      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Veg/Non-veg badge + Bestseller */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${isVegetarian ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isVegetarian ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
          {isBestseller && (
            <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-widest border border-amber-200">
              Bestseller
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-extrabold text-gray-900 text-base sm:text-lg leading-tight mb-0.5 font-outfit group-hover:text-orange-600 transition-colors">
          {name}
        </h3>

        {/* Price */}
        <p className="font-black text-gray-800 text-sm mb-1">₹{price}</p>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5 text-green-700 font-bold text-[11px] bg-green-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-current" />
              <span>{rating.toFixed(1)}</span>
            </div>
            {votes && (
              <span className="text-gray-400 text-[11px] font-medium">({votes.toLocaleString()})</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mt-auto">
          {description}
        </p>
      </div>

      {/* Image + Button */}
      <div className="w-28 sm:w-36 shrink-0 flex flex-col items-center">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow mb-[-18px]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Customise Button */}
        <button
          onClick={onCustomize}
          className="relative z-10 bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-black text-xs uppercase tracking-widest px-5 py-2 rounded-xl shadow-lg transition-all duration-200 hover:shadow-orange-200"
        >
          Customise
        </button>
      </div>
    </div>
  );
}
