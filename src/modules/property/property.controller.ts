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

const saveProperty = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const propertyId = req.params.id;
    const result = await propertyService.savePropertyDB(propertyId as string, userId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.CREATED,
        message: "Property saved successfully",
        data: result
    });
});

const unsaveProperty = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const propertyId = req.params.id;
    const result = await propertyService.unsavePropertyDB(propertyId as string, userId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Property removed from saved list",
        data: result
    });
});

const getSavedProperties = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await propertyService.getSavedPropertiesFromDB(userId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Saved properties retrieved successfully",
        data: result
    });
});

export const propertyController = {
    getAllProperties,
    getPropertyById,
    saveProperty,        // ADD
    unsaveProperty,       // ADD
    getSavedProperties     // ADD
};