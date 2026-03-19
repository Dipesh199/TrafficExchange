"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Globe, ExternalLink, Trash2, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Website {
    id: string; url: string; title: string;
    status: 'active' | 'pending' | 'disabled' | 'rejected';
    category: string; created_at: string;
}

const statusStyle: Record<string, string> = {
    active: 'bg-[#6dc8c2]/15 text-[#3d9e97]',
    pending: 'bg-yellow-50 text-yellow-600',
    disabled: 'bg-gray-100 text-gray-400',
    rejected: 'bg-red-50 text-red-500',
};

export default function WebsitesPage() {
    const { token } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUrl, setNewUrl] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('general');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => { fetchWebsites(); }, [token]);

    const fetchWebsites = async () => {
        if (!token) return;
        setIsLoading(true); setError('');
        try {
            const res = await fetch('/api/websites', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || `Server error ${res.status}`);
            }
            setWebsites(await res.json());
        } catch (e: any) { setError(e.message); }
        finally { setIsLoading(false); }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault(); if (!token) return;
        setIsAdding(true);
        try {
            const res = await fetch('/api/websites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ url: newUrl, title: newTitle, category: newCategory }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                const msg = Array.isArray(body.message) ? body.message.join(', ') : (body.message || `Server error ${res.status}`);
                throw new Error(msg);
            }
            await fetchWebsites();
            setIsModalOpen(false); setNewUrl(''); setNewTitle(''); setNewCategory('general');
        } catch (e: any) { alert(e.message); }
        finally { setIsAdding(false); }
    };

    const inputCls = "w-full border-b border-gray-200 focus:border-[#5bbcb5] outline-none text-sm py-1.5 bg-transparent text-gray-800 placeholder-gray-300 transition-colors";

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">My Websites</h1>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Manage sites to receive traffic</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#6dc8c2] text-white rounded hover:bg-[#5bbcb5] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Website
                </button>
            </div>

            {error && <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

            {isLoading ? (
                <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#6dc8c2] border-t-transparent rounded-full animate-spin"></div></div>
            ) : websites.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-lg py-16 text-center">
                    <Globe className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">No websites yet</h3>
                    <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto">Add your first website to start receiving traffic from the network.</p>
                    <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#6dc8c2] text-white rounded hover:bg-[#5bbcb5] transition-colors">
                        Add Website
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-left">
                                <th className="px-5 py-3">Website</th>
                                <th className="px-5 py-3 hidden md:table-cell">Category</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 hidden sm:table-cell">Added</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {websites.map(site => (
                                <tr key={site.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-gray-800 truncate max-w-[180px] text-sm">{site.title}</div>
                                        <a href={site.url} target="_blank" rel="noreferrer" className="text-xs text-[#5bbcb5] hover:underline flex items-center gap-1 mt-0.5 truncate max-w-[180px]">
                                            {site.url} <ExternalLink className="w-3 h-3 shrink-0" />
                                        </a>
                                    </td>
                                    <td className="px-5 py-4 hidden md:table-cell text-xs text-gray-400 capitalize">{site.category}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${statusStyle[site.status] ?? 'bg-gray-100 text-gray-400'}`}>
                                            {site.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 hidden sm:table-cell text-xs text-gray-400">{new Date(site.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {site.status === 'active' && (
                                                <Link href={`/spend?siteId=${site.id}`} className="text-[10px] font-bold uppercase tracking-wide text-[#5bbcb5] hover:underline">Run Traffic</Link>
                                            )}
                                            <button className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setIsModalOpen(false)}>
                    <div className="card-float w-full max-w-md px-8 py-8" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800">Add New Website</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-gray-500"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-5">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Website URL</label>
                                <input type="url" required placeholder="https://example.com" value={newUrl} onChange={e => setNewUrl(e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Title</label>
                                <input type="text" required placeholder="My Blog" value={newTitle} onChange={e => setNewTitle(e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Category</label>
                                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className={`${inputCls} cursor-pointer`}>
                                    {['general', 'blog', 'ecommerce', 'crypto', 'gaming', 'technology'].map(c => (
                                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-[10px] text-gray-300 leading-relaxed">Sites with illegal content or malware will be permanently banned without refund.</p>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wide text-gray-400 border border-gray-200 rounded hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={isAdding} className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wide text-white bg-[#6dc8c2] rounded hover:bg-[#5bbcb5] disabled:opacity-50 transition-colors">
                                    {isAdding ? 'Adding…' : 'Add Website'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
