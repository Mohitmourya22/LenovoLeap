import { ENV } from "./env.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Deterministic keyword-based scoring. Always available — used directly when no
 * OpenAI key is configured, and as the fallback when an AI call fails.
 *
 * Weighting: required-skill overlap (65%) + nice-to-have bonus (15%) +
 * experience factor (20%).
 */
export function keywordScore({ extractedSkills = [], experienceYears = 0 }, job) {
  const required = job.requiredSkills || [];
  const nice = job.niceToHaveSkills || [];
  const have = new Set(extractedSkills.map((skill) => skill.toLowerCase()));

  const matchedSkills = [];
  const missingSkills = [];
  for (const skill of required) {
    if (have.has(skill.toLowerCase())) matchedSkills.push(skill);
    else missingSkills.push(skill);
  }
  const matchedNice = nice.filter((skill) => have.has(skill.toLowerCase()));

  // if a job lists no required skills, give a neutral base so it isn't a flat zero
  const requiredScore = required.length ? matchedSkills.length / required.length : 0.6;
  const niceScore = nice.length ? matchedNice.length / nice.length : 0;
  const expScore = job.minExperienceYears
    ? clamp(experienceYears / job.minExperienceYears, 0, 1)
    : experienceYears > 0
    ? 1
    : 0.5;

  const raw = requiredScore * 0.65 + niceScore * 0.15 + expScore * 0.2;
  const matchScore = clamp(Math.round(raw * 100), 0, 100);

  const strengths = [];
  if (matchedSkills.length) {
    strengths.push(
      `Matches ${matchedSkills.length}/${required.length || matchedSkills.length} required skills: ${matchedSkills.join(", ")}`
    );
  }
  if (matchedNice.length) strengths.push(`Bonus (nice-to-have) skills: ${matchedNice.join(", ")}`);
  if (job.minExperienceYears && experienceYears >= job.minExperienceYears) {
    strengths.push(`${experienceYears} yrs experience meets the ${job.minExperienceYears}+ requirement`);
  }
  if (!strengths.length) strengths.push("Some relevant background detected in the resume.");

  const gaps = [];
  if (missingSkills.length) gaps.push(`Missing required skills: ${missingSkills.join(", ")}`);
  if (job.minExperienceYears && experienceYears < job.minExperienceYears) {
    gaps.push(`Experience (${experienceYears} yrs) is below the ${job.minExperienceYears}+ requirement`);
  }
  if (!gaps.length) gaps.push("No major gaps detected against the listed requirements.");

  const verdict = matchScore >= 75 ? "Strong match" : matchScore >= 50 ? "Potential match" : "Weak match";
  const aiSummary = `${verdict} — ${matchScore}% fit. ${matchedSkills.length}/${required.length || 0} required skills present${
    experienceYears ? `, ~${experienceYears} yrs experience` : ""
  }.`;

  return { matchScore, matchedSkills, missingSkills, aiSummary, strengths, gaps, scoredBy: "keyword" };
}

/** OpenAI-powered scoring. Mirrors the fetch pattern used in aiController.js. */
async function aiScore({ resumeText, experienceYears }, job) {
  const systemPrompt =
    "You are an expert technical recruiter screening a resume against a job posting. Respond ONLY with strict JSON matching the requested shape.";

  const userPrompt = `Job title: ${job.title}
Required skills: ${(job.requiredSkills || []).join(", ") || "n/a"}
Nice-to-have skills: ${(job.niceToHaveSkills || []).join(", ") || "n/a"}
Minimum experience (years): ${job.minExperienceYears || 0}
Detected candidate experience (years): ${experienceYears}

Job description:
${job.description}

Candidate resume (extracted text, may be truncated):
${String(resumeText).slice(0, 6000)}

Return JSON with EXACTLY this shape:
{
  "matchScore": <integer 0-100 overall fit>,
  "matchedSkills": [<required skills clearly present in the resume>],
  "missingSkills": [<required skills absent from the resume>],
  "summary": "<2-3 sentence fit assessment>",
  "strengths": [<3-5 short bullet strings>],
  "gaps": [<1-4 short bullet strings>]
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  return {
    matchScore: clamp(Math.round(Number(parsed.matchScore) || 0), 0, 100),
    matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
    missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
    aiSummary: parsed.summary || "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
    scoredBy: "ai",
  };
}

/**
 * Score a resume against a job. Uses OpenAI when a key is configured, and
 * transparently falls back to deterministic keyword scoring otherwise (or if
 * the AI call errors), so scoring always produces a result.
 */
export async function scoreResume(input, job) {
  if (ENV.OPENAI_API_KEY) {
    try {
      return await aiScore(input, job);
    } catch (error) {
      console.error("AI scoring failed, falling back to keyword scoring:", error.message);
    }
  }
  return keywordScore(input, job);
}
