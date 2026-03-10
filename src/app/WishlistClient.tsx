"use client";

import GiftCard, { GiftItem } from "@/components/GiftCard";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function WishlistContent({ gifts }: { gifts: GiftItem[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "all";
  const priorityFilter = searchParams.get("priority") || "all";

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      const matchesSearch = gift.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || gift.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || gift.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [gifts, searchQuery, statusFilter, priorityFilter]);

  const wishingCount = gifts.filter((g) => g.status === "wishing").length;

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen bg-slate-50 font-sans selection:bg-pink-200 pb-20 pt-24 sm:pt-28">

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute overflow-hidden inset-0 pointer-events-none z-0">
          <m.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] rounded-full bg-pink-200 blur-3xl filter"
          />
          <m.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-[10%] top-[20%] h-[35rem] w-[35rem] rounded-full bg-rose-200 blur-3xl filter"
          />
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          {/* Header Hero */}
          <div className="text-center space-y-4 pt-4 sm:pt-8 min-h-[160px]">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-sm font-medium mb-4 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              {wishingCount} deal chưa chốt
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-fredoka text-slate-800 leading-tight"
            >
              Nơi bày tỏ mong muốn của{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">
                Vợ Iêu
              </span>{" "}
              🎀
            </m.h1>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg px-4"
            >
              Nơi lưu giữ những món quà bé thích. Thấy cái nào ưng là tấp vô đây để anh chồng dễ bề chốt đơn nhe!
            </m.p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-fredoka text-slate-800">
                {searchQuery
                  ? "Kết quả tìm kiếm"
                  : statusFilter === "bought"
                  ? "Thành quả thu hoạch 🛍️"
                  : "Danh sách muốn mua 🎀"}
              </h2>
              <Link href="/add" className="hidden sm:flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-pink-200 text-pink-600 hover:bg-pink-50 font-medium cursor-pointer transition-colors shadow-sm bg-white/50 backdrop-blur-sm">
                <PlusCircle className="h-4 w-4" />
                <span className="text-sm">Gợi ý quà mới</span>
              </Link>
            </div>

            {filteredGifts.length > 0 ? (
              <m.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredGifts.map((gift) => (
                  <div key={gift.id} className="break-inside-avoid w-full">
                    <GiftCard gift={gift} />
                  </div>
                ))}
              </m.div>
            ) : (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center flex flex-col items-center justify-center bg-white/50 border border-dashed border-pink-200 rounded-3xl"
              >
                <div className="w-20 h-20 mb-4 bg-pink-100 text-pink-300 rounded-full flex items-center justify-center">
                  <Search className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-fredoka text-slate-700 mb-2">
                  {gifts.length === 0 ? "Chưa có món quà nào!" : "Không tìm thấy món nào!"}
                </h3>
                <p className="text-slate-500 max-w-sm mb-6">
                  {gifts.length === 0
                    ? "Hãy thêm món quà đầu tiên vào danh sách nhé!"
                    : "Xin lỗi cậu, không có món nào khớp với tìm kiếm hoặc bộ lọc hiện tại."}
                </p>
                {gifts.length > 0 && (
                  <button
                    onClick={() => router.replace("/", { scroll: false })}
                    className="px-6 py-2.5 bg-white border border-slate-200 hover:border-pink-300 text-slate-600 hover:text-pink-600 font-medium rounded-full shadow-sm transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </m.div>
            )}
          </div>
        </main>

        {/* FAB - Gợi ý quà mới (Mobile Only) */}
        <Link
          href="/add"
          className="sm:hidden fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-lg shadow-pink-300 active:scale-95 transition-transform"
          title="Gợi ý quà mới"
        >
          <span className="text-3xl font-light leading-none mb-0.5">+</span>
        </Link>
      </div>
    </LazyMotion>
  );
}

export default function WishlistClient({ gifts }: { gifts: GiftItem[] }) {
  return (
    <Suspense fallback={null}>
      <WishlistContent gifts={gifts} />
    </Suspense>
  );
}
