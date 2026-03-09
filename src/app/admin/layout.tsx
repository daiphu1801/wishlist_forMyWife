import { LayoutDashboard, Settings, Gift, Users } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans pt-6 sm:pt-32 pb-24 sm:pb-20">
            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Sidebar Desktop / Bottom Nav Mobile */}
            <nav className="fixed bottom-0 left-0 z-40 w-full bg-white/90 border-t border-pink-100 backdrop-blur-xl sm:bottom-auto sm:top-32 sm:left-4 sm:h-[calc(100vh-9rem)] sm:w-20 sm:rounded-3xl sm:border sm:shadow-sm sm:shadow-pink-100 flex sm:flex-col items-center justify-around sm:justify-start sm:py-6 sm:gap-6 pb-safe">
                <Link
                    href="/admin"
                    className="flex flex-col items-center gap-1 p-3 text-pink-600 transition-colors hover:text-pink-500 hover:bg-pink-50 rounded-xl"
                >
                    <LayoutDashboard className="h-6 w-6" />
                    <span className="text-[10px] font-medium sm:hidden">Tổng quan</span>
                </Link>
                <Link
                    href="/admin/gifts"
                    className="flex flex-col items-center gap-1 p-3 text-slate-400 transition-colors hover:text-pink-500 hover:bg-pink-50 rounded-xl"
                >
                    <Gift className="h-6 w-6" />
                    <span className="text-[10px] font-medium sm:hidden">Cửa hàng</span>
                </Link>
                <Link
                    href="/admin"
                    className="flex flex-col items-center gap-1 p-3 text-slate-400 transition-colors hover:text-pink-500 hover:bg-pink-50 rounded-xl mt-auto sm:mb-2"
                >
                    <Settings className="h-6 w-6" />
                    <span className="text-[10px] font-medium sm:hidden">Cài đặt</span>
                </Link>
            </nav>

            <main className="relative z-10 flex-1 px-4 sm:ml-28 sm:px-6">
                {children}
            </main>
        </div>
    );
}
