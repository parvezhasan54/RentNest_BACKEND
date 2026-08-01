import {  Router } from "express";
import { authController } from "./user.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";


const router = Router();
router.post('/register', authController.resgisterUser);
router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken)
//delete all users
// router.delete("/", auth([Role.ADMIN]), async (req: Request, res: Response) => {
//     const result = await prisma.user.deleteMany();
// })

router.get("/me", auth([Role.ADMIN, Role.TENANT, Role.LANDLORD]), authController.getMe);
// router.get('/', async (req,res) => {
//     const result = await prisma.user.findMany();
//     return res.send(result)
// })

export const authRoute = router;