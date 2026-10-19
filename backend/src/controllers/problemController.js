import Problem from "../models/Problem.js";

export async function getProblems(req, res) {
  try {
    const { q = "", difficulty = "", tag = "" } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = tag;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const problems = await Problem.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ problems });
  } catch (error) {
    console.error("Error in getProblems controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProblemBySlug(req, res) {
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({ slug });

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json({ problem });
  } catch (error) {
    console.error("Error in getProblemBySlug controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}