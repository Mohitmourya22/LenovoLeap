import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createSubmission, getMySubmissions } from "../controllers/submissionController.js";

const router = express.Router();

router.post("/", protectRoute, createSubmission);
router.get("/me", protectRoute, getMySubmissions);

export default router;