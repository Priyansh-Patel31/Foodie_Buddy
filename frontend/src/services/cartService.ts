import { CartItem } from '../features/cart/cartSlice';

export const cartService = {
  syncCart: async (items: CartItem[]) => {
    return Promise.resolve({ success: true, items });
  },

  checkout: async (_orderData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderId: 'ORD-' + Math.floor(Math.random() * 100000)
        });
      }, 1500);
    });
  }
};
