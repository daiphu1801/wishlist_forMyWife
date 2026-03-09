"use client";

import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { convertToWebP, uploadToCloudinary } from "@/lib/upload";
import { getGiftById, updateGift } from "@/actions/gift";

export default function EditGiftPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const [giftName, setGiftName] = useState("");
    const [price, setPrice] = useState("");
    const [priority, setPriority] = useState("normal");
    const [link, setLink] = useState("");
    const [notes, setNotes] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchGift() {
            const result = await getGiftById(id);
            if (result.success && result.gift) {
                const g = result.gift;
                setGiftName(g.name);
                setPrice(String(g.price));
                setPriority(g.priority);
                setLink(g.url ?? "");
                setNotes(g.notes ?? "");
                setImageUrl(g.imageUrl);
            } else {
                showToast("error", "Không tìm thấy món quà này!");
                setTimeout(() => router.back(), 1500);
            }
            setIsLoading(false);
        }
        fetchGift();
    }, [id]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsConverting(true);
            // Clean up old preview object URL if it exists
            if (imageUrl && imageUrl.startsWith("blob:")) {
                URL.revokeObjectURL(imageUrl);
            }

            const webpFile = await convertToWebP(file);
            setImageFile(webpFile);

            // Show preview
            const previewUrl = URL.createObjectURL(webpFile);
            setImageUrl(previewUrl);
        } catch (error) {
            console.error("Lỗi chuyển đổi ảnh:", error);
            showToast("error", "Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại!");
        } finally {
            setIsConverting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let finalImageUrl = imageUrl;

        // Only upload if the user selected a new file
        if (imageFile) {
            try {
                setIsUploading(true);
                finalImageUrl = await uploadToCloudinary(imageFile);
                setImageUrl(finalImageUrl);
            } catch (error: unknown) {
                console.error("Lỗi upload ảnh:", error);
                showToast("error", error instanceof Error ? error.message : "Tải ảnh lên thất bại. Vui lòng thử lại!");
                setIsUploading(false);
                return;
            }
        }

        const result = await updateGift(id, {
            name: giftName,
            price: parseInt(price) || 0,
            imageUrl: finalImageUrl,
            url: link || undefined,
            priority,
            notes: notes || undefined,
        });

        setIsUploading(false);

        if (result.success) {
            showToast("success", "Cập nhật thành công! 🎀");
            setTimeout(() => router.push(`/gift/${id}`), 1500);
        } else {
            showToast("error", result.error || "Cập nhật thất bại, thử lại nhé!");
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-pink-500"></div>
            </div>
        );
    }

    return (
        <LazyMotion features={domAnimation}>
            {/* Toast notification */}
            <AnimatePresence>
                {toast && (
                    <m.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium ${
                            toast.type === "success"
                                ? "bg-white border border-green-100 text-green-700 shadow-green-100/50"
                                : "bg-white border border-red-100 text-red-600 shadow-red-100/50"
                        }`}
                    >
                        {toast.type === "success"
                            ? <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            : <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
                        {toast.message}
                    </m.div>
                )}
            </AnimatePresence>

            <div className="relative min-h-screen overflow-hidden bg-slate-50 font-sans selection:bg-pink-200">
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                </div>

                <main className="relative z-10 mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-slate-500 transition-colors hover:text-pink-500 cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" /> Quay lại
                        </button>
                    </m.div>

                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="overflow-hidden rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-xl shadow-pink-100/50 backdrop-blur-md sm:p-10"
                    >
                        <h1 className="mb-8 text-2xl font-fredoka text-pink-600">Sửa Lại Bảo Bối ✏️</h1>

                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            {/* Image Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">Hình Ảnh Khác Đẹp Hơn Nè 📸</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group relative flex aspect-square h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 text-pink-300 transition-all hover:border-pink-400 hover:text-pink-400"
                                    >
                                        {imageUrl ? (
                                            <>
                                                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover group-hover:opacity-50 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                                                    <ImageIcon className="h-8 w-8 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1">
                                                <ImageIcon className="h-6 w-6" />
                                                <span className="text-[10px] font-medium text-center leading-tight">Click để<br />đổi ảnh</span>
                                            </div>
                                        )}
                                        {isConverting && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500"></div>
                                            </div>
                                        )}
                                    </button>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <div className="rounded-2xl border border-pink-100 bg-white/50 px-4 py-3 text-sm text-slate-500">
                                            {imageFile ? (
                                                <span className="text-pink-600 font-medium truncate flex max-w-[200px] sm:max-w-[300px]">
                                                    {imageFile.name}
                                                    <span className="ml-2 whitespace-nowrap text-xs bg-pink-100 px-2 flex items-center rounded-full text-pink-500">
                                                        {(imageFile.size / 1024).toFixed(1)} KB
                                                    </span>
                                                </span>
                                            ) : (
                                                "Hoặc giữ nguyên ảnh cũ cũng xinh gòi..."
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">Tên Món Quà (Chắc Chắn Chưa?) 🎁</label>
                                <input
                                    type="text"
                                    required
                                    value={giftName}
                                    onChange={(e) => setGiftName(e.target.value)}
                                    placeholder="Ví dụ: Son Dior, Váy Miu, Túi xinh..."
                                    className="rounded-2xl border border-pink-100 bg-white/50 px-4 py-3 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* Price */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700">Chốt Lại Giá Đi Nè 💵</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="500000"
                                            className="w-full rounded-2xl border border-pink-100 bg-white/50 px-4 py-3 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100 pr-12"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">VNĐ</span>
                                    </div>
                                </div>

                                {/* Priority */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700">Mức Độ U Mê Gấp Rút Ko? 🥺</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="rounded-2xl border border-pink-100 bg-white/50 px-4 py-3 text-slate-700 outline-none transition-all focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
                                    >
                                        <option value="must-have">Phải có thuii (Rất Mê) ❤️‍🔥</option>
                                        <option value="high">Ưng bụng (Thích) 💖</option>
                                        <option value="normal">Có cũng vui (Bình Thường) 💗</option>
                                    </select>
                                </div>
                            </div>

                            {/* URL */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">Link Chỗ Bán Mua Nè 🛒</label>
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="Link Shopee, Tiktok, Facebook..."
                                    className="rounded-2xl border border-pink-100 bg-white/50 px-4 py-3 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
                                />
                            </div>

                            {/* Notes */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">Cần Dặn Nhắc Gì Hông? 📝</label>
                                <textarea
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Lấy size S cho em nhóee..."
                                    className="rounded-2xl border border-pink-100 bg-white/50 px-4 py-3 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100 resize-none"
                                />
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/40 disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {isUploading ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                    ) : (
                                        <Save className="h-5 w-5" />
                                    )}
                                    {isUploading ? "Đang đẩy ảnh lên mây..." : "Cập Nhật Lại Cho Chuẩn"}
                                </button>
                            </div>
                        </form>
                    </m.div>
                </main>
            </div>
        </LazyMotion>
    );
}
