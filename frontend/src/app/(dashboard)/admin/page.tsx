"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, Globe, AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';

interface User { id: string; username: string; email: string; role: string; status: string; credits: number; createdAt: string; }
interface Website { id: string; url: string; title: string; status: string; user: { username: string }; }
interface FraudFlag { id: string; reason: string; severity: string; createdAt: string; user?: { username: string }; website?: { url: string }; }

export default function AdminPage() {
    const { token } = useAuth();
    const [tab, setTab] = useState<'users' | 'websites' | 'fraud'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [pendingWebsites, setPendingWebsites] = useState<Website[]>([]);
    const [fraudFlags, setFraudFlags] = useState<FraudFlag[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionMsg, setActionMsg] = useState('');

    const h = { 'Authorization': `Bearer ${token}` };

    const fetchAll = () => {
        setLoading(true);
        Promise.all([
            fetch('/api/admin/users', { headers: h }).then(r => r.ok ? r.json() : []),
            fetch('/api/admin/websites/pending', { headers: h }).then(r => r.ok ? r.json() : []),
            fetch('/api/admin/fraud-flags', { headers: h }).then(r => r.ok ? r.json() : [])
        ]).then(([u, w, f]) => {
            setUsers(Array.isArray(u) ? u : []);
            setPendingWebsites(Array.isArray(w) ? w : []);
            setFraudFlags(Array.isArray(f) ? f : []);
        }).finally(() => setLoading(false));
    };

    useEffect(() => { if (token) fetchAll(); }, [token]);

    const adminAction = async (url: string, method = 'PATCH') => {
        setActionMsg('');
        const res = await fetch(url, { method, headers: h });
        if (res.ok) { setActionMsg('Action completed.'); fetchAll(); }
        else setActionMsg('Action failed.');
        setTimeout(() => setActionMsg(''), 3000);
    };

    const tabCls = (t: string) => `px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${tab === t ? 'border-b-2 border-[#6dc8c2] text-[#3d9e97]' : 'text-gray-400 hover:text-gray-600'}`;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#6dc8c2]" />
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">Platform management</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Users', value: users.length, icon: Users },
                    { label: 'Pending Websites', value: pendingWebsites.length, icon: Globe },
                    { label: 'Fraud Flags', value: fraudFlags.length, icon: AlertTriangle },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <s.icon className="w-4 h-4 text-[#6dc8c2]" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{loading ? '…' : s.value}</p>
                    </div>
                ))}
            </div>

            {actionMsg && <div className="mb-4 bg-blue-50 text-blue-600 text-xs px-4 py-2 rounded">{actionMsg}</div>}

            {/* Tabs */}
            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                <div className="flex border-b border-gray-100 px-2">
                    <button className={tabCls('users')} onClick={() => setTab('users')}>Users ({users.length})</button>
                    <button className={tabCls('websites')} onClick={() => setTab('websites')}>Pending Websites ({pendingWebsites.length})</button>
                    <button className={tabCls('fraud')} onClick={() => setTab('fraud')}>Fraud Flags ({fraudFlags.length})</button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10"><div className="w-5 h-5 border-2 border-[#6dc8c2] border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <>
                        {tab === 'users' && (
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Username', 'Email', 'Role', 'Status', 'Credits', 'Joined', 'Actions'].map(h => (
                                            <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td className="px-4 py-3 font-semibold text-gray-700">{u.username}</td>
                                            <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>{u.role}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{u.status}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{Number(u.credits).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">
                                                {u.status === 'active' && u.role !== 'admin' && (
                                                    <button onClick={() => adminAction(`/api/admin/users/${u.id}/suspend`)} className="text-[10px] text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition-colors">Suspend</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {tab === 'websites' && (
                            pendingWebsites.length === 0 ? (
                                <div className="py-10 text-center text-gray-400 text-sm">No pending websites.</div>
                            ) : (
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['Title', 'URL', 'Owner', 'Actions'].map(h => (
                                                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {pendingWebsites.map(w => (
                                            <tr key={w.id}>
                                                <td className="px-4 py-3 font-semibold text-gray-700">{w.title}</td>
                                                <td className="px-4 py-3 text-blue-500 truncate max-w-[200px]"><a href={w.url} target="_blank" rel="noopener noreferrer">{w.url}</a></td>
                                                <td className="px-4 py-3 text-gray-500">{w.user?.username}</td>
                                                <td className="px-4 py-3 flex gap-2">
                                                    <button onClick={() => adminAction(`/api/admin/websites/${w.id}/approve`)} className="flex items-center gap-1 text-[10px] text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-50"><CheckCircle className="w-3 h-3" /> Approve</button>
                                                    <button onClick={() => adminAction(`/api/admin/websites/${w.id}/reject`)} className="flex items-center gap-1 text-[10px] text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-50"><XCircle className="w-3 h-3" /> Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        )}

                        {tab === 'fraud' && (
                            fraudFlags.length === 0 ? (
                                <div className="py-10 text-center text-gray-400 text-sm">No fraud flags.</div>
                            ) : (
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['User', 'Website', 'Reason', 'Severity', 'Date'].map(h => (
                                                <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {fraudFlags.map(f => (
                                            <tr key={f.id}>
                                                <td className="px-4 py-3 text-gray-700">{f.user?.username || '—'}</td>
                                                <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]">{f.website?.url || '—'}</td>
                                                <td className="px-4 py-3 text-gray-500">{f.reason}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${f.severity === 'critical' ? 'bg-red-100 text-red-600' : f.severity === 'high' ? 'bg-orange-50 text-orange-500' : 'bg-yellow-50 text-yellow-600'}`}>{f.severity}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
