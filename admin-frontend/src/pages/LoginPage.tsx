import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useThemeStore } from '../stores'
import { authApi } from '../services/api'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useEffect } from 'react'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login, isAuthenticated } = useAuthStore()
    const { isDark } = useThemeStore()
    const navigate = useNavigate()

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark)
    }, [isDark])

    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true })
    }, [isAuthenticated, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await authApi.login(username, password)
            const data = res.data.data
            login(data.token, data.username, data.role)
            navigate('/')
        } catch {
            setError('Invalid username or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            padding: '20px',
        }}>
            {/* Floating orbs */}
            <div style={{
                position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
                top: '10%', left: '10%', filter: 'blur(40px)',
            }} />
            <div style={{
                position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)',
                bottom: '10%', right: '10%', filter: 'blur(60px)',
            }} />

            <div style={{
                width: '100%', maxWidth: '420px',
                background: 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(24px)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '40px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                position: 'relative',
                zIndex: 1,
            }} className="animate-fade-in">
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: '24px', fontWeight: 800, color: '#fff',
                    }}>F</div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
                        Welcome Back
                    </h1>
                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>Sign in to your admin account</p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#fca5a5', fontSize: '13px', textAlign: 'center',
                    }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>
                            Username
                        </label>
                        <input
                            id="login-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15, 23, 42, 0.6)',
                                color: '#f1f5f9', fontSize: '14px', outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px', position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '6px' }}>
                            Password
                        </label>
                        <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            style={{
                                width: '100%', padding: '12px 16px', paddingRight: '44px', borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15, 23, 42, 0.6)',
                                color: '#f1f5f9', fontSize: '14px', outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '12px', bottom: '10px',
                                background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        id="login-submit"
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                            background: loading ? '#4f46e5' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'default' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.2s ease',
                            opacity: loading ? 0.8 : 1,
                        }}
                    >
                        <LogIn size={18} />
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#64748b' }}>
                    Demo credentials: <strong style={{ color: '#94a3b8' }}>admin / admin123</strong>
                </p>
            </div>
        </div>
    )
}
