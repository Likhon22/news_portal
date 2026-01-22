'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCategories } from '@/hooks/queries/useCategories';
import { FacebookIcon, TwitterIcon, YouTubeIcon, SearchIcon, CloseIcon } from '@/components/common/Icons';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const { data: categories, isLoading, error } = useCategories();

    useEffect(() => {
        const handleScroll = () => {
            if (typeof window !== 'undefined') {
                setIsSticky(window.scrollY > 80);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const renderNavItems = () => {
        if (isLoading) return <div className="text-gray-400 text-sm italic">লোড হচ্ছে...</div>;
        if (error) return null;
        if (!categories) return null;

        return (
            <ul className="flex items-center gap-x-12">
                {categories.map((cat) => (
                    <li key={cat.id}>
                        <Link
                            href={`/${cat.slug}`}
                            className="text-[17px] font-black text-gray-900 hover:text-primary transition-colors tracking-tight whitespace-nowrap uppercase italic"
                        >
                            {cat.name_bn || cat.name}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    };

    const renderMenuLinks = () => {
        if (isLoading || error || !categories) return null;

        return categories.map((cat) => (
            <Link
                key={cat.id}
                href={`/${cat.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl md:text-4xl font-black text-gray-900 hover:text-primary transition-all text-left md:text-center italic border-l-4 md:border-l-0 md:border-b-4 border-transparent hover:border-primary pl-4 md:pl-0 pb-1 md:pb-4 truncate md:overflow-visible"
            >
                {cat.name_bn || cat.name}
            </Link>
        ));
    };

    return (
        <>
            {/* 
                FINAL DESKTOP HEADER LOGIC:
                - Static State: Full Branding (100px) + Navigation (60px).
                - Sticky State: Header translates UP by 100px, so Branding is hidden and NAV is fixed at top.
                - Search Icon stays in the branding row ONLY (one place, no animation).
            */}
            <header
                className={`w-full bg-white z-[150] border-b border-gray-100 transition-transform duration-500 fixed top-0 left-0
                ${isSticky ? 'md:-translate-y-[100px] shadow-sm' : 'translate-y-0'}`}
            >
                {/* Top Red Bar */}
                <div className="w-full h-1 bg-primary"></div>

                <div className="container px-4">
                    {/* --- MOBILE HEADER --- */}
                    <div className="md:hidden flex items-center h-[56px] relative">
                        <div className="w-1/4 flex justify-start">
                            <button className="p-2 text-3xl" onClick={() => setIsMenuOpen(true)}>
                                <span className="font-bold text-gray-900">☰</span>
                            </button>
                        </div>
                        <div className="w-1/2 flex justify-center">
                            <Link href="/">
                                <h1 className="text-3xl font-black text-primary tracking-tighter italic">খবর</h1>
                            </Link>
                        </div>
                        <div className="w-1/4 flex justify-end">
                            <button className="text-gray-400 p-2">
                                <SearchIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* --- DESKTOP HEADER --- */}
                    <div className="hidden md:flex flex-col">
                        {/* Branding Row - 100px (Search Icon fixed here) */}
                        <div className="flex items-center justify-between h-[100px]">
                            <div className="w-1/3 flex items-center gap-6">
                                <Link href="#" className="p-1 text-gray-400 hover:text-primary transition-all"><FacebookIcon className="w-5 h-5" /></Link>
                                <Link href="#" className="p-1 text-gray-400 hover:text-primary transition-all"><TwitterIcon className="w-4 h-4" /></Link>
                                <Link href="#" className="p-1 text-gray-400 hover:text-primary transition-all"><YouTubeIcon className="w-5 h-5" /></Link>
                            </div>

                            <div className="w-1/3 flex justify-center">
                                <Link href="/">
                                    <h1 className="text-[70px] leading-none font-black text-primary tracking-tighter italic select-none">খবর</h1>
                                </Link>
                            </div>

                            <div className="w-1/3 flex justify-end items-center gap-8 text-gray-400">
                                <div className="text-right">
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-600">মঙ্গলবার, ২০ জানুয়ারি ২০২৬</p>
                                </div>
                                <button className="hover:text-primary transition-all">
                                    <SearchIcon className="w-7 h-7" />
                                </button>
                            </div>
                        </div>

                        {/* Category Navigation - Stays fixed at top when header translates up */}
                        <div className="flex items-center h-[60px] border-t border-gray-50">
                            <nav className="flex items-center justify-center w-full">
                                {renderNavItems()}
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-[56px] md:h-[160px]"></div>

            {/* Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-white z-[200] overflow-y-auto animate-in fade-in duration-300">
                    <div className="container px-6 py-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-16 border-b border-gray-50 pb-8">
                            <Link href="/" onClick={() => setIsMenuOpen(false)}>
                                <h1 className="text-6xl md:text-8xl font-black text-primary italic tracking-tighter">খবর</h1>
                            </Link>
                            <button onClick={() => setIsMenuOpen(false)} className="text-gray-900">
                                <CloseIcon className="w-12 h-12" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-10 gap-y-6 md:gap-y-16 max-w-7xl mx-auto w-full mb-20 px-4">
                            {renderMenuLinks()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
