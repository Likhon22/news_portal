import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Users, Eye } from 'lucide-react';
import { getDashboardStats } from './actions';
import { OverviewCharts } from '@/components/custom/OverviewCharts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const statsData = await getDashboardStats();

    const stats = [
        {
            title: 'Total News',
            value: statsData?.total_news.toString() || '0',
            icon: Newspaper,
            description: 'Published articles',
        },
        {
            title: 'Active Users',
            value: statsData?.total_users.toString() || '0',
            icon: Users,
            description: 'Registered users',
        },
        {
            title: 'Total Views',
            value: statsData?.total_views.toLocaleString() || '0',
            icon: Eye,
            description: 'Across all articles',
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <OverviewCharts
                categoryStats={statsData?.category_stats || []}
                topNews={statsData?.top_news || []}
            />
        </div>
    );
}
