import { Router } from "express";
import { landlordController } from "./landlord.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post('/properties', auth([Role.LANDLORD, Role.ADMIN]), landlordController.createProperty);
router.get('/properties', auth([Role.LANDLORD, Role.ADMIN]), landlordController.getMyProperties);
router.get('/properties/:id', auth([Role.LANDLORD, Role.ADMIN]), landlordController.getProperty);
router.put("/properties/:id", auth([Role.LANDLORD, Role.ADMIN]), landlordController.updateProperty);
router.delete('/properties/:id', auth([Role.LANDLORD, Role.ADMIN]), landlordController.deleteProperty);

router.get('/requests', auth([Role.LANDLORD, Role.ADMIN]), landlordController.getAllRentalRequests);
router.patch("/requests/:id", auth([Role.LANDLORD, Role.ADMIN]), landlordController.updateRentalRequest);

export const landlordRouter = router;