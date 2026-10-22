import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";

// accepts either an array of strings or a comma-separated string
const normalizeSkills = (value) =>
  Array.isArray(value)
    ? value.map((skill) => String(skill).trim()).filter(Boolean)
    : String(value || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

export async function createJob(req, res) {
  try {
    const {
      title,
      description,
      company,
      location,
      employmentType,
      requiredSkills,
      niceToHaveSkills,
      minExperienceYears,
    } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      company: (company || "").trim(),
      location: (location || "Remote").trim(),
      employmentType: employmentType || "full-time",
      requiredSkills: normalizeSkills(requiredSkills),
      niceToHaveSkills: normalizeSkills(niceToHaveSkills),
      minExperienceYears: Number(minExperienceYears) || 0,
      createdBy: req.user._id,
    });

    res.status(201).json({ job });
  } catch (error) {
    console.error("Error in createJob controller:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

export async function getJobs(req, res) {
  try {
    const { q = "", status = "" } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    // attach candidate + shortlisted counts per job in a single aggregation
    const jobIds = jobs.map((job) => job._id);
    const counts = await Candidate.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: "$job",
          total: { $sum: 1 },
          shortlisted: { $sum: { $cond: [{ $eq: ["$status", "shortlisted"] }, 1, 0] } },
        },
      },
    ]);
    const countMap = new Map(counts.map((entry) => [entry._id.toString(), entry]));

    const withCounts = jobs.map((job) => ({
      ...job.toObject(),
      candidateCount: countMap.get(job._id.toString())?.total || 0,
      shortlistedCount: countMap.get(job._id.toString())?.shortlisted || 0,
    }));

    res.status(200).json({ jobs: withCounts });
  } catch (error) {
    console.error("Error in getJobs controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getJobById(req, res) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("createdBy", "name email profileImage");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ job });
  } catch (error) {
    console.error("Error in getJobById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getJobStats(req, res) {
  try {
    const [openJobs, totalJobs, totalCandidates, shortlisted, scoreAgg] = await Promise.all([
      Job.countDocuments({ status: "open" }),
      Job.countDocuments({}),
      Candidate.countDocuments({}),
      Candidate.countDocuments({ status: "shortlisted" }),
      Candidate.aggregate([{ $group: { _id: null, avg: { $avg: "$matchScore" } } }]),
    ]);

    const avgMatchScore = Math.round(scoreAgg[0]?.avg || 0);

    res.status(200).json({
      stats: { openJobs, totalJobs, totalCandidates, shortlisted, avgMatchScore },
    });
  } catch (error) {
    console.error("Error in getJobStats controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateJobStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ job });
  } catch (error) {
    console.error("Error in updateJobStatus controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteJob(req, res) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the job creator can delete this job" });
    }

    // remove the job and all of its candidates
    await Candidate.deleteMany({ job: id });
    await job.deleteOne();

    res.status(200).json({ message: "Job and its candidates deleted" });
  } catch (error) {
    console.error("Error in deleteJob controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
