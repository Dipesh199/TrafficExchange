"use client";

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Globe, Activity, ArrowUpRight, LogOut, CreditCard, BarChart2, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Websites', href: '/websites', icon: Globe },
    { name: 'Earn Credits', href: '/earn', icon: Activity },
    { name: 'Create Campaign', href: '/spend', icon: ArrowUpRight },
    { name: 'Buy Credits', href: '/billing', icon: CreditCard },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const username = user?.username || 'User';
    const userInitial = username.charAt(0).toUpperCase();
    const credits = typeof user?.credits === 'number' ? user.credits.toFixed(2) : '0.00';

    return (
        <ProtectedRoute>
            <div className="flex flex-col md:flex-row flex-1" style={{ background: '#f0fafa' }}>

                {/* Sidebar */}
                <aside className="w-full md:w-56 bg-white border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0">
                    <div className="p-5">
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                            <div className="w-9 h-9 rounded-full bg-[#6dc8c2] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {userInitial}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{username}</p>
                                <p className="text-xs text-[#5bbcb5] font-medium truncate">{credits} credits</p>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="space-y-0.5">
                            {navigation.map(item => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${isActive
                                            ? 'bg-[#6dc8c2]/15 text-[#3d9e97]'
                                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4 flex-shrink-0" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            {user?.role === 'admin' && (
                                <Link href="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${pathname === '/admin' ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}>
                                    <Shield className="w-4 h-4 flex-shrink-0" />
                                    Admin Panel
                                </Link>
                            )}
                        </nav>

                        {/* Sign Out */}
                        <div className="mt-6 pt-5 border-t border-gray-100">
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
