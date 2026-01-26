'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryViewStat, NewsViewStat } from '@/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface OverviewChartsProps {
    categoryStats: CategoryViewStat[];
    topNews: NewsViewStat[];
}

export function OverviewCharts({ categoryStats, topNews }: OverviewChartsProps) {
    return (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* Pie Chart: Category Views */}
            <Card>
                <CardHeader>
                    <CardTitle>Views by Category</CardTitle>
                </CardHeader>
                <CardContent className="pl-2 pb-6">
                    <div className="h-[350px] min-h-[350px] w-full">
                        {categoryStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <PieChart>
                                    <Pie
                                        data={categoryStats}
                                        cx="50%"
                                        cy="45%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={false}
                                    >
                                        {categoryStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        wrapperStyle={{ fontSize: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No data available
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Bar Chart: Top 5 News - Hidden on mobile */}
            <Card className="hidden lg:block">
                <CardHeader>
                    <CardTitle>Top 5 News (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        {topNews.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <BarChart data={topNews} layout="vertical" margin={{ top: 20, right: 30, left: 200, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis
                                        type="category"
                                        dataKey="id"
                                        width={190}
                                        tick={{ fontSize: 11 }}
                                        interval={0}
                                        tickFormatter={(id) => {
                                            const item = topNews.find(n => n.id === id);
                                            return item ? item.title : id;
                                        }}
                                    />
                                    <Tooltip
                                        labelFormatter={(id) => {
                                            const item = topNews.find(n => n.id === id);
                                            return item ? item.title : id;
                                        }}
                                    />
                                    <Bar dataKey="views" fill="#8884d8" name="Views" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No data available
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Mobile-only: Simple News List */}
            <Card className="lg:hidden">
                <CardHeader>
                    <CardTitle>Top 5 News (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {topNews.length > 0 ? (
                            topNews.map((news, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1 pr-4">
                                        <p className="text-sm font-medium line-clamp-2">{news.title}</p>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <p className="text-lg font-bold text-primary">{news.views}</p>
                                        <p className="text-xs text-gray-500">views</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-32 items-center justify-center text-muted-foreground">
                                No data available
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
