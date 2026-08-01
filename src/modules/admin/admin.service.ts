import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import HttpsStatus from "http-status-codes";

interface IUserQuery {
    page: number;
    limit: number;
    role?: Role;
}

const getAllUserDB = async ({ page, limit, role }: IUserQuery) => {
    const where = role ? { role } : {};

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            omit: {
                password: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: users,
    };
};

const updateUserStatusDB = async (id: string, payload: { isBanned: boolean }) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new AppError(HttpsStatus.NOT_FOUND, "User not found");
    }

    if (user.role === Role.ADMIN) {
        throw new AppError(
            HttpsStatus.FORBIDDEN,
            "Admin user cannot be banned"
        );
    }

    const result = await prisma.user.update({
        where: {
            id,
        },
        data: { isBanned: payload.isBanned },
    });

    return result;
};

const getAllPropertiesDB = async () => {
    const result = await prisma.property.findMany({
        include: {
            landlord: {
                omit: { password: true },
            },
            category: true,
        },
    });
    return result;
};

const getAllRentalsDB = async () => {
    const result = await prisma.rentalRequest.findMany({
        include: {
            tenant: {
                omit: {
                    password: true,
                },
            },
            property: true,
        },
    });
    return result;
};

export const adminService = {
    getAllUserDB,
    updateUserStatusDB,
    getAllPropertiesDB,
    getAllRentalsDB,
};