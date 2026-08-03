import cloudinary from "../../config/cloudinary";
import AppError from "../../utils/AppError";
import HttpsStatus from "http-status-codes";

const uploadBuffer = (buffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "rentnest/properties",
                resource_type: "image",
                // keeps payload reasonable without visibly degrading quality
                transformation: [{ width: 1920, height: 1920, crop: "limit", quality: "auto" }],
            },
            (error, result) => {
                if (error || !result) {
                    return reject(
                        new AppError(HttpsStatus.BAD_GATEWAY, error?.message || "Upload failed")
                    );
                }
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

const uploadImagesToCloudinary = async (files: Express.Multer.File[]) => {
    const urls = await Promise.all(files.map((file) => uploadBuffer(file.buffer)));
    return urls;
};

export const uploadService = { uploadImagesToCloudinary };