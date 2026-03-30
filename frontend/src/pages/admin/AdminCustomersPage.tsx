import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Users, X, MessageSquareQuote, Bike, Star } from 'lucide-react';

export default function AdminCustomersPage() {
  const { users, orders } = useAppSelector(state => state.admin);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Filter only customers and sort by dynamically calculated spending
  const customers = users
    .filter(u => u.role === 'ROLE_CUSTOMER')
    .map(customer => {
      const cOrders = orders.filter(o => o.customerId === customer.id);
      const computedTotalSpent = cOrders.reduce((sum, o) => sum + (o.charge || 0), 0);
      return { ...customer, computedTotalSpent };
    })
    .sort((a, b) => b.computedTotalSpent - a.computedTotalSpent);

  const activeCustomerObj = customers.find(c => c.id === selectedCustomer);
  const customerOrders = orders.filter(o => o.customerId === selectedCustomer);

  const renderStars = (rating?: number) => {
     if (!rating) return <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Rating</span>;
     
     const fullStars = Math.floor(rating);
     const stars = [];
     for (let i=0; i<5; i++) {
        stars.push(
          <Star key={i} size={14} className={i < fullStars ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
        );
     }
     return (
       <div className="flex items-center gap-1">
          <div className="flex">{stars}</div>
          <span className="text-xs font-black text-gray-700">{rating.toFixed(1)}</span>
       </div>
     );
  };

  return (
    <div className="space-y-6 relative animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
          <Users className="text-blue-600" size={32} /> Customer CRM
        </h1>
        <p className="text-gray-500 font-medium">Click on a customer profile to execute a deep dive into their order history and internal reviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {customers.map(customer => (
          <div 
            key={customer.id} 
            onClick={() => setSelectedCustomer(customer.id)}
            className="glass shadow-lg rounded-3xl p-6 border border-white/60 hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-4 relative overflow-hidden group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 text-lg truncate pr-10">{customer.name}</h3>
              <p className="text-xs text-gray-400 font-semibold truncate">{customer.email}</p>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="text-[10px] font-black uppercase text-green-700 bg-green-100/80 px-2 py-0.5 rounded border border-green-200 truncate">
                  Life Value: ₹{customer.computedTotalSpent?.toLocaleString()}
                </div>
                {renderStars(customer.customerRating)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep-Dive Modal */}
      {selectedCustomer && activeCustomerObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div className="glass shadow-2xl rounded-3xl w-full max-w-4xl border border-white p-8 relative z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedCustomer(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/50 text-gray-500">
              <X size={20} />
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pr-12 border-b border-gray-100 pb-6">
               <div>
                 <h2 className="text-3xl font-black text-gray-900">{activeCustomerObj.name}'s Profile</h2>
                 <div className="flex items-center gap-4 mt-2 text-sm font-bold text-gray-400">
                   <p>UID: {activeCustomerObj.id}</p>
                   <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> 
                   <p className="text-green-600">Lifetime: ₹{activeCustomerObj.computedTotalSpent?.toLocaleString()}</p>
                   <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                   {renderStars(activeCustomerObj.customerRating)}
                 </div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
               <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl relative shadow-sm">
                  <MessageSquareQuote className="text-blue-200 absolute top-4 right-4" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Customer Feedback</p>
                  <p className="text-sm font-medium text-gray-800 italic relative z-10">"{activeCustomerObj.customerReview || 'No review submitted.'}"</p>
               </div>
               
               <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl relative shadow-sm">
                  <Bike className="text-orange-200 absolute top-4 right-4" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-2">Delivery Partner's Review</p>
                  <p className="text-sm font-medium text-gray-800 italic relative z-10">"{activeCustomerObj.deliveryReview || 'No internal note.'}"</p>
               </div>
            </div>

            <h3 className="text-lg font-black text-gray-800 mb-4 tracking-wide flex items-center justify-between">
               Detailed Order History
               <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-lg">Total: {customerOrders.length}</span>
            </h3>
            
            <div className="space-y-3">
              {customerOrders.map(order => (
                <div key={order.id} className="bg-white/60 p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-sm hover:shadow-md transition-all group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-800 text-lg">{order.id}</p>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-1">Status: <span className="font-black text-gray-900">{order.status}</span></p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Manager: {order.manager} | Chef: {order.assignedChefName || 'N/A'} | Driver: {order.assignedDeliveryName || 'N/A'}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-6 bg-gray-50/50 p-3 sm:bg-transparent sm:p-0 rounded-xl">
                    <div className="text-left sm:text-right border-r border-gray-200 pr-4 sm:pr-6 opacity-90 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Rating</p>
                      {renderStars(order.orderRating)}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-primary-600">₹{order.charge}</p>
                      <p className="text-[10px] uppercase font-bold text-green-500">Margin: +₹{order.profit}</p>
                    </div>
                  </div>
                </div>
              ))}
              {customerOrders.length === 0 && (
                 <div className="text-center font-bold text-gray-400 p-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    No specific orders mapped to this user yet.
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
