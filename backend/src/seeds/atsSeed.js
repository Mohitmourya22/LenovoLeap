// Seed the ATS module with a few sample jobs + candidates so the ranked list
// demos non-empty. Scores are computed with the deterministic keyword engine.
//
// Requires at least one signed-in user in the DB (jobs/candidates need an owner).
// Run from the backend/ folder:  node src/seeds/atsSeed.js
import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "../lib/db.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Candidate from "../models/Candidate.js";
import { extractSkills, estimateExperienceYears, extractEmail, guessName } from "../lib/resumeParser.js";
import { keywordScore } from "../lib/scoring.js";

const JOBS = [
  {
    title: "Senior Frontend Engineer",
    company: "Nimbus Labs",
    location: "Remote",
    employmentType: "full-time",
    minExperienceYears: 4,
    requiredSkills: ["React", "TypeScript", "JavaScript", "CSS", "Redux"],
    niceToHaveSkills: ["Next.js", "Tailwind CSS", "GraphQL"],
    description:
      "Build and own our customer-facing web app. You will craft accessible, performant React interfaces in TypeScript, collaborate with design, and mentor other engineers.",
  },
  {
    title: "Backend Engineer (Node.js)",
    company: "Nimbus Labs",
    location: "Bangalore, India",
    employmentType: "full-time",
    minExperienceYears: 3,
    requiredSkills: ["Node.js", "Express", "MongoDB", "REST", "JavaScript"],
    niceToHaveSkills: ["Docker", "AWS", "Redis"],
    description:
      "Design and scale the APIs behind our platform. Experience with Node.js/Express, MongoDB data modeling, and building reliable REST services is essential.",
  },
  {
    title: "Full-Stack Developer",
    company: "Orbit Systems",
    location: "Remote",
    employmentType: "contract",
    minExperienceYears: 2,
    requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript", "Express"],
    niceToHaveSkills: ["TypeScript", "Docker", "AWS"],
    description:
      "Ship features end to end across a React frontend and a Node.js/Express + MongoDB backend. Comfortable owning a feature from UI to database.",
  },
];

// [jobIndex, name, resumeText]
const RESUMES = [
  [
    0,
    "Aditi Sharma",
    `Aditi Sharma
aditi.sharma@example.com
Senior Frontend Engineer with 6 years of experience building React applications in TypeScript.
Expert in React, Redux, JavaScript, CSS and Next.js. Built design systems with Tailwind CSS.
Worked with GraphQL APIs and led a team of 4 engineers.`,
  ],
  [
    0,
    "Rahul Verma",
    `Rahul Verma
rahul.verma@example.com
Frontend developer with 2 years of experience. Skilled in JavaScript, HTML, CSS and some React.
Built responsive websites with Bootstrap. Learning TypeScript.`,
  ],
  [
    1,
    "Priya Nair",
    `Priya Nair
priya.nair@example.com
Backend Engineer with 5 years of experience in Node.js and Express.
Designed REST APIs backed by MongoDB and Redis. Deployed services with Docker on AWS.
Strong JavaScript fundamentals.`,
  ],
  [
    1,
    "Marcus Lee",
    `Marcus Lee
marcus.lee@example.com
Software engineer with 4 years of experience in Python and Django.
Some exposure to Node.js and REST APIs. Familiar with PostgreSQL.`,
  ],
  [
    2,
    "Sofia Rossi",
    `Sofia Rossi
sofia.rossi@example.com
Full-stack developer with 3 years of experience. Builds apps with React on the frontend and
Node.js + Express + MongoDB on the backend. Comfortable with TypeScript and Docker. Deployed to AWS.`,
  ],
  [
    2,
    "James Okoro",
    `James Okoro
james.okoro@example.com
Junior developer with 1 year of experience. Knows JavaScript and React basics.
Built a small MongoDB project during a bootcamp.`,
  ],
];

async function run() {
  await connectDB();

  const owner = await User.findOne().sort({ createdAt: 1 });
  if (!owner) {
    console.error(
      "❌ No user found in the DB. Sign in to the app at least once (which creates a user), then re-run this seed."
    );
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`Seeding as owner: ${owner.name} (${owner.email})`);

  // idempotent: clear previously-seeded jobs (by title) and their candidates
  const titles = JOBS.map((job) => job.title);
  const existing = await Job.find({ title: { $in: titles } }).select("_id");
  if (existing.length) {
    const ids = existing.map((job) => job._id);
    await Candidate.deleteMany({ job: { $in: ids } });
    await Job.deleteMany({ _id: { $in: ids } });
    console.log(`Cleared ${existing.length} previously-seeded job(s).`);
  }

  const createdJobs = [];
  for (const jobData of JOBS) {
    const job = await Job.create({ ...jobData, createdBy: owner._id });
    createdJobs.push(job);
  }
  console.log(`Created ${createdJobs.length} jobs.`);

  let candidateCount = 0;
  for (const [jobIndex, name, resumeText] of RESUMES) {
    const job = createdJobs[jobIndex];
    const extraSkills = [...(job.requiredSkills || []), ...(job.niceToHaveSkills || [])];
    const extractedSkills = extractSkills(resumeText, extraSkills);
    const experienceYears = estimateExperienceYears(resumeText);
    const scored = keywordScore({ extractedSkills, experienceYears }, job);

    await Candidate.create({
      job: job._id,
      name: name || guessName(resumeText),
      email: extractEmail(resumeText),
      resumeText,
      fileName: `${name.replace(/\s+/g, "_").toLowerCase()}_resume.txt`,
      fileType: "text/plain",
      extractedSkills,
      experienceYears,
      uploadedBy: owner._id,
      ...scored,
    });
    candidateCount += 1;
  }
  console.log(`Created ${candidateCount} candidates.`);

  await mongoose.disconnect();
  console.log("✅ ATS seed complete.");
  process.exit(0);
}

run().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
