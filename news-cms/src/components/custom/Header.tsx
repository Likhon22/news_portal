'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/(auth)/login/actions';
import { LogOut } from 'lucide-react';
import { MobileSidebar } from './MobileSidebar';

import { useState, useEffect } from 'react';
import { getMeAction } from '@/app/(auth)/login/auth.actions';
import { User } from '@/types';

export function Header() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const result = await getMeAction();
            if (!('error' in result)) {
                setUser(result);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await logoutAction();
    };

    const userInitials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'AD';

    return (
        <header className="flex h-14 md:h-16 items-center justify-between border-b px-4 md:px-6 bg-white">
            <div className="flex items-center gap-4">
                <MobileSidebar />
                <div className="text-sm font-medium text-gray-500 hidden sm:block truncate max-w-[200px]">
                    Welcome, {user?.name || 'Admin'}
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs md:text-sm">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                    <LogOut className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                </Button>
            </div>
        </header>
    );
}
