
import { Router } from "express";
import { authController } from "./user.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.post("/refresh-token", authController.refreshToken);

router.post("/google", authController.googleLogin);

router.get(
    "/me",
    auth([Role.ADMIN, Role.TENANT, Role.LANDLORD]),
    authController.getMe
);

router.patch(
    "/me",
    auth([Role.ADMIN, Role.TENANT, Role.LANDLORD]),
    authController.updateMe
);

export const authRoute = router;
