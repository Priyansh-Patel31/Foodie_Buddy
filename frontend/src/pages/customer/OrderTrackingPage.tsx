import { useParams, Link } from 'react-router-dom';
import { Steps } from 'antd';
import { Check, ChefHat, Bike, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate order progress
  useEffect(() => {
    const intervals = [
      setTimeout(() => setCurrentStep(1), 3000),   // Preparing
      setTimeout(() => setCurrentStep(2), 6000),   // Out for delivery
      setTimeout(() => setCurrentStep(3), 10000)   // Delivered
    ];
    
    return () => intervals.forEach(i => clearTimeout(i));
  }, []);

  const steps = [
    {
      title: 'Order Placed',
      description: 'We have received your order',
      icon: <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}><Check className="w-4 h-4" /></div>
    },
    {
      title: 'Preparing',
      description: 'Your food is being prepared',
      icon: <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}><ChefHat className="w-4 h-4" /></div>
    },
    {
      title: 'Out for Delivery',
      description: 'Rider is on the way',
      icon: <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}><Bike className="w-4 h-4" /></div>
    },
    {
      title: 'Delivered',
      description: 'Enjoy your meal!',
      icon: <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}><MapPin className="w-4 h-4" /></div>
    }
  ];

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order #{id}</h1>
            <p className="text-gray-500 text-sm mt-1">Arriving in <span className="font-bold text-gray-900">25 mins</span></p>
          </div>
          <Link to="/" className="text-primary-600 font-semibold hover:text-primary-700">Need Help?</Link>
        </div>
        
        <div className="p-8 pb-12">
          <Steps
            direction="vertical"
            current={currentStep}
            items={steps}
            className="tracking-steps"
          />
        </div>
      </div>
      
      {currentStep >= 2 && currentStep < 3 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&q=80" alt="Rider" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Alex Johnson</h3>
              <p className="text-gray-500 text-sm">Delivery Partner (⭐ 4.8)</p>
            </div>
          </div>
          <div className="flex gap-2 text-primary-600">
            <button className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center hover:bg-primary-100 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center hover:bg-primary-100 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Link to="/" className="inline-block bg-gray-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
