export const authService = {
  login: async (credentials: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-12345',
          user: {
            id: 'u1',
            name: 'Priyansh Patel',
            email: credentials.email || 'user@example.com',
            role: 'customer'
          }
        });
      }, 1000);
    });
  },

  register: async (_data: any) => {
    return Promise.resolve({ success: true });
  },

  logout: async () => {
    return Promise.resolve({ success: true });
  }
};
