import { getNewsBySlug, updateNewsAction } from '../actions';
import { getCategoriesAction } from '@/app/(dashboard)/categories/actions';
import { NewsForm } from '@/components/custom/NewsForm';

export default async function EditNewsPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const params = await props.params;
    const slug = params.slug;

    const [news, categories] = await Promise.all([
        getNewsBySlug(slug),
        getCategoriesAction(),
    ]);

    if ('error' in news) {
        return <div className="text-red-500">News not found or error loading.</div>;
    }

    if ('error' in categories || !Array.isArray(categories)) {
        return <div className="text-red-500">Error loading categories.</div>;
    }

    const updateActionWithId = updateNewsAction.bind(null, news.id);

    return (
        <div className="max-w-4xl mx-auto py-6">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Edit Article</h2>
            <NewsForm
                categories={categories}
                initialData={news}
                action={updateActionWithId}
            />
        </div>
    );
}
