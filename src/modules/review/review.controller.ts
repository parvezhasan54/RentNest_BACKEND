import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpsStatus from "http-status-codes"

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const result = await reviewService.createReviewDB(req.body, tenantId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.CREATED,
        message: "Review Created Successfully",
        data: result
    })
});

const getReviewsByProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.propertyId;
    const result = await reviewService.getReviewsByPropertyDB(propertyId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Reviews Retrieved Successfully",
        data: result
    })
});

const getLatestReviews = catchAsync(async (req: Request, res: Response) => {
    const limit = Math.min(12, Math.max(1, Number(req.query.limit) || 3));
    const result = await reviewService.getLatestReviewsDB(limit);
    sendResponse(res, { success: true, statusCode: HttpsStatus.OK, message: "Latest reviews retrieved", data: result });
});
export const reviewController = { createReview, getReviewsByProperty,getLatestReviews }