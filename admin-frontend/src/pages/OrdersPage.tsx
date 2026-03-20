import { useQuery } from '@tanstack/react-query'
import { orderApi } from '../services/api'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

const statusColors: Record<string, { bg: string; text: string }> = {
    PLACED: { bg: '#e0e7ff', text: '#4f46e5' },
    CONFIRMED: { bg: '#dbeafe', text: '#2563eb' },
    PREPARING: { bg: '#fef3c7', text: '#d97706' },
    OUT_FOR_DELIVERY: { bg: '#fce7f3', text: '#db2777' },
    DELIVERED: { bg: '#dcfce7', text: '#16a34a' },
    CANCELLED: { bg: '#fee2e2', text: '#dc2626' },
}

export default function OrdersPage() {
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(0)

    const { data, isLoading } = useQuery({
        queryKey: ['orders', statusFilter, page],
        queryFn: () => orderApi.getAll({
            ...(statusFilter ? { status: statusFilter } : {}),
            page,
            size: 10,
        }),
    })

    const orders = data?.data?.data?.content || []
    const totalPages = data?.data?.data?.totalPages || 0

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Orders</h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Monitor all platform orders</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['', 'PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((s) => (
                    <button key={s} onClick={() => { setStatusFilter(s); setPage(0) }} style={{
                        padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                        border: statusFilter === s ? '1px solid #6366f1' : '1px solid var(--border-color)',
                        background: statusFilter === s ? '#6366f115' : 'var(--bg-card)',
                        color: statusFilter === s ? '#6366f1' : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        {s ? s.replace(/_/g, ' ') : 'All'}
                    </button>
                ))}
            </div>

            <div style={{
                background: 'var(--bg-card)', borderRadius: '16px',
                border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
            }}>
                {isLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : orders.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <ShoppingBag size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <p>No orders found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {['Order ID', 'User', 'Restaurant', 'Amount', 'Distance', 'Commission', 'Platform Rev.', 'Status', 'Date'].map((h) => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o: Record<string, unknown>, i: number) => (
                                    <tr key={o.id as number} className="animate-fade-in" style={{ borderBottom: '1px solid var(--border-color)', animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>#{o.id as number}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{o.userName as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{o.restaurantName as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>₹{Number(o.totalAmount).toFixed(0)}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: (o.distanceKm as number) <= 2 ? '#10b981' : 'var(--text-secondary)' }}>
                                            {(o.distanceKm as number).toFixed(1)} km
                                            {(o.distanceKm as number) <= 2 && <span style={{ fontSize: '10px', marginLeft: '4px' }}>🟢</span>}
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: Number(o.commissionAmount) === 0 ? '#10b981' : 'var(--text-secondary)' }}>
                                            ₹{Number(o.commissionAmount).toFixed(0)}
                                            {Number(o.commissionAmount) === 0 && <span style={{ fontSize: '10px', marginLeft: '4px', color: '#10b981' }}>(waived)</span>}
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>₹{Number(o.platformRevenue).toFixed(0)}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600,
                                                background: statusColors[o.status as string]?.bg ?? '#f1f5f9',
                                                color: statusColors[o.status as string]?.text ?? '#64748b',
                                                whiteSpace: 'nowrap',
                                            }}>{(o.status as string).replace(/_/g, ' ')}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                            {new Date(o.createdAt as string).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {totalPages > 1 && (
                    <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'center', gap: '8px', borderTop: '1px solid var(--border-color)' }}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i} onClick={() => setPage(i)} style={{
                                padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
                                border: page === i ? '1px solid #6366f1' : '1px solid var(--border-color)',
                                background: page === i ? '#6366f115' : 'transparent',
                                color: page === i ? '#6366f1' : 'var(--text-secondary)',
                                cursor: 'pointer',
                            }}>{i + 1}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
