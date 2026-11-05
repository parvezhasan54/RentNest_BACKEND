
import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { statsController } from "./stats.controller";

const router = Router();
router.get("/public", statsController.getPublic);
router.get("/dashboard", auth([Role.ADMIN, Role.LANDLORD, Role.TENANT]), statsController.getDashboard);
export const statsRoute = router;