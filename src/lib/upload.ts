import imageCompression from 'browser-image-compression';

/**
 * Converts any browser-supported image file to WebP format using `browser-image-compression`.
 *
 * This safely handles large images (e.g. 48MP from iPhone 14 Pro Max) by using Web Workers
 * and an efficient resizing algorithm, preventing memory spikes and tab crashes on iOS Safari.
 */
export const convertToWebP = async (file: File): Promise<File> => {
    try {
        const options = {
            maxSizeMB: 1, // Kích thước tối đa 1MB
            maxWidthOrHeight: 1024, // Thu gọn hơn một chút để đỡ ngốn RAM (1024 thay vì 1200)
            useWebWorker: false, // TẮT Web Worker vì Safari iOS cấp rất ít RAM cho worker, dễ làm tab bị crash
            fileType: 'image/jpeg', // Lưu ý: dùng jpeg encode nhanh hơn WebP và tốn ít RAM hơn trên iPhone
            initialQuality: 0.8,
        };

        const compressedBlob = await imageCompression(file, options);
        
        // Convert Blob back to File preserving original name but changing extension to jpg
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        return new File([compressedBlob], `${baseName}.jpg`, { type: "image/jpeg" });
        
    } catch (error) {
        console.error("Image compression error:", error);
        throw new Error("Không thể xử lý ảnh quá lớn, vui lòng thử ảnh khác!");
    }
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
