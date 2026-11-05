
import { Router } from "express";
import { propertyController } from "./property.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();

// Public routes
router.get("/suggestions", propertyController.getSuggestions);
router.get("/trending", propertyController.getTrending);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);

// Protected routes
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

export const propertyRoute = router;
