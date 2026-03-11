/** Kích thước tối đa (px) - ảnh lớn hơn sẽ bị thu nhỏ trước khi đưa lên Canvas */
const MAX_DIMENSION = 1200;
/** Timeout tối đa cho quá trình convert (ms) */
const CONVERT_TIMEOUT_MS = 15_000;

/**
 * Converts any browser-supported image file to WebP format using Canvas.
 *
 * Dùng createObjectURL thay vì readAsDataURL:
 * - readAsDataURL: copy TOÀN BỘ file vào RAM dưới dạng base64 (x1.37 kích thước)
 *   → iOS Safari kill tab khi file lớn (iPhone 14 Pro Max)
 * - createObjectURL: chỉ tạo pointer đến file, KHÔNG copy vào RAM → an toàn hơn
 */
export const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);

        const timer = setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Xử lý ảnh quá lâu, vui lòng thử ảnh nhỏ hơn!"));
        }, CONVERT_TIMEOUT_MS);

        const img = new Image();

        img.onload = () => {
            // Giải phóng bộ nhớ ngay sau khi ảnh đã load vào img element
            URL.revokeObjectURL(objectUrl);

            // Tính kích thước mới, giữ tỉ lệ ảnh
            let { width, height } = img;
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width >= height) {
                    height = Math.round((height / width) * MAX_DIMENSION);
                    width = MAX_DIMENSION;
                } else {
                    width = Math.round((width / height) * MAX_DIMENSION);
                    height = MAX_DIMENSION;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                clearTimeout(timer);
                reject(new Error("Failed to get canvas context"));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    clearTimeout(timer);
                    if (blob) {
                        const baseName = file.name.replace(/\.[^/.]+$/, "");
                        resolve(new File([blob], `${baseName}.webp`, { type: "image/webp" }));
                    } else {
                        reject(new Error("Không thể chuyển đổi ảnh, vui lòng thử lại!"));
                    }
                },
                "image/webp",
                0.82
            );
        };

        img.onerror = () => {
            clearTimeout(timer);
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Không đọc được file ảnh này!"));
        };

        img.src = objectUrl;
    });
};

/**
 * Uploads an image file to Cloudinary using an unsigned upload preset.
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset || cloudName === "your_cloud_name_here") {
        throw new Error("Vui lòng cấu hình Cloudinary trong file .env.local");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Lỗi upload lên Cloudinary");
        }

        const data = await response.json();
        // Returns the secure HTTPS URL from Cloudinary
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw error;
    }
};
