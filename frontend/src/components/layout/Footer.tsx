import { Activity } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-[#6dc8c2] flex items-center justify-center">
                                <Activity className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Neon.Today</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Premium traffic exchange network.<br />Providing reliable views since 2026.
                        </p>
                    </div>
                    {[
                        {
                            title: 'Services',
                            links: [
                                { label: 'Autosurfing', href: '/register' },
                                { label: 'Paid Traffic', href: '/pricing' },
                                { label: 'Dashboard', href: '/login' },
                            ]
                        },
                        {
                            title: 'Company',
                            links: [
                                { label: 'About Us', href: '#' },
                                { label: 'Contact', href: '#' },
                            ]
                        },
                        {
                            title: 'Legal',
                            links: [
                                { label: 'Terms of Service', href: '#' },
                                { label: 'Privacy Policy', href: '#' },
                                { label: 'Cookie Policy', href: '#' },
                            ]
                        },
                    ].map(col => (
                        <div key={col.title}>
                            <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{col.title}</h6>
                            <ul className="space-y-2">
                                {col.links.map(l => (
                                    <li key={l.label}>
                                        <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-900 transition-colors">{l.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-10 pt-6 border-t border-gray-50 text-center text-[11px] text-gray-300 uppercase tracking-widest">
                    © {new Date().getFullYear()} Neon.Today — All rights reserved
                </div>
            </div>
        </footer>
    );
}
