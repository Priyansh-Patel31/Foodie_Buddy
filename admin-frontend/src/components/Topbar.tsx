import { Moon, Sun, Bell, LogOut } from 'lucide-react'
import { useThemeStore, useAuthStore } from '../stores'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
    const { isDark, toggle } = useThemeStore()
    const { username, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header style={{
            height: '64px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: 'var(--shadow-sm)',
        }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Welcome back, <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{username || 'Admin'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Notifications */}
                <button
                    style={{
                        width: '40px', height: '40px', borderRadius: '10px', border: 'none',
                        background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease', position: 'relative',
                    }}
                >
                    <Bell size={18} />
                    <span style={{
                        position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px',
                        borderRadius: '50%', background: '#ef4444',
                    }} />
                </button>

                {/* Dark Mode */}
                <button
                    onClick={toggle}
                    style={{
                        width: '40px', height: '40px', borderRadius: '10px', border: 'none',
                        background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Profile / Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', borderRadius: '10px', border: 'none',
                        background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                        cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                        transition: 'all 0.2s ease',
                    }}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </header>
    )
}
