import {  Router } from "express";
import { authController } from "./user.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";


const router = Router();
router.post('/register', authController.resgisterUser);
router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken)


router.get("/me", auth([Role.ADMIN, Role.TENANT, Role.LANDLORD]), authController.getMe);


export const authRoute = router;