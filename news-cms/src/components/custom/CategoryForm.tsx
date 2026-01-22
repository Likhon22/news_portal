'use client';

import { useActionState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    name_bn: z.string().optional(),
    description: z.string().optional(),
});

interface CategoryFormProps {
    initialData?: any; // strict typing 'Category' might miss name_bn if not in interface yet
    action: (prevState: any, formData: FormData) => Promise<any>;
}

export function CategoryForm({ initialData, action: serverAction }: CategoryFormProps) {
    const [state, formAction, isPending] = useActionState(serverAction, null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || '',
            name_bn: initialData?.name_bn || '',
            description: initialData?.description || '',
        },
    });

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Form {...form}>
            <form action={formAction} onSubmit={(evt) => {
                evt.preventDefault();
                form.handleSubmit(() => {
                    const formData = new FormData();
                    const values = form.getValues();
                    Object.entries(values).forEach(([key, value]) => {
                        if (value) formData.append(key, String(value));
                    });
                    formAction(formData);
                })(evt);
            }} className="space-y-8 max-w-xl">

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name (English)</FormLabel>
                            <FormControl>
                                <Input placeholder="Technology" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name_bn"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name (Bangla)</FormLabel>
                            <FormControl>
                                <Input placeholder="প্রযুক্তি" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Category description..."
                                    className="resize-none"
                                    {...field}
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
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {initialData ? 'Updating...' : 'Create Category'}
                            </>
                        ) : (
                            initialData ? 'Update Category' : 'Create Category'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
