import { createHash } from "crypto";

/**
 * Extracts the Cloudinary public_id from a Cloudinary image URL.
 * Supports URLs with or without version segment.
 * e.g. https://res.cloudinary.com/cloud/image/upload/v123/folder/name.webp → folder/name
 */
function extractPublicId(imageUrl: string): string | null {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i);
    return match ? match[1] : null;
}

/**
 * Deletes an image from Cloudinary using the Admin API (signed request).
 * Only runs if the URL is from Cloudinary and all env vars are present.
 * Fails silently — a Cloudinary delete failure should not block the DB operation.
 */
export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
    if (!imageUrl.includes("res.cloudinary.com")) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.warn("Cloudinary API credentials not configured — skipping image delete");
        return;
    }

    const publicId = extractPublicId(imageUrl);
    if (!publicId) return;

    const timestamp = Math.round(Date.now() / 1000);
    const signature = createHash("sha1")
        .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
        .digest("hex");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("timestamp", String(timestamp));
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

    try {
        await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: "POST",
            body: formData,
        });
    } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
    }
}
