'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/(auth)/login/actions';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        await logoutAction();
        // Navigation is handled by redirect in action, or we can push here
    };

    return (
        <header className="flex h-16 items-center justify-between border-b px-6 bg-white">
            <div className="text-sm font-medium text-gray-500">Welcome, Admin</div>
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                    <LogOut className="h-5 w-5 text-gray-500" />
                </Button>
            </div>
        </header>
    );
}
