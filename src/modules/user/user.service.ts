
import { randomUUID } from "crypto";
import { JwtPayload } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { config } from "../../config/index";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwtUtils";
import { IRegisterPayload } from "./user.interface";
import bcrypt from "bcrypt";
import HttpsStatus from "http-status-codes";

const googleClient = new OAuth2Client(config.google_client_id);

const registerUserDB = async (userData: IRegisterPayload) => {
    const { name, email, password, role } = userData;

    if (role && role !== "TENANT" && role !== "LANDLORD") {
        throw new AppError(HttpsStatus.FORBIDDEN, "Invalid account type");
    }

    const isExist = await prisma.user.findUnique({
        where: { email }
    });

    if (isExist) {
        throw new AppError(HttpsStatus.CONFLICT, "User already Exist");
    }

    const hashPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            role
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isBanned: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return user;
};

const logInUserIntoDB = async (userData: { email: string; password: string }) => {
    const { email, password } = userData;

    const isExist = await prisma.user.findUnique({
        where: { email }
    });

    if (!isExist) {
        throw new AppError(HttpsStatus.NOT_FOUND, "User not Found");
    }

    if (isExist.isBanned) {
        throw new AppError(
            HttpsStatus.FORBIDDEN,
            "Your account has been banned."
        );
    }

    const isMatchPassword = await bcrypt.compare(password, isExist.password);

    if (!isMatchPassword) {
        throw new AppError(
            HttpsStatus.UNAUTHORIZED,
            "Invalid email or password"
        );
    }

    const jwtPayload = {
        id: isExist.id,
        name: isExist.name,
        email: isExist.email,
        role: isExist.role
    };

    const accessToken = await jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_token_secret as string,
        config.jwt_access_expires_in as string
    );

    const refreshToken = await jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
    );

    const { password: _, ...user } = isExist;

    return { accessToken, refreshToken, user };
};

const getMeDB = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        omit: { password: true }
    });

    if (!user) {
        throw new AppError(HttpsStatus.NOT_FOUND, "User not Found");
    }

    return user;
};

const refreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(
        refreshToken,
        config.jwt_refresh_secret
    );

    if (!verifiedRefreshToken.success) {
        throw new AppError(
            HttpsStatus.UNAUTHORIZED,
            verifiedRefreshToken.error
        );
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new AppError(HttpsStatus.NOT_FOUND, "User not Found");
    }

    if (user.isBanned) {
        throw new AppError(HttpsStatus.FORBIDDEN, "User is blocked!");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_token_secret,
        config.jwt_access_expires_in as string
    );

    return { accessToken };
};

const updateMeDB = async (
    userId: string,
    payload: {
        name?: string;
        currentPassword?: string;
        newPassword?: string;
    }
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new AppError(HttpsStatus.NOT_FOUND, "User not Found");
    }

    const data: { name?: string; password?: string } = {};

    if (payload.name !== undefined) {
        const name = payload.name.trim();

        if (name.length < 2 || name.length > 60) {
            throw new AppError(
                HttpsStatus.BAD_REQUEST,
                "Name must be 2–60 characters"
            );
        }

        data.name = name;
    }

    if (payload.newPassword) {
        if (payload.newPassword.length < 6) {
            throw new AppError(
                HttpsStatus.BAD_REQUEST,
                "Password must be at least 6 characters"
            );
        }

        if (
            !payload.currentPassword ||
            !(await bcrypt.compare(payload.currentPassword, user.password))
        ) {
            throw new AppError(
                HttpsStatus.UNAUTHORIZED,
                "Current password is incorrect"
            );
        }

        data.password = await bcrypt.hash(
            payload.newPassword,
            config.bcrypt_salt_rounds
        );
    }

    return prisma.user.update({
        where: { id: userId },
        data,
        omit: { password: true }
    });
};

const googleLoginDB = async (
    credential: string,
    role?: "TENANT" | "LANDLORD"
) => {
    if (!credential) {
        throw new AppError(
            HttpsStatus.BAD_REQUEST,
            "Google credential is required"
        );
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: config.google_client_id
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
        throw new AppError(
            HttpsStatus.UNAUTHORIZED,
            "Google email is not verified"
        );
    }

    let user = await prisma.user.findUnique({
        where: { email: payload.email }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: payload.name ?? payload.email.split("@")[0],
                email: payload.email,
                password: await bcrypt.hash(
                    randomUUID(),
                    config.bcrypt_salt_rounds
                ),
                role: role === "LANDLORD" ? "LANDLORD" : "TENANT"
            }
        });
    }

    if (user.isBanned) {
        throw new AppError(
            HttpsStatus.FORBIDDEN,
            "Your account has been banned."
        );
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = await jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_token_secret as string,
        config.jwt_access_expires_in as string
    );

    const refreshToken = await jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
    );

    return { accessToken, refreshToken };
};

export const authService = {
    registerUserDB,
    logInUserIntoDB,
    getMeDB,
    refreshToken,
    updateMeDB,
    googleLoginDB
};
