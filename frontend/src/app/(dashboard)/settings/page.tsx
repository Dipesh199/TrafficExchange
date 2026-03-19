"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, AlertCircle, User, Lock } from 'lucide-react';

export default function SettingsPage() {
    const { user, token, updateUser } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true); setProfileMsg(null);
        try {
            const res = await fetch('/api/users/me', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim() })
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Update failed');
            const updated = await res.json();
            updateUser({ username: updated.username });
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setProfileMsg({ type: 'error', text: err.message });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'New passwords do not match.' }); return;
        }
        if (newPassword.length < 8) {
            setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters.' }); return;
        }
        setPasswordLoading(true); setPasswordMsg(null);
        try {
            const res = await fetch('/api/users/me', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });
            if (!res.ok) throw new Error((await res.json()).message || 'Update failed');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        } catch (err: any) {
            setPasswordMsg({ type: 'error', text: err.message });
        } finally {
            setPasswordLoading(false);
        }
    };

    const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6dc8c2] transition-colors bg-white";

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800">Account Settings</h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Manage your profile and security</p>
            </div>

            {/* Profile */}
            <div className="bg-white border border-gray-100 rounded-lg p-6 mb-5">
                <div className="flex items-center gap-2 mb-5">
                    <User className="w-4 h-4 text-[#6dc8c2]" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Profile Information</h2>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Email</label>
                        <input type="text" value={user?.email || ''} disabled className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                        <p className="text-[10px] text-gray-300 mt-1">Email cannot be changed.</p>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={inputCls} required minLength={3} maxLength={50} />
                    </div>
                    {profileMsg && (
                        <div className={`flex items-center gap-2 text-xs px-3 py-2.5 rounded ${profileMsg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                            {profileMsg.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {profileMsg.text}
                        </div>
                    )}
                    <button type="submit" disabled={profileLoading} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#6dc8c2] text-white rounded-lg hover:bg-[#5bbcb5] disabled:opacity-40 transition-colors">
                        {profileLoading ? 'Saving…' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Password */}
            <div className="bg-white border border-gray-100 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Lock className="w-4 h-4 text-[#6dc8c2]" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Change Password</h2>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputCls} required minLength={8} placeholder="Min. 8 characters" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputCls} required placeholder="Repeat new password" />
                    </div>
                    {passwordMsg && (
                        <div className={`flex items-center gap-2 text-xs px-3 py-2.5 rounded ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                            {passwordMsg.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {passwordMsg.text}
                        </div>
                    )}
                    <button type="submit" disabled={passwordLoading} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#6dc8c2] text-white rounded-lg hover:bg-[#5bbcb5] disabled:opacity-40 transition-colors">
                        {passwordLoading ? 'Changing…' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
