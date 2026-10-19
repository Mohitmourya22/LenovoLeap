import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", default: null },
    language: { type: String, required: true },
    sourceCode: { type: String, required: true },
    status: { type: String, enum: ["accepted", "wrong-answer", "runtime-error", "pending"], default: "pending" },
    runtimeMs: { type: Number, default: 0 },
    memoryKb: { type: Number, default: 0 },
    testResult: { type: String, default: "" },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;