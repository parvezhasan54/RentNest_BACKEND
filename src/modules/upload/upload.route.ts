import { Router } from "express";
import { upload } from "../../middlewares/upload";
import { uploadController } from "./upload.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/images",
    auth([Role.LANDLORD, Role.ADMIN]),
    upload.array("images", 10),
    uploadController.uploadImages
);

export const uploadRoute = router;