"use client";

import { m, LazyMotion, domAnimation } from "framer-motion";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { convertToWebP, uploadToCloudinary } from "@/lib/upload";

export default function AddGiftPage() {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Default form states
    const [giftName, setGiftName] = useState("");
    const [price, setPrice] = useState("");
    const [priority, setPriority] = useState("must-have");
    const [link, setLink] = useState("");
    const [notes, setNotes] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

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
            alert("Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại!");
        } finally {
            setIsConverting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile) {
            alert("Bạn chưa chọn ảnh món quà kìa 🥺");
            return;
        }

        let finalImageUrl = imageUrl;

        try {
            setIsUploading(true);
            finalImageUrl = await uploadToCloudinary(imageFile);
            setImageUrl(finalImageUrl); // Update state to Cloudinary URL
        } catch (error: any) {
            console.error("Lỗi upload ảnh:", error);
            alert(error.message || "Tải ảnh lên thất bại. Vui lòng thử lại!");
            setIsUploading(false);
            return;
        }

        // TODO: Proceed to save to database with finalImageUrl
        console.log("Saving gift with URL:", finalImageUrl);
        alert("Upload thành công nha! Link ảnh: " + finalImageUrl);
        setIsUploading(false);
        router.push("/admin"); // For now, redirect to admin directly or go back
    };

    return (
        <LazyMotion features={domAnimation}>
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
                        <h1 className="mb-8 text-2xl font-fredoka text-pink-600">Thêm Điều Ước Mới ✨</h1>

                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            {/* Image Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">Hình Ảnh Của Bé 📸</label>
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
                                                <span className="text-[10px] font-medium text-center leading-tight">Click để<br />chọn ảnh</span>
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
                                                "Hãy Upload một bức ảnh xinh xắn nha..."
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700">Tên Món Quà Là Gì Ta? 🎁</label>
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
                                    <label className="text-sm font-medium text-slate-700">Tầm Bao Nhiêu Xiền? 💵</label>
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
                                    <label className="text-sm font-medium text-slate-700">Mức Độ U Mê 🥺</label>
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
                                <label className="text-sm font-medium text-slate-700">Link Chỗ Bán Mua Nè 🛒 (Không bắt buộc)</label>
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
                                <label className="text-sm font-medium text-slate-700">Dặn Dò (Size, Màu...) 📝</label>
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
                                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/40 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
                                >
                                    {isUploading ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                    ) : (
                                        <Save className="h-5 w-5" />
                                    )}
                                    {isUploading ? "Đang đẩy ảnh lên mây..." : "Gửi Yêu Cầu Chốt Đơn"}
                                </button>
                            </div>
                        </form>
                    </m.div>
                </main>
            </div>
        </LazyMotion>
    );
}
