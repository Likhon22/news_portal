'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { uploadFileAction } from '@/app/(dashboard)/news/create/actions';
import { TipTapEditor } from '@/components/custom/TipTapEditor';
import { Category, News } from '@/types';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    category_id: z.string().min(1, 'Category is required'),
    excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
    content: z.string().min(20, 'Content must be at least 20 characters'),
    is_featured: z.boolean(),
    // Thumbnail is handled separately via upload but we validate it exists
    thumbnail: z.string().min(1, 'Thumbnail is required'),
});

interface NewsFormProps {
    categories: Category[];
    initialData?: News;
    action: (prevState: any, formData: FormData) => Promise<any>;
}

export function NewsForm({ categories, initialData, action: serverAction }: NewsFormProps) {
    const [uploading, setUploading] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnail || null);

    // Server Action State
    const [state, formAction, isPending] = useActionState(serverAction, null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || '',
            category_id: initialData?.category_id || '',
            excerpt: initialData?.excerpt || '',
            content: initialData?.content || '',
            is_featured: initialData ? initialData.is_featured : false,
            thumbnail: initialData?.thumbnail || '',
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadFileAction(formData);

        setUploading(false);

        if (result.error) {
            toast.error(result.error);
        } else if (result.url) {
            form.setValue('thumbnail', result.url);
            setThumbnailPreview(result.url);
            toast.success('Image uploaded successfully');
        }
    };

    return (
        <Form {...form}>
            <form action={formAction} onSubmit={(evt) => {
                evt.preventDefault();
                form.handleSubmit(() => {
                    // Create FormData manually to pass to server action because we need to combine hook form data
                    const formData = new FormData();
                    const values = form.getValues();
                    Object.entries(values).forEach(([key, value]) => {
                        formData.append(key, String(value));
                    });
                    formAction(formData);
                })(evt);
            }} className="space-y-8 max-w-3xl">

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="News Headline" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8">
                                <div className="space-y-0.5">
                                    <FormLabel>Featured News</FormLabel>
                                    <FormDescription>
                                        Show on the homepage slider
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FormControl>
                                <div className="flex gap-4 items-center">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                    {uploading && <Loader2 className="animate-spin" />}
                                </div>
                            </FormControl>
                            <input type="hidden" {...field} />
                            <FormMessage />
                            {thumbnailPreview && (
                                <div className="mt-2 relative h-40 w-full max-w-xs border rounded overflow-hidden">
                                    <Image src={thumbnailPreview} alt="Preview" fill className="object-cover" />
                                </div>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Excerpt (Short Description)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief summary of the news..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <TipTapEditor
                                    content={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending || uploading}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {initialData ? 'Updating...' : 'Publish News'}
                            </>
                        ) : (
                            initialData ? 'Update News' : 'Publish News'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
