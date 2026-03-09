"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MockCustomer } from '@/lib/types/auth';

const mockCustomers: MockCustomer[] = [
    { storeSlug: 'demo-store', email: 'customer1@test.com', password: '123456', name: 'Ahmed Ali' },
    { storeSlug: 'demo-store', email: 'customer2@test.com', password: '123456', name: 'Sara Mohamed' },
    { storeSlug: 'other-store', email: 'customer1@test.com', password: '123456', name: 'Ahmed Ali (other store)' },
];

export function useStoreAuth(storeSlug: string) {
    const [customer, setCustomer] = useState<MockCustomer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const storageKey = `store_user_${storeSlug}`;

    useEffect(() => {
        const savedCustomer = localStorage.getItem(storageKey);
        if (savedCustomer) {
            setCustomer(JSON.parse(savedCustomer));
        }
        setIsLoading(false);
    }, [storageKey]);

    const login = async (email: string, password: string): Promise<MockCustomer> => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Get any newly registered customers from localStorage first
        const localCustomersStr = localStorage.getItem(`customers_${storeSlug}`);
        const localCustomers: MockCustomer[] = localCustomersStr ? JSON.parse(localCustomersStr) : [];

        const allCustomers = [...mockCustomers, ...localCustomers];

        const foundCustomer = allCustomers.find(
            (c) => c.storeSlug === storeSlug && c.email === email && c.password === password
        );

        if (foundCustomer) {
            localStorage.setItem(storageKey, JSON.stringify(foundCustomer));
            setCustomer(foundCustomer);
            setIsLoading(false);
            return foundCustomer;
        } else {
            setIsLoading(false);
            throw new Error("Invalid email or password");
        }
    };

    const logout = () => {
        localStorage.removeItem(storageKey);
        setCustomer(null);
        router.push(`/store/${storeSlug}/login`);
    };

    return { customer, login, logout, isLoading };
}
