"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePrince } from "@/lib/session";
import { deleteFromCloudinary } from "@/lib/cloudinary";

// ─── Validation helpers ───────────────────────────────────────────────────────

const VALID_PRIORITIES = ["normal", "high", "must-have"] as const;
const VALID_STATUSES = ["wishing", "bought"] as const;

function isValidHttpUrl(value: string): boolean {
    try {
        const u = new URL(value);
        return u.protocol === "https:" || u.protocol === "http:";
    } catch { return false; }
}

function validateGiftData(data: {
    name: string;
    price: number;
    imageUrl: string;
    url?: string;
    priority: string;
    notes?: string;
}): string | null {
    if (!data.name?.trim() || data.name.length > 200) return "Tên món quà không hợp lệ";
    if (!Number.isInteger(data.price) || data.price < 0 || data.price > 1_000_000_000) return "Giá không hợp lệ";
    if (!isValidHttpUrl(data.imageUrl)) return "URL ảnh không hợp lệ";
    if (data.url && !isValidHttpUrl(data.url)) return "Link sản phẩm không hợp lệ (phải là http/https)";
    if (!VALID_PRIORITIES.includes(data.priority as typeof VALID_PRIORITIES[number])) return "Mức độ ưu tiên không hợp lệ";
    if (data.notes && data.notes.length > 2000) return "Ghi chú quá dài (tối đa 2000 ký tự)";
    return null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createGift(data: {
    name: string;
    price: number;
    imageUrl: string;
    url?: string;
    priority: string;
    notes?: string;
}) {
    await requirePrince();

    const validationError = validateGiftData(data);
    if (validationError) return { success: false, error: validationError };

    try {
        const gift = await prisma.gift.create({
            data: {
                name: data.name.trim(),
                price: data.price,
                imageUrl: data.imageUrl,
                url: data.url || null,
                priority: data.priority,
                notes: data.notes?.trim() || null,
                status: "wishing"
            }
        });
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true, gift };
    } catch (error) {
        console.error("Error creating gift:", error);
        return { success: false, error: "Failed to create gift" };
    }
}

export async function getGifts() {
    try {
        const gifts = await prisma.gift.findMany({
            orderBy: { createdAt: "desc" }
        });
        return { success: true, gifts };
    } catch (error) {
        console.error("Error fetching gifts:", error);
        return { success: false, error: "Failed to fetch gifts" };
    }
}

export async function getGiftById(id: string) {
    try {
        const gift = await prisma.gift.findUnique({ where: { id } });
        if (!gift) return { success: false, error: "Gift not found" };
        return { success: true, gift };
    } catch (error) {
        console.error("Error fetching gift:", error);
        return { success: false, error: "Failed to fetch gift" };
    }
}

export async function updateGift(id: string, data: {
    name: string;
    price: number;
    imageUrl: string;
    url?: string;
    priority: string;
    notes?: string;
}) {
    await requirePrince();

    const validationError = validateGiftData(data);
    if (validationError) return { success: false, error: validationError };

    try {
        // Lấy ảnh cũ trước khi update để xóa trên Cloudinary nếu đổi ảnh
        const existing = await prisma.gift.findUnique({ where: { id }, select: { imageUrl: true } });

        const gift = await prisma.gift.update({
            where: { id },
            data: {
                name: data.name.trim(),
                price: data.price,
                imageUrl: data.imageUrl,
                url: data.url || null,
                priority: data.priority,
                notes: data.notes?.trim() || null,
            }
        });

        // Xóa ảnh cũ trên Cloudinary nếu ảnh đã thay đổi
        if (existing && existing.imageUrl !== data.imageUrl) {
            await deleteFromCloudinary(existing.imageUrl);
        }

        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath(`/gift/${id}`);
        revalidatePath(`/edit/${id}`);
        return { success: true, gift };
    } catch (error) {
        console.error("Error updating gift:", error);
        return { success: false, error: "Failed to update gift" };
    }
}

export async function updateGiftStatus(id: string, status: "wishing" | "bought") {
    await requirePrince();

    if (!VALID_STATUSES.includes(status)) {
        return { success: false, error: "Trạng thái không hợp lệ" };
    }

    try {
        const gift = await prisma.gift.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true, gift };
    } catch (error) {
        console.error("Error updating gift status:", error);
        return { success: false, error: "Failed to update gift status" };
    }
}

export async function deleteGift(id: string) {
    await requirePrince();

    try {
        // Lấy ảnh trước khi xóa để xóa luôn trên Cloudinary
        const existing = await prisma.gift.findUnique({ where: { id }, select: { imageUrl: true } });

        await prisma.gift.delete({ where: { id } });

        if (existing) {
            await deleteFromCloudinary(existing.imageUrl);
        }

        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error deleting gift:", error);
        return { success: false, error: "Failed to delete gift" };
    }
}

export async function getAdminStats() {
    await requirePrince();

    try {
        const [totalWishes, totalBought, totalPrice] = await Promise.all([
            prisma.gift.count({ where: { status: "wishing" } }),
            prisma.gift.count({ where: { status: "bought" } }),
            prisma.gift.aggregate({
                where: { status: "wishing" },
                _sum: { price: true }
            })
        ]);

        return {
            success: true,
            stats: {
                totalWishes,
                totalBought,
                totalPrice: totalPrice._sum.price || 0,
                totalGifts: totalWishes + totalBought
            }
        };
    } catch (error) {
        console.error("Error getting stats:", error);
        return { success: false, error: "Failed to get stats" };
    }
}


export async function getGifts() {
    try {
        const gifts = await prisma.gift.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return { success: true, gifts };
    } catch (error) {
        console.error("Error fetching gifts:", error);
        return { success: false, error: "Failed to fetch gifts" };
    }
}

export async function getGiftById(id: string) {
    try {
        const gift = await prisma.gift.findUnique({ where: { id } });
        if (!gift) return { success: false, error: "Gift not found" };
        return { success: true, gift };
    } catch (error) {
        console.error("Error fetching gift:", error);
        return { success: false, error: "Failed to fetch gift" };
    }
}

export async function updateGift(id: string, data: {
    name: string;
    price: number;
    imageUrl: string;
    url?: string;
    priority: string;
    notes?: string;
}) {
    try {
        const gift = await prisma.gift.update({
            where: { id },
            data: {
                name: data.name,
                price: data.price,
                imageUrl: data.imageUrl,
                url: data.url || null,
                priority: data.priority,
                notes: data.notes || null,
            }
        });
        revalidatePath("/");
        revalidatePath("/admin");
        revalidatePath(`/gift/${id}`);
        revalidatePath(`/edit/${id}`);
        return { success: true, gift };
    } catch (error) {
        console.error("Error updating gift:", error);
        return { success: false, error: "Failed to update gift" };
    }
}

export async function updateGiftStatus(id: string, status: "wishing" | "bought") {
    try {
        const gift = await prisma.gift.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true, gift };
    } catch (error) {
        console.error("Error updating gift status:", error);
        return { success: false, error: "Failed to update gift status" };
    }
}

export async function deleteGift(id: string) {
    try {
        await prisma.gift.delete({
            where: { id }
        });
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error deleting gift:", error);
        return { success: false, error: "Failed to delete gift" };
    }
}

export async function getAdminStats() {
    try {
        const [totalWishes, totalBought, totalPrice] = await Promise.all([
            prisma.gift.count({ where: { status: "wishing" } }),
            prisma.gift.count({ where: { status: "bought" } }),
            prisma.gift.aggregate({
                where: { status: "wishing" },
                _sum: { price: true }
            })
        ]);

        return {
            success: true,
            stats: {
                totalWishes,
                totalBought,
                totalPrice: totalPrice._sum.price || 0,
                totalGifts: totalWishes + totalBought
            }
        };
    } catch (error) {
        console.error("Error getting stats:", error);
        return { success: false, error: "Failed to get stats" };
    }
}
