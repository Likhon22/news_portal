'use client';

import Layout from '@/components/layout/Layout';
import Card from '@/components/common/Card';
import { notFound, useParams } from 'next/navigation';
import { useNews } from '@/hooks/queries/useNews';
import { useCategories } from '@/hooks/queries/useCategories';

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params?.category as string;

    const { data: categories, isLoading: isCatsLoading } = useCategories();
    const { data: newsData, isLoading: isNewsLoading } = useNews({ category: categorySlug });

    if (isCatsLoading || isNewsLoading) {
        return <div className="py-20 text-center text-gray-400 font-bold italic">খবর লোড হচ্ছে...</div>;
    }

    const category = categories?.find((c) => c.slug === categorySlug);
    if (!category) {
        notFound();
    }

    const categoryArticles = newsData?.newsList || [];

    return (
        <Layout>
            <div className="py-8 md:py-12">
                <div className="border-b-4 border-primary mb-12">
                    <h1 className="text-4xl md:text-5xl font-black py-4 uppercase tracking-tighter italic">
                        {category.name_bn || category.name}
                    </h1>
                </div>

                {categoryArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                        {categoryArticles.map((article) => (
                            <Card key={article.id} article={article} variant="medium" />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500 font-bold text-xl">
                        এই বিভাগে বর্তমানে কোনো সংবাদ নেই।
                    </div>
                )}
            </div>
        </Layout>
    );
}
