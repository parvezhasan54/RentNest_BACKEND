import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();
router.post('/', auth([Role.TENANT, Role.ADMIN]), reviewController.createReview);
router.get('/property/:propertyId', reviewController.getReviewsByProperty);

export const reviewRouter = router;