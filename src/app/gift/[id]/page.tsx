"use client";

import { m, LazyMotion, domAnimation } from "framer-motion";
import { ArrowLeft, ExternalLink, Edit2, Heart, Gift, MoreHorizontal, LinkIcon, AlignLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// Tạm thời dùng mock data để minh họa UI
const mockGift = {
    id: "1",
    name: "Son Dior Lip Glow màu 012 Rosewood",
    price: 850000,
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
    url: "https://shopee.vn",
    status: "wishing" as "wishing" | "bought", // "wishing" | "bought"
    priority: "must-have", // "normal" | "high" | "must-have"
    notes: "Màu hồng đất xinh lắmmmmm, đánh lên tự nhiên như màu môi thật luôn đó chồng yêu ơi. Lấy đúng mã màu 012 dùm em nhaaa 🥺",
    dateAdded: "08/03/2024"
};

export default function GiftDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="relative min-h-screen overflow-hidden bg-slate-50 font-sans selection:bg-pink-200">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                </div>

                <main className="relative z-10 mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8">
                    {/* Navigation Bar */}
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex items-center justify-between"
                    >
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-pink-500 cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" /> Quay lại
                        </button>

                        <Link
                            href={`/ edit / ${id} `}
                            className="flex items-center gap-2 rounded-full border border-pink-200 bg-white/50 px-4 py-2 text-sm font-medium text-pink-600 shadow-sm backdrop-blur-md transition-colors hover:bg-pink-50 hover:text-pink-700"
                        >
                            <Edit2 className="h-4 w-4" /> Chỉnh sửa
                        </Link>
                    </m.div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Image Column */}
                        <m.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-pink-100 bg-white/80 shadow-xl shadow-pink-100/50"
                        >
                            <Image
                                src={mockGift.imageUrl}
                                alt={mockGift.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                            <div className="absolute left-4 top-4">
                                <span
                                    className={`flex items - center gap - 1.5 rounded - full px - 4 py - 2 text - sm font - medium shadow - sm backdrop - blur - md ${mockGift.status === "bought"
                                        ? "bg-green-100/90 text-green-700"
                                        : "bg-pink-100/90 text-pink-700"
                                        } `}
                                >
                                    {mockGift.status === "bought" ? (
                                        <>
                                            <Gift className="h-4 w-4" /> Chàng đã chốt đơn
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="h-4 w-4" /> Đang ước
                                        </>
                                    )}
                                </span>
                            </div>
                        </m.div>

                        {/* Details Column */}
                        <m.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col justify-center gap-6"
                        >
                            <div>
                                <h1 className="text-3xl font-fredoka text-pink-600 md:text-4xl">
                                    {mockGift.name}
                                </h1>
                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <span className="text-3xl font-extrabold text-pink-500">
                                        {formatPrice(mockGift.price)}
                                    </span>
                                    {mockGift.priority === "must-have" && (
                                        <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600">
                                            Rất mê 😍
                                        </span>
                                    )}
                                </div>
                            </div>

                            {mockGift.notes && (
                                <div className="rounded-2xl border border-pink-100 bg-white/60 p-5 backdrop-blur-sm">
                                    <h3 className="mb-2 text-sm font-fredoka uppercase tracking-wider text-pink-600">Dặn dò từ bấy bì iuuu choa anh</h3>
                                    <p className="text-slate-700">{mockGift.notes}</p>
                                </div>
                            )}

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                {mockGift.url && (
                                    <a
                                        href={mockGift.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pink-100 px-6 py-4 font-semibold text-pink-600 transition-all hover:bg-pink-200"
                                    >
                                        Xem chổ mua <ExternalLink className="h-5 w-5" />
                                    </a>
                                )}
                                {mockGift.status === "wishing" && (
                                    <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 px-6 py-4 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/40">
                                        <Heart className="h-5 w-5" /> Đánh dấu đã chốt đơn
                                    </button>
                                )}
                            </div>
                        </m.div>
                    </div>
                </main>
            </div>
        </LazyMotion>
    );
}
