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

        // Check if thumbnail is a new file upload or existing string?
        // In NewsForm, we handle upload separately and put URL in 'thumbnail' input.

        const data = {
            title: formData.get('title'),
            category_id: formData.get('category_id'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            thumbnail: formData.get('thumbnail'),
            is_featured: formData.get('is_featured') === 'true',
        };

        await api.put(`/news/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });

        revalidatePath('/news');
    } catch (error: any) {
        console.error('Update news error:', error.response?.data || error.message);
        return { error: error.response?.data?.message || 'Failed to update news' };
    }

    redirect('/news');
}
