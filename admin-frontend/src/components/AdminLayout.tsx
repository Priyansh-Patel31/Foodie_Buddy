import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuthStore, useThemeStore } from '../stores'
import { useEffect } from 'react'

export default function AdminLayout() {
    const { isAuthenticated } = useAuthStore()
    const { isDark } = useThemeStore()

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark)
    }, [isDark])

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Topbar />
                <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
