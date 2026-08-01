import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./user.service"
import { sendResponse } from "../../utils/sendResponse";
import HttpsStatus from "http-status-codes"
const resgisterUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await authService.registerUserDB(req.body) || [];
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.CREATED,
        message: "User Register Successfully",
        data: result
    });
});


const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken, user } = await authService.logInUserIntoDB(req.body);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 //one day
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 //one day
    });


    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "User Login Successfully",
        data: {
            accessToken,
            refreshToken
        }
    });
});

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await authService.getMeDB(user?.email as string);
    // console.log("from controller : ", req.user);
    sendResponse(res, {
        success: true,
        statusCode: HttpsStatus.OK,
        message: "User fetched successfully",
        data: result
    });

});

const refreshToken = catchAsync(async (req : Request, res : Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const {accessToken} = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 // 24 hour or 1 day
    })

    sendResponse(res, {
        success : true,
        statusCode : HttpsStatus.OK,
        message : "Token Refreshed Successfully",
        data : {
            accessToken
        }
    })
})
export const authController = { resgisterUser, loginUser, getMe,refreshToken }
