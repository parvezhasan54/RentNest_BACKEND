import { Router } from "express";
import { propertyController } from "./property.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();
const anyRole = auth([Role.TENANT, Role.LANDLORD, Role.ADMIN]);

// Static routes MUST come before "/:id"
router.get("/suggestions", propertyController.getSuggestions);
router.get("/trending", propertyController.getTrending);
router.get("/saved", anyRole, propertyController.getSavedProperties);

router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);

router.post("/:id/save", anyRole, propertyController.saveProperty);
router.delete("/:id/save", anyRole, propertyController.unsaveProperty);

export const propertyRoute = router;