import { getAdminStats, getGifts } from "@/actions/gift";
import { Gift, Heart, CreditCard, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function AdminDashboardPage() {
    const [statsResult, giftsResult] = await Promise.all([
        getAdminStats(),
        getGifts(),
    ]);

    const stats = statsResult.success ? statsResult.stats! : { totalGifts: 0, totalBought: 0, totalWishes: 0, totalPrice: 0 };
    const recentGifts = giftsResult.success ? giftsResult.gifts!.slice(0, 4) : [];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const formatCompactPrice = (price: number) => {
        if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1).replace(".", ",")}tr`;
        if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
        return formatPrice(price);
    };

    return (
        <div className="max-w-6xl w-full mx-auto space-y-6 sm:space-y-8">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-fredoka text-pink-600">Hoàng Tử Dashboard 👑</h1>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">Quản lý những điều ước của bé bấy bì</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white/80 p-4 sm:p-5 rounded-3xl border border-pink-100 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shrink-0">
                        <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Tổng Món Quà</p>
                        <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats.totalGifts}</p>
                    </div>
                </div>
                <div className="bg-white/80 p-4 sm:p-5 rounded-3xl border border-green-100 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0">
                        <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Đã Chốt Đơn</p>
                        <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats.totalBought}</p>
                    </div>
                </div>
                <div className="bg-white/80 p-4 sm:p-5 rounded-3xl border border-orange-100 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Đang Chờ Mua</p>
                        <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats.totalWishes}</p>
                    </div>
                </div>
                <div className="bg-white/80 p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Để làm em bé cườiiii</p>
                        <p className="text-base sm:text-xl font-bold text-slate-800">{formatCompactPrice(stats.totalPrice)}</p>
                    </div>
                </div>
            </div>

            {/* Recent Gifts Section */}
            <div className="bg-white/80 border border-pink-100 rounded-3xl shadow-sm backdrop-blur-md overflow-hidden">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-pink-50">
                    <h2 className="text-lg sm:text-xl font-fredoka text-slate-800">Mới Thêm Gần Đây 🎁</h2>
                    <Link
                        href="/admin/gifts"
                        className="text-sm font-medium text-pink-500 hover:text-pink-600 hover:underline flex items-center gap-1"
                    >
                        Xem tất cả <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </Link>
                </div>
                {recentGifts.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">Chưa có món quà nào. Thêm ngay nào! 🎁</div>
                ) : (
                    <div className="divide-y divide-pink-50">
                        {recentGifts.map((gift) => (
                            <Link key={gift.id} href={`/gift/${gift.id}`} className="flex items-center gap-4 px-4 sm:px-6 py-4 hover:bg-pink-50/30 transition-colors">
                                <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-pink-100 relative">
                                    <Image src={gift.imageUrl} alt={gift.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 truncate text-sm">{gift.name}</p>
                                    <p className="text-xs text-pink-500 font-semibold mt-0.5">{formatPrice(gift.price)}</p>
                                </div>
                                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    gift.status === "bought" ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-700"
                                }`}>
                                    {gift.status === "bought" ? "Đã chốt" : "Đang ước"}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
