import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    token: string | null
    username: string | null
    role: string | null
    isAuthenticated: boolean
    login: (token: string, username: string, role: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            username: null,
            role: null,
            isAuthenticated: false,
            login: (token, username, role) =>
                set({ token, username, role, isAuthenticated: true }),
            logout: () =>
                set({ token: null, username: null, role: null, isAuthenticated: false }),
        }),
        { name: 'admin-auth' }
    )
)

interface ThemeState {
    isDark: boolean
    toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDark: false,
            toggle: () => set((state) => ({ isDark: !state.isDark })),
        }),
        { name: 'admin-theme' }
    )
)
