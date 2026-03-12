"use client";

import Link from "next/link";
import { User, LogIn, Search, Filter, Crown, Heart, LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useRef } from "react";
import { logout } from "@/actions/auth";

interface HeaderClientProps {
    role: string | null;
}

function HeaderContent({ role }: HeaderClientProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for instant typing, but synced to URL
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
    const [isSearchOpen, setIsSearchOpen] = useState(!!searchParams.get('q'));
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const statusFilter = searchParams.get('status') || "all";
    const priorityFilter = searchParams.get('priority') || "all";

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

    // Debounce search query to URL
    useEffect(() => {
        const handler = setTimeout(() => {
            updateFilter('q', searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Handle click outside to close the user menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Do not show the generic header in the admin dashboard layout
    if (pathname && pathname.startsWith("/admin")) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
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
                        
                        {role === 'myfiance' && (
                            <div className="relative flex items-center gap-2" ref={userMenuRef}>
                                <button 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 sm:py-2 text-sm font-semibold text-pink-600 shadow-sm transition-all hover:bg-pink-100 hover:text-pink-700 hover:shadow-md active:scale-95"
                                    title="Menu người dùng"
                                >
                                    <div className="relative flex h-5 w-5 items-center justify-center">
                                        <User className="h-4 w-4 absolute" />
                                        <Heart className="h-2.5 w-2.5 absolute -top-1 -right-1 text-pink-500 fill-pink-500 drop-shadow-sm" />
                                    </div>
                                    <span className="hidden sm:inline">Vợ Yêu</span>
                                </button>
                                
                                {isUserMenuOpen && (
                                    <div className="absolute top-[calc(100%+12px)] right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="relative rounded-2xl border border-pink-100 bg-white p-1.5 shadow-xl shadow-pink-500/10 min-w-[140px]">
                                            <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 rounded-tl-sm border-l border-t border-pink-100 bg-white"></div>
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="relative flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-pink-600 transition-colors hover:bg-pink-50 cursor-pointer"
                                            >
                                                <User className="h-4 w-4" />
                                                Quản lý
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="relative flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-pink-600 transition-colors hover:bg-pink-50 cursor-pointer"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {role === 'prince' && (
                            <div className="relative flex items-center gap-2" ref={userMenuRef}>
                                <button 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 sm:py-2 text-sm font-semibold text-blue-600 shadow-sm transition-all hover:bg-blue-100 hover:text-blue-700 hover:shadow-md active:scale-95"
                                    title="Menu hệ thống"
                                >
                                    <div className="relative flex h-5 w-5 items-center justify-center">
                                        <User className="h-4 w-4 absolute" />
                                        <Crown className="h-3 w-3 absolute -top-1.5 right-0 text-amber-500 fill-amber-300 drop-shadow-sm rotate-12" />
                                    </div>
                                    <span className="hidden sm:inline">Hoàng Tử</span>
                                </button>
                                
                                {isUserMenuOpen && (
                                    <div className="absolute top-[calc(100%+12px)] right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="relative rounded-2xl border border-blue-100 bg-white p-1.5 shadow-xl shadow-blue-500/10 min-w-[140px]">
                                            <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 rounded-tl-sm border-l border-t border-blue-100 bg-white"></div>
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="relative flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 cursor-pointer"
                                            >
                                                <User className="h-4 w-4" />
                                                Quản trị
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="relative flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 cursor-pointer"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {!role && (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-1.5 sm:py-2 text-sm font-semibold text-pink-600 shadow-sm transition-all hover:bg-white hover:text-pink-700 hover:shadow-md active:scale-95"
                            >
                                <LogIn className="h-4 w-4" />
                                <span className="hidden sm:inline">Đăng nhập</span>
                            </Link>
                        )}
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

export default function HeaderClient({ role }: HeaderClientProps) {
    return (
        <Suspense fallback={null}>
            <HeaderContent role={role} />
        </Suspense>
    );
}
