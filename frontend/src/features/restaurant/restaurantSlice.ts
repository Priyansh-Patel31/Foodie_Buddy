import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  tags: string[];
}

interface RestaurantState {
  restaurants: Restaurant[];
  activeRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  activeRestaurant: null,
  loading: false,
  error: null,
};

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
    },
    setActiveRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.activeRestaurant = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  },
});

export const { setRestaurants, setActiveRestaurant, setLoading, setError } = restaurantSlice.actions;
export default restaurantSlice.reducer;
