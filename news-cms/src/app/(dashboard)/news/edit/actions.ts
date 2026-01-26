'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { News } from '@/types';

export async function getNewsBySlug(slug: string): Promise<News | { error: string }> {
    try {
        const response = await api.get(`/news/${slug}`);
        return response.data;
    } catch (error: any) {
        return { error: 'Failed to fetch news' };
    }
}

export async function updateNewsAction(id: string, prevState: any, formData: FormData) {
    try {
        const token = await getAuthToken();

        await api.put(`/news/${id}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        revalidatePath('/news');
        return { success: true };
    } catch (error: any) {
        console.error('Update news error:', error.response?.data || error.message);
        return { error: error.response?.data?.message || 'Failed to update news' };
    }
}
