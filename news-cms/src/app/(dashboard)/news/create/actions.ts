'use server';

import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNewsAction(prevState: any, formData: FormData) {
    try {
        const token = await getAuthToken();

        await api.post('/news', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        revalidatePath('/news');
    } catch (error: any) {
        console.error('Create news error:', error.response?.data || error.message);
        return { error: error.response?.data?.message || 'Failed to create news' };
    }

    redirect('/news');
}
