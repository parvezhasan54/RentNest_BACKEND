import { Router } from "express";
import { propertyController } from "./property.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();

router.get("/", propertyController.getAllProperties);

router.get(
    "/saved",
    auth([Role.TENANT, Role.LANDLORD, Role.ADMIN]),
    propertyController.getSavedProperties
);

router.post(
    "/:id/save",
    auth([Role.TENANT, Role.LANDLORD, Role.ADMIN]),
    propertyController.saveProperty
);

router.delete(
    "/:id/save",
    auth([Role.TENANT, Role.LANDLORD, Role.ADMIN]),
    propertyController.unsaveProperty
);

router.get("/:id", propertyController.getPropertyById);

export const propertyRoute = router;