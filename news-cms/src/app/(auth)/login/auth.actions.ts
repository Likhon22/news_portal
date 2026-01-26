'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { User } from '@/types';

export async function getMeAction(): Promise<User | { error: string }> {
    try {
        const token = await getAuthToken();
        if (!token) return { error: 'Not authenticated' };

        const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch user:', error.message);
        return { error: 'Failed to fetch user profile' };
    }
}
