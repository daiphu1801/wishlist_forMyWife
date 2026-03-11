"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function AppLoader() {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade-out after 1.4s, completely hide after 1.7s
        const fadeTimer = setTimeout(() => setFadeOut(true), 1400);
        const hideTimer = setTimeout(() => setVisible(false), 1700);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-pink-50 transition-opacity duration-300 ${
                fadeOut ? "opacity-0" : "opacity-100"
            }`}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#f9a8d4_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

            {/* Blobs */}
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-pink-200 opacity-50 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-rose-200 opacity-40 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Bouncing hearts */}
                <div className="flex gap-2 mb-2">
                    {[0, 1, 2].map((i) => (
                        <Heart
                            key={i}
                            className="h-6 w-6 fill-pink-400 text-pink-400"
                            style={{
                                animation: `loaderBounce 0.8s ease-in-out infinite`,
                                animationDelay: `${i * 0.15}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Title */}
                <h1 className="font-fredoka text-4xl font-semibold text-pink-500 tracking-wide">
                    Princess Wishlist
                </h1>
                <p className="text-sm text-pink-400 font-medium">Đang tải... 🌸</p>

                {/* Progress bar */}
                <div className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-pink-100">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-400"
                        style={{
                            animation: "loaderProgress 1.4s ease-out forwards",
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes loaderBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes loaderProgress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
}
