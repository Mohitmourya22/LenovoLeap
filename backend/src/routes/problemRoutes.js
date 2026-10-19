import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getProblemBySlug, getProblems } from "../controllers/problemController.js";

const router = express.Router();

router.get("/", protectRoute, getProblems);
router.get("/:slug", protectRoute, getProblemBySlug);

export default router;