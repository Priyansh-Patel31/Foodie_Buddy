import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  subtotal: number;
  deliveryFee: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  restaurantId: null,
  subtotal: 0,
  deliveryFee: 49,
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const item = action.payload;
      
      // Clear cart if adding item from different restaurant
      if (state.restaurantId && state.restaurantId !== item.restaurantId) {
        state.items = [];
      }
      
      state.restaurantId = item.restaurantId;

      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      
      state.subtotal = state.items.reduce((total, i) => total + (i.price * i.quantity), 0);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.subtotal = state.items.reduce((total, i) => total + (i.price * i.quantity), 0);
      
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== id);
        }
      }
      state.subtotal = state.items.reduce((total, i) => total + (i.price * i.quantity), 0);
      
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.subtotal = 0;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    }
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;
