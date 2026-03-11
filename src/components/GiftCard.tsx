"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ExternalLink, Trash2, Edit2, Gift, CheckCircle2 } from "lucide-react";
import { m } from "framer-motion";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteGift, updateGiftStatus } from "@/actions/gift";

export type GiftItem = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    url?: string;
    status: "wishing" | "bought";
    priority: "normal" | "high" | "must-have";
    notes?: string;
};

interface GiftCardProps {
    gift: GiftItem;
    priority?: boolean;
}

export default function GiftCard({ gift, priority = false }: GiftCardProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [deleteTarget, setDeleteTarget] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const handleDeleteConfirm = () => {
        setDeleteTarget(false);
        startTransition(async () => {
            await deleteGift(gift.id);
            router.refresh();
        });
    };

    const handleStatusToggle = () => {
        const next = gift.status === "wishing" ? "bought" : "wishing";
        startTransition(async () => {
            await updateGiftStatus(gift.id, next);
            router.refresh();
        });
    };

    return (
        <>
        <m.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            className={`group relative flex flex-row sm:flex-col overflow-hidden rounded-3xl sm:rounded-[2rem] border border-pink-100 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
        >
            {/* Image Container - Square on Mobile, Portrait on Desktop */}
            <div className="relative aspect-square sm:aspect-[4/5] w-32 sm:w-full shrink-0 overflow-hidden bg-pink-50">
                <Image
                    src={gift.imageUrl}
                    alt={gift.name}
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 50vw, 33vw"
                    priority={priority}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Badge - Hidden on very small mobile, shown on SM+ */}
                <div className="absolute left-3 top-3 hidden sm:block">
                    <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-md ${gift.status === "bought"
                            ? "bg-green-100/90 text-green-700"
                            : "bg-pink-100/90 text-pink-700"
                            }`}
                    >
                        {gift.status === "bought" ? (
                            <>
                                <Gift className="h-3 w-3" /> Chàng đã chốt đơn
                            </>
                        ) : (
                            <>
                                <Heart className="h-3 w-3" /> Đang ước
                            </>
                        )}
                    </span>
                </div>

                {/* Action buttons (Edit/Delete) - Absolute on SM+, hidden on Mobile */}
                <div className="absolute right-3 top-3 hidden flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:flex z-10">
                    <Link
                        href={`/gift/${gift.id}`}
                        title="Xem chi tiết"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition-colors hover:text-pink-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                    </Link>
                    <Link
                        href={`/edit/${gift.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm hover:text-pink-600"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Link>
                    <button onClick={() => setDeleteTarget(true)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm hover:text-red-500 cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-1 flex-col p-4">
                <Link href={`/gift/${gift.id}`} className="transition-colors hover:text-pink-500">
                    {/* Name */}
                    <h3 className="line-clamp-2 text-base font-fredoka text-pink-600 sm:text-lg sm:leading-snug">
                        {gift.name}
                    </h3>
                </Link>

                {/* Mobile Status Badge */}
                <div className="mt-2 sm:hidden">
                    <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${gift.status === "bought"
                            ? "bg-green-100 text-green-700"
                            : "bg-pink-100 text-pink-700"
                            }`}
                    >
                        {gift.status === "bought" ? "Đã chốt đơn" : "Đang ước"}
                    </span>
                </div>

                {gift.notes && (
                    <p className="mt-1.5 hidden line-clamp-1 text-sm text-slate-500 sm:block">
                        {gift.notes}
                    </p>
                )}

                <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-x-2 gap-y-3">
                    <span className="text-base font-bold text-pink-500 sm:text-lg shrink-0">
                        {formatPrice(gift.price)}
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                        {gift.url && (
                            <a
                                href={gift.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1.5 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-100 sm:flex shrink-0"
                            >
                                Link mua <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        )}
                        <button
                            onClick={handleStatusToggle}
                            title={gift.status === "wishing" ? "Chốt đơn" : "Hoàn tác - chưa mua"}
                            className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full shadow-md transition-colors cursor-pointer ${
                                gift.status === "bought"
                                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                                    : "bg-pink-500 text-white hover:bg-pink-600"
                            }`}
                        >
                            {gift.status === "bought" ? (
                                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            ) : (
                                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            )}
                        </button>

                        {/* Mobile Action Buttons */}
                        <div className="flex items-center gap-1 sm:hidden">
                            <Link
                                href={`/edit/${gift.id}`}
                                title="Chỉnh sửa"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-400 hover:bg-blue-100 shrink-0"
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                            </Link>
                            <button
                                title="Xóa món quà"
                                onClick={() => setDeleteTarget(true)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 shrink-0 cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                            <Link
                                href={`/gift/${gift.id}`}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </m.div>

        {/* Custom Delete Confirmation Dialog */}
        {deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteTarget(false)} />
                <div className="relative bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm mx-auto flex flex-col gap-4">
                    <div className="text-center">
                        <div className="text-4xl mb-2">🗑️</div>
                        <h3 className="text-lg font-fredoka text-slate-800">Xóa món quà này?</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            <span className="font-semibold text-slate-700">&quot;{gift.name}&quot;</span> sẽ bị xóa khỏi danh sách. Không thể hoàn tác nhé!
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setDeleteTarget(false)}
                            className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Thôi
                        </button>
                        <button
                            onClick={handleDeleteConfirm}
                            className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors shadow-md shadow-red-100 cursor-pointer"
                        >
                            Xóa luôn
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
