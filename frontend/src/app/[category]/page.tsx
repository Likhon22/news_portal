'use client';

import Layout from '@/components/layout/Layout';
import { notFound, useParams } from 'next/navigation';
import { useCategories } from '@/hooks/queries/useCategories';
import InfiniteNewsList from '@/components/sections/InfiniteNewsList';

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params?.category as string;

    const { data: categories, isLoading: isCatsLoading } = useCategories();

    if (isCatsLoading) {
        return <div className="py-20 text-center text-gray-400 font-bold italic">খবর লোড হচ্ছে...</div>;
    }

    const category = categories?.find((c) => c.slug === categorySlug);
    if (!category) {
        notFound();
    }

    return (
        <Layout>
            <div className="py-8 md:py-12">
                <div className="border-b-4 border-primary mb-12">
                    <h1 className="text-4xl md:text-5xl font-black py-4 uppercase tracking-tighter italic">
                        {category.name_bn || category.name}
                    </h1>
                </div>

                <InfiniteNewsList category={categorySlug} />
            </div>
        </Layout>
    );
}
