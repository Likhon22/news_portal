'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { News, PaginatedResponse } from '@/types';

export async function getNewsAction(page = 1, limit = 10): Promise<PaginatedResponse<News> | { error: string }> {
    try {
        const token = await getAuthToken();
        const response = await api.get(`/news?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch news:', error.message);
        return { error: 'Failed to fetch news' };
    }
}

export async function deleteNewsAction(id: string) {
    try {
        const token = await getAuthToken();
        await api.delete(`/news/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        revalidatePath('/news');
        return { success: true };
    } catch (error: any) {
        return { error: error.response?.data?.message || 'Failed to delete news' };
    }
}
