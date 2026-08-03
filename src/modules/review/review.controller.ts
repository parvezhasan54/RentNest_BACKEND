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


export const reviewController = { createReview, getReviewsByProperty }