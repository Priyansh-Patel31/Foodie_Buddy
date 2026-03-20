import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../services/api'
import { useState } from 'react'
import { Search, Ban, Trash2, Users } from 'lucide-react'

export default function UsersPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(0)

    const { data, isLoading } = useQuery({
        queryKey: ['users', search, page],
        queryFn: () => userApi.getAll({ ...(search ? { search } : {}), page, size: 10 }),
    })

    const suspendMut = useMutation({
        mutationFn: (id: number) => userApi.suspend(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    })
    const deleteMut = useMutation({
        mutationFn: (id: number) => userApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    })

    const users = data?.data?.data?.content || []
    const totalPages = data?.data?.data?.totalPages || 0

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Users</h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage platform users</p>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    id="user-search"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0) }}
                    placeholder="Search users by name or email..."
                    style={{
                        width: '100%', padding: '10px 14px 10px 40px', borderRadius: '10px',
                        border: '1px solid var(--border-color)', background: 'var(--bg-card)',
                        color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                    }}
                />
            </div>

            <div style={{
                background: 'var(--bg-card)', borderRadius: '16px',
                border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
            }}>
                {isLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : users.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <p>No users found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {['ID', 'Name', 'Email', 'Phone', 'Address', 'Status', 'Joined', 'Actions'].map((h) => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u: Record<string, unknown>, i: number) => (
                                    <tr key={u.id as number} className="animate-fade-in" style={{ borderBottom: '1px solid var(--border-color)', animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>#{u.id as number}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.name as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.email as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.phone as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.address as string}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600,
                                                background: (u.status as string) === 'ACTIVE' ? '#dcfce7' : '#f1f5f9',
                                                color: (u.status as string) === 'ACTIVE' ? '#16a34a' : '#64748b',
                                            }}>{u.status as string}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            {new Date(u.createdAt as string).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {(u.status as string) === 'ACTIVE' && (
                                                    <button onClick={() => suspendMut.mutate(u.id as number)} title="Suspend" style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fef3c7', color: '#d97706', cursor: 'pointer' }}><Ban size={14} /></button>
                                                )}
                                                <button onClick={() => { if (confirm('Delete this user?')) deleteMut.mutate(u.id as number) }} title="Delete" style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                            </div>
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
