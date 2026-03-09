"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MockPlatformUser } from '@/lib/types/auth';

const mockPlatformUsers: MockPlatformUser[] = [
    { email: 'admin@test.com', password: '123456', role: 'superadmin' },
    { email: 'merchant@test.com', password: '123456', role: 'merchant', status: 'active' },
    { email: 'pending@test.com', password: '123456', role: 'merchant', status: 'pending' },
    { email: 'rejected@test.com', password: '123456', role: 'merchant', status: 'rejected' },
];

export function usePlatformAuth() {
    const [user, setUser] = useState<MockPlatformUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem('platform_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<MockPlatformUser> => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const foundUser = mockPlatformUsers.find(
            (u) => u.email === email && u.password === password
        );

        if (foundUser) {
            if (foundUser.role === 'merchant' && foundUser.status === 'rejected') {
                setIsLoading(false);
                throw new Error("Your account has been rejected. Contact support.");
            }

            localStorage.setItem('platform_user', JSON.stringify(foundUser));
            setUser(foundUser);
            setIsLoading(false);
            return foundUser;
        } else {
            setIsLoading(false);
            throw new Error("Invalid email or password");
        }
    };

    const logout = () => {
        localStorage.removeItem('platform_user');
        setUser(null);
        router.push('/login');
    };

    return { user, login, logout, isLoading };
}
