import api from '@/lib/api';
import { Category } from '@/types/category';

export const categoryService = {
    getAll: async () => {
        const { data } = await api.get<Category[]>('/categories');
        return data;
    },
};
