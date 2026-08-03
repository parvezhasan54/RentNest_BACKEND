import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { uploadService } from "./upload.service";
import AppError from "../../utils/AppError";
import HttpsStatus from "http-status-codes";

const uploadImages = catchAsync(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        throw new AppError(HttpsStatus.BAD_REQUEST, "No files uploaded");
    }

    const urls = await uploadService.uploadImagesToCloudinary(files);

    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.CREATED,
        message: "Images uploaded successfully",
        data: { urls },
    });
});

export const uploadController = { uploadImages };