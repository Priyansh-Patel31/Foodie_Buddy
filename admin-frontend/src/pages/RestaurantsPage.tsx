import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { restaurantApi } from '../services/api'
import { useState } from 'react'
import { Search, Check, X, Ban, Trash2, Store } from 'lucide-react'

const statusColors: Record<string, { bg: string; text: string }> = {
    APPROVED: { bg: '#dcfce7', text: '#16a34a' },
    PENDING: { bg: '#fef3c7', text: '#d97706' },
    REJECTED: { bg: '#fee2e2', text: '#dc2626' },
    SUSPENDED: { bg: '#f1f5f9', text: '#64748b' },
}

export default function RestaurantsPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(0)

    const { data, isLoading } = useQuery({
        queryKey: ['restaurants', search, statusFilter, page],
        queryFn: () => restaurantApi.getAll({
            ...(search ? { search } : {}),
            ...(statusFilter ? { status: statusFilter } : {}),
            page,
            size: 10,
        }),
    })

    const approveMut = useMutation({
        mutationFn: (id: number) => restaurantApi.approve(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurants'] }),
    })
    const rejectMut = useMutation({
        mutationFn: (id: number) => restaurantApi.reject(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurants'] }),
    })
    const suspendMut = useMutation({
        mutationFn: (id: number) => restaurantApi.suspend(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurants'] }),
    })
    const deleteMut = useMutation({
        mutationFn: (id: number) => restaurantApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurants'] }),
    })

    const restaurants = data?.data?.data?.content || []
    const totalPages = data?.data?.data?.totalPages || 0

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Restaurants</h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage and approve restaurant registrations</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap',
            }}>
                <div style={{ position: 'relative', flex: '1 1 300px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        id="restaurant-search"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0) }}
                        placeholder="Search restaurants..."
                        style={{
                            width: '100%', padding: '10px 14px 10px 40px', borderRadius: '10px',
                            border: '1px solid var(--border-color)', background: 'var(--bg-card)',
                            color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                        }}
                    />
                </div>
                {['', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map((s) => (
                    <button key={s} onClick={() => { setStatusFilter(s); setPage(0) }} style={{
                        padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                        border: statusFilter === s ? '1px solid #6366f1' : '1px solid var(--border-color)',
                        background: statusFilter === s ? '#6366f115' : 'var(--bg-card)',
                        color: statusFilter === s ? '#6366f1' : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                        {s || 'All'}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{
                background: 'var(--bg-card)', borderRadius: '16px',
                border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
            }}>
                {isLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : restaurants.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Store size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <p>No restaurants found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {['Name', 'Owner', 'Email', 'Location', 'Commission', 'Status', 'Actions'].map((h) => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {restaurants.map((r: Record<string, unknown>, i: number) => (
                                    <tr key={r.id as number} className="animate-fade-in" style={{ borderBottom: '1px solid var(--border-color)', animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.name as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-secondary)' }}>{r.ownerName as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{r.email as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{r.location as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{r.commissionRate as number}%</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600,
                                                background: statusColors[r.status as string]?.bg, color: statusColors[r.status as string]?.text,
                                            }}>{r.status as string}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {(r.status as string) !== 'APPROVED' && (
                                                    <button onClick={() => approveMut.mutate(r.id as number)} title="Approve" style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#dcfce7', color: '#16a34a', cursor: 'pointer' }}><Check size={14} /></button>
                                                )}
                                                {(r.status as string) !== 'REJECTED' && (
                                                    <button onClick={() => rejectMut.mutate(r.id as number)} title="Reject" style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}><X size={14} /></button>
                                                )}
                                                {(r.status as string) === 'APPROVED' && (
                                                    <button onClick={() => suspendMut.mutate(r.id as number)} title="Suspend" style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}><Ban size={14} /></button>
                                                )}
                                                <button onClick={() => { if (confirm('Delete this restaurant?')) deleteMut.mutate(r.id as number) }} title="Delete" style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
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
