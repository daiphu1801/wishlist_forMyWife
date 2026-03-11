/** Kích thước tối đa (px) - ảnh lớn hơn sẽ bị thu nhỏ trước khi đưa lên Canvas */
const MAX_DIMENSION = 1200;
/** Timeout tối đa cho quá trình convert (ms) */
const CONVERT_TIMEOUT_MS = 15_000;

/**
 * Converts any browser-supported image file to WebP format using Canvas.
 * - Resizes ảnh về max 1200px để tránh crash RAM trên mobile yếu
 * - Timeout 15s để không treo vô thời hạn nếu Canvas lỗi âm thầm
 */
export const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        // Guard timeout — nếu canvas.toBlob không callback sau 15s → reject
        const timer = setTimeout(() => {
            reject(new Error("Xử lý ảnh quá lâu, vui lòng thử ảnh nhỏ hơn!"));
        }, CONVERT_TIMEOUT_MS);

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                // --- Tính kích thước mới, giữ tỉ lệ ảnh ---
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

                // Vẽ ảnh với kích thước đã scale nhỏ
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        clearTimeout(timer);
                        if (blob) {
                            const baseName = file.name.replace(/\.[^/.]+$/, "");
                            const newFile = new File([blob], `${baseName}.webp`, {
                                type: "image/webp",
                            });
                            resolve(newFile);
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
                reject(new Error("Không đọc được file ảnh này!"));
            };

            if (event.target?.result) {
                img.src = event.target.result as string;
            } else {
                clearTimeout(timer);
                reject(new Error("Failed to read file"));
            }
        };

        reader.onerror = () => {
            clearTimeout(timer);
            reject(new Error("Không đọc được file, vui lòng thử lại!"));
        };

        reader.readAsDataURL(file);
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
