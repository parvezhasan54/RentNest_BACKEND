import Stripe from "stripe";
import HttpStatus from "http-status-codes";
import {
  PaymentProvider,
  PaymentStatus,
  RequestStatus,
} from "../../../generated/prisma/client";

import { config } from "../../config";
import stripe from "../../config/stripe";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";

const createPaymentIntoDB = async (
  payload: { rentalRequestId: string },
  tenantId: string
) => {
  const { rentalRequestId } = payload;

  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
      tenant: {
        omit: {
          password: true,
        },
      },
    },
  });

  if (!rental) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "Rental request not found"
    );
  }

  if (rental.tenantId !== tenantId) {
    throw new AppError(
      HttpStatus.FORBIDDEN,
      "You are not allowed to pay"
    );
  }

  if (rental.status !== RequestStatus.APPROVED) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Rental request is not approved"
    );
  }

  const existingPayment = await prisma.payment.findFirst({
    where: { rentalRequestId, status: PaymentStatus.COMPLETED },
  });
  if (existingPayment) {
    throw new AppError(HttpStatus.CONFLICT, "Payment already completed for this rental request");
  }

  // Clear out any abandoned/cancelled attempts before starting a new Stripe session
  await prisma.payment.deleteMany({
    where: { rentalRequestId, status: { not: PaymentStatus.COMPLETED } },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: rental.tenant.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(rental.property.price) * 100),
          product_data: {
            name: rental.property.title,
          },
        },
      },
    ],
    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/cancel`,
    metadata: {
      tenantId,
      rentalRequestId,
    },
  });

  await prisma.payment.create({
    data: {
      transactionId: session.id,
      amount: Number(rental.property.price),
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
      rentalRequestId,
      userId: tenantId,
      paidAt: null,
    },
  });

  return {
    checkoutUrl: session.url,
    transactionId: session.id,
  };
};

const confirmPaymentIntoDB = async (
  payload: Buffer,
  signature: string
) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe_webhook_secret
    );

    if (event.type !== "checkout.session.completed") {
      return {
        status: "IGNORED",
      };
    }

    const session = event.data.object as Stripe.Checkout.Session;

    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: {
          transactionId: session.id,
        },
        data: {
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(),
        },
      });

      await tx.rentalRequest.update({
        where: {
          id: payment.rentalRequestId,
        },
        data: {
          status: RequestStatus.ACTIVE,
        },
      });
    });

    return {
      status: "SUCCESS",
    };
  } catch (error: any) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      error.message
    );
  }
};

const verifyPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new AppError(HttpStatus.BAD_REQUEST, "Payment not completed");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { transactionId: session.id },
    include: { rentalRequest: true },
  });

  if (!existingPayment) {
    throw new AppError(HttpStatus.NOT_FOUND, "Payment not found");
  }

  // Self-heal: if the webhook hasn't landed yet (or ever), update here.
  if (existingPayment.status !== PaymentStatus.COMPLETED) {
    const updated = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { transactionId: session.id },
        data: { status: PaymentStatus.COMPLETED, paidAt: new Date() },
      });

      await tx.rentalRequest.update({
        where: { id: payment.rentalRequestId },
        data: { status: RequestStatus.ACTIVE },
      });

      return payment;
    });

    return { ...existingPayment, ...updated };
  }

  return existingPayment;
};

const getPaymentHistoryDB = async (userId: string) => {
  return prisma.payment.findMany({
    where: {
      userId,
    },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentDetailsDB = async (
  paymentId: string,
  userId: string
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      userId,
    },
    include: {
      rentalRequest: true,
    },
  });

  if (!payment) {
    throw new AppError(
      HttpStatus.NOT_FOUND,
      "Payment not found"
    );
  }

  return payment;
};

export const paymentService = {
  createPaymentIntoDB,
  confirmPaymentIntoDB,
  verifyPayment,
  getPaymentHistoryDB,
  getPaymentDetailsDB,
};