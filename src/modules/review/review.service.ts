import { PaymentStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import HttpsStatus from "http-status-codes";

const createReviewDB = async (payload: any, tenantId: string) => {

    const propertyId = payload.propertyId;
    const request = await prisma.rentalRequest.findFirst({
        where: {
            propertyId,
            tenantId,
        },
        include: {
            payment: true
        }
    });
    if (!request) {
        throw new AppError(HttpsStatus.NOT_FOUND, "Rental request not found for the specified property");
    }
    const completedPayment = request.payment.find(
        (payment) => payment.status === PaymentStatus.COMPLETED
    );

    if (!completedPayment) {
        throw new AppError(
            HttpsStatus.BAD_REQUEST,
            "Payment not completed for the specified property"
        );
    }

    const result = await prisma.review.create({
        data: {
            rating: payload.rating,
            comment: payload.comment,
            propertyId,
            tenantId
        }
    });
    return result;
};

const getReviewsByPropertyDB = async (propertyId: string) => {
    const result = await prisma.review.findMany({
        where: { propertyId },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

export const reviewService = { createReviewDB, getReviewsByPropertyDB };