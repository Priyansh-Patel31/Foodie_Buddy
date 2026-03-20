import { useQuery } from '@tanstack/react-query'
import { revenueApi } from '../services/api'
import { IndianRupee, TrendingUp, TrendingDown, Gift } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts'

export default function RevenuePage() {
    const { data: statsData, isLoading } = useQuery({ queryKey: ['revenue-stats'], queryFn: () => revenueApi.getStats() })
    const { data: dailyData } = useQuery({ queryKey: ['daily-revenue-30'], queryFn: () => revenueApi.getDaily(30) })
    const { data: restaurantData } = useQuery({ queryKey: ['restaurant-revenue-detail'], queryFn: () => revenueApi.getByRestaurant() })

    const stats = statsData?.data?.data
    const daily = dailyData?.data?.data || []
    const restaurants = restaurantData?.data?.data || []

    const fmt = (n: number | undefined) => { if (!n) return '₹0'; if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`; if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`; return `₹${n}` }

    if (isLoading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>

    const cards = [
        { icon: IndianRupee, label: 'Total Order Value', value: fmt(stats?.totalOrderValue), color: '#6366f1' },
        { icon: TrendingUp, label: 'Platform Revenue', value: fmt(stats?.totalPlatformRevenue), color: '#10b981' },
        { icon: TrendingDown, label: 'Restaurant Revenue', value: fmt(stats?.totalRestaurantRevenue), color: '#f59e0b' },
        { icon: IndianRupee, label: 'Commission Collected', value: fmt(stats?.totalCommissionCollected), color: '#3b82f6' },
        { icon: Gift, label: 'Commission Waived (≤2km)', value: fmt(stats?.totalCommissionWaived), color: '#ec4899' },
    ]

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Revenue Analytics</h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Platform revenue and commission overview</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                {cards.map((c, i) => (
                    <div key={i} className="animate-fade-in" style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><c.icon size={18} style={{ color: c.color }} /></div>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{c.label}</span>
                        </div>
                        <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>{c.value}</div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Revenue (30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={daily}>
                            <defs><linearGradient id="cR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                            <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(5)} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '13px' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#cR)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Revenue by Restaurant</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={restaurants.slice(0, 8)} layout="vertical">
                            <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="restaurantName" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '13px' }} />
                            <Legend /><Bar dataKey="totalRevenue" fill="#6366f1" radius={[0, 4, 4, 0]} name="Total" /><Bar dataKey="platformRevenue" fill="#10b981" radius={[0, 4, 4, 0]} name="Platform" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
