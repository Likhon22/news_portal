import { getCategoriesAction } from './actions';
import { CategoryTable } from '@/components/custom/CategoryTable';

export default async function CategoriesPage() {
    const result = await getCategoriesAction();

    if ('error' in result) {
        return <div className="p-4 text-red-500">Error: {result.error}</div>;
    }

    return (
        <CategoryTable data={result || []} />
    );
}
