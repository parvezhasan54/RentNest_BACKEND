
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpsStatus from "http-status-codes";
import AppError from "../../utils/AppError";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.registerUserDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.CREATED,
        message: "User Register Successfully",
        data: result
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } =
        await authService.logInUserIntoDB(req.body);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
        path: "/"
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/"
    });

    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "User Login Successfully",
        data: {
            accessToken,
            refreshToken,
            user
        }
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.getMeDB(req.user!.email);

    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "User fetched successfully",
        data: result
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        throw new AppError(
            HttpsStatus.UNAUTHORIZED,
            "Refresh token is required"
        );
    }

    const { accessToken } = await authService.refreshToken(token);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
        path: "/"
    });

    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Token Refreshed Successfully",
        data: { accessToken }
    });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.updateMeDB(req.user!.id, req.body);

    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "Profile updated",
        data: result
    });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
    const { accessToken, refreshToken } =
        await authService.googleLoginDB(
            req.body.credential,
            req.body.role
        );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
        path: "/"
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/"
    });

    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "User Login Successfully",
        data: { accessToken, refreshToken }
    });
});

export const authController = {
    registerUser,
    loginUser,
    getMe,
    refreshToken,
    updateMe,
    googleLogin
};
