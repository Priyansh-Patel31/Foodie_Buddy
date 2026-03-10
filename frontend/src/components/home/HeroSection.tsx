import { MapPin, Search } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80" 
          alt="Delicious food background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-2xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight mb-6 drop-shadow-lg font-outfit">
            Discover the Best Food <br className="hidden md:block" /> Near You
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-10 drop-shadow-md">
            Order from top restaurants, fast food, and cloud kitchens in your city with blazing fast delivery!
          </p>

          <div className="glass flex flex-col sm:flex-row items-center p-2 rounded-2xl sm:rounded-full gap-2 shadow-2xl">
            {/* Location Input */}
            <div className="flex items-center w-full sm:w-1/3 bg-white/90 rounded-xl sm:rounded-full px-4 py-3">
              <MapPin className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="City, Area or Street" 
                defaultValue="Tech Park, Block B"
                className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder-gray-500"
              />
            </div>
            
            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

            {/* Search Input */}
            <div className="flex items-center w-full sm:flex-1 bg-white/90 rounded-xl sm:rounded-full px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search for restaurants, cuisines..." 
                className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder-gray-500"
              />
            </div>

            <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl sm:rounded-full font-bold text-sm transition-colors shadow-lg shadow-primary-500/30">
              Find Food
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="text-sm font-semibold text-gray-300">Quick searches:</span>
            {['Pizza', 'Burger', 'Sushi', 'Biryani'].map((tag) => (
              <button 
                key={tag} 
                className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 transition-all hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
