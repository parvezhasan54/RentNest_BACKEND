import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpsStatus from "http-status-codes";



const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const queryParams = req.query;
    const result = await propertyService.getAllPropertiesFromDB(queryParams);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Properties retrieved successfully",
        data: result
    })
});

const getPropertyById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
    const result = await propertyService.getPropertyByIdFromDB(propertyId as string) || [];
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Property retrieved successfully",
        data: result
    })
});


export const propertyController = { getAllProperties, getPropertyById };