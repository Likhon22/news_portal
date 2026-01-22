import { CategoryForm } from '@/components/custom/CategoryForm';
import { updateCategoryAction, getCategoriesAction } from '../../actions';

// Fetch single category? API doesn't have public single category by ID endpoint usually used by frontend?
// Let's check backend. CategoryHandler.ListCategories is there. GetCategoryBySlug is there.
// But we have ID. The ListCategories returns all. We can filter.
// Or we can assume there might be a GetCategoryById?
// Checking backend storage adapter... ListCategories, GetCategoryBySlug. No GetCategoryById.
// So we'll fetch all and find by ID.

export default async function EditCategoryPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const id = params.id;

    const categories = await getCategoriesAction();

    if ('error' in categories || !Array.isArray(categories)) {
        return <div className="text-red-500">Error loading category.</div>;
    }

    const category = categories.find((c) => c.id === id);

    if (!category) {
        return <div className="text-red-500">Category not found.</div>;
    }

    const updateActionWithId = updateCategoryAction.bind(null, id);

    return (
        <div className="max-w-4xl mx-auto py-6">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Edit Category</h2>
            <CategoryForm initialData={category} action={updateActionWithId} />
        </div>
    );
}
