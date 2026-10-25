import { JwtPayload, SignOptions } from "jsonwebtoken";
import {config} from "../../config/index";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwtUtils";
import { IRegisterPayload } from "./user.interface";
import bcrypt from "bcrypt";
import HttpsStatus from "http-status-codes";
const registerUserDB = async (userData: IRegisterPayload) => {
const { name, email, password, role } = userData;

if (role && role !== "TENANT" && role !== "LANDLORD") {
  throw new AppError(HttpsStatus.FORBIDDEN, "Invalid account type");
}

    //check user is exist or not
    const isExist = await prisma.user.findUnique({
        where: { email }
    });
    if (isExist) {
        throw new AppError(HttpsStatus.CONFLICT, "User already Exist");
    };

    //hashed password
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
            updatedAt: true,
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
        throw new AppError(HttpsStatus.NOT_FOUND, "User not Found")
    };

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
    };

    //create token
    const jwtPayload = {
        id: isExist.id,
        name: isExist.name,
        email: isExist.email,
        role: isExist.role

    };

    const accessToken = await jwtUtils.createToken(jwtPayload, config.jwt_access_token_secret as string, config.jwt_access_expires_in as string);
    const refreshToken = await jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);
    delete (isExist as Partial<typeof isExist>).password;

    return { accessToken, refreshToken, user: isExist }
};

const getMeDB = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new AppError(HttpsStatus.NOT_FOUND, "User not Found");
    }
     delete (user as Partial<typeof user>).password;
    return user;
};

const refreshToken = async (refreshToken : string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if(!verifiedRefreshToken.success){
        throw new Error(verifiedRefreshToken.error)
    }

    const {id} = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where : {
            id
        }
    })

    if(user.isBanned=== true){
        throw new Error("User is blocked!")
    }

    const jwtPayload = {
        id,
        name : user.name,
        email : user.email,
        role : user.role
    }


    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_token_secret,
        config.jwt_access_expires_in as string
    );

    return {accessToken}
}

export const authService = {
    registerUserDB,
    logInUserIntoDB,
    getMeDB,
    refreshToken
}