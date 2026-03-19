"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Play, Pause, AlertTriangle, RefreshCcw } from 'lucide-react';

export default function EarnPage() {
    const { user, token, refreshUser } = useAuth();
    const [isSurfing, setIsSurfing] = useState(false);
    const [currentSite, setCurrentSite] = useState<{ url: string; id: string; duration: number } | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [sessionCredits, setSessionCredits] = useState(0);
    const [error, setError] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isSurfing && timeLeft === 0 && !currentSite) fetchNextSite();
    }, [isSurfing, timeLeft, currentSite]);

    useEffect(() => {
        if (isSurfing && currentSite && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) { clearInterval(timerRef.current!); verifyView(); return 0; }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isSurfing, currentSite]);

    const toggleSurfing = () => {
        if (isSurfing) {
            setIsSurfing(false);
            if (timerRef.current) clearInterval(timerRef.current);
            setCurrentSite(null); setTimeLeft(0); setSessionCredits(0);
        } else { setIsSurfing(true); setError(''); setSessionCredits(0); }
    };

    const fetchNextSite = async () => {
        try {
            const res = await fetch('/api/traffic/surf', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Could not find available sites.');
            }

            const data = await res.json();
            setCurrentSite({ id: data.sessionId, url: data.url, duration: data.duration });
            setTimeLeft(data.duration);
        } catch (err: any) {
            setError(err.message || 'Could not find available sites.');
            setIsSurfing(false);
        }
    };

    const verifyView = async () => {
        if (!currentSite) return;
        try {
            const res = await fetch('/api/traffic/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId: currentSite.id, token: 'placeholder' })
            });

            if (res.ok) {
                const data = await res.json();
                // Track earned amount for this session's badge display
                setSessionCredits(p => p + (data.creditsEarned || 0));

                // Pull the authoritative balance from the server
                await refreshUser();
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error('Verify failed:', res.status, errorData);
            }
        } catch (e) {
            console.error('Verification failed', e);
        }
        setCurrentSite(null);
        fetchNextSite();
    };

    const pct = currentSite ? Math.round(((currentSite.duration - timeLeft) / currentSite.duration) * 100) : 0;

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-5 h-[calc(100vh-80px)]">

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Earn Credits</h1>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">Keep this tab active while surfing</p>
                </div>
                <div className="flex items-center gap-3">
                    {sessionCredits > 0 && (
                        <span className="text-xs font-bold uppercase tracking-wider text-[#3d9e97] bg-[#6dc8c2]/15 px-3 py-1.5 rounded">
                            +{sessionCredits.toFixed(1)} credits earned
                        </span>
                    )}
                    <button onClick={toggleSurfing}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${isSurfing
                            ? 'border border-red-200 text-red-500 hover:bg-red-50'
                            : 'bg-[#6dc8c2] text-white hover:bg-[#5bbcb5]'
                            }`}>
                        {isSurfing ? <><Pause className="w-3.5 h-3.5" />Stop</> : <><Play className="w-3.5 h-3.5" />Start Autosurf</>}
                    </button>
                </div>
            </div>

            {/* Viewer box */}
            <div className="bg-white border border-gray-100 rounded-lg flex-1 flex flex-col overflow-hidden min-h-0">

                {/* Toolbar */}
                <div className="h-11 border-b border-gray-100 px-4 flex items-center justify-between gap-4 bg-gray-50 shrink-0">
                    <div className="flex items-center gap-3">
                        {isSurfing && currentSite && (
                            <>
                                <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#6dc8c2] rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs font-mono font-bold text-gray-600 tabular-nums">{timeLeft}s</span>
                            </>
                        )}
                        {isSurfing && !currentSite && !error && (
                            <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                <span className="w-3 h-3 border border-[#6dc8c2] border-t-transparent rounded-full animate-spin inline-block"></span>
                                Finding next site…
                            </span>
                        )}
                        {!isSurfing && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Idle</span>}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        {isSurfing && currentSite && (
                            <button onClick={fetchNextSite} className="text-[10px] font-bold uppercase tracking-wide text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                                <RefreshCcw className="w-3 h-3" /> Skip
                            </button>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                            Balance: <span className="text-gray-700">{(user?.credits ?? 0).toFixed(2)}</span>
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-[#f0fafa] relative min-h-0">
                    {!isSurfing && !error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-14 h-14 rounded-full border-2 border-[#6dc8c2]/30 flex items-center justify-center mb-5">
                                <Play className="w-5 h-5 text-[#6dc8c2] ml-0.5" />
                            </div>
                            <h3 className="text-base font-bold text-gray-700 mb-1">Start the Autosurf Engine</h3>
                            <p className="text-sm text-gray-400 max-w-sm mb-5">
                                Earn <strong className="text-[#3d9e97]">0.5 credits</strong> for every verified 15-second view. Keep this tab visible.
                            </p>
                            <div className="flex items-start gap-2 text-left text-xs text-gray-500 bg-white border border-gray-100 p-3 rounded-lg max-w-sm">
                                <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                                Do not switch tabs — the timer pauses to ensure traffic quality.
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                            <AlertTriangle className="w-8 h-8 text-red-300 mb-3" />
                            <h3 className="font-bold text-red-500 mb-2 text-sm">Surfing Stopped</h3>
                            <p className="text-xs text-gray-400 mb-5">{error}</p>
                            <button onClick={toggleSurfing} className="px-4 py-2 text-xs font-bold uppercase tracking-wide border border-gray-200 rounded hover:bg-gray-50 transition-colors">Retry</button>
                        </div>
                    )}
                    {isSurfing && currentSite && (
                        <iframe src={currentSite.url} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" title="Surfed Website" />
                    )}
                </div>
            </div>
        </div>
    );
}
