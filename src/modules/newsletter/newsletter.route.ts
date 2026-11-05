import { Router } from "express";
import HttpsStatus from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const router = Router();
router.post("/", catchAsync(async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new AppError(HttpsStatus.BAD_REQUEST, "Enter a valid email");
  await prisma.newsletterSubscriber.upsert({ where: { email }, update: {}, create: { email } });
  sendResponse(res, { success: true, statusCode: HttpsStatus.CREATED, message: "Subscribed", data: {} });
}));
export const newsletterRoute = router;