"use client";

import { m, LazyMotion, domAnimation } from "framer-motion";
import { Search, Edit2, Trash2, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

// Extended Mock Data for Pagination testing
const initialMockGifts = [
    { id: "1", name: "Son Dior Lip Glow màu 012 Rosewood", price: 850000, imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop", status: "wishing", priority: "must-have", date: "2024-03-08" },
    { id: "2", name: "Váy hoa nhí Vintage MiuMiu", price: 450000, imageUrl: "https://images.unsplash.com/photo-1515347619362-e6fdfffa839e?q=80&w=800&auto=format&fit=crop", status: "bought", priority: "high", date: "2024-03-07" },
    { id: "3", name: "Túi xách Charles & Keith thắt nơ", price: 1250000, imageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop", status: "wishing", priority: "normal", date: "2024-03-06" },
    { id: "4", name: "Nước hoa Chanel Chance Eau Tendre", price: 3500000, imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop", status: "wishing", priority: "must-have", date: "2024-03-05" },
    { id: "5", name: "Gấu bông Capybara khổng lồ", price: 650000, imageUrl: "https://images.unsplash.com/photo-1562043236-559c3b65a6d2?q=80&w=800&auto=format&fit=crop", status: "wishing", priority: "high", date: "2024-03-04" },
    { id: "6", name: "Set mỹ phẩm Skincare Kiehl's", price: 2150000, imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop", status: "bought", priority: "must-have", date: "2024-03-03" },
    { id: "7", name: "Giày Sneaker MLB Chunky Liner", price: 2800000, imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop", status: "wishing", priority: "normal", date: "2024-03-02" },
    { id: "8", name: "Máy uống tóc Dyson Airwrap", price: 15000000, imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop", status: "wishing", priority: "must-have", date: "2024-03-01" },
];

export default function AdminGiftsPage() {
    // --- States for Filtering and Pagination ---
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // "all", "wishing", "bought"
    const [priorityFilter, setPriorityFilter] = useState("all"); // "all", "must-have", "high", "normal"
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // --- Filter Logic ---
    const filteredGifts = useMemo(() => {
        return initialMockGifts.filter((gift) => {
            const matchesSearch = gift.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || gift.status === statusFilter;
            const matchesPriority = priorityFilter === "all" || gift.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [searchQuery, statusFilter, priorityFilter]);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredGifts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentGifts = filteredGifts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, priorityFilter]);

    return (
        <LazyMotion features={domAnimation}>
            <div className="max-w-6xl w-full mx-auto space-y-6 sm:space-y-8">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="w-full sm:w-auto text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-fredoka text-pink-600">Quản Lý Quà Tặng 🎁</h1>
                        <p className="text-sm sm:text-base text-slate-500 mt-1">Nơi lưu giữ các option vòi vĩnh của vợ iu</p>
                    </div>
                    <Link
                        href="/add"
                        className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-5 py-2.5 rounded-full font-semibold shadow-md shadow-pink-200 hover:shadow-lg transition-all hover:-translate-y-0.5 w-full sm:w-auto text-center"
                    >
                        + Thêm quà mới
                    </Link>
                </div>

                {/* Filters and Data Table Section */}
                <div className="bg-white/80 border border-pink-100 rounded-3xl shadow-sm backdrop-blur-md overflow-hidden flex flex-col">

                    {/* Filters Head */}
                    <div className="p-4 sm:p-6 border-b border-pink-50 flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-xl font-fredoka text-slate-800 hidden sm:block">Danh Sách ({filteredGifts.length}) 📝</h2>
                            <div className="relative w-full sm:w-72 sm:ml-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm theo tên quà..."
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-800 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                                <select
                                    className="bg-transparent text-sm text-slate-600 outline-none shrink-0"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả Trạng thái</option>
                                    <option value="wishing">Đang chờ mua</option>
                                    <option value="bought">Đã chốt đơn</option>
                                </select>
                                <div className="h-4 w-[1px] bg-slate-200 shrink-0 mx-1"></div>
                                <select
                                    className="bg-transparent text-sm text-slate-600 outline-none shrink-0"
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả Ưu tiên</option>
                                    <option value="must-have">Rất Mê ❤️‍🔥</option>
                                    <option value="high">Thích 💖</option>
                                    <option value="normal">Vui 💗</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50/50 text-slate-500">
                                <tr>
                                    <th className="font-medium px-6 py-4">Sản Phẩm</th>
                                    <th className="font-medium px-6 py-4">Giá Tiền</th>
                                    <th className="font-medium px-6 py-4">Độ Ưu Tiên</th>
                                    <th className="font-medium px-6 py-4">Trạng Thái</th>
                                    <th className="font-medium px-6 py-4 text-right">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pink-50">
                                {currentGifts.length > 0 ? currentGifts.map((gift) => (
                                    <tr key={gift.id} className="hover:bg-pink-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-pink-100 relative">
                                                    <Image src={gift.imageUrl} alt={gift.name} fill className="object-cover" />
                                                </div>
                                                <div className="max-w-[200px]">
                                                    <p className="font-medium text-slate-800 truncate">{gift.name}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{gift.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-700">
                                            {formatPrice(gift.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${gift.priority === "must-have" ? "bg-red-100 text-red-600" :
                                                gift.priority === "high" ? "bg-orange-100 text-orange-600" :
                                                    "bg-blue-100 text-blue-600"
                                                }`}>
                                                {gift.priority === "must-have" ? "Rất Mê ❤️‍🔥" : gift.priority === "high" ? "Thích 💖" : "Có cũng vui 💗"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Beautiful Toggle Switch representation */}
                                            <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${gift.status === 'bought' ? 'bg-green-400' : 'bg-pink-200'}`}>
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${gift.status === 'bought' ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/edit/${gift.id}`} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Không tìm thấy món quà nào phù hợp.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden flex flex-col divide-y divide-pink-50 min-h-[400px]">
                        {currentGifts.length > 0 ? currentGifts.map((gift) => (
                            <div key={gift.id} className="p-4 flex flex-col gap-3">
                                {/* Top row: Image & Basic Info */}
                                <div className="flex gap-3">
                                    <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-pink-100 relative">
                                        <Image src={gift.imageUrl} alt={gift.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 line-clamp-2 text-sm">{gift.name}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="font-semibold text-slate-700 text-sm">{formatPrice(gift.price)}</p>
                                            <p className="text-xs text-slate-400">{gift.date}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom row: Actions & Tags */}
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex gap-2 items-center">
                                        <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${gift.status === 'bought' ? 'bg-green-400' : 'bg-pink-200'}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${gift.status === 'bought' ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${gift.priority === "must-have" ? "bg-red-100 text-red-600" :
                                            gift.priority === "high" ? "bg-orange-100 text-orange-600" :
                                                "bg-blue-100 text-blue-600"
                                            }`}>
                                            {gift.priority === "must-have" ? "Rất Mê ❤️‍🔥" : gift.priority === "high" ? "Thích 💖" : "Vui 💗"}
                                        </span>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Link href={`/edit/${gift.id}`} className="p-2 block text-slate-400 hover:text-blue-500 bg-blue-50/50 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 className="h-4 w-4" />
                                        </Link>
                                        <button className="p-2 block text-slate-400 hover:text-red-500 bg-red-50/50 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                Không tìm thấy món quà nào.
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-pink-50 flex items-center justify-between bg-slate-50/30 mt-auto">
                            <p className="text-xs sm:text-sm text-slate-500">
                                Hiển thị <span className="font-semibold text-slate-700">{startIndex + 1}</span> - <span className="font-semibold text-slate-700">{Math.min(startIndex + ITEMS_PER_PAGE, filteredGifts.length)}</span> trên <span className="font-semibold text-slate-700">{filteredGifts.length}</span> món
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center"
                                >
                                    <ChevronLeft className="h-4 w-4 sm:hidden" />
                                    <span className="hidden sm:inline text-sm font-medium">Trước</span>
                                </button>

                                <span className="text-sm font-medium text-slate-700 hidden sm:block px-2">
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center"
                                >
                                    <ChevronRight className="h-4 w-4 sm:hidden" />
                                    <span className="hidden sm:inline text-sm font-medium">Sau</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LazyMotion>
    );
}
