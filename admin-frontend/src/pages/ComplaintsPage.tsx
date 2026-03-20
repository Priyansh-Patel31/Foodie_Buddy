import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { complaintApi } from '../services/api'
import { useState } from 'react'
import { MessageSquare } from 'lucide-react'

const statusColors: Record<string, { bg: string; text: string }> = {
    OPEN: { bg: '#fee2e2', text: '#dc2626' },
    IN_PROGRESS: { bg: '#fef3c7', text: '#d97706' },
    RESOLVED: { bg: '#dcfce7', text: '#16a34a' },
}

export default function ComplaintsPage() {
    const queryClient = useQueryClient()
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(0)

    const { data, isLoading } = useQuery({
        queryKey: ['complaints', statusFilter, page],
        queryFn: () => complaintApi.getAll({ ...(statusFilter ? { status: statusFilter } : {}), page, size: 10 }),
    })

    const updateMut = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => complaintApi.updateStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['complaints'] }),
    })

    const complaints = data?.data?.data?.content || []
    const totalPages = data?.data?.data?.totalPages || 0

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Complaints</h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Handle user complaints and issues</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((s) => (
                    <button key={s} onClick={() => { setStatusFilter(s); setPage(0) }} style={{
                        padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                        border: statusFilter === s ? '1px solid #6366f1' : '1px solid var(--border-color)',
                        background: statusFilter === s ? '#6366f115' : 'var(--bg-card)',
                        color: statusFilter === s ? '#6366f1' : 'var(--text-secondary)',
                        cursor: 'pointer',
                    }}>{s ? s.replace(/_/g, ' ') : 'All'}</button>
                ))}
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                {isLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : complaints.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <MessageSquare size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} /><p>No complaints found</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {['ID', 'User', 'Order', 'Description', 'Status', 'Date', 'Actions'].map((h) => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((c: Record<string, unknown>, i: number) => (
                                    <tr key={c.id as number} className="animate-fade-in" style={{ borderBottom: '1px solid var(--border-color)', animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>#{c.id as number}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.userName as string}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>#{c.orderId as number}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description as string}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: statusColors[c.status as string]?.bg, color: statusColors[c.status as string]?.text }}>{(c.status as string).replace(/_/g, ' ')}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date(c.createdAt as string).toLocaleDateString()}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <select value={c.status as string} onChange={(e) => updateMut.mutate({ id: c.id as number, status: e.target.value })} style={{
                                                padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer',
                                            }}>
                                                <option value="OPEN">Open</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="RESOLVED">Resolved</option>
                                            </select>
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
                                color: page === i ? '#6366f1' : 'var(--text-secondary)', cursor: 'pointer',
                            }}>{i + 1}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
