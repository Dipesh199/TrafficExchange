"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, Package, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface CreditPackage { id: string; name: string; credits: number; price: number; currency: string; }
interface Payment { id: string; amount: number; currency: string; status: string; createdAt: string; gatewayRef: string; }

export default function BillingPage() {
    const { token, user, updateUser } = useAuth();
    const [packages, setPackages] = useState<CreditPackage[]>([]);
    const [history, setHistory] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
        Promise.all([
            fetch('/api/billing/packages').then(r => r.ok ? r.json() : []),
            token ? fetch('/api/billing/history', { headers }).then(r => r.ok ? r.json() : []) : Promise.resolve([])
        ]).then(([pkgs, hist]) => {
            setPackages(Array.isArray(pkgs) ? pkgs : []);
            setHistory(Array.isArray(hist) ? hist : []);
        }).finally(() => setLoading(false));
    }, [token]);

    const handleBuy = async (pkg: CreditPackage) => {
        if (!token) return;
        setPurchasing(pkg.id); setError(''); setSuccessMsg('');
        try {
            // Step 1: Create payment intent
            const intentRes = await fetch('/api/billing/intent', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageId: pkg.id })
            });
            if (!intentRes.ok) throw new Error((await intentRes.json()).message || 'Failed to create payment');
            const { paymentId } = await intentRes.json();

            // Step 2: Confirm payment (production: this would go via Stripe redirect)
            const confirmRes = await fetch(`/api/billing/confirm/${paymentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!confirmRes.ok) throw new Error((await confirmRes.json()).message || 'Payment confirmation failed');
            const data = await confirmRes.json();

            // Update credit balance in context
            updateUser({ credits: data.newBalance });
            setSuccessMsg(`Successfully purchased ${pkg.credits} credits! New balance: ${data.newBalance.toFixed(2)}`);

            // Refresh history
            fetch('/api/billing/history', { headers: { 'Authorization': `Bearer ${token}` } })
                .then(r => r.ok ? r.json() : []).then(setHistory);
        } catch (err: any) {
            setError(err.message || 'Purchase failed.');
        } finally {
            setPurchasing(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">Buy Credits</h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Purchase credits to run your traffic campaigns</p>
            </div>

            {successMsg && (
                <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-3 rounded-lg">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    {successMsg}
                </div>
            )}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
            )}

            {/* Current Balance */}
            <div className="bg-gradient-to-r from-[#6dc8c2] to-[#3d9e97] rounded-lg p-5 mb-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest opacity-75 mb-1">Current Balance</p>
                <p className="text-3xl font-bold">{(user?.credits ?? 0).toFixed(2)} <span className="text-sm font-normal opacity-75">credits</span></p>
            </div>

            {/* Packages */}
            <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Credit Packages</h2>
            {loading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#6dc8c2] border-t-transparent rounded-full animate-spin" /></div>
            ) : packages.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-lg p-10 text-center">
                    <Package className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No packages available right now. Check back soon.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {packages.map(pkg => (
                        <div key={pkg.id} className="bg-white border border-gray-100 rounded-lg p-5 flex flex-col">
                            <div className="mb-4">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{pkg.name}</p>
                                <p className="text-2xl font-bold text-gray-800">{pkg.credits.toLocaleString()} <span className="text-sm font-normal text-gray-400">credits</span></p>
                                <p className="text-lg font-bold text-[#3d9e97] mt-1">${pkg.price.toFixed(2)} <span className="text-xs font-normal text-gray-400">{pkg.currency}</span></p>
                            </div>
                            <p className="text-[10px] text-gray-300 mb-4">${(pkg.price / pkg.credits * 100).toFixed(3)} per 100 credits</p>
                            <button
                                onClick={() => handleBuy(pkg)}
                                disabled={!token || purchasing === pkg.id}
                                className="mt-auto w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded bg-[#6dc8c2] text-white hover:bg-[#5bbcb5] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                            >
                                {purchasing === pkg.id ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CreditCard className="w-3.5 h-3.5" /><span>Buy Now</span></>}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Transaction History */}
            <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Payment History</h2>
            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                {history.length === 0 ? (
                    <div className="py-10 text-center">
                        <Clock className="w-7 h-7 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No transactions yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</th>
                                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Reference</th>
                                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {history.map(p => (
                                <tr key={p.id}>
                                    <td className="px-5 py-3 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td className="px-5 py-3 font-semibold text-gray-700">${Number(p.amount).toFixed(2)} {p.currency}</td>
                                    <td className="px-5 py-3 text-gray-400 font-mono">{p.gatewayRef?.slice(0, 20)}…</td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.status === 'completed' ? 'bg-green-50 text-green-600' : p.status === 'failed' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'}`}>{p.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
