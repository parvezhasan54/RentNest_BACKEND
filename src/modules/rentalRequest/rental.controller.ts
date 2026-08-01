import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { requestService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import HttsStatus from "http-status-codes"

const createRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const result = await requestService.createRequest(req.body, tenantId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttsStatus.CREATED,
        message: "Rental  Request Has Been Created",
        data: result
    })
});


const getRequestByTenantId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id;
    const result = await requestService.getRequestByTenantIdDB(tenantId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttsStatus.OK,
        message: "Rental  Request Has Been Fetched",
        data: result
    })
});
const getRequestByRequestId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id;
    // console.log("from Controller : ",{requestId});
    const result = await requestService.getRequestByRequestIdDB(requestId as string)||[];
    sendResponse(res, {
        success: true,
        statusCode: HttsStatus.OK,
        message: "Rental  Request Has Been Fetched",
        data: result
    })
});

export const requestController = { createRequest, getRequestByTenantId, getRequestByRequestId }