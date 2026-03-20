import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '../services/api'
import { useState } from 'react'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Tag } from 'lucide-react'

export default function CategoriesPage() {
    const queryClient = useQueryClient()
    const [newName, setNewName] = useState('')
    const [editId, setEditId] = useState<number | null>(null)
    const [editName, setEditName] = useState('')

    const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: () => categoryApi.getAll() })

    const createMut = useMutation({
        mutationFn: (name: string) => categoryApi.create(name),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setNewName('') },
    })
    const updateMut = useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) => categoryApi.update(id, name),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setEditId(null) },
    })
    const toggleMut = useMutation({
        mutationFn: (id: number) => categoryApi.toggle(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    })
    const deleteMut = useMutation({
        mutationFn: (id: number) => categoryApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    })

    const categories = data?.data?.data || []

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Categories</h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage food categories</p>
            </div>

            {/* Add Category */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', maxWidth: '500px' }}>
                <input id="new-category" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New category name..." onKeyDown={(e) => e.key === 'Enter' && newName.trim() && createMut.mutate(newName.trim())}
                    style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
                <button onClick={() => newName.trim() && createMut.mutate(newName.trim())} style={{
                    padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                }}><Plus size={16} /> Add</button>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                {isLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : categories.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <Tag size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} /><p>No categories yet</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {['ID', 'Name', 'Status', 'Actions'].map((h) => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((c: Record<string, unknown>, i: number) => (
                                    <tr key={c.id as number} className="animate-fade-in" style={{ borderBottom: '1px solid var(--border-color)', animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>#{c.id as number}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            {editId === (c.id as number) ? (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && updateMut.mutate({ id: c.id as number, name: editName })} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }} autoFocus />
                                                    <button onClick={() => updateMut.mutate({ id: c.id as number, name: editName })} style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#6366f1', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>Save</button>
                                                    <button onClick={() => setEditId(null)} style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name as string}</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: c.active ? '#dcfce7' : '#f1f5f9', color: c.active ? '#16a34a' : '#64748b' }}>{c.active ? 'Active' : 'Inactive'}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => { setEditId(c.id as number); setEditName(c.name as string) }} title="Edit" style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#e0e7ff', color: '#4f46e5', cursor: 'pointer' }}><Pencil size={14} /></button>
                                                <button onClick={() => toggleMut.mutate(c.id as number)} title="Toggle" style={{ padding: '6px', borderRadius: '6px', border: 'none', background: c.active ? '#fef3c7' : '#dcfce7', color: c.active ? '#d97706' : '#16a34a', cursor: 'pointer' }}>
                                                    {c.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                                </button>
                                                <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(c.id as number) }} title="Delete" style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
