
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";
import HttpsStatus from "http-status-codes";

const createCategory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const result = await categoryService.createCategoryInDB(payload);

        sendResponse(res, {
            success: true,
            statusCode: HttpsStatus.CREATED,
            message: "Category created successfully",
            data: result,
        });
    }
);

const getAllCategories = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await categoryService.getAllCategoriesFromDB();

        sendResponse(res, {
            success: true,
            statusCode: HttpsStatus.OK,
            message: "Categories retrieved successfully",
            data: result,
        });
    }
);

const deleteCategory = catchAsync(
    async (req: Request, res: Response) => {
        const result = await categoryService.deleteCategoryInDB(
            req.params.id as string
        );

        sendResponse(res, {
            success: true,
            statusCode: HttpsStatus.OK,
            message: "Category deleted successfully",
            data: result,
        });
    }
);

export const categoryController = {
    createCategory,
    getAllCategories,
    deleteCategory,
};
