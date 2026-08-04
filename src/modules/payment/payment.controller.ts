import { Request, Response } from "express";
import HttpStatus from "http-status-codes";

import { paymentService } from "./payment.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../utils/AppError";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id as string;

  const result = await paymentService.createPaymentIntoDB(
    req.body,
    tenantId
  );

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: "Payment session created successfully",
    data: result,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Stripe signature missing"
    );
  }

  const result = await paymentService.confirmPaymentIntoDB(
    req.body,
    signature
  );

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Payment confirmed successfully",
    data: result,
  });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Session ID is required"
    );
  }

  const result = await paymentService.verifyPayment(sessionId);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Payment verified successfully",
    data: result,
  });
});

const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  const result = await paymentService.getPaymentHistoryDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Payment history retrieved successfully",
    data: result,
  });
});

const getPaymentDetails = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  const result = await paymentService.getPaymentDetailsDB(
    req.params.id as string,
    userId
  );

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Payment details retrieved successfully",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  confirmPayment,
  verifyPayment,
  getPaymentHistory,
  getPaymentDetails,
};