export interface Category {
    id: string;
    name: {
        bn: string;
        en: string;
    };
    slug: string;
}

export const categories: Category[] = [
    { id: '1', name: { bn: 'বাংলাদেশ', en: 'Bangladesh' }, slug: 'bangladesh' },
    { id: '2', name: { bn: 'আন্তর্জাতিক', en: 'International' }, slug: 'international' },
    { id: '3', name: { bn: 'অর্থনীতি', en: 'Economy' }, slug: 'economy' },
    { id: '4', name: { bn: 'মতামত', en: 'Opinion' }, slug: 'opinion' },
    { id: '5', name: { bn: 'খেলা', en: 'Sports' }, slug: 'sports' },
    { id: '6', name: { bn: 'বিনোদন', en: 'Entertainment' }, slug: 'entertainment' },
    { id: '7', name: { bn: 'প্রযুক্তি', en: 'Technology' }, slug: 'technology' },
    { id: '8', name: { bn: 'জীবনযাপন', en: 'Lifestyle' }, slug: 'lifestyle' },
];
