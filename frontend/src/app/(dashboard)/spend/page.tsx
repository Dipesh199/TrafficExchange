"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface Website { id: string; url: string; title: string; status: string; }

export default function SpendPage() {
    const { token, user, updateUser } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [selectedSiteId, setSelectedSiteId] = useState(searchParams.get('siteId') || '');
    const [visitAmount, setVisitAmount] = useState(100);
    const [costPerVisit, setCostPerVisit] = useState(1.0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const totalCost = visitAmount * costPerVisit;
    const userCredits = user?.credits ?? 0;
    const hasEnough = userCredits >= totalCost;

    useEffect(() => {
        if (!token) return;
        fetch('/api/websites', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : [])
            .then((d: Website[]) => {
                const active = d.filter(s => s.status === 'active');
                setWebsites(active);
                if (active.length > 0 && !selectedSiteId) setSelectedSiteId(active[0].id);
            })
            .finally(() => setIsLoading(false));
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSiteId) { setError('Please select a website.'); return; }
        if (!hasEnough) { setError('Insufficient credits.'); return; }
        setIsSubmitting(true); setError('');
        try {
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ websiteId: selectedSiteId, totalVisitsOrdered: visitAmount })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to create campaign');
            }
            // Deduct credits from context (server already did it atomically)
            updateUser({ credits: (userCredits - totalCost) });
            setSuccess(true);
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
            setIsSubmitting(false);
        }
    };

    const selectCls = "w-full border-b border-gray-200 focus:border-[#5bbcb5] outline-none text-sm py-2 bg-transparent text-gray-800 transition-colors cursor-pointer";

    if (isLoading) return <div className="flex justify-center items-center py-20"><div className="w-6 h-6 border-2 border-[#6dc8c2] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">Create Traffic Campaign</h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Spend credits to drive visitors to your website</p>
            </div>

            {success ? (
                <div className="bg-[#6dc8c2]/10 border border-[#6dc8c2]/30 rounded-lg p-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#6dc8c2] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="font-bold text-[#3d9e97] mb-1">Campaign Activated!</h2>
                    <p className="text-sm text-gray-400">Your site is now receiving traffic. Redirecting…</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-100 rounded-lg p-7">
                            {error && <div className="mb-5 flex items-center gap-2 bg-red-50 text-red-500 text-xs px-4 py-3 rounded"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}</div>}

                            {websites.length === 0 ? (
                                <div className="text-center py-10">
                                    <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                    <h3 className="text-sm font-semibold text-gray-700 mb-1">No active websites</h3>
                                    <p className="text-xs text-gray-400 mb-5">Add an approved website before running a campaign.</p>
                                    <Link href="/websites" className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#6dc8c2] text-white rounded hover:bg-[#5bbcb5] transition-colors">Manage Websites</Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-7">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5">Target Website</label>
                                        <select value={selectedSiteId} onChange={e => setSelectedSiteId(e.target.value)} required className={selectCls}>
                                            <option value="" disabled>Select a website…</option>
                                            {websites.map(s => <option key={s.id} value={s.id}>{s.title} — {s.url}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs text-gray-400">Total Visits</label>
                                            <span className="text-sm font-bold text-[#3d9e97]">{visitAmount.toLocaleString()}</span>
                                        </div>
                                        <input type="range" min="10" max="10000" step="10" value={visitAmount}
                                            onChange={e => setVisitAmount(Number(e.target.value))}
                                            className="w-full h-1 appearance-none bg-gray-200 rounded-full accent-[#6dc8c2] cursor-pointer" />
                                        <div className="flex justify-between text-[10px] text-gray-300 mt-1.5 uppercase tracking-wide">
                                            <span>10</span><span>5,000</span><span>10,000</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-3">Delivery Priority</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: 'Standard', value: 1.0, desc: '1.0 credit / visit' },
                                                { label: 'Express', value: 1.5, desc: '1.5 credits / visit' },
                                            ].map(opt => (
                                                <label key={opt.label} className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${costPerVisit === opt.value ? 'border-[#6dc8c2] bg-[#6dc8c2]/10' : 'border-gray-100 hover:border-gray-200'}`}>
                                                    <input type="radio" name="priority" className="sr-only" checked={costPerVisit === opt.value} onChange={() => setCostPerVisit(opt.value)} />
                                                    <span className="text-xs font-bold uppercase tracking-wide text-gray-700">{opt.label}</span>
                                                    <span className="text-[10px] text-gray-400 mt-1">{opt.desc}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <button type="submit" disabled={!hasEnough || isSubmitting}
                                        className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white bg-[#6dc8c2] rounded hover:bg-[#5bbcb5] disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                                        {isSubmitting
                                            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            : <><span>Launch Campaign</span><ArrowRight className="w-3.5 h-3.5" /></>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-100 rounded-lg p-5 sticky top-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Order Summary</h3>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between text-gray-500"><span>Visits</span><span className="font-bold text-gray-700">{visitAmount.toLocaleString()}</span></div>
                                <div className="flex justify-between text-gray-500"><span>Cost / visit</span><span className="font-bold text-gray-700">{costPerVisit.toFixed(1)} cr.</span></div>
                                <div className="border-t border-gray-50 pt-3 flex justify-between">
                                    <span className="font-bold text-gray-700">Total</span>
                                    <span className={`font-bold text-lg ${hasEnough ? 'text-[#3d9e97]' : 'text-red-500'}`}>{totalCost.toLocaleString()} cr.</span>
                                </div>
                                <div className={`text-[10px] text-right ${hasEnough ? 'text-gray-300' : 'text-red-400 font-bold'}`}>
                                    Balance after: {(userCredits - totalCost).toFixed(2)} cr.
                                </div>
                            </div>
                            {!hasEnough && (
                                <div className="mt-4 pt-4 border-t border-gray-50">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-red-400 mb-3">Not enough credits.</p>
                                    <Link href="/earn" className="block text-center text-[10px] font-bold uppercase tracking-wider border border-gray-200 rounded py-2 hover:bg-gray-50 transition-colors text-gray-500">
                                        Surf to Earn Credits
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
