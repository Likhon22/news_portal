'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { News, PaginatedResponse } from '@/types';

export async function getNewsAction(page = 1, limit = 10, sort = 'latest'): Promise<PaginatedResponse<News> | { error: string }> {
    try {
        const token = await getAuthToken();
        const response = await api.get(`/news?page=${page}&limit=${limit}&sort=${sort}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch news:', error.message);
        return { error: 'Failed to fetch news' };
    }
}

export async function getNewsBySlug(slug: string): Promise<News | { error: string }> {
    try {
        const response = await api.get(`/news/${slug}`);
        return response.data;
    } catch (error: any) {
        return { error: 'Failed to fetch news' };
    }
}

export async function createNewsAction(prevState: any, formData: FormData) {
    try {
        const token = await getAuthToken();

        await api.post('/news', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // Don't set Content-Type manually, axios will handle it with boundary
            },
        });

        revalidatePath('/news');
        return { success: true };
    } catch (error: any) {
        console.error('Create news error:', error.response?.data || error.message);
        return { error: error.response?.data?.message || 'Failed to create news' };
    }
}

export async function updateNewsAction(id: string, prevState: any, formData: FormData) {
    try {
        const token = await getAuthToken();

        await api.put(`/news/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // Don't set Content-Type manually, axios will handle it with boundary
            },
        });

        revalidatePath('/news');
        return { success: true };
    } catch (error: any) {
        console.error('Update news error:', error.response?.data || error.message);
        return { error: error.response?.data?.message || 'Failed to update news' };
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
