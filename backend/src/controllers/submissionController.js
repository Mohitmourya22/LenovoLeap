import Submission from "../models/Submission.js";
import Analytics from "../models/Analytics.js";

export async function createSubmission(req, res) {
  try {
    const {
      problemId = "custom",
      problemTitle = "",
      sessionId = null,
      language,
      sourceCode,
      status = "pending",
      runtimeMs = 0,
      memoryKb = 0,
      testResult = "",
    } = req.body;

    const submission = await Submission.create({
      user: req.user._id,
      problemId,
      problemTitle: problemTitle || problemId,
      session: sessionId || null,
      language,
      sourceCode,
      status,
      runtimeMs,
      memoryKb,
      testResult,
    });

    // Update or create analytics record for the user
    let analytics = await Analytics.findOne({ user: req.user._id });
    if (!analytics) {
      analytics = await Analytics.create({ user: req.user._id });
    }

    analytics.stats.submissionsCount = (analytics.stats.submissionsCount || 0) + 1;
    if (status === "accepted") {
      analytics.stats.solvedCount = (analytics.stats.solvedCount || 0) + 1;
    }
    await analytics.save();

    res.status(201).json({ submission, stats: analytics.stats });
  } catch (error) {
    console.error("Error in createSubmission controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMySubmissions(req, res) {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ submissions });
  } catch (error) {
    console.error("Error in getMySubmissions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}