import axios from 'axios'
import { useAuthStore } from '../stores'

const api = axios.create({
    baseURL: '/api/admin',
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth
export const authApi = {
    login: (username: string, password: string) =>
        api.post('/login', { username, password }),
}

// Dashboard
export const dashboardApi = {
    getStats: () => api.get('/dashboard'),
}

// Restaurants
export const restaurantApi = {
    getAll: (params?: Record<string, unknown>) => api.get('/restaurants', { params }),
    getById: (id: number) => api.get(`/restaurants/${id}`),
    approve: (id: number) => api.put(`/restaurants/${id}/approve`),
    reject: (id: number) => api.put(`/restaurants/${id}/reject`),
    suspend: (id: number) => api.put(`/restaurants/${id}/suspend`),
    delete: (id: number) => api.delete(`/restaurants/${id}`),
}

// Users
export const userApi = {
    getAll: (params?: Record<string, unknown>) => api.get('/users', { params }),
    getById: (id: number) => api.get(`/users/${id}`),
    suspend: (id: number) => api.put(`/users/${id}/suspend`),
    delete: (id: number) => api.delete(`/users/${id}`),
}

// Orders
export const orderApi = {
    getAll: (params?: Record<string, unknown>) => api.get('/orders', { params }),
    getById: (id: number) => api.get(`/orders/${id}`),
}

// Revenue
export const revenueApi = {
    getStats: () => api.get('/revenue'),
    getDaily: (days?: number) => api.get('/revenue/daily', { params: { days } }),
    getByRestaurant: () => api.get('/revenue/restaurants'),
}

// Complaints
export const complaintApi = {
    getAll: (params?: Record<string, unknown>) => api.get('/complaints', { params }),
    updateStatus: (id: number, status: string) =>
        api.put(`/complaints/${id}/status`, null, { params: { status } }),
}

// Categories
export const categoryApi = {
    getAll: () => api.get('/categories'),
    create: (name: string) => api.post('/categories', { name }),
    update: (id: number, name: string) => api.put(`/categories/${id}`, { name }),
    toggle: (id: number) => api.put(`/categories/${id}/toggle`),
    delete: (id: number) => api.delete(`/categories/${id}`),
}

export default api
