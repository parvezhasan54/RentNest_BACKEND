import { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../utils/jwtUtils";
import { config } from "../config/index";
import { sendResponse } from "../utils/sendResponse";
import { catchAsync } from "../utils/catchAsync";

// Auth Middleware
// 1. Check access token exists
// 2. Verify access token
// 3. Check user payload exists
// 4. Attach user to req.user
// 5.check role

const auth = (requiredRole: string[]) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken;

        if (!token) {
            return sendResponse(res, {
                success: false,
                statusCode: 401,
                message: "Invalid Access Token",
                data: [],
            });
        }

        const verifiedToken = jwtUtils.verifyToken(
            token,
            config.jwt_access_token_secret as string
        );

        if (!verifiedToken.success) {
            return sendResponse(res, {
                success: false,
                statusCode: 401,
                message: "Unauthorized Access Token Expired",
                data: [],
            });
        }

        if (!verifiedToken.data) {
            return sendResponse(res, {
                success: false,
                statusCode: 401,
                message: "User Not Found",
                data: [],
            });
        }

        if (!requiredRole.includes(verifiedToken.data.role)) {
            return sendResponse(res, {
                success: false,
                statusCode: 403,
                message: "Forbidden Access",
                data: [],
            });
        }
        req.user = {
            id: verifiedToken.data.id,
            name: verifiedToken.data.name,
            email: verifiedToken.data.email,
            role: verifiedToken.data.role,
        };
        next();
    });

export default auth;