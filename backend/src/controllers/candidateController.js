import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import Session from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";
import {
  extractText,
  extractSkills,
  estimateExperienceYears,
  extractEmail,
  guessName,
} from "../lib/resumeParser.js";
import { scoreResume } from "../lib/scoring.js";

// strip the (large) raw resume text before sending a candidate back to the client
const toClient = (candidateDoc) => {
  const obj = candidateDoc.toObject ? candidateDoc.toObject() : candidateDoc;
  delete obj.resumeText;
  return obj;
};

export async function uploadResume(req, res) {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "jobId is required" });
    if (!req.file) return res.status(400).json({ message: "Resume file is required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const resumeText = await extractText(req.file.buffer, req.file.originalname, req.file.mimetype);
    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(422).json({ message: "Could not extract readable text from this file" });
    }

    const extraSkills = [...(job.requiredSkills || []), ...(job.niceToHaveSkills || [])];
    const extractedSkills = extractSkills(resumeText, extraSkills);
    const experienceYears = estimateExperienceYears(resumeText);
    const email = extractEmail(resumeText);
    const name = req.body.name?.trim() || guessName(resumeText, req.file.originalname);

    const scored = await scoreResume({ resumeText, extractedSkills, experienceYears }, job);

    const candidate = await Candidate.create({
      job: jobId,
      name,
      email,
      resumeText,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      extractedSkills,
      experienceYears,
      uploadedBy: req.user._id,
      ...scored,
    });

    res.status(201).json({ candidate: toClient(candidate) });
  } catch (error) {
    console.error("Error in uploadResume controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getCandidates(req, res) {
  try {
    const { jobId, status } = req.query;
    if (!jobId) return res.status(400).json({ message: "jobId query param is required" });

    const filter = { job: jobId };
    if (status) filter.status = status;

    // exclude the full resume text from the list payload; rank by score desc
    const candidates = await Candidate.find(filter)
      .select("-resumeText")
      .sort({ matchScore: -1, createdAt: -1 });

    res.status(200).json({ candidates });
  } catch (error) {
    console.error("Error in getCandidates controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateCandidateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const candidate = await Candidate.findByIdAndUpdate(id, { status }, { new: true }).select("-resumeText");
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.status(200).json({ candidate });
  } catch (error) {
    console.error("Error in updateCandidateStatus controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function rescoreCandidate(req, res) {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const job = await Job.findById(candidate.job);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const extraSkills = [...(job.requiredSkills || []), ...(job.niceToHaveSkills || [])];
    const extractedSkills = extractSkills(candidate.resumeText, extraSkills);
    const experienceYears = estimateExperienceYears(candidate.resumeText);
    const scored = await scoreResume({ resumeText: candidate.resumeText, extractedSkills, experienceYears }, job);

    candidate.extractedSkills = extractedSkills;
    candidate.experienceYears = experienceYears;
    Object.assign(candidate, scored);
    await candidate.save();

    res.status(200).json({ candidate: toClient(candidate) });
  } catch (error) {
    console.error("Error in rescoreCandidate controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function inviteToInterview(req, res) {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const job = await Job.findById(candidate.job);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // already invited — return the existing session instead of creating a duplicate
    if (candidate.session) {
      return res.status(200).json({ candidate: toClient(candidate), sessionId: candidate.session });
    }

    const clerkId = req.user.clerkId;
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const inviteCode = `${callId}_${Math.random().toString(36).substring(2, 8)}`;

    const session = await Session.create({
      problem: `Interview: ${job.title}`,
      difficulty: "medium",
      visibility: "private",
      host: req.user._id,
      callId,
      inviteCode,
    });

    // best-effort Stream setup (mirrors sessionController.createSession). Don't fail
    // the invite if Stream is unconfigured or unavailable.
    try {
      await streamClient.video.call("default", callId).getOrCreate({
        data: {
          created_by_id: clerkId,
          custom: {
            problem: session.problem,
            difficulty: "medium",
            visibility: "private",
            sessionId: session._id.toString(),
          },
        },
      });

      const channel = chatClient.channel("messaging", callId, {
        name: `${job.title} Interview`,
        created_by_id: clerkId,
        members: [clerkId],
      });
      await channel.create();
    } catch (streamError) {
      console.error("Stream setup failed during invite (continuing):", streamError.message);
    }

    candidate.session = session._id;
    candidate.status = "shortlisted";
    await candidate.save();

    res.status(201).json({ candidate: toClient(candidate), sessionId: session._id });
  } catch (error) {
    console.error("Error in inviteToInterview controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteCandidate(req, res) {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.status(200).json({ message: "Candidate deleted" });
  } catch (error) {
    console.error("Error in deleteCandidate controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
