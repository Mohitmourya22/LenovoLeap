import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createJob,
  getJobs,
  getJobStats,
  getJobById,
  updateJobStatus,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/", protectRoute, createJob);
router.get("/", protectRoute, getJobs);
router.get("/stats", protectRoute, getJobStats);

router.get("/:id", protectRoute, getJobById);
router.patch("/:id/status", protectRoute, updateJobStatus);
router.delete("/:id", protectRoute, deleteJob);

export default router;
