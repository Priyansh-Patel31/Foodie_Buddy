import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { closeCart } from '../features/cart/cartSlice';
import { fetchAdminData } from '../features/admin/adminSlice';
import { useEffect } from 'react';

export default function CustomerLayout() {
  const isCartOpen = useAppSelector(state => state.cart.isOpen);
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);

  // Always fetch fresh data on mount, role change & refresh periodically
  useEffect(() => {
    dispatch(fetchAdminData());
    const interval = setInterval(() => dispatch(fetchAdminData()), 30000);
    return () => clearInterval(interval);
  }, [dispatch, user?.role]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      
      <main className="flex-1 w-full flex flex-col mx-auto w-full">
        <Outlet />
      </main>

      <Footer />
      
      <CartDrawer isOpen={isCartOpen} onClose={() => dispatch(closeCart())} />
    </div>
  );
}
