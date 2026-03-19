"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            login(data.access_token, data.user);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-teal flex items-center justify-center p-6">
            {/* Background shapes */}
            <div className="shape shape-circle-lg" style={{ top: '-80px', left: '-80px' }}></div>
            <div className="shape shape-circle-sm" style={{ top: '60px', right: '120px' }}></div>
            <div className="shape shape-circle-md" style={{ bottom: '-40px', left: '25%' }}></div>
            <div className="shape-tri" style={{ bottom: '20px', right: '-60px', transform: 'rotate(30deg)' }}></div>

            {/* Floating card */}
            <div className="card-float w-full max-w-sm px-8 py-10">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Log in</h1>
                <p className="text-center text-xs text-gray-400 mb-7">
                    New to Neon.Today?{' '}
                    <Link href="/register" className="text-[#5bbcb5] font-semibold hover:underline uppercase tracking-wide text-[10px]">
                        Sign up for free
                    </Link>
                </p>

                {error && (
                    <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2.5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1" htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-gray-300 focus:border-[#5bbcb5] outline-none text-sm py-1.5 bg-transparent text-gray-800 placeholder-gray-300 transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b border-gray-300 focus:border-[#5bbcb5] outline-none text-sm py-1.5 bg-transparent text-gray-800 placeholder-gray-300 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white bg-gray-700 hover:bg-gray-800 disabled:opacity-50 transition-colors rounded"
                        >
                            {isLoading ? 'Logging in…' : 'Log In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
