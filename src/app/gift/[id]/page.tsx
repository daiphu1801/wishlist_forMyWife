import { getGiftById } from "@/actions/gift";
import { getSessionRole } from "@/lib/session";
import { notFound } from "next/navigation";
import GiftDetailClient from "./GiftDetailClient";

export default async function GiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [result, role] = await Promise.all([
        getGiftById(id),
        getSessionRole(),
    ]);

    if (!result.success || !result.gift) notFound();

    const gift = {
        ...result.gift,
        createdAt: result.gift.createdAt.toISOString(),
        updatedAt: result.gift.updatedAt.toISOString(),
    };

    return <GiftDetailClient gift={gift} role={role ?? "myfiance"} />;
}

