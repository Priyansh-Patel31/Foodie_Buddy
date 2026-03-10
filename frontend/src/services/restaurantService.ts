import apiClient from './apiClient';
import { RestaurantCardProps } from '../components/restaurant/RestaurantCard';

// Using the type from component props for simplicity in this boilerplate
export type Restaurant = RestaurantCardProps;

export const restaurantService = {
  /**
   * Fetch all recommended restaurants
   */
  getRestaurants: async (): Promise<Restaurant[]> => {
    // Simulated API Call
    // return apiClient.get('/restaurants');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          // Mock data returned
        ]);
      }, 800);
    });
  },

  /**
   * Get specific restaurant details and its menu
   */
  getRestaurantDetails: async (id: string) => {
    // return apiClient.get(`/restaurants/${id}`);
    console.log(`Fetching details for ${id}`);
    return Promise.resolve({ id, name: 'Mock Data' });
  },

  /**
   * Search restaurants by query
   */
  searchRestaurants: async (query: string) => {
    return apiClient.get(`/restaurants/search?q=${query}`);
  }
};
