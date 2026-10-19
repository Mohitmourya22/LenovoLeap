import mammoth from "mammoth";
// pdf-parse v2 exposes a PDFParse class (ESM). Construct it with the file bytes
// and call getText(); destroy() frees the underlying pdf.js document.
import { PDFParse } from "pdf-parse";

/**
 * A practical dictionary of common tech skills. Stored in canonical display form;
 * matching is case-insensitive. Recruiter-specified job skills are matched too
 * (passed in as extraSkills), so this list only needs to cover the common cases.
 */
export const SKILLS = [
  // languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Golang", "Rust",
  "Ruby", "PHP", "Swift", "Kotlin", "Scala", "Perl", "Objective-C", "Dart", "Elixir",
  "Haskell", "Bash", "Shell", "PowerShell", "SQL", "R", "MATLAB", "Solidity",
  // frontend
  "React", "React Native", "Next.js", "Redux", "Vue", "Vue.js", "Nuxt", "Angular",
  "Svelte", "jQuery", "HTML", "HTML5", "CSS", "CSS3", "Sass", "SCSS", "Tailwind",
  "Tailwind CSS", "Bootstrap", "Material UI", "Chakra UI", "Webpack", "Vite", "Babel",
  "Three.js", "D3.js", "Framer Motion", "Storybook",
  // backend
  "Node.js", "Express", "Express.js", "NestJS", "Fastify", "Django", "Flask",
  "FastAPI", "Spring", "Spring Boot", "Laravel", "Rails", "Ruby on Rails", ".NET",
  "ASP.NET", "GraphQL", "REST", "gRPC", "WebSockets", "Socket.IO", "Microservices",
  // databases
  "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Cassandra", "DynamoDB",
  "Elasticsearch", "Firebase", "Firestore", "Supabase", "Prisma", "Mongoose",
  "Sequelize", "Oracle", "SQL Server", "MariaDB", "Neo4j",
  // cloud / devops
  "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Terraform",
  "Ansible", "Jenkins", "CircleCI", "GitHub Actions", "GitLab CI", "CI/CD", "Nginx",
  "Apache", "Linux", "Serverless", "Lambda", "EC2", "S3", "CloudFormation",
  "Prometheus", "Grafana", "Datadog",
  // data / ml
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras",
  "scikit-learn", "Pandas", "NumPy", "Spark", "Hadoop", "Kafka", "Airflow",
  "Tableau", "Power BI", "NLP", "Computer Vision", "OpenAI", "LangChain", "LLM",
  // tools / practices
  "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Figma", "Agile", "Scrum",
  "Kanban", "TDD", "Jest", "Cypress", "Playwright", "Selenium", "Mocha", "Vitest",
  "Postman", "Swagger", "OAuth", "JWT", "Stripe", "WebRTC",
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A skill is "present" when it appears as a standalone token. We treat letters,
// digits and the characters that legitimately live inside skill names (+, #, .)
// as token characters, so "java" does NOT match inside "javascript" and "go"
// does NOT match inside "google".
const hasSkill = (haystackLower, skill) => {
  const needle = skill.toLowerCase().trim();
  if (!needle) return false;
  const pattern = new RegExp(`(?:^|[^a-z0-9+#.])${escapeRegex(needle)}(?:$|[^a-z0-9+#.])`);
  return pattern.test(haystackLower);
};

/** Extract raw text from a resume buffer (PDF, DOCX/DOC, or plain text). */
export async function extractText(buffer, fileName = "", mimeType = "") {
  const lower = fileName.toLowerCase();
  const isPdf = mimeType.includes("pdf") || lower.endsWith(".pdf");
  const isDocx =
    mimeType.includes("word") ||
    mimeType.includes("officedocument") ||
    lower.endsWith(".docx") ||
    lower.endsWith(".doc");

  if (isPdf) {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      // pdf-parse v2 inserts "-- N of M --" page separators; drop them
      return (result.text || "").replace(/\n*--\s*\d+\s*of\s*\d+\s*--\n*/g, "\n").trim();
    } finally {
      await parser.destroy();
    }
  }
  if (isDocx) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }
  // fallback: treat as UTF-8 plain text (.txt / .md)
  return buffer.toString("utf-8");
}

/**
 * Return the skills found in the text. extraSkills (e.g. the job's required /
 * nice-to-have skills) are matched in addition to the built-in dictionary so a
 * recruiter's custom skill still gets detected. Results use canonical casing.
 */
export function extractSkills(text, extraSkills = []) {
  const haystack = ` ${String(text).toLowerCase()} `;
  const canonical = new Map(); // lowercased skill -> display form
  for (const skill of SKILLS) canonical.set(skill.toLowerCase(), skill);
  for (const skill of extraSkills) {
    if (skill && String(skill).trim()) canonical.set(String(skill).toLowerCase().trim(), String(skill).trim());
  }

  const found = [];
  for (const [lower, display] of canonical) {
    if (hasSkill(haystack, lower)) found.push(display);
  }
  return found;
}

/** Best-effort estimate of years of experience mentioned in the resume. */
export function estimateExperienceYears(text) {
  const matches = [...String(text).matchAll(/(\d{1,2})\s*\+?\s*(?:years|yrs|yr)\b/gi)];
  let max = 0;
  for (const match of matches) {
    const years = parseInt(match[1], 10);
    if (!Number.isNaN(years) && years < 50 && years > max) max = years;
  }
  return max;
}

/** Pull the first email address out of the text, if any. */
export function extractEmail(text) {
  const match = String(text).match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "";
}

/** Heuristic guess of the candidate name: first name-like line, else the file name. */
export function guessName(text, fileName = "") {
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 6)) {
    if (/@|\d|https?:/i.test(line)) continue; // skip emails / links / lines with numbers
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && line.length <= 40 && /^[A-Za-z.,'\- ]+$/.test(line)) {
      return line.replace(/,/g, "").trim();
    }
  }

  const base = fileName.replace(/\.[^.]+$/, "").replace(/[_\-]+/g, " ").trim();
  return base || "Unknown Candidate";
}
