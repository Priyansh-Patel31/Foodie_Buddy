import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard, Store, Users, ShoppingBag,
    BarChart3, MessageSquare, Tag, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/restaurants', icon: Store, label: 'Restaurants' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/revenue', icon: BarChart3, label: 'Revenue' },
    { to: '/complaints', icon: MessageSquare, label: 'Complaints' },
    { to: '/categories', icon: Tag, label: 'Categories' },
]

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            style={{
                width: collapsed ? '72px' : '260px',
                background: 'var(--bg-sidebar)',
                transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                position: 'sticky',
                top: 0,
                zIndex: 40,
                overflow: 'hidden',
            }}
        >
            {/* Logo */}
            <div style={{
                padding: collapsed ? '20px 12px' : '20px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minHeight: '72px',
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#fff',
                    flexShrink: 0,
                }}>F</div>
                {!collapsed && (
                    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff', letterSpacing: '-0.02em' }}>FoodieBuddy</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>Admin Panel</div>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: collapsed ? '12px' : '10px 16px',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            color: isActive ? 'var(--text-sidebar-active)' : 'var(--text-sidebar)',
                            background: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                            fontWeight: isActive ? 600 : 400,
                            fontSize: '14px',
                            transition: 'all 0.2s ease',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            position: 'relative',
                        })}
                    >
                        <item.icon size={20} style={{ flexShrink: 0 }} />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    margin: '12px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--bg-sidebar-hover)',
                    color: 'var(--text-sidebar)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                }}
            >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
        </aside>
    )
}
