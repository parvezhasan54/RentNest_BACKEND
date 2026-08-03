import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get('/users', auth([Role.ADMIN]), adminController.getAllUser);
router.patch('/users/:id', auth([Role.ADMIN]), adminController.updateUserStatus);
router.get('/properties', auth([Role.ADMIN]), adminController.getAllProperties);
router.patch('/properties/:id', auth([Role.ADMIN]), adminController.updatePropertyStatus);
router.delete('/properties/:id', auth([Role.ADMIN]), adminController.deleteProperty);
router.get('/rentals', auth([Role.ADMIN]), adminController.getAllRentals)

export const adminRoute = router;