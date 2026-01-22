'use server';

import { api } from '@/lib/api';
import { DashboardStats } from '@/types';

export async function getDashboardStats(): Promise<DashboardStats | null> {
    try {
        const response = await api.get('/stats');
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch dashboard stats:', error.message);
        return null;
    }
}
