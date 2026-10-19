import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMyAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/me", protectRoute, getMyAnalytics);

export default router;