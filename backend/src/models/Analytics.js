import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    stats: {
      sessionsHosted: { type: Number, default: 0 },
      sessionsJoined: { type: Number, default: 0 },
      submissionsCount: { type: Number, default: 0 },
      solvedCount: { type: Number, default: 0 },
      aiRequests: { type: Number, default: 0 },
      streakDays: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;