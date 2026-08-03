import multer from "multer";
import AppError from "../utils/AppError";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    if (!ACCEPTED_TYPES.includes(file.mimetype)) {
        return cb(new AppError(400, "Only JPG, PNG, WEBP, or AVIF images are allowed") as any);
    }
    cb(null, true);
};

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE, files: 10 },
});