
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { aiController } from "./ai.controller";

const limiter = rateLimit({ windowMs: 60_000, limit: 15, standardHeaders: true, legacyHeaders: false });
const router = Router();
router.post("/chat", limiter, aiController.chat);
router.post("/search", limiter, aiController.search);
export const aiRoute = router;