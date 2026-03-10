import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/customer/HomePage';
import RestaurantDetailPage from './pages/customer/RestaurantDetailPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-tracking/:id" element={<OrderTrackingPage />} />
        </Route>
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div className="p-8 text-center text-2xl font-bold bg-white rounded-lg shadow-sm">Admin Dashboard</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
