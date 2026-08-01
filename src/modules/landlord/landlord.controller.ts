import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpsStatus from "http-status-codes";

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const result = await landlordService.createPropertyDB(req.body, landlordId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.CREATED,
        message: "Property Created Successfully",
        data: result
    })
});

// returns only the properties owned by the logged-in landlord.
const getMyProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const result = await landlordService.getMyPropertiesDB(landlordId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Properties Retrieved Successfully",
        data: result
    })
});

// NEW: returns a single property owned by the logged-in landlord.
const getProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const id = req.params.id;
    const result = await landlordService.getPropertyDB(id as string, landlordId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Property Retrieved Successfully",
        data: result
    })
});

const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const id = req.params.id;
    const result = await landlordService.updatePropertyDB(id as string, req.body, landlordId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Property Modified Successfully",
        data: result
    })
});

const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const id = req.params.id;
    const result = await landlordService.deletePropertyDB(id as string, landlordId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Property Deleted Successfully",
        data: result
    });
});

const getAllRentalRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const result = await landlordService.getAllRentalRequestsDB(landlordId as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Rental Request Retrieve Successfully",
        data: result
    });
});

const updateRentalRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const requestId = req.params.id;
    const result = await landlordService.updateRentalRequestDB(landlordId as string, requestId as string, req.body);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Rental Request Updated Successfully",
        data: result
    });
});



export const landlordController = {
  createProperty,
  getMyProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  getAllRentalRequests,
  updateRentalRequest,
};