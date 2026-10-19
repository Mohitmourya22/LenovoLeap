import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  uploadResume,
  getCandidates,
  updateCandidateStatus,
  rescoreCandidate,
  inviteToInterview,
  deleteCandidate,
} from "../controllers/candidateController.js";

const router = express.Router();

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
]);

// keep the file in memory only — we extract text and never persist the binary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = ALLOWED_MIME.has(file.mimetype) || /\.(pdf|docx?|txt)$/i.test(file.originalname);
    if (ok) cb(null, true);
    else cb(new Error("Only PDF, DOCX, DOC, or TXT files are allowed"));
  },
});

// wrap multer so its errors return clean JSON instead of an unhandled throw
const uploadResumeFile = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

router.post("/", protectRoute, uploadResumeFile, uploadResume);
router.get("/", protectRoute, getCandidates);
router.patch("/:id/status", protectRoute, updateCandidateStatus);
router.post("/:id/rescore", protectRoute, rescoreCandidate);
router.post("/:id/invite", protectRoute, inviteToInterview);
router.delete("/:id", protectRoute, deleteCandidate);

export default router;
