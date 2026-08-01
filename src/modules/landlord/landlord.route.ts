import { Router } from "express";
import { landlordController } from "./landlord.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const router = Router();
router.post('/properties', auth([Role.LANDLORD, Role.ADMIN]), landlordController.createProperty);
router.put("/properties/:id", auth([Role.LANDLORD, Role.ADMIN]), landlordController.updateProperty);
router.delete('/properties/:id', auth([Role.LANDLORD, Role.ADMIN]), landlordController.deleteProperty);
router.get('/requests', auth([Role.LANDLORD, Role.ADMIN]), landlordController.getAllRentalRequests);
router.patch("/requests/:id", auth([Role.LANDLORD, Role.ADMIN]), landlordController.updateRentalRequest)

// router.post('/', async (req, res) => {
//     const data = req.body;
//     await prisma.property.createMany({
//         data: data,
//         skipDuplicates: true
//     });
//     const result = await prisma.property.findMany();
//     res.send(result);
// })


export const landlordRouter = router;