import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import restaurantReducer from '../features/restaurant/restaurantSlice';
import adminReducer from '../features/admin/adminSlice';
import locationReducer from '../features/location/locationSlice';

// Only persist auth state (user session) — admin data comes from the API
const loadAuthState = () => {
  try {
    const serialized = localStorage.getItem('foodieBuddyAuth');
    if (!serialized) return undefined;
    return { auth: JSON.parse(serialized) };
  } catch {
    return undefined;
  }
};

const saveAuthState = (state: any) => {
  try {
    localStorage.setItem('foodieBuddyAuth', JSON.stringify(state.auth));
    // Also persist the JWT token separately for the API client
    if (state.auth?.token) {
      localStorage.setItem('foodieBuddyToken', state.auth.token);
    } else {
      localStorage.removeItem('foodieBuddyToken');
    }
  } catch {
    // ignore write errors
  }
};

const preloadedState = loadAuthState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    restaurant: restaurantReducer,
    admin: adminReducer,
    location: locationReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveAuthState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
