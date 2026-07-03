import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ROLES } from './utils/constants';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages — Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminFinancialsPage from './pages/admin/AdminFinancialsPage';
import AdminPayrollPage from './pages/admin/AdminPayrollPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Dashboard Pages — Manager
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage';
import ManagerAnalyticsPage from './pages/manager/ManagerAnalyticsPage';
import ManagerOrdersPage from './pages/manager/ManagerOrdersPage';
import ManagerMenuPage from './pages/manager/ManagerMenuPage';
import ManagerStaffPage from './pages/manager/ManagerStaffPage';
import ManagerCRMPage from './pages/manager/ManagerCRMPage';
import ManagerReportsPage from './pages/manager/ManagerReportsPage';

// Staff Pages
import ChefDashboardPage from './pages/chef/ChefDashboardPage';
import DeliveryDashboardPage from './pages/delivery/DeliveryDashboardPage';

// Shared Pages
import ProfileAttendancePage from './pages/shared/ProfileAttendancePage';

function App() {
  const customerRegistrationEnabled = import.meta.env.VITE_CUSTOMER_REGISTRATION_ENABLED !== 'false';
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500 }
      }} />
      <Routes>
        {/* Public Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-tracking/:id" element={<OrderTrackingPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={customerRegistrationEnabled ? <RegisterPage /> : <Navigate to="/login" replace />} />

        {/* Protected Dashboard Routes */}
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/menu" element={<AdminMenuPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/accounts" element={<AdminFinancialsPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/payroll" element={<AdminPayrollPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/roster" element={<ManagerStaffPage />} />
        </Route>

        {/* Manager Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/manager" element={<ManagerDashboardPage />} />
          <Route path="/manager/analytics" element={<ManagerAnalyticsPage />} />
          <Route path="/manager/orders" element={<ManagerOrdersPage />} />
          <Route path="/manager/menu" element={<ManagerMenuPage />} />
          <Route path="/manager/staff" element={<ManagerStaffPage />} />
          <Route path="/manager/crm" element={<ManagerCRMPage />} />
          <Route path="/manager/reports" element={<ManagerReportsPage />} />
        </Route>

        {/* Chef Route */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.CHEF]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/kitchen" element={<ChefDashboardPage />} />
        </Route>

        {/* Delivery Route */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.DELIVERY]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/delivery" element={<DeliveryDashboardPage />} />
        </Route>

        {/* Shared Staff Profile / Attendance */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.CHEF, ROLES.DELIVERY, ROLES.WAITER, ROLES.CLEANER]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/profile" element={<ProfileAttendancePage />} />
          <Route path="/profile/:id" element={<ProfileAttendancePage />} />
        </Route>

        {/* Catch All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
