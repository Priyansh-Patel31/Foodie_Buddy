import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleMenuItemApi } from '../../features/admin/adminSlice';
import { UtensilsCrossed, Eye, EyeOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManagerMenuPage() {
  const dispatch = useAppDispatch();
  const { menuItems } = useAppSelector(state => state.admin);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (item: any) => {
    dispatch(toggleMenuItemApi(item.id));
    toast.success(item.isAvailable ? `${item.name} marked OUT OF STOCK` : `${item.name} is now AVAILABLE`);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
            <UtensilsCrossed className="text-purple-600" size={32} /> Menu Controls
          </h1>
          <p className="text-gray-500 font-medium mt-1">Toggle item availability and view the live menu.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search dishes..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/60 border border-white/60 focus:ring-2 focus:ring-primary-500 outline-none font-bold shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => {
          const isOutOfStock = !item.isAvailable;
          return (
            <div key={item.id} className={`glass rounded-3xl overflow-hidden border shadow-lg transition-all hover:shadow-xl flex flex-col group relative ${isOutOfStock ? 'border-red-200 opacity-70' : 'border-white/50'}`}>
              <div className="h-40 w-full overflow-hidden relative">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-black text-gray-800 uppercase shadow-sm">
                  {item.category}
                </div>
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col bg-white/40">
                <h3 className="font-black text-lg text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>

                <div className="mt-3">
                  {item.toppings.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.toppings.map((t: any, idx: number) => (
                        <span key={idx} className="text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md border border-orange-200/50">+{t.inventoryItemName || t.name}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/60">
                  <span className="text-2xl font-black text-primary-600 tracking-tight">₹{item.price}</span>
                  <button
                    onClick={() => handleToggle(item)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all shadow-sm border ${
                      isOutOfStock
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    }`}
                  >
                    {isOutOfStock ? <Eye size={16} /> : <EyeOff size={16} />}
                    {isOutOfStock ? 'Restock' : 'Disable'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
