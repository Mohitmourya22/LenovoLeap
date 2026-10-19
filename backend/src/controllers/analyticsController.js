import Analytics from "../models/Analytics.js";

export async function getMyAnalytics(req, res) {
  try {
    let analytics = await Analytics.findOne({ user: req.user._id });

    if (!analytics) {
      analytics = await Analytics.create({ user: req.user._id });
    }

    res.status(200).json({ analytics });
  } catch (error) {
    console.error("Error in getMyAnalytics controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}