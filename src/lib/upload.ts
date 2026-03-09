/**
 * Converts any browser-supported image file (PNG, JPG, etc.) to WebP format using Canvas.
 */
export const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }

                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0);

                // Convert the canvas to a WebP blob (0.8 = 80% quality parameter)
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // Extract original filename without extension and append .webp
                            const baseName = file.name.replace(/\.[^/.]+$/, "");
                            const newFileName = `${baseName}.webp`;
                            const newFile = new File([blob], newFileName, {
                                type: "image/webp",
                            });
                            resolve(newFile);
                        } else {
                            reject(new Error("Failed to convert image to WebP"));
                        }
                    },
                    "image/webp",
                    0.8
                );
            };
            img.onerror = (error) => reject(new Error("Failed to load image for conversion"));
            // Safe to cast event.target.result to string since readAsDataURL guarantees a string
            if (event.target?.result) {
                img.src = event.target.result as string;
            } else {
                reject(new Error("Failed to read file"));
            }
        };
        reader.onerror = (error) => reject(error);
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
