"use client";

import Link from 'next/link';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16">
            <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between gap-6">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-[#6dc8c2] flex items-center justify-center">
                        <Activity className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm tracking-widest uppercase font-bold text-gray-700">Neon.Today</span>
                </Link>

                {/* Center Nav — always horizontal, hidden on very small screens */}
                <nav className="hidden sm:flex items-center gap-6">
                    <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
                    <a href="/#how-it-works" className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors">How It Works</a>
                    <Link href="/pricing" className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
                    {isAuthenticated && (
                        <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
                    )}
                </nav>

                {/* Right side auth */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                    {isAuthenticated ? (
                        <button
                            onClick={logout}
                            className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Log Out
                        </button>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/register"
                                className="text-xs font-semibold uppercase tracking-wider text-[#6dc8c2] border border-[#6dc8c2] rounded-full px-4 py-1.5 hover:bg-[#6dc8c2] hover:text-white transition-all"
                            >
                                Sign Up For Free
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger — only shows below sm breakpoint */}
                <button
                    className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="sm:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 z-50 px-5 py-4 flex flex-col gap-4">
                    <Link href="/" onClick={() => setMobileOpen(false)} className="text-xs font-semibold uppercase tracking-wider text-gray-600">Home</Link>
                    <a href="/#how-it-works" onClick={() => setMobileOpen(false)} className="text-xs font-semibold uppercase tracking-wider text-gray-600">How It Works</a>
                    <Link href="/pricing" onClick={() => setMobileOpen(false)} className="text-xs font-semibold uppercase tracking-wider text-gray-600">Pricing</Link>
                    {isAuthenticated ? (
                        <button onClick={() => { logout(); setMobileOpen(false); }} className="text-left text-xs font-semibold uppercase tracking-wider text-red-500">Log Out</button>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setMobileOpen(false)} className="text-xs font-semibold uppercase tracking-wider text-gray-600">Log In</Link>
                            <Link href="/register" onClick={() => setMobileOpen(false)} className="self-start text-xs font-semibold uppercase tracking-wider text-[#6dc8c2] border border-[#6dc8c2] rounded-full px-4 py-1.5">Sign Up For Free</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
