'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function uploadFileAction(formData: FormData): Promise<{ url?: string; error?: string }> {
    try {
        const token = await getAuthToken();
        const file = formData.get('file');

        if (!file) {
            return { error: 'No file provided' };
        }

        // Need to send as multipart/form-data
        // When using axios with FormData in Node environment, we need to handle headers
        const uploadData = new FormData();
        uploadData.append('file', file);

        const response = await api.post('/upload', uploadData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return { url: response.data.url };
    } catch (error: any) {
        console.error('Upload error:', error.response?.data || error.message);
        return { error: 'Failed to upload file' };
    }
}

export async function createNewsAction(prevState: any, formData: FormData) {
    try {
        const token = await getAuthToken();

        // Convert FormData to JSON object for the API
        const data = {
            title: formData.get('title'),
            category_id: formData.get('category_id'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'), // rich text html
            thumbnail: formData.get('thumbnail'), // url from previous upload
            is_featured: formData.get('is_featured') === 'true',
        };

        await api.post('/news', data, {
            headers: { Authorization: `Bearer ${token}` },
        });

        revalidatePath('/news');
    } catch (error: any) {
        console.error('Create news error:', error.response?.data || error.message);
        return { error: error.response?.data?.message || 'Failed to create news' };
    }

    redirect('/news');
}
