"use client";

import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { Crown, Heart, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";

type Role = "prince" | "princess" | null;

export default function LoginPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<Role>(null);
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;

        setIsSubmitting(true);
        setError("");

        const result = await login(selectedRole, passcode);

        if (result.success) {
            router.push(result.role === "prince" ? "/admin" : "/");
        } else {
            setError(result.error ?? "Mật mã không đúng!");
            setPasscode("");
            setIsSubmitting(false);
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="relative min-h-screen overflow-hidden bg-slate-50 font-sans selection:bg-pink-200 flex flex-col items-center justify-center p-4 pt-24 sm:pt-28">

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                </div>

                {/* Decorative Blobs */}
                <m.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-[10%] -top-[10%] z-0 h-[30rem] w-[30rem] rounded-full bg-pink-200 blur-3xl filter"
                />
                <m.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -right-[10%] bottom-[10%] z-0 h-[25rem] w-[25rem] rounded-full bg-rose-200 blur-3xl filter"
                />

                <main className="relative z-10 w-full max-w-md">
                    <AnimatePresence mode="wait">
                        {!selectedRole ? (
                            <m.div
                                key="role-selection"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="text-center mb-4">
                                    <h1 className="text-3xl font-fredoka text-pink-600 tracking-tight">
                                        Bạn là ai? <Heart className="inline-block h-6 w-6 text-pink-500 fill-pink-500 animate-pulse" />
                                    </h1>
                                    <p className="text-slate-500 mt-2">Vui lòng chọn vai trò để tiếp tục</p>
                                </div>

                                <button
                                    onClick={() => setSelectedRole("prince")}
                                    className="group relative flex w-full items-center justify-between rounded-3xl border border-blue-100 bg-white/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/80 hover:shadow-xl hover:shadow-blue-200/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-md shadow-blue-300/50 transition-transform group-hover:scale-110">
                                            <Crown className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-fredoka text-pink-600">Hoàng Tử</h2>
                                            <p className="text-sm text-slate-500">Là anh Phú đóa ạaaa</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-6 w-6 text-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>

                                <button
                                    onClick={() => setSelectedRole("princess")}
                                    className="group relative flex w-full items-center justify-between rounded-3xl border border-pink-100 bg-white/80 p-6 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 hover:bg-pink-50/80 hover:shadow-xl hover:shadow-pink-200/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-500 shadow-md shadow-pink-300/50 transition-transform group-hover:scale-110">
                                            <Heart className="h-7 w-7 text-white fill-current" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-fredoka text-pink-600">Công Chúa</h2>
                                            <p className="text-sm text-slate-500">Là em bé mít của anh ạaaa</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-6 w-6 text-pink-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                            </m.div>
                        ) : (
                            <m.div
                                key="passcode-entry"
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 shadow-2xl shadow-pink-200/50 backdrop-blur-xl"
                            >
                                <div className="mb-8 flex items-center justify-between">
                                    <button
                                        onClick={() => {
                                            setSelectedRole(null);
                                            setPasscode("");
                                        }}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm transition-colors hover:bg-pink-100 hover:text-pink-600"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${selectedRole === "prince" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                                        }`}>
                                        {selectedRole === "prince" ? <Crown className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                                        {selectedRole === "prince" ? "Hoàng Tử" : "Công Chúa"}
                                    </div>
                                </div>

                                <div className="text-center mb-8">
                                    <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-inner shadow-black/10 ${selectedRole === "prince" ? "from-blue-100 to-blue-200" : "from-pink-100 to-pink-200"
                                        }`}>
                                        <KeyRound className={`h-10 w-10 ${selectedRole === "prince" ? "text-blue-500" : "text-pink-500"}`} />
                                    </div>
                                    <h2 className="text-2xl font-fredoka text-pink-600">Nhập Mật Mã</h2>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Vui lòng nhập mật mã bí mật của {selectedRole === "prince" ? "Hoàng Tử" : "Công Chúa"}
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div>
                                        <input
                                            type="password"
                                            value={passcode}
                                            onChange={(e) => { setPasscode(e.target.value); setError(""); }}
                                            placeholder="••••••••"
                                            className={`w-full rounded-2xl border-2 bg-white/80 px-5 py-4 text-center text-2xl font-bold tracking-[0.3em] outline-none transition-all placeholder:font-normal placeholder:tracking-normal focus:bg-white ${
                                                error
                                                    ? "border-red-300 text-red-600 focus:border-red-400 focus:shadow-lg focus:shadow-red-200/50"
                                                    : selectedRole === "prince"
                                                    ? "border-blue-100 text-blue-700 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-200/50"
                                                    : "border-pink-100 text-pink-700 focus:border-pink-400 focus:shadow-lg focus:shadow-pink-200/50"
                                            }`}
                                            autoFocus
                                        />
                                        {error && (
                                            <p className="mt-2 text-center text-sm text-red-500">{error}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={passcode.length < 4 || isSubmitting}
                                        className={`group relative flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none ${
                                            selectedRole === "prince"
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-[1.02] hover:shadow-blue-500/30"
                                                : "bg-gradient-to-r from-pink-400 to-pink-500 hover:scale-[1.02] hover:shadow-pink-500/30"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        ) : (
                                            <>
                                                <span>Mở Khóa</span>
                                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </m.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </LazyMotion>
    );
}
