import Submission from "../models/Submission.js";

export async function createSubmission(req, res) {
  try {
    const { problemId, sessionId, language, sourceCode, status, runtimeMs, memoryKb, testResult } = req.body;

    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      session: sessionId || null,
      language,
      sourceCode,
      status,
      runtimeMs,
      memoryKb,
      testResult,
    });

    res.status(201).json({ submission });
  } catch (error) {
    console.error("Error in createSubmission controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMySubmissions(req, res) {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate("problem", "title slug difficulty")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ submissions });
  } catch (error) {
    console.error("Error in getMySubmissions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}