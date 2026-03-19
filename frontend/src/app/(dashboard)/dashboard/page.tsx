"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Activity, Globe, Zap, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

interface Campaign {
    id: string;
    status: string;
    totalVisitsOrdered: number;
    visitsDelivered: number;
    createdAt: string;
    website: { url: string; title: string };
}

export default function DashboardOverview() {
    const { user, token } = useAuth();
    const username = user?.username || 'User';
    const credits = typeof user?.credits === 'number' ? user.credits.toFixed(2) : '0.00';
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [stats, setStats] = useState<{ totalVisitsReceived: number; activeCampaignsCount: number; creditsEarned30d: number } | null>(null);
    const [websiteCount, setWebsiteCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const h = { 'Authorization': `Bearer ${token}` };
        Promise.all([
            fetch('/api/campaigns', { headers: h }).then(r => r.ok ? r.json() : []),
            fetch('/api/analytics/dashboard', { headers: h }).then(r => r.ok ? r.json() : null),
            fetch('/api/websites', { headers: h }).then(r => r.ok ? r.json() : [])
        ]).then(([cmp, analytic, sites]) => {
            setCampaigns(Array.isArray(cmp) ? cmp.slice(0, 5) : []);
            if (analytic) setStats(analytic);
            setWebsiteCount(Array.isArray(sites) ? sites.filter((s: any) => s.status === 'active').length : 0);
        }).finally(() => setLoading(false));
    }, [token]);

    const totalDelivered = campaigns.reduce((s, c) => s + c.visitsDelivered, 0);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-xl font-bold text-gray-800">Welcome back, {username} 👋</h1>
                <p className="text-sm text-gray-400 mt-1 uppercase tracking-wide">Your account at a glance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Credits', value: credits, icon: Zap, href: '/earn', cta: 'Earn more' },
                    { label: 'Active Sites', value: String(websiteCount), icon: Globe, href: '/websites', cta: 'Manage' },
                    { label: 'Traffic Delivered', value: String(totalDelivered), icon: Activity, href: '/spend', cta: 'Run campaign' },
                    { label: 'Credits Earned (30d)', value: (stats?.creditsEarned30d ?? 0).toFixed(1), icon: TrendingUp, href: '/earn', cta: 'Surf now' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-lg border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                            <stat.icon className="w-4 h-4 text-[#6dc8c2]" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mb-2">{loading ? '…' : stat.value}</p>
                        <Link href={stat.href} className="text-xs text-[#5bbcb5] font-semibold hover:underline">{stat.cta} &rarr;</Link>
                    </div>
                ))}
            </div>

            {/* Lower panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Recent Campaigns</h3>
                        <Link href="/spend" className="text-[10px] font-bold uppercase tracking-wider text-[#5bbcb5] hover:underline">New</Link>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-10"><div className="w-5 h-5 border-2 border-[#6dc8c2] border-t-transparent rounded-full animate-spin" /></div>
                    ) : campaigns.length === 0 ? (
                        <div className="flex flex-col items-center py-10 text-center px-5">
                            <Activity className="w-8 h-8 text-gray-200 mb-3" />
                            <p className="text-xs text-gray-400 mb-5">No campaigns yet.</p>
                            <Link href="/spend" className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#6dc8c2] text-white rounded hover:bg-[#5bbcb5] transition-colors">Create Campaign</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {campaigns.map(c => (
                                <div key={c.id} className="px-5 py-3 flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-700 truncate">{c.website?.title || c.website?.url}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{c.visitsDelivered} / {c.totalVisitsOrdered} visits</p>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded ${c.status === 'active' ? 'bg-green-50 text-green-600' : c.status === 'completed' ? 'bg-gray-100 text-gray-400' : 'bg-yellow-50 text-yellow-600'}`}>{c.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Quick Links</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[
                            { href: '/earn', icon: Zap, title: 'Surf & Earn Credits', desc: 'Browse member sites and earn credits per verified view.' },
                            { href: '/spend', icon: Activity, title: 'Create Campaign', desc: 'Drive real visitors to your website with targeted traffic.' },
                            { href: '/billing', icon: TrendingUp, title: 'Buy Credits', desc: 'Purchase credit packages to instantly boost your campaigns.' },
                            { href: '/settings', icon: Clock, title: 'Account Settings', desc: 'Update your profile and change your password.' },
                        ].map(item => (
                            <Link key={item.href} href={item.href} className="flex gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                                <item.icon className="w-4 h-4 text-[#6dc8c2] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
