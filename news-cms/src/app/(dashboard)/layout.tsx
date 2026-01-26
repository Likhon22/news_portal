import { Sidebar } from '@/components/custom/Sidebar';
import { Header } from '@/components/custom/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
}
