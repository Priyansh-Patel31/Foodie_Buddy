import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Steps } from 'antd';
import { MapPin, CreditCard, CheckCircle2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearCart } from '../../features/cart/cartSlice';
import { placeOrderApi } from '../../features/admin/adminSlice';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, subtotal, deliveryFee } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.auth);
  
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    toast.loading('Processing your order...', { id: 'checkout' });
    
    try {
      // Map cart items to backend DTO format
      const orderItems = items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // Simulate address extraction from form
      const address = localStorage.getItem('foodieBuddyLocation') || "Block A, Silicon Valley Apartments, Near Main Road";

      // Call the real API thunk
      const resultAction = await dispatch(placeOrderApi({
        items: orderItems,
        customerAddress: address,
        customerPhone: user?.id || 'GUEST',
        // other fields like coords can go here in future
      }));

      if (placeOrderApi.fulfilled.match(resultAction)) {
        const orderId = resultAction.payload.id;
        dispatch(clearCart());
        toast.dismiss('checkout');
        toast.success('Order placed successfully!', { id: 'checkout-success' });
        navigate(`/order-tracking/${orderId}`);
      } else {
        toast.dismiss('checkout');
        toast.error('Failed to place order.');
      }
    } catch (e) {
      toast.dismiss('checkout');
      toast.error('Something went wrong.');
    }
  };

  const steps = [
    {
      title: 'Delivery Address',
      icon: <MapPin className="w-5 h-5" />,
      content: (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" defaultValue="Priyansh" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" defaultValue="Patel" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" defaultValue="+91 9876543210" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
              <textarea rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" defaultValue="Block A, Silicon Valley Apartments, Near Main Road"></textarea>
            </div>
            
            <button 
              type="button"
              onClick={() => setCurrentStep(1)}
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl mt-4 hover:bg-gray-800 transition-colors"
            >
              Save Address & Proceed
            </button>
          </form>
        </div>
      )
    },
    {
      title: 'Payment',
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h3>
          
          <div className="space-y-3">
            <div 
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'upi' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center">
                  <span className="font-bold text-sm text-green-600">UPI</span>
                </div>
                <div className="font-semibold text-gray-800">Add New UPI ID</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary-600' : 'border-gray-300'}`}>
                {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
              </div>
            </div>

            <div 
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center text-blue-600">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="font-semibold text-gray-800">Credit / Debit Card</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
                  </div>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="space-y-3 mt-2 animate-in fade-in slide-in-from-top-2">
                    <input type="text" placeholder="Card Number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
                      <input type="text" placeholder="CVV" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div 
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 border rounded-xl cursor-pointer flex items-center justify-between transition-all ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center text-gray-700">
                  <span className="font-black">₹</span>
                </div>
                <div className="font-semibold text-gray-800">Cash on Delivery</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary-600' : 'border-gray-300'}`}>
                {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setCurrentStep(0)}
              className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={() => setCurrentStep(2)}
              className="flex-1 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Review Order
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Confirm',
      icon: <CheckCircle2 className="w-5 h-5" />,
      content: (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center py-10">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Ready to Place Order?</h3>
          <p className="text-gray-500 mb-8 text-center max-w-sm">
            You are placing an order for {items.length} items. Total amount to pay is <span className="font-bold text-gray-900">₹{total}</span> via {paymentMethod.toUpperCase()}.
          </p>
          
          <div className="flex gap-4 w-full max-w-sm">
            <button 
              onClick={() => setCurrentStep(1)}
              className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handlePlaceOrder}
              className="flex-1 bg-primary-600 text-white font-bold py-3.5 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
            >
              Place Order
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Checkout Steps */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Steps current={currentStep} items={steps.map(s => ({ title: s.title, icon: s.icon }))} />
        </div>
        
        <div className="transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
          {steps[currentStep].content}
        </div>
      </div>

      {/* Order Summary Line */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Order Summary</h3>
          </div>
          
          <div className="p-4 max-h-[400px] overflow-y-auto space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start gap-4 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium">{item.quantity} x</span>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-600 shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Item Total</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-black text-lg pt-3 border-t border-gray-200">
              <span>To Pay</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
