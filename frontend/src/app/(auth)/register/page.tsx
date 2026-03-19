"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Registration failed');
            // Account created — redirect to login
            setSuccess(true);
            setTimeout(() => router.push('/login?registered=true'), 1500);
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-teal flex items-center justify-center p-6">
            {/* Background shapes */}
            <div className="shape shape-circle-lg" style={{ top: '-60px', right: '-80px' }}></div>
            <div className="shape shape-circle-sm" style={{ bottom: '80px', left: '80px' }}></div>
            <div className="shape shape-circle-md" style={{ top: '40%', left: '-60px' }}></div>
            <div className="shape-tri" style={{ bottom: '-30px', right: '15%', transform: 'rotate(-15deg)' }}></div>

            {/* Floating card */}
            <div className="card-float w-full max-w-sm px-8 py-10">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Create Account</h1>
                <p className="text-center text-xs text-gray-400 mb-7">
                    Already a member?{' '}
                    <Link href="/login" className="text-[#5bbcb5] font-semibold hover:underline uppercase tracking-wide text-[10px]">
                        Log in
                    </Link>
                </p>

                {success && (
                    <div className="mb-5 text-sm text-[#3d9e97] bg-[#6dc8c2]/10 border border-[#6dc8c2]/30 rounded px-3 py-2.5">
                        Account created! Redirecting to login…
                    </div>
                )}

                {error && (
                    <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2.5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        { id: 'username', label: 'Username', type: 'text', value: username, setter: setUsername, ph: 'yourname' },
                        { id: 'email', label: 'Email address', type: 'email', value: email, setter: setEmail, ph: 'you@example.com' },
                        { id: 'password', label: 'Password', type: 'password', value: password, setter: setPassword, ph: '••••••••' },
                        { id: 'confirm', label: 'Confirm password', type: 'password', value: confirmPassword, setter: setConfirmPassword, ph: '••••••••' },
                    ].map(f => (
                        <div key={f.id}>
                            <label className="block text-xs text-gray-500 mb-1" htmlFor={f.id}>{f.label}</label>
                            <input
                                id={f.id}
                                type={f.type}
                                required
                                value={f.value}
                                onChange={(e) => f.setter(e.target.value)}
                                placeholder={f.ph}
                                className="w-full border-b border-gray-300 focus:border-[#5bbcb5] outline-none text-sm py-1.5 bg-transparent text-gray-800 placeholder-gray-300 transition-colors"
                            />
                        </div>
                    ))}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white bg-gray-700 hover:bg-gray-800 disabled:opacity-50 transition-colors rounded"
                        >
                            {isLoading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
