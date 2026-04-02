import { ArrowRight } from 'lucide-react';

export default function PromotionBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Banner 1 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 p-8 sm:p-10 text-white shadow-xl shadow-primary-500/20 group cursor-pointer h-64 flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110 duration-700"></div>
          
          <div className="relative z-10 w-2/3">
            <span className="uppercase tracking-widest text-primary-200 font-bold text-xs mb-2 block">First Order</span>
            <h3 className="text-3xl sm:text-4xl font-black mb-3 leading-tight font-outfit">Free Delivery On First Order!</h3>
            <button className="flex items-center gap-2 text-sm font-bold bg-white text-primary-600 px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors w-max shadow-md">
              Order Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-end pointer-events-none pr-4 pb-4">
             <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white/20 backdrop-blur-md rounded-full border border-white/30 rotate-12 flex items-center justify-center text-6xl shadow-2xl group-hover:rotate-0 transition-transform duration-500">🍔</div>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-accent-500 to-accent-600 p-8 sm:p-10 text-white shadow-xl shadow-accent-500/20 group cursor-pointer h-64 flex flex-col justify-center">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-10 -mb-10 blur-2xl transition-transform group-hover:scale-110 duration-700"></div>
          
          <div className="relative z-10 w-2/3">
            <span className="uppercase tracking-widest text-accent-100 font-bold text-xs mb-2 block">Weekend Deal</span>
            <h3 className="text-3xl sm:text-4xl font-black mb-3 leading-tight font-outfit">Up to 50% Off Desserts</h3>
            <button className="flex items-center gap-2 text-sm font-black btn-glass px-5 py-2.5 rounded-full w-max shadow-md transition-all hover:scale-105 active:scale-95">
              Explore Deals <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end justify-end pointer-events-none pr-4 pb-4">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white/20 backdrop-blur-md rounded-full border border-white/30 -rotate-12 flex items-center justify-center text-6xl shadow-2xl group-hover:-rotate-0 transition-transform duration-500">🍦</div>
          </div>
        </div>
      </div>
    </section>
  );
}
