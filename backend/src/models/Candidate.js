import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    name: { type: String, default: "Unknown Candidate" },
    email: { type: String, default: "" },
    // extracted plain text of the resume (we never store the original binary)
    resumeText: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileType: { type: String, default: "" },
    extractedSkills: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    // scoring output
    matchScore: { type: Number, default: 0 },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    aiSummary: { type: String, default: "" },
    strengths: [{ type: String }],
    gaps: [{ type: String }],
    scoredBy: { type: String, enum: ["ai", "keyword"], default: "keyword" },
    status: {
      type: String,
      enum: ["new", "shortlisted", "rejected"],
      default: "new",
    },
    // set when a shortlisted candidate is invited to a live interview session
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
