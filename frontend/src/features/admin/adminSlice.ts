import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// ========================== TYPES ==========================
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryName: string;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  toppings: any[];
}

export interface OrderData {
  id: string;
  customerId: string;
  customerName: string;
  status: string;
  charge: number;
  profit: number;
  deliveryAddress: string;
  assignedChefId: string;
  assignedChefName: string;
  assignedDeliveryId: string;
  assignedDeliveryName: string;
  manager: string;
  date: string;
  orderRating?: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  baseSalary: number;
  leavesTaken: number;
  totalSpent?: number;
  customerRating?: number;
  customerReview?: string;
  deliveryReview?: string;
}

export interface TransactionData {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

// ========================== FALLBACK DUMMY DATA ==========================
// This data is used when the backend API is NOT reachable.
// When the backend IS running, DataInitializer.java seeds this same data into MongoDB permanently.

const FALLBACK_MENU: MenuItem[] = [
  { id: 'm1', name: 'Truffle Pasta', price: 450, category: 'Main Course', categoryName: 'Main Course', description: 'Creamy black truffle pasta with parmesan.', imageUrl: 'https://images.unsplash.com/photo-1621996316514-14ebd679f291?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: true, toppings: [] },
  { id: 'm2', name: 'Margherita Pizza', price: 300, category: 'Main Course', categoryName: 'Main Course', description: 'Classic stone-fired mozzarella pizza.', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: true, toppings: [] },
  { id: 'm3', name: 'Garlic Bread', price: 150, category: 'Breads', categoryName: 'Breads', description: 'Roasted garlic butter bread sticks.', imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: true, toppings: [] },
  { id: 'm4', name: 'Butter Chicken', price: 380, category: 'Main Course', categoryName: 'Main Course', description: 'Rich tomato-based curry with tender chicken.', imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: false, toppings: [] },
  { id: 'm5', name: 'Caesar Salad', price: 220, category: 'Starters', categoryName: 'Starters', description: 'Crispy romaine with Caesar dressing and croutons.', imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: true, toppings: [] },
  { id: 'm6', name: 'Chocolate Lava Cake', price: 280, category: 'Desserts', categoryName: 'Desserts', description: 'Warm molten chocolate cake with vanilla ice cream.', imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: true, toppings: [] },
  { id: 'm7', name: 'Paneer Tikka', price: 260, category: 'Starters', categoryName: 'Starters', description: 'Chargrilled cottage cheese with spices.', imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: true, toppings: [] },
  { id: 'm8', name: 'Masala Chai', price: 60, category: 'Beverages', categoryName: 'Beverages', description: 'Authentic Indian spiced tea.', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: true, toppings: [] },
  { id: 'm9', name: 'Chicken Biryani', price: 349, category: 'Rice & Biryani', categoryName: 'Rice & Biryani', description: 'Fragrant basmati rice with spiced chicken.', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: false, toppings: [] },
  { id: 'm10', name: 'Paneer Butter Masala', price: 299, category: 'Main Course', categoryName: 'Main Course', description: 'Rich paneer in buttery gravy.', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80', isAvailable: true, isVegetarian: true, toppings: [] },
];

const FALLBACK_ORDERS: OrderData[] = [
  { id: 'ORD-001', customerId: 'U1', customerName: 'Happy Customer', status: 'DELIVERED', charge: 900, profit: 350, deliveryAddress: 'Block A, Tech Park', assignedChefId: '3', assignedChefName: 'Head Chef', assignedDeliveryId: '4', assignedDeliveryName: 'Delivery Partner', manager: 'Restaurant Manager', date: '2026-03-29T10:00:00', orderRating: 5 },
  { id: 'ORD-002', customerId: 'U2', customerName: 'Alice Smith', status: 'PREPARING', charge: 450, profit: 200, deliveryAddress: '7th Avenue, Sector 12', assignedChefId: '3', assignedChefName: 'Head Chef', assignedDeliveryId: '', assignedDeliveryName: '', manager: 'Restaurant Manager', date: '2026-03-29T12:00:00', orderRating: 4 },
  { id: 'ORD-003', customerId: 'U1', customerName: 'Happy Customer', status: 'DELIVERED', charge: 1550, profit: 450, deliveryAddress: 'Block A, Tech Park', assignedChefId: '5', assignedChefName: 'Sous Chef', assignedDeliveryId: '4', assignedDeliveryName: 'Delivery Partner', manager: 'Admin User', date: '2026-02-14T19:00:00', orderRating: 5 },
  { id: 'ORD-004', customerId: 'U3', customerName: 'Tom Hanks', status: 'DELIVERED', charge: 2100, profit: 800, deliveryAddress: 'Downtown Square', assignedChefId: '3', assignedChefName: 'Head Chef', assignedDeliveryId: '6', assignedDeliveryName: 'Rider Two', manager: 'Restaurant Manager', date: '2025-12-25T20:00:00', orderRating: 3 },
  { id: 'ORD-005', customerId: 'U4', customerName: 'Priya Sharma', status: 'OUT_FOR_DELIVERY', charge: 780, profit: 290, deliveryAddress: 'MG Road, Indira Nagar', assignedChefId: '5', assignedChefName: 'Sous Chef', assignedDeliveryId: '4', assignedDeliveryName: 'Delivery Partner', manager: 'Restaurant Manager', date: '2026-03-29T16:30:00' },
  { id: 'ORD-006', customerId: 'U5', customerName: 'Raj Patel', status: 'PREPARING', charge: 560, profit: 180, deliveryAddress: 'Jubilee Hills', assignedChefId: '3', assignedChefName: 'Head Chef', assignedDeliveryId: '', assignedDeliveryName: '', manager: 'Restaurant Manager', date: '2026-03-29T17:00:00' },
  { id: 'ORD-007', customerId: 'U6', customerName: 'Sneha Iyer', status: 'DELIVERED', charge: 1200, profit: 500, deliveryAddress: 'Banjara Hills', assignedChefId: '5', assignedChefName: 'Sous Chef', assignedDeliveryId: '6', assignedDeliveryName: 'Rider Two', manager: 'Restaurant Manager', date: '2026-03-28T13:00:00', orderRating: 5 },
  { id: 'ORD-008', customerId: 'U2', customerName: 'Alice Smith', status: 'DELIVERED', charge: 340, profit: 120, deliveryAddress: '7th Avenue, Sector 12', assignedChefId: '3', assignedChefName: 'Head Chef', assignedDeliveryId: '4', assignedDeliveryName: 'Delivery Partner', manager: 'Admin User', date: '2026-03-27T11:00:00', orderRating: 4 },
  { id: 'ORD-009', customerId: 'U4', customerName: 'Priya Sharma', status: 'DELIVERED', charge: 680, profit: 250, deliveryAddress: 'MG Road, Indira Nagar', assignedChefId: '5', assignedChefName: 'Sous Chef', assignedDeliveryId: '6', assignedDeliveryName: 'Rider Two', manager: 'Restaurant Manager', date: '2026-03-20T13:00:00', orderRating: 5 },
  { id: 'ORD-010', customerId: 'U3', customerName: 'Tom Hanks', status: 'DELIVERED', charge: 990, profit: 380, deliveryAddress: 'Downtown Square', assignedChefId: '3', assignedChefName: 'Head Chef', assignedDeliveryId: '4', assignedDeliveryName: 'Delivery Partner', manager: 'Restaurant Manager', date: '2026-01-15T18:00:00', orderRating: 4 },
  { id: 'ORD-011', customerId: 'U5', customerName: 'Raj Patel', status: 'DELIVERED', charge: 1450, profit: 600, deliveryAddress: 'Jubilee Hills', assignedChefId: '5', assignedChefName: 'Sous Chef', assignedDeliveryId: '6', assignedDeliveryName: 'Rider Two', manager: 'Admin User', date: '2025-11-10T12:00:00', orderRating: 5 },
  { id: 'ORD-012', customerId: 'U6', customerName: 'Sneha Iyer', status: 'DELIVERED', charge: 2800, profit: 1100, deliveryAddress: 'Banjara Hills', assignedChefId: '3', assignedChefName: 'Head Chef', assignedDeliveryId: '4', assignedDeliveryName: 'Delivery Partner', manager: 'Restaurant Manager', date: '2025-10-05T19:00:00', orderRating: 4 },
];

const FALLBACK_USERS: UserData[] = [
  { id: '1', name: 'Admin User', email: 'admin@foodie.com', role: 'ROLE_ADMIN', baseSalary: 80000, leavesTaken: 0 },
  { id: '2', name: 'Restaurant Manager', email: 'manager@foodie.com', role: 'ROLE_MANAGER', baseSalary: 60000, leavesTaken: 1 },
  { id: '3', name: 'Head Chef', email: 'chef@foodie.com', role: 'ROLE_CHEF', baseSalary: 50000, leavesTaken: 4 },
  { id: '4', name: 'Delivery Partner', email: 'delivery@foodie.com', role: 'ROLE_DELIVERY', baseSalary: 25000, leavesTaken: 2 },
  { id: '5', name: 'Sous Chef', email: 'souschef@foodie.com', role: 'ROLE_CHEF', baseSalary: 35000, leavesTaken: 1 },
  { id: '6', name: 'Rider Two', email: 'rider2@foodie.com', role: 'ROLE_DELIVERY', baseSalary: 22000, leavesTaken: 0 },
  { id: 'U1', name: 'Happy Customer', email: 'customer@foodie.com', role: 'ROLE_CUSTOMER', baseSalary: 0, leavesTaken: 0, totalSpent: 2450, customerRating: 4.8, customerReview: 'Amazing food, incredibly fast delivery!', deliveryReview: 'Very polite customer.' },
  { id: 'U2', name: 'Alice Smith', email: 'alice@foodie.com', role: 'ROLE_CUSTOMER', baseSalary: 0, leavesTaken: 0, totalSpent: 900, customerRating: 3.5, customerReview: 'Food was slightly cold but tasted great.', deliveryReview: 'Took 10 minutes to answer.' },
  { id: 'U3', name: 'Tom Hanks', email: 'tom@movie.com', role: 'ROLE_CUSTOMER', baseSalary: 0, leavesTaken: 0, totalSpent: 3090, customerRating: 5.0, customerReview: 'Perfect catering for my office party.', deliveryReview: 'Gave a generous ₹500 tip.' },
  { id: 'U4', name: 'Priya Sharma', email: 'priya@gmail.com', role: 'ROLE_CUSTOMER', baseSalary: 0, leavesTaken: 0, totalSpent: 1460, customerRating: 4.5, customerReview: 'The butter chicken is to die for!', deliveryReview: 'Easy drop-off.' },
  { id: 'U5', name: 'Raj Patel', email: 'raj@outlook.com', role: 'ROLE_CUSTOMER', baseSalary: 0, leavesTaken: 0, totalSpent: 2010, customerRating: 4.0, customerReview: 'Great variety on the menu!', deliveryReview: 'Always orders in bulk.' },
  { id: 'U6', name: 'Sneha Iyer', email: 'sneha@yahoo.com', role: 'ROLE_CUSTOMER', baseSalary: 0, leavesTaken: 0, totalSpent: 4000, customerRating: 4.9, customerReview: 'I order almost every weekend!', deliveryReview: 'VIP customer.' },
];

const FALLBACK_TRANSACTIONS: TransactionData[] = [
  { id: 't1', type: 'ORDER_REVENUE', amount: 1200, description: 'Order Revenue ORD-005', date: '2026-03-28T10:00:00' },
  { id: 't2', type: 'ORDER_REVENUE', amount: 450, description: 'Order Revenue ORD-006', date: '2026-03-20T12:00:00' },
  { id: 't3', type: 'PAYROLL', amount: -65000, description: 'Staff Payroll (March)', date: '2026-03-01T09:00:00' },
  { id: 't4', type: 'ORDER_REVENUE', amount: 3200, description: 'Bulk Catering Revenue', date: '2026-03-05T14:00:00' },
  { id: 't5', type: 'ORDER_REVENUE', amount: 950, description: 'Order Revenue ORD-099', date: '2026-02-28T11:00:00' },
  { id: 't6', type: 'PAYROLL', amount: -65000, description: 'Staff Payroll (February)', date: '2026-02-25T09:00:00' },
  { id: 't7', type: 'ORDER_REVENUE', amount: 2400, description: 'Valentine Day Special', date: '2026-02-14T20:00:00' },
  { id: 't8', type: 'ORDER_REVENUE', amount: 800, description: 'Weekend Orders', date: '2026-02-07T18:00:00' },
  { id: 't9', type: 'PAYROLL', amount: -64000, description: 'Staff Payroll (January)', date: '2026-01-30T09:00:00' },
  { id: 't10', type: 'ORDER_REVENUE', amount: 15400, description: 'New Year Bash Profits', date: '2026-01-01T22:00:00' },
  { id: 't11', type: 'PAYROLL', amount: -70000, description: 'Staff Payroll + Bonuses (Dec)', date: '2025-12-31T09:00:00' },
  { id: 't12', type: 'ORDER_REVENUE', amount: 45000, description: 'Christmas Dinner Gala', date: '2025-12-25T21:00:00' },
  { id: 't13', type: 'ORDER_REVENUE', amount: 12000, description: 'Corporate Booking', date: '2025-12-10T14:00:00' },
  { id: 't14', type: 'ORDER_REVENUE', amount: 30000, description: 'Diwali Celebration Week', date: '2025-10-20T19:00:00' },
  { id: 't15', type: 'PAYROLL', amount: -60000, description: 'Staff Payroll (October)', date: '2025-10-31T09:00:00' },
  { id: 't16', type: 'ORDER_REVENUE', amount: 150000, description: 'Store Launch Celebration', date: '2025-05-01T12:00:00' },
];

// ========================== ASYNC THUNKS ==========================

export const fetchAllMenu = createAsyncThunk('admin/fetchMenu', async () => {
  const res = await apiClient.get('/admin/menu');
  return res.data.data || res.data;
});

export const fetchAllOrders = createAsyncThunk('admin/fetchOrders', async () => {
  const res = await apiClient.get('/admin/orders');
  return res.data.data || res.data;
});

export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const res = await apiClient.get('/admin/users');
  return res.data.data || res.data;
});

export const fetchTransactions = createAsyncThunk('admin/fetchTransactions', async () => {
  const res = await apiClient.get('/admin/financials/transactions');
  return res.data.data || res.data;
});

export const fetchDashboardStats = createAsyncThunk('admin/fetchDashboard', async () => {
  const res = await apiClient.get('/admin/dashboard');
  return res.data.data || res.data;
});

// Combined fetch — tries API first, falls back to dummy data if API is down
export const fetchAdminData = createAsyncThunk('admin/fetchAll', async (_, { dispatch }) => {
  const results = await Promise.allSettled([
    dispatch(fetchAllMenu()),
    dispatch(fetchAllOrders()),
    dispatch(fetchAllUsers()),
    dispatch(fetchTransactions()),
  ]);

  // Check if all failed (backend is down) → load fallback data
  const allFailed = results.every(r => {
    if (r.status === 'fulfilled') {
      const action = r.value as any;
      return action?.error !== undefined;
    }
    return true;
  });

  if (allFailed) {
    return 'FALLBACK';
  }
  return 'API';
});

// Mutation thunks
export const addMenuItemApi = createAsyncThunk('admin/addMenuItem', async (item: any) => {
  try {
    const res = await apiClient.post('/admin/menu', item);
    return res.data.data || res.data;
  } catch {
    return { ...item, id: `fallback-${Date.now()}` };
  }
});

export const updateMenuItemApi = createAsyncThunk('admin/updateMenuItem', async ({ id, item }: { id: string; item: any }, { getState }) => {
  try {
    const res = await apiClient.put(`/admin/menu/${id}`, item);
    return res.data.data || res.data;
  } catch {
    const state = getState() as any;
    const existing = state.admin.menuItems.find((i: any) => i.id === id);
    if (existing) return { ...existing, ...item };
    throw new Error('Item not found');
  }
});

export const deleteMenuItemApi = createAsyncThunk('admin/deleteMenuItem', async (id: string) => {
  try {
    await apiClient.delete(`/admin/menu/${id}`);
    return id;
  } catch {
    return id;
  }
});

export const toggleMenuItemApi = createAsyncThunk('admin/toggleMenuItem', async (id: string, { getState }) => {
  try {
    const res = await apiClient.put(`/admin/menu/${id}/toggle`);
    return res.data.data || res.data;
  } catch {
    // Fallback: toggle locally if backend is down
    const state = getState() as any;
    const item = state.admin.menuItems.find((i: any) => i.id === id);
    if (item) return { ...item, isAvailable: !item.isAvailable };
    throw new Error('Item not found');
  }
});

export const updateUserRoleApi = createAsyncThunk('admin/updateUserRole', async ({ id, newRole }: { id: string; newRole: string }, { getState }) => {
  try {
    const res = await apiClient.put(`/admin/users/${id}/role`, { role: newRole });
    return res.data.data || res.data;
  } catch {
    const state = getState() as any;
    const user = state.admin.users.find((u: any) => u.id === id);
    if (user) return { ...user, role: newRole };
    throw new Error('User not found');
  }
});

export const updateSalaryApi = createAsyncThunk('admin/updateSalary', async ({ id, baseSalary }: { id: string; baseSalary: number }, { getState }) => {
  try {
    const res = await apiClient.put(`/admin/users/${id}/salary`, { baseSalary });
    return res.data.data || res.data;
  } catch {
    const state = getState() as any;
    const user = state.admin.users.find((u: any) => u.id === id);
    if (user) return { ...user, baseSalary };
    throw new Error('User not found');
  }
});

export const updateLeavesApi = createAsyncThunk('admin/updateLeaves', async ({ id, leavesTaken }: { id: string; leavesTaken: number }, { getState }) => {
  try {
    const res = await apiClient.put(`/admin/users/${id}/leaves`, { leavesTaken });
    return res.data.data || res.data;
  } catch {
    const state = getState() as any;
    const user = state.admin.users.find((u: any) => u.id === id);
    if (user) return { ...user, leavesTaken };
    throw new Error('User not found');
  }
});

export const assignChefApi = createAsyncThunk('admin/assignChef', async ({ orderId, userId, userName }: { orderId: string; userId: string; userName: string }, { getState }) => {
  try {
    const res = await apiClient.put(`/admin/orders/${orderId}/assign-chef/${userId}`);
    return res.data.data || res.data;
  } catch {
    const state = getState() as any;
    const order = state.admin.orders.find((o: any) => o.id === orderId);
    if (order) return { ...order, assignedChefId: userId, assignedChefName: userName };
    throw new Error('Order not found');
  }
});

export const assignDeliveryApi = createAsyncThunk('admin/assignDelivery', async ({ orderId, userId, userName }: { orderId: string; userId: string; userName: string }, { getState }) => {
  try {
    const res = await apiClient.put(`/admin/orders/${orderId}/assign-delivery/${userId}`);
    return res.data.data || res.data;
  } catch {
    const state = getState() as any;
    const order = state.admin.orders.find((o: any) => o.id === orderId);
    if (order) return { ...order, assignedDeliveryId: userId, assignedDeliveryName: userName };
    throw new Error('Order not found');
  }
});

export const updateOrderStatusApi = createAsyncThunk('admin/updateOrderStatus', async ({ id, status }: { id: string; status: string }, { getState }) => {
  // Route to the correct backend endpoint based on target status
  const endpointMap: Record<string, string> = {
    'CONFIRMED': `/admin/orders/${id}/confirm`,
    'CANCELLED': `/admin/orders/${id}/cancel`,
    'PREPARING': `/kitchen/start/${id}`,
    'READY': `/kitchen/ready/${id}`,
    'PICKED_UP': `/delivery/pickup/${id}`,
    'OUT_FOR_DELIVERY': `/delivery/pickup/${id}`,
    'DELIVERED': `/delivery/deliver/${id}`,
  };

  const endpoint = endpointMap[status];
  
  try {
    if (endpoint) {
      const res = await apiClient.put(endpoint);
      return res.data.data || res.data;
    }
    // Fallback for unknown statuses
    const res = await apiClient.put(`/admin/orders/${id}/status`, { status });
    return res.data.data || res.data;
  } catch {
    // Fallback: update locally when backend is unreachable
    const state = getState() as any;
    const order = state.admin.orders.find((o: any) => o.id === id);
    if (order) return { ...order, status };
    throw new Error('Order not found');
  }
});

// ========================== MAPPERS ==========================
function mapMenuItem(raw: any): MenuItem {
  return {
    id: raw.id,
    name: raw.name || '',
    price: Number(raw.price) || 0,
    category: raw.categoryName || raw.category || 'Other',
    categoryName: raw.categoryName || raw.category || 'Other',
    description: raw.description || '',
    imageUrl: raw.imageUrl || '',
    isAvailable: raw.isAvailable !== false,
    isVegetarian: raw.isVegetarian || false,
    toppings: raw.ingredients || raw.toppings || [],
  };
}

function mapOrder(raw: any): OrderData {
  return {
    id: raw.id,
    customerId: raw.customerId || '',
    customerName: raw.customerName || '',
    status: raw.status || 'PLACED',
    charge: Number(raw.customerCharge || raw.totalAmount || raw.charge || 0),
    profit: Number(raw.calculatedProfit || raw.profit || 0),
    deliveryAddress: raw.customerAddress || raw.deliveryAddress || '',
    assignedChefId: raw.assignedChefId || '',
    assignedChefName: raw.assignedChefName || raw.assignedChefUserName || '',
    assignedDeliveryId: raw.assignedDeliveryId || raw.assignedDeliveryUserId || '',
    assignedDeliveryName: raw.assignedDeliveryName || raw.assignedDeliveryUserName || '',
    manager: raw.managingManagerName || raw.manager || '',
    date: raw.createdAt || raw.date || new Date().toISOString(),
    orderRating: raw.orderRating,
  };
}

function mapUser(raw: any): UserData {
  return {
    id: raw.id,
    name: raw.name || '',
    email: raw.email || '',
    role: raw.role || 'ROLE_CUSTOMER',
    baseSalary: Number(raw.baseSalary || 0),
    leavesTaken: raw.leavesTakenThisMonth ?? raw.leavesTaken ?? 0,
    totalSpent: raw.totalSpent,
    customerRating: raw.customerRating,
    customerReview: raw.customerReview,
    deliveryReview: raw.deliveryReview,
  };
}

function mapTransaction(raw: any): TransactionData {
  return {
    id: raw.id,
    type: raw.transactionType || raw.type || 'ORDER_REVENUE',
    amount: Number(raw.amount || 0),
    description: raw.description || '',
    date: raw.transactionDate || raw.date || new Date().toISOString(),
  };
}

function calcBalance(txns: TransactionData[]): number {
  const revenue = txns.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  return revenue - expenses;
}

// ========================== STATE ==========================
interface AdminState {
  menuItems: MenuItem[];
  orders: OrderData[];
  users: UserData[];
  transactions: TransactionData[];
  totalBalance: number;
  loading: boolean;
  error: string | null;
  dataSource: 'api' | 'fallback' | 'none';
}

const initialState: AdminState = {
  menuItems: [],
  orders: [],
  users: [],
  transactions: [],
  totalBalance: 0,
  loading: false,
  error: null,
  dataSource: 'none',
};

// ========================== SLICE ==========================
export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminData: () => initialState,
    // Local-only mutations when backend is down
    updateMenuLocally: (state, action) => {
      const idx = state.menuItems.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) state.menuItems[idx] = { ...state.menuItems[idx], ...action.payload };
    },
    updateUserLocally: (state, action) => {
      const idx = state.users.findIndex(u => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = { ...state.users[idx], ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // ===== fetchAdminData (combined) =====
    builder.addCase(fetchAdminData.fulfilled, (state, action) => {
      if (action.payload === 'FALLBACK' && state.dataSource === 'none') {
        // Backend is down — load all fallback data
        state.menuItems = FALLBACK_MENU;
        state.orders = FALLBACK_ORDERS;
        state.users = FALLBACK_USERS;
        state.transactions = FALLBACK_TRANSACTIONS;
        state.totalBalance = calcBalance(FALLBACK_TRANSACTIONS);
        state.dataSource = 'fallback';
      } else if (action.payload === 'API') {
        state.dataSource = 'api';
      }
    });

    // ===== Individual fetch handlers =====
    builder.addCase(fetchAllMenu.fulfilled, (state, action) => {
      const data = action.payload || [];
      if (Array.isArray(data) && data.length > 0) {
        state.menuItems = data.map(mapMenuItem);
      }
    });

    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      const data = action.payload || [];
      if (Array.isArray(data) && data.length > 0) {
        state.orders = data.map(mapOrder);
      }
    });

    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      const data = action.payload || [];
      if (Array.isArray(data) && data.length > 0) {
        state.users = data.map(mapUser);
      }
    });

    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      const data = action.payload || [];
      if (Array.isArray(data) && data.length > 0) {
        state.transactions = data.map(mapTransaction);
        state.totalBalance = calcBalance(state.transactions);
      }
    });

    // ===== Mutation handlers =====
    builder.addCase(addMenuItemApi.fulfilled, (state, action) => {
      state.menuItems.push(mapMenuItem(action.payload));
    });

    builder.addCase(updateMenuItemApi.fulfilled, (state, action) => {
      const mapped = mapMenuItem(action.payload);
      const idx = state.menuItems.findIndex(i => i.id === mapped.id);
      if (idx !== -1) state.menuItems[idx] = mapped;
    });

    builder.addCase(deleteMenuItemApi.fulfilled, (state, action) => {
      state.menuItems = state.menuItems.filter(i => i.id !== action.payload);
    });

    builder.addCase(toggleMenuItemApi.fulfilled, (state, action) => {
      if (action.payload) {
        const mapped = mapMenuItem(action.payload);
        const idx = state.menuItems.findIndex(i => i.id === mapped.id);
        if (idx !== -1) state.menuItems[idx] = mapped;
      }
    });

    builder.addCase(updateUserRoleApi.fulfilled, (state, action) => {
      if (action.payload) {
        const mapped = mapUser(action.payload);
        const idx = state.users.findIndex(u => u.id === mapped.id);
        if (idx !== -1) state.users[idx] = mapped;
      }
    });

    builder.addCase(updateSalaryApi.fulfilled, (state, action) => {
      if (action.payload) {
        const mapped = mapUser(action.payload);
        const idx = state.users.findIndex(u => u.id === mapped.id);
        if (idx !== -1) state.users[idx] = mapped;
      }
    });

    builder.addCase(updateLeavesApi.fulfilled, (state, action) => {
      if (action.payload) {
        const mapped = mapUser(action.payload);
        const idx = state.users.findIndex(u => u.id === mapped.id);
        if (idx !== -1) state.users[idx] = mapped;
      }
    });

    // ===== Generic loading / error =====
    builder.addCase(assignChefApi.fulfilled, (state, action) => {
      const mapped = mapOrder(action.payload);
      const idx = state.orders.findIndex(o => o.id === mapped.id);
      if (idx !== -1) state.orders[idx] = mapped;
    });

    builder.addCase(assignDeliveryApi.fulfilled, (state, action) => {
      const mapped = mapOrder(action.payload);
      const idx = state.orders.findIndex(o => o.id === mapped.id);
      if (idx !== -1) state.orders[idx] = mapped;
    });

    builder.addCase(updateOrderStatusApi.fulfilled, (state, action) => {
      const mapped = mapOrder(action.payload);
      const idx = state.orders.findIndex(o => o.id === mapped.id);
      if (idx !== -1) state.orders[idx] = mapped;
    });

    builder.addMatcher(
      (action) => action.type.startsWith('admin/') && action.type.endsWith('/pending'),
      (state) => { state.loading = true; state.error = null; }
    );
    builder.addMatcher(
      (action) => action.type.startsWith('admin/') && action.type.endsWith('/fulfilled'),
      (state) => { state.loading = false; }
    );
    builder.addMatcher(
      (action) => action.type.startsWith('admin/') && action.type.endsWith('/rejected'),
      (state, action: any) => {
        state.loading = false;
        state.error = action.error?.message || 'API request failed';
      }
    );
  },
});

export const { clearAdminData, updateMenuLocally, updateUserLocally } = adminSlice.actions;
export default adminSlice.reducer;
