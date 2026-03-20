import { useQuery } from '@tanstack/react-query'
import { dashboardApi, revenueApi } from '../services/api'
import { ShoppingBag, IndianRupee, Store, Users, Clock, AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6']

function StatCard({ icon: Icon, label, value, color, delay }: {
    icon: React.ElementType; label: string; value: string | number; color: string; delay: number
}) {
    return (
        <div
            className="animate-fade-in"
            style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                animationDelay: `${delay}ms`,
                animationFillMode: 'backwards',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>{label}</p>
                    <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</p>
                </div>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={22} style={{ color }} />
                </div>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => dashboardApi.getStats(),
    })

    const { data: dailyData } = useQuery({
        queryKey: ['daily-revenue'],
        queryFn: () => revenueApi.getDaily(14),
    })

    const { data: restaurantRevData } = useQuery({
        queryKey: ['restaurant-revenue'],
        queryFn: () => revenueApi.getByRestaurant(),
    })

    const stats = statsData?.data?.data
    const daily = dailyData?.data?.data || []
    const restaurantRev = restaurantRevData?.data?.data || []

    const fmt = (n: number | undefined) => {
        if (n === undefined || n === null) return '0'
        if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
        if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
        return `₹${n}`
    }

    if (statsLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <div style={{
                        width: '48px', height: '48px', border: '3px solid var(--border-color)',
                        borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite',
                    }} />
                    Loading dashboard...
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Dashboard</h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Platform overview and analytics</p>
            </div>

            {/* Stat Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '28px',
            }}>
                <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders ?? 0} color="#6366f1" delay={0} />
                <StatCard icon={IndianRupee} label="Total Revenue" value={fmt(stats?.totalRevenue)} color="#10b981" delay={50} />
                <StatCard icon={Store} label="Total Restaurants" value={stats?.totalRestaurants ?? 0} color="#f59e0b" delay={100} />
                <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} color="#3b82f6" delay={150} />
                <StatCard icon={Clock} label="Today's Orders" value={stats?.todaysOrders ?? 0} color="#8b5cf6" delay={200} />
                <StatCard icon={AlertTriangle} label="Pending Approvals" value={stats?.pendingApprovals ?? 0} color="#ef4444" delay={250} />
                <StatCard icon={CheckCircle} label="Active Restaurants" value={stats?.activeRestaurants ?? 0} color="#14b8a6" delay={300} />
                <StatCard icon={MessageSquare} label="Open Complaints" value={stats?.openComplaints ?? 0} color="#ec4899" delay={350} />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
                {/* Revenue Chart */}
                <div className="animate-fade-in" style={{
                    background: 'var(--bg-card)', borderRadius: '16px', padding: '24px',
                    border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)',
                    animationDelay: '400ms', animationFillMode: 'backwards',
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
                        Revenue (Last 14 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={daily}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(5)} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '13px' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Chart */}
                <div className="animate-fade-in" style={{
                    background: 'var(--bg-card)', borderRadius: '16px', padding: '24px',
                    border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)',
                    animationDelay: '450ms', animationFillMode: 'backwards',
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
                        Orders (Last 14 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={daily}>
                            <XAxis dataKey="date" tickFormatter={(v: string) => v.slice(5)} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '13px' }} />
                            <Bar dataKey="orderCount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Restaurants Pie Chart */}
                <div className="animate-fade-in" style={{
                    background: 'var(--bg-card)', borderRadius: '16px', padding: '24px',
                    border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)',
                    animationDelay: '500ms', animationFillMode: 'backwards',
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
                        Top Restaurants by Revenue
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={restaurantRev.slice(0, 6)}
                                dataKey="totalRevenue"
                                nameKey="restaurantName"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={3}
                                strokeWidth={0}
                            >
                                {restaurantRev.slice(0, 6).map((_: unknown, i: number) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '13px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                        {restaurantRev.slice(0, 6).map((r: { restaurantName: string }, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                                {r.restaurantName}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
