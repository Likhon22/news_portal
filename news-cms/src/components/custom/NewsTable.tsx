'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { News } from '@/types';
import { deleteNewsAction } from '@/app/(dashboard)/news/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NewsTableProps {
    data: News[];
    totalPages: number;
    currentPage: number;
}

export function NewsTable({ data, totalPages, currentPage }: NewsTableProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const onConfirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        const result = await deleteNewsAction(deleteId);
        setIsDeleting(false);
        setDeleteId(null);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('News deleted successfully');
            router.refresh();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">News Articles</h2>
                <Link href="/news/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create News
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No news articles found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium max-w-[300px] truncate" title={article.title}>
                                        {article.title}
                                        {article.is_featured && (
                                            <Badge variant="secondary" className="ml-2 text-xs">Featured</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{article.category_name || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                                            {article.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{article.views_count}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/news/edit/${article.slug}`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => setDeleteId(article.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Basic Pagination Controls */}
            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => router.push(`/news?page=${currentPage - 1}`)}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    disabled={currentPage >= totalPages}
                    onClick={() => router.push(`/news?page=${currentPage + 1}`)}
                >
                    Next
                </Button>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the news article.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirmDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
