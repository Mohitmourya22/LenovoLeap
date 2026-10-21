import Analytics from "../models/Analytics.js";
import Session from "../models/Session.js";
import Submission from "../models/Submission.js";

export async function getMyAnalytics(req, res) {
  try {
    let analytics = await Analytics.findOne({ user: req.user._id });

    if (!analytics) {
      analytics = await Analytics.create({ user: req.user._id });
    }

    const submissionsCount = await Submission.countDocuments({ user: req.user._id });
    const solvedCount = await Submission.countDocuments({ user: req.user._id, status: "accepted" });
    const sessionsHosted = await Session.countDocuments({ host: req.user._id });
    const sessionsJoined = await Session.countDocuments({ participant: req.user._id });

    analytics.stats.submissionsCount = submissionsCount;
    analytics.stats.solvedCount = solvedCount;
    analytics.stats.sessionsHosted = sessionsHosted;
    analytics.stats.sessionsJoined = sessionsJoined;
    await analytics.save();

    res.status(200).json({ analytics });
  } catch (error) {
    console.error("Error in getMyAnalytics controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}