"use client";

import Link from "next/link";
import { User, LogIn, Search, Filter } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function HeaderContent() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for instant typing, but synced to URL
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
    const [isSearchOpen, setIsSearchOpen] = useState(!!searchParams.get('q'));
    const statusFilter = searchParams.get('status') || "all";
    const priorityFilter = searchParams.get('priority') || "all";

    // Debounce search query to URL
    useEffect(() => {
        const handler = setTimeout(() => {
            updateFilter('q', searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Do not show the generic header in the admin dashboard layout
    if (pathname && pathname.startsWith("/admin")) {
        return null;
    }

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // If not on home page, performing a search should route to home
        if (pathname !== '/') {
            router.push(`/?${params.toString()}`);
        } else {
            router.replace(`/?${params.toString()}`, { scroll: false });
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center p-2 sm:p-4 pointer-events-none">
            <header className={`pointer-events-auto w-full max-w-5xl rounded-3xl border border-white/60 bg-white/70 shadow-xl shadow-pink-500/10 backdrop-blur-xl transition-all duration-300 ${pathname === '/' ? 'p-3 sm:p-4' : 'px-4 py-2 sm:px-6 sm:py-3 rounded-full'}`}>
                <div className="flex h-12 sm:h-14 items-center justify-between">
                    {/* Logo / Home Link */}
                    <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                        <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center overflow-hidden rounded-full shadow-sm shadow-pink-200">
                            <Image src="/logoHeadere.png" alt="Logo" fill className="object-cover" />
                        </div>
                        <span className="hidden whitespace-nowrap text-lg font-fredoka text-pink-600 sm:block sm:text-xl">
                            Princess Wishlist
                        </span>
                    </Link>

                    {/* Right side actions - Login / Profile / Search Toggle */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {pathname === '/' && (
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className={`flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full border transition-all shadow-sm cursor-pointer ${isSearchOpen || searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                                    ? "bg-pink-50 border-pink-200 text-pink-600 shadow-pink-100"
                                    : "bg-white/80 border-white/60 text-slate-500 hover:bg-white hover:text-pink-600 hover:border-pink-100"
                                    }`}
                                title="Tìm kiếm & Bộ lọc"
                            >
                                <Search className="h-4 w-4" />
                                {/* Optional: show a small dot if filters are active but panel is closed */}
                                {!isSearchOpen && (searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
                                    <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-pink-500 border-2 border-white"></span>
                                )}
                            </button>
                        )}
                        <Link
                            href="/login"
                            className="flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-1.5 sm:py-2 text-sm font-semibold text-pink-600 shadow-sm transition-all hover:bg-white hover:text-pink-700 hover:shadow-md active:scale-95"
                        >
                            <LogIn className="h-4 w-4" />
                            <span className="hidden sm:inline">Đăng nhập</span>
                        </Link>
                    </div>
                </div>

                {/* Search & Filters Section - Only visible on the homepage AND when toggled open */}
                {pathname === '/' && isSearchOpen && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-pink-100/60 flex flex-col md:flex-row gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Search Input */}
                        <div className="relative flex-1 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors pointer-events-none">
                                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm món quà vợ đang me..."
                                className="w-full bg-white/80 border-2 border-transparent hover:border-pink-100 rounded-2xl py-2.5 sm:py-3 pl-11 pr-10 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-50 transition-all shadow-sm"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 p-1 bg-white hover:bg-rose-50 rounded-full transition-colors"
                                    title="Xóa tìm kiếm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            )}
                        </div>

                        {/* Filters Row */}
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0 hide-scrollbar">
                            {/* Status Switcher as Tabs */}
                            <div className="flex p-1 bg-slate-100/80 rounded-2xl shrink-0">
                                <button
                                    onClick={() => updateFilter('status', 'all')}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${statusFilter === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
                                >
                                    Tất cả
                                </button>
                                <button
                                    onClick={() => updateFilter('status', 'wishing')}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${statusFilter === "wishing" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
                                >
                                    Đang ước
                                </button>
                                <button
                                    onClick={() => updateFilter('status', 'bought')}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${statusFilter === "bought" ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
                                >
                                    Đã chốt
                                </button>
                            </div>

                            {/* Priority Dropdown */}
                            <div className="relative shrink-0">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                    <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </div>
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => updateFilter('priority', e.target.value)}
                                    className="appearance-none bg-white border border-slate-200 hover:border-pink-200 rounded-2xl py-2 sm:py-2.5 pl-8 sm:pl-9 pr-9 sm:pr-10 text-xs sm:text-sm font-medium text-slate-700 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50 transition-all cursor-pointer shadow-sm h-full"
                                >
                                    <option value="all">Sắp xếp: Mặc định</option>
                                    <option value="must-have">Rất Mê ❤️‍🔥</option>
                                    <option value="high">Thích 💖</option>
                                    <option value="normal">Vui 💗</option>
                                </select>
                                <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}

export default function Header() {
    return (
        <Suspense fallback={null}>
            <HeaderContent />
        </Suspense>
    );
}
