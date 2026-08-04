import { Router } from "express";
import { Role } from "../../../generated/prisma/client";

import auth from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create",
  auth([Role.TENANT, Role.ADMIN]),
  paymentController.createPayment
);

router.post("/confirm", paymentController.confirmPayment);

router.post(
  "/verify",
  auth([Role.TENANT, Role.ADMIN]),
  paymentController.verifyPayment
);

router.get("/history",auth([Role.TENANT, Role.ADMIN]),paymentController.getPaymentHistory);

router.get(
  "/:id",
  auth([Role.TENANT, Role.ADMIN]),
  paymentController.getPaymentDetails
);

export const paymentRoute = router;