export interface Article {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    category: string;
    categorySlug: string;
    author: string;
    publishedAt: string;
    image: string;
    slug: string;
    isFeatured?: boolean;
}

export const articles: Article[] = [
    {
        id: '1',
        title: 'দেশের অর্থনীতিতে নতুন গতির সম্ভাবনা, আশাবাদী বিশেষজ্ঞরা',
        excerpt: 'সাম্প্রতিক অর্থনৈতিক সূচকগুলো ইতিবাচক পরিবর্তনের ইঙ্গিত দিচ্ছে। বিশেষজ্ঞরা মনে করছেন আগামী মাসগুলোতে প্রবৃদ্ধি আরও বাড়বে।',
        category: 'অর্থনীতি',
        categorySlug: 'economy',
        author: 'নিজস্ব প্রতিবেদক',
        publishedAt: '২০ জানুয়ারি ২০২৬',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800',
        slug: 'economy-growth-prospects',
        isFeatured: true,
    },
    {
        id: '2',
        title: 'প্রযুক্তির নতুন দিগন্ত: এআই বিপ্লবে বদলে যাচ্ছে কাজের ধরন',
        excerpt: 'কৃত্রিম বুদ্ধিমত্তা এখন আর কেবল কল্পনা নয়, বরং বাস্তব জীবনে এর প্রভাব অত্যন্ত গভীর। বিভিন্ন শিল্পে এটি আনছে বৈপ্লবিক পরিবর্তন।',
        category: 'প্রযুক্তি',
        categorySlug: 'technology',
        author: 'আইটি ডেস্ক',
        publishedAt: '১৯ জানুয়ারি ২০২৬',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        slug: 'ai-revolution-work-style',
        isFeatured: true,
    },
    {
        id: '3',
        title: 'বিপিএলে সাকিবের দুর্দান্ত অলরাউন্ড নৈপুণ্য',
        excerpt: 'মাগুরার এই তারকা ক্রিকেটার ব্যাটে-বলে সমান তালে উজ্জ্বল। তার নেতৃত্বে তার দল সহজ জয় তুলে নিয়েছে।',
        category: 'খেলা',
        categorySlug: 'sports',
        author: 'ক্রীড়া প্রতিবেদক',
        publishedAt: '২০ জানুয়ারি ২০২৬',
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
        slug: 'bpl-shakib-performance',
    },
    {
        id: '4',
        title: 'ঢাকায় আজ শুরু হচ্ছে আন্তর্জাতিক নাট্য উৎসব',
        excerpt: 'দশ দিনব্যাপী এই উৎসবে বিশ্বের সাতটি দেশের নাট্যদল অংশগ্রহণ করবে। সংস্কৃতি মন্ত্রণালয় এ অনুষ্ঠানের আয়োজন করেছে।',
        category: 'বিনোদন',
        categorySlug: 'entertainment',
        author: 'সংস্কৃতি প্রতিবেদক',
        publishedAt: '১৮ জানুয়ারি ২০২৬',
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
        slug: 'international-theatre-festival-dhaka',
    },
    {
        id: '5',
        title: 'শীতের সকালে কুয়াশাচ্ছন প্রকৃতির অপরূপ সৌন্দর্য',
        excerpt: 'উত্তরাঞ্চলের জেলাগুলোতে জেঁকে বসেছে শীত। কুয়াশার চাদরে ঢাকা প্রকৃতি যেন এক অন্য রূপ ধারণ করেছে।',
        category: 'বাংলাদেশ',
        categorySlug: 'bangladesh',
        author: 'নিজস্ব প্রতিনিধি',
        publishedAt: '২০ জানুয়ারি ২০২৬',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
        slug: 'winter-morning-beauty',
    },
    {
        id: '6',
        title: 'জলবায়ু পরিবর্তনে হুমকির মুখে উপকূলীয় অঞ্চল',
        excerpt: 'সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি পাওয়ায় লবণাক্ততা বাড়ছে আবাদি জমিতে। ভিটেমাটি হারানোর ঝুঁকিতে লক্ষ লক্ষ মানুষ।',
        category: 'মতামত',
        categorySlug: 'opinion',
        author: 'কলামিস্ট আজাদ',
        publishedAt: '১৭ জানুয়ারি ২০২৬',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
        slug: 'climate-change-coastal-threat',
    }
];
