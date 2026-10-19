import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { postAiAssist } from "../controllers/aiController.js";

const router = express.Router();

router.post("/assist", protectRoute, postAiAssist);

export default router;