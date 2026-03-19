"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex flex-1 justify-center items-center">
                <span className="loading loading-spinner text-primary w-12 h-12"></span>
            </div>
        );
    }

    // Only render children if authenticated
    return isAuthenticated ? <>{children}</> : null;
}
