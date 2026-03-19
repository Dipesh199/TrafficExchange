"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, Activity, Zap } from 'lucide-react';

interface DashboardStats {
    totalVisitsReceived: number;
    creditsEarned30d: number;
    creditsSpent30d: number;
    activeCampaignsCount: number;
}

interface Campaign {
    id: string;
    totalVisitsOrdered: number;
    visitsDelivered: number;
    status: string;
    createdAt: string;
    website: { title: string; url: string };
}

export default function AnalyticsPage() {
    const { token } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const h = { 'Authorization': `Bearer ${token}` };
        Promise.all([
            fetch('/api/analytics/dashboard', { headers: h }).then(r => r.ok ? r.json() : null),
            fetch('/api/campaigns', { headers: h }).then(r => r.ok ? r.json() : []),
        ]).then(([s, c]) => {
            setStats(s);
            setCampaigns(Array.isArray(c) ? c : []);
        }).finally(() => setLoading(false));
    }, [token]);

    const statCards = stats ? [
        { label: 'Traffic Received', value: stats.totalVisitsReceived, icon: Activity, color: 'text-[#3d9e97]' },
        { label: 'Credits Earned (30d)', value: stats.creditsEarned30d?.toFixed(1) || 0, icon: Zap, color: 'text-yellow-500' },
        { label: 'Credits Spent (30d)', value: stats.creditsSpent30d?.toFixed(1) || 0, icon: TrendingUp, color: 'text-blue-500' },
        { label: 'Active Campaigns', value: stats.activeCampaignsCount, icon: Activity, color: 'text-green-500' },
    ] : [];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Your traffic and credit performance</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-[#6dc8c2] border-t-transparent rounded-full animate-spin" /></div>
            ) : (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map(s => (
                            <div key={s.label} className="bg-white border border-gray-100 rounded-lg p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
                                    <s.icon className={`w-4 h-4 ${s.color}`} />
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Campaign Performance Table */}
                    <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Campaign Performance</h2>
                    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                        {campaigns.length === 0 ? (
                            <div className="py-10 text-center">
                                <Activity className="w-7 h-7 text-gray-200 mx-auto mb-3" />
                                <p className="text-sm text-gray-400">No campaigns yet.</p>
                            </div>
                        ) : (
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Website</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ordered</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Delivered</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Progress</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {campaigns.map(c => {
                                        const pct = c.totalVisitsOrdered > 0 ? Math.round((c.visitsDelivered / c.totalVisitsOrdered) * 100) : 0;
                                        return (
                                            <tr key={c.id}>
                                                <td className="px-5 py-3 font-semibold text-gray-700 max-w-[150px] truncate">{c.website?.title || c.website?.url}</td>
                                                <td className="px-5 py-3 text-gray-500">{c.totalVisitsOrdered.toLocaleString()}</td>
                                                <td className="px-5 py-3 text-gray-500">{c.visitsDelivered.toLocaleString()}</td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-[#6dc8c2] rounded-full" style={{ width: `${pct}%` }} />
                                                        </div>
                                                        <span className="text-gray-400">{pct}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${c.status === 'active' ? 'bg-green-50 text-green-600' : c.status === 'completed' ? 'bg-gray-100 text-gray-400' : 'bg-yellow-50 text-yellow-600'}`}>{c.status}</span>
                                                </td>
                                                <td className="px-5 py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
