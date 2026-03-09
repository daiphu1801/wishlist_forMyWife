"use client";

import { m, LazyMotion, domAnimation } from "framer-motion";
import { Gift, Heart, CreditCard, Clock, Search, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import Link from "next/link";
import Image from "next/image";

// Mock Data for Chart
const chartData = [
    { name: "T2", wishes: 2, bought: 0 },
    { name: "T3", wishes: 3, bought: 1 },
    { name: "T4", wishes: 5, bought: 2 },
    { name: "T5", wishes: 4, bought: 2 },
    { name: "T6", wishes: 7, bought: 3 },
    { name: "T7", wishes: 8, bought: 5 },
    { name: "CN", wishes: 10, bought: 7 },
];

// Mock Data for Table
const mockGifts = [
    {
        id: "1",
        name: "Son Dior Lip Glow màu 012 Rosewood",
        price: 850000,
        imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
        status: "wishing",
        priority: "must-have",
        date: "2024-03-08",
    },
    {
        id: "2",
        name: "Váy hoa nhí Vintage MiuMiu",
        price: 450000,
        imageUrl: "https://images.unsplash.com/photo-1515347619362-e6fdfffa839e?q=80&w=800&auto=format&fit=crop",
        status: "bought",
        priority: "high",
        date: "2024-03-07",
    },
    {
        id: "3",
        name: "Túi xách Charles & Keith thắt nơ",
        price: 1250000,
        imageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop",
        status: "wishing",
        priority: "normal",
        date: "2024-03-06",
    },
    {
        id: "4",
        name: "Nước hoa Chanel Chance Eau Tendre",
        price: 3500000,
        imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
        status: "wishing",
        priority: "must-have",
        date: "2024-03-05",
    },
];

export default function AdminDashboardPage() {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <LazyMotion features={domAnimation}>
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
                            <p className="text-lg sm:text-2xl font-bold text-slate-800">12</p>
                        </div>
                    </div>
                    <div className="bg-white/80 p-4 sm:p-5 rounded-3xl border border-green-100 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0">
                            <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Đã Chốt Đơn</p>
                            <p className="text-lg sm:text-2xl font-bold text-slate-800">5</p>
                        </div>
                    </div>
                    <div className="bg-white/80 p-4 sm:p-5 rounded-3xl border border-orange-100 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Đang Chờ Mua</p>
                            <p className="text-lg sm:text-2xl font-bold text-slate-800">7</p>
                        </div>
                    </div>
                    <div className="bg-white/80 p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center shrink-0">
                            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Để làm em bé cườiiii</p>
                            <p className="text-base sm:text-xl font-bold text-slate-800">6.050K</p>
                        </div>
                    </div>
                </div>

                {/* Line Chart Section */}
                <div className="bg-white/80 border border-pink-100 rounded-3xl shadow-sm backdrop-blur-md p-4 sm:p-6 overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-fredoka text-slate-800">Tiến Độ Chốt Đơn 📈</h2>
                        <Link
                            href="/admin/gifts"
                            className="text-sm font-medium text-pink-500 hover:text-pink-600 hover:underline flex items-center gap-1 w-full sm:w-auto justify-end"
                        >
                            Xem tất cả <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                        </Link>
                    </div>
                    <div className="h-[250px] sm:h-[300px] w-full -ml-4 sm:ml-0 overflow-visible">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWishes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBought" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#fbcfe8', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" name="Số điều ước" dataKey="wishes" stroke="#f472b6" strokeWidth={3} fillOpacity={1} fill="url(#colorWishes)" />
                                <Area type="monotone" name="Đã mua" dataKey="bought" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorBought)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </LazyMotion>
    );
}
