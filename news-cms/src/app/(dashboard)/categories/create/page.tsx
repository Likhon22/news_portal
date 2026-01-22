import { CategoryForm } from '@/components/custom/CategoryForm';
import { createCategoryAction } from '../actions';

export default function CreateCategoryPage() {
    return (
        <div className="max-w-4xl mx-auto py-6">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Create Category</h2>
            <CategoryForm action={createCategoryAction} />
        </div>
    );
}
