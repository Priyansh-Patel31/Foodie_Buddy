import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addMenuItemApi, updateMenuItemApi, toggleMenuItemApi } from '../../features/admin/adminSlice';
import { Plus, Edit2, Image as ImageIcon, UtensilsCrossed, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMenuPage() {
  const dispatch = useAppDispatch();
  const { menuItems } = useAppSelector(state => state.admin);
  
  // Create / Edit Form State
  const [showAdd, setShowAdd] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeDishId, setActiveDishId] = useState<string | null>(null);

  const [dishData, setDishData] = useState({ name: '', price: '', category: '', description: '', imageUrl: '' });
  
  const handleToggle = (item: any) => {
    dispatch(toggleMenuItemApi(item.id));
    toast.success(item.isAvailable ? `${item.name} marked OUT OF STOCK` : `${item.name} is now AVAILABLE`);
  };
  
  // Dynamic Toppings Builder
  const [toppings, setToppings] = useState<{name: string, price: string}[]>([]);
  const [toppingInput, setToppingInput] = useState({name: '', price: ''});

  const addTopping = () => {
    if (toppingInput.name && toppingInput.price) {
      setToppings([...toppings, { name: toppingInput.name, price: toppingInput.price }]);
      setToppingInput({name: '', price: ''});
    }
  };

  const openEditor = (item: any) => {
    setActiveDishId(item.id);
    setDishData({
       name: item.name || '',
       price: item.price ? item.price.toString() : '',
       category: item.category || '',
       description: item.description || '',
       imageUrl: item.imageUrl || ''
    });
    
    // Safely map toppings whether they come from old dummy data or new backend ingredients
    const safeToppings = (item.toppings || []).map((t: any) => ({ 
      name: t.name || t.inventoryItemName || '', 
      price: t.price ? t.price.toString() : (t.quantityRequired ? t.quantityRequired.toString() : '0') 
    }));
    
    setToppings(safeToppings);
    setIsEditing(true);
    setShowAdd(true);
  };

  const closeForm = () => {
    setShowAdd(false);
    setIsEditing(false);
    setActiveDishId(null);
    setDishData({ name: '', price: '', category: '', description: '', imageUrl: '' });
    setToppings([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishData.name || !dishData.price) return;
    
    const finalItem = {
      name: dishData.name,
      price: Number(dishData.price),
      categoryName: dishData.category || 'Main Course',
      description: dishData.description || '',
      imageUrl: dishData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      isAvailable: true,
      isVegetarian: false,
      ingredients: toppings.map(t => ({ 
        inventoryItemName: t.name, 
        quantityRequired: Number(t.price) || 0 
      }))
    };

    if (isEditing && activeDishId) {
       dispatch(updateMenuItemApi({ id: activeDishId, item: finalItem }));
       toast.success('Dish thoroughly updated!');
    } else {
       dispatch(addMenuItemApi(finalItem));
       toast.success('New dish added to menu!');
    }
    closeForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 font-outfit">Menu Management</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-md transition-all"
        >
          <Plus size={20} /> Add New Dish
        </button>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl p-8 rounded-3xl border border-white/50 w-full max-w-4xl relative overflow-hidden my-auto">
            <button onClick={closeForm} className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors z-20"><X size={20}/></button>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-full -z-10 opacity-50 blur-xl"></div>
            
            <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-orange-500 mb-6">
              {isEditing ? 'Deep Edit Mode' : 'Create New Dish'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Dish Name</label>
                <input type="text" value={dishData.name} onChange={e => setDishData({...dishData, name: e.target.value})} required className="w-full mt-1 p-2.5 rounded-xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary-500 outline-none font-bold" placeholder="e.g. Masala Dosa" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                <input type="number" value={dishData.price} onChange={e => setDishData({...dishData, price: e.target.value})} required className="w-full mt-1 p-2.5 rounded-xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary-500 outline-none font-bold" placeholder="e.g. 150" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                <input type="text" value={dishData.category} onChange={e => setDishData({...dishData, category: e.target.value})} className="w-full mt-1 p-2.5 rounded-xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary-500 outline-none font-bold" placeholder="e.g. Breakfast" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><ImageIcon size={12}/> Image URL</label>
                <input type="text" value={dishData.imageUrl} onChange={e => setDishData({...dishData, imageUrl: e.target.value})} className="w-full mt-1 p-2.5 rounded-xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary-500 outline-none font-bold" placeholder="https://..." />
              </div>
               <div className="md:col-span-2 lg:col-span-4">
                <label className="text-xs font-bold text-gray-500 uppercase">Menu Description</label>
                <textarea value={dishData.description} onChange={e => setDishData({...dishData, description: e.target.value})} rows={2} className="w-full mt-1 p-2.5 rounded-xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary-500 outline-none font-medium resize-none" placeholder="Provide an appetizing description..." />
              </div>
            </div>

            <div className="p-4 bg-white/50 rounded-2xl border border-white/60 shadow-inner">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2"><UtensilsCrossed size={16} className="text-orange-500"/> Connect Extra Toppings</h3>
              <div className="flex gap-2 items-start mb-4">
                <input type="text" value={toppingInput.name} onChange={e => setToppingInput({...toppingInput, name: e.target.value})} placeholder="Topping Name (e.g. Extra Cheese)" className="flex-1 p-2 text-sm rounded-xl bg-white/80 border border-gray-200 outline-none font-bold"/>
                <input type="number" value={toppingInput.price} onChange={e => setToppingInput({...toppingInput, price: e.target.value})} placeholder="₹ Price" className="w-24 p-2 text-sm rounded-xl bg-white/80 border border-gray-200 outline-none font-bold"/>
                <button type="button" onClick={addTopping} className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-gray-700 shadow-md">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {toppings.map((t, i) => (
                  <div key={i} className="bg-orange-100/80 text-orange-800 text-[11px] font-black px-3 py-1.5 rounded-xl flex items-center gap-2 border border-orange-200/50">
                    {t.name} (₹{t.price})
                    <button type="button" onClick={() => setToppings(toppings.filter((_, idx) => idx !== i))} className="bg-orange-200/50 p-0.5 rounded-full hover:bg-red-200 text-red-600 transition-colors"><X size={12} /></button>
                  </div>
                ))}
                {toppings.length === 0 && <span className="text-xs text-gray-400 font-bold">No extra toppings mapped to this dish yet.</span>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="submit" className="bg-gradient-to-r from-orange-500 to-primary-600 hover:from-orange-600 hover:to-primary-700 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5">
                {isEditing ? 'Commit Menu Override' : 'Save Dish to Database'}
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map(item => {
          const isOutOfStock = !item.isAvailable;
          return (
          <div key={item.id} className={`glass rounded-3xl overflow-hidden border hover:shadow-xl transition-all flex flex-col group relative ${isOutOfStock ? 'border-red-200 opacity-70' : 'border-white/50'}`}>
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
            
            <div className="p-5 flex-1 flex flex-col relative z-10 bg-white/40">
              <h3 className="font-black text-xl text-gray-900 leading-tight pr-8">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[32px]">{item.description}</p>
              
              <div className="mt-3">
                {item.toppings.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {item.toppings.map((t: any, idx: number) => (
                      <span key={idx} className="text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md border border-orange-200/50">+{t.name || t.inventoryItemName}</span>
                    ))}
                  </div>
                ) : (
                   <span className="text-[10px] text-gray-400 font-bold tracking-wide">No extra toppings mapped</span>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/60">
                 <span className="text-2xl font-black text-primary-600 tracking-tight">₹{item.price}</span>
                 <button
                    onClick={() => handleToggle(item)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm border ${
                      isOutOfStock
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    }`}
                  >
                    {isOutOfStock ? <Eye size={14} /> : <EyeOff size={14} />}
                    {isOutOfStock ? 'Restock' : 'Disable'}
                  </button>
              </div>
              
              <button 
                onClick={() => openEditor(item)} 
                className="absolute right-4 bottom-[72px] text-gray-400 hover:text-white hover:bg-primary-500 p-2 bg-white rounded-xl shadow-sm transition-all border border-gray-100"
                title="Deep Edit Menu Item"
              >
                 <Edit2 size={16} />
              </button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
