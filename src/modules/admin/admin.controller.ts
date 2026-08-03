import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpsStatus from "http-status-codes"
import { Role } from "../../../generated/prisma/enums";
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const role = req.query.role as Role | undefined;

  const result = await adminService.getAllUserDB({page,
    limit,
    role,
  });

  sendResponse(res, {
    success: true,
    statusCode: HttpsStatus.OK,
    message: "All users retrieved successfully",
    data: result,
  });
});
const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await adminService.updateUserStatusDB(id as string, req.body);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "User Status Updated Successfully",
        data: result

    })
});

const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllPropertiesDB();
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "All Properties Retrieve Successfully",
        data: result
    })
});

const updatePropertyStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await adminService.updatePropertyStatusDB(id as string, req.body);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Property Status Updated Successfully",
        data: result
    })
});

const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await adminService.deletePropertyDB(id as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Property Deleted Successfully",
        data: result
    })
});

const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRentalsDB();
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "All Rental Request Retrieve Successfully",
        data: result
    })
});




export const adminController = {
    getAllUser,
    updateUserStatus,
    getAllRentals,
    getAllProperties,
    updatePropertyStatus,
    deleteProperty,
}