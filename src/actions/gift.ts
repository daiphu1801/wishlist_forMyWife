"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/session";
import { deleteFromCloudinary } from "@/lib/cloudinary";

//  Validation helpers 

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
    if (!data.name?.trim() || data.name.length > 200) return "Ten mon qua khong hop le";
    if (!Number.isInteger(data.price) || data.price < 0 || data.price > 1_000_000_000) return "Gia khong hop le";
    if (!isValidHttpUrl(data.imageUrl)) return "URL anh khong hop le";
    if (data.url && !isValidHttpUrl(data.url)) return "Link san pham khong hop le (phai la http/https)";
    if (!VALID_PRIORITIES.includes(data.priority as typeof VALID_PRIORITIES[number])) return "Muc do uu tien khong hop le";
    if (data.notes && data.notes.length > 2000) return "Ghi chu qua dai (toi da 2000 ky tu)";
    return null;
}

//  Actions 

export async function createGift(data: {
    name: string;
    price: number;
    imageUrl: string;
    url?: string;
    priority: string;
    notes?: string;
}) {
    await requireAuth();

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
    await requireAuth();

    const validationError = validateGiftData(data);
    if (validationError) return { success: false, error: validationError };

    try {
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
    await requireAuth();

    if (!VALID_STATUSES.includes(status)) {
        return { success: false, error: "Trang thai khong hop le" };
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
    await requireAuth();

    try {
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
    await requireAuth();

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
