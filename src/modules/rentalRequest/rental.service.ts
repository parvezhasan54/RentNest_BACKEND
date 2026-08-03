import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/enums";

const createRequest = async (payload: any, tenantId: string) => {
    const result = await prisma.rentalRequest.create({
        data: {
            tenantId,
            ...payload
        },
        include: {
            property: true
        }
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

// FIX: previously looked up by id alone — any authenticated TENANT could
// fetch any other tenant's rental request (address, price, status) just
// by guessing/knowing the UUID. Now scoped to the requesting user unless
// they're an ADMIN. Also now includes tenant + payment so the payment
// page can show real data instead of hardcoded placeholders.
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