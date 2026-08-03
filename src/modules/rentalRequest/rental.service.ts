import { prisma } from "../../lib/prisma";
import { Role, RequestStatus } from "../../../generated/prisma/enums";
import AppError from "../../utils/AppError";
import HttpsStatus from "http-status-codes";

interface ICreateRentalRequestPayload {
    propertyId: string;
    message?: string;
    startDate?: string;
    endDate?: string;
}

// FIX: previously did `{ tenantId, ...payload }` — spreading the raw request
// body AFTER tenantId. Object spread is last-key-wins, so a client could
// include its own `tenantId` in the body and silently override the
// authenticated user's id, letting any tenant create a rental request under
// someone else's identity. Now we whitelist exactly the fields we accept
// from the client and always use the authenticated tenantId.
// Also adds: property exists/available checks, date-order validation, and
// a duplicate-request guard (nothing previously stopped a tenant from
// submitting the same request over and over).
const createRequest = async (
    payload: ICreateRentalRequestPayload,
    tenantId: string
) => {
    const { propertyId, message, startDate, endDate } = payload;

    if (!propertyId) {
        throw new AppError(HttpsStatus.BAD_REQUEST, "propertyId is required");
    }

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new AppError(HttpsStatus.NOT_FOUND, "Property not found");
    }

    if (!property.available) {
        throw new AppError(
            HttpsStatus.BAD_REQUEST,
            "This property is not currently available for rent"
        );
    }

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        throw new AppError(
            HttpsStatus.BAD_REQUEST,
            "End date must be after the start date"
        );
    }

    const existing = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId,
            status: {
                in: [
                    RequestStatus.PENDING,
                    RequestStatus.APPROVED,
                    RequestStatus.ACTIVE,
                ],
            },
        },
    });

    if (existing) {
        throw new AppError(
            HttpsStatus.CONFLICT,
            "You already have an active request for this property"
        );
    }

    const result = await prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId,
            message,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        },
        include: {
            property: true,
        },
    });

    return result;
};

const getRequestByTenantIdDB = async (tenantId: string) => {
    const result = await prisma.rentalRequest.findMany({
        where: {
            tenantId
        },
        include: {
            property: true
        }
    });

    return result;
};

const getRequestByRequestIdDB = async (
    requestId: string,
    userId: string,
    role?: Role
) => {
    const result = await prisma.rentalRequest.findFirst({
        where: {
            id: requestId,
            ...(role !== Role.ADMIN ? { tenantId: userId } : {}),
        },
        include: {
            property: true,
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            payment: true,
        },
    });

    return result;
};

export const requestService = { createRequest, getRequestByTenantIdDB, getRequestByRequestIdDB }