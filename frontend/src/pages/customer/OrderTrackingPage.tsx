import { useParams, Link } from 'react-router-dom';
import { Steps } from 'antd';
import { Check, ChefHat, Bike, MapPin, Phone, MessageSquare, AlertCircle, Star, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchAllOrders, rateOrderApi } from '../../features/admin/adminSlice';

// Map status to integer steps
const STATUS_STEPS: Record<string, number> = {
  PLACED: 0,
  CONFIRMED: 0,
  PREPARING: 1,
  READY: 1,
  PICKED_UP: 2,
  OUT_FOR_DELIVERY: 2,
  DELIVERED: 3,
  CANCELLED: -1
};

export default function OrderTrackingPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(state => state.admin);
  const [deliveryRatingInput, setDeliveryRatingInput] = useState(0);
  const [foodRatingInput, setFoodRatingInput] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const order = orders.find(o => o.id === id);

  // Poll for live status updates, but don't wipe a freshly placed order
  useEffect(() => {
    // Only fetch if we don't already have this order in the store
    if (!order) {
      dispatch(fetchAllOrders()).finally(() => setHasFetched(true));
    } else {
      setHasFetched(true);
    }
    // Poll every 5s for status updates (only after initial load)
    const interval = setInterval(() => dispatch(fetchAllOrders()), 5000);
    return () => clearInterval(interval);
  }, [dispatch, !order]); // re-run if order presence changes
  
  if (!hasFetched && !order) {
    return <div className="max-w-3xl mx-auto py-20 text-center font-bold text-gray-500">Loading Order Tracking...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find an order with ID: {id}</p>
        <Link to="/" className="bg-orange-500 text-white font-bold px-6 py-2 rounded-xl">Back to Menu</Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS[order.status] ?? 0;
  const isCancelled = order.status === 'CANCELLED';

  const steps = [
    {
      title: 'Order Placed',
      description: 'We have received your order',
      icon: <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 0 || isCancelled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}><Check className="w-4 h-4" /></div>
    },
    {
      title: 'Preparing',
      description: order.assignedChefName ? `Chef ${order.assignedChefName} is cooking` : 'Your food is being prepared',
      icon: <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}><ChefHat className="w-4 h-4" /></div>
    },
    {
      title: 'Out for Delivery',
      description: order.assignedDeliveryName ? `Rider ${order.assignedDeliveryName} is on the way` : 'Rider is on the way',
      icon: <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}><Bike className="w-4 h-4" /></div>
    },
    {
      title: 'Delivered',
      description: 'Enjoy your meal!',
      icon: <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}><MapPin className="w-4 h-4" /></div>
    }
  ];

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gray-50 border-b border-gray-100 p-6 sm:p-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-outfit">Order {order.id}</h1>
            {isCancelled ? (
              <p className="text-red-500 font-bold text-sm mt-1">Order Cancelled</p>
            ) : currentStep === 3 ? (
              <p className="text-green-600 font-bold text-sm mt-1">Order Delivered Successfully!</p>
            ) : (
              <p className="text-gray-500 text-sm mt-1">Arriving in <span className="font-black text-gray-900">25 mins</span></p>
            )}
          </div>
          <Link to="/my-orders" className="text-orange-600 font-bold hover:text-orange-700 hidden sm:block">View All</Link>
        </div>
        
        <div className="p-8 pb-12">
          {isCancelled ? (
            <div className="text-center py-10">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">This order was cancelled.</h3>
            </div>
          ) : (
            <Steps
              direction="vertical"
              current={currentStep}
              items={steps}
              className="tracking-steps"
            />
          )}
        </div>
      </div>

      {/* Order Bill Details */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
        <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
          Order Details
        </h2>
        <div className="space-y-4">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-sm">
                <div className="flex gap-3">
                  <div className="bg-orange-50 text-orange-600 font-black px-2 py-0.5 rounded-lg text-xs h-fit mt-0.5 border border-orange-100">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{item.menuItemName}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">₹{item.unitPrice} each</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">₹{item.totalPrice}</p>
              </div>
            ))
          ) : (
             <p className="text-sm text-gray-400 font-medium italic">Item details not available for this legacy order.</p>
          )}

          <div className="border-t border-gray-100 pt-4 mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Item Total</span>
              <span>₹{order.subtotal ?? order.charge}</span>
            </div>
            <div className="flex justify-between text-gray-500 font-medium">
              <span>Delivery Fee (based on distance)</span>
              <span>₹{order.deliveryFee ?? 0}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-gray-900 border-t border-dashed border-gray-200 pt-4 mt-4">
              <span>Grand Total</span>
              <span className="text-primary-600 font-outfit">₹{order.totalAmount ?? order.charge}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Delivery Driver Info Card or Rating Card */}
      {currentStep >= 2 && currentStep < 3 && order.assignedDeliveryName && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-xl font-black text-gray-500">
              {order.assignedDeliveryName.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg">{order.assignedDeliveryName}</h3>
              <p className="text-gray-500 text-sm font-medium">Delivery Partner (⭐ 4.8)</p>
            </div>
          </div>
          <div className="flex gap-2 text-orange-600 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none h-12 w-full sm:w-12 rounded-2xl bg-orange-50 flex items-center justify-center hover:bg-orange-100 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="flex-1 sm:flex-none h-12 w-full sm:w-12 rounded-2xl bg-orange-50 flex items-center justify-center hover:bg-orange-100 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* RATING SYSTEM AFTER DELIVERED */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Rate Your Experience</h2>
          
          {order.isRated ? (
            <div className="flex flex-col gap-6 items-center">
              <div className="text-center w-full max-w-sm bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="font-bold text-gray-900 mb-2">Delivery Partner: <span className="text-orange-600">{order.assignedDeliveryName || 'Driver'}</span></p>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={`d-${s}`} className={`w-6 h-6 ${(order.deliveryRating || 0) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              
              <div className="text-center w-full max-w-sm bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="font-bold text-gray-900 mb-2">Food Quality</p>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={`f-${s}`} className={`w-6 h-6 ${(order.foodRating || 0) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              
              <p className="text-green-600 font-bold mt-4 flex items-center gap-2">
                <Check className="w-5 h-5" /> Thank you for your feedback!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              <div className="text-center w-full max-w-sm p-4">
                <p className="font-bold text-gray-900 mb-3">Rate Delivery by <span className="text-orange-600">{order.assignedDeliveryName || 'Driver'}</span></p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={`d-btn-${s}`} 
                      onClick={() => setDeliveryRatingInput(s)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className={`w-8 h-8 ${deliveryRatingInput >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-center w-full max-w-sm p-4 border-t border-gray-100">
                <p className="font-bold text-gray-900 mb-3 mt-2">Rate the Food Quality</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={`f-btn-${s}`} 
                      onClick={() => setFoodRatingInput(s)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className={`w-8 h-8 ${foodRatingInput >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                disabled={deliveryRatingInput === 0 || foodRatingInput === 0 || submittingRating}
                onClick={async () => {
                  setSubmittingRating(true);
                  await dispatch(rateOrderApi({ orderId: order.id, deliveryRating: deliveryRatingInput, foodRating: foodRatingInput }));
                  setSubmittingRating(false);
                }}
                className={`w-full max-w-sm mt-4 px-6 py-4 rounded-xl font-bold text-white transition-all transform ${
                  deliveryRatingInput > 0 && foodRatingInput > 0 
                  ? 'bg-orange-600 hover:bg-orange-700 hover:-translate-y-1 hover:shadow-xl' 
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 text-center sm:hidden">
        <Link to="/my-orders" className="text-orange-600 font-bold hover:text-orange-700">View All Orders</Link>
      </div>
    </div>
  );
}

