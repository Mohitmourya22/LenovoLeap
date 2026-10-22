import { useNavigate } from "react-router-dom";
import {
  CheckCircle2Icon,
  XCircleIcon,
  RefreshCwIcon,
  VideoIcon,
  Trash2Icon,
  MailIcon,
  SparklesIcon,
  BriefcaseIcon,
  Share2Icon,
} from "lucide-react";
import MatchScoreRing from "./MatchScoreRing";

const statusPill = (status) => {
  switch (status) {
    case "shortlisted":
      return "bg-emerald-100 text-emerald-700";
    case "rejected":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

function CandidateCard({ candidate, onShortlist, onReject, onRescore, onInvite, onShareInvite, onDelete, isBusy }) {
  const navigate = useNavigate();
  const {
    _id,
    name,
    email,
    matchScore = 0,
    matchedSkills = [],
    missingSkills = [],
    aiSummary,
    strengths = [],
    gaps = [],
    scoredBy,
    status,
    experienceYears = 0,
    session,
  } = candidate;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* HEADER */}
      <div className="flex items-start gap-4">
        <MatchScoreRing score={matchScore} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-bold text-slate-900">{name}</h3>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusPill(status)}`}>
              {status}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                scoredBy === "ai" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              <SparklesIcon className="size-3" />
              {scoredBy === "ai" ? "AI scored" : "Keyword scored"}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            {email && (
              <span className="inline-flex items-center gap-1">
                <MailIcon className="size-3.5" />
                {email}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <BriefcaseIcon className="size-3.5" />
              {experienceYears} yrs experience
            </span>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {aiSummary && <p className="mt-4 text-sm leading-relaxed text-slate-600">{aiSummary}</p>}

      {/* SKILLS */}
      <div className="mt-4 space-y-2">
        {matchedSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Matched</span>
            {matchedSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                {skill}
              </span>
            ))}
          </div>
        )}
        {missingSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">Missing</span>
            {missingSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* STRENGTHS / GAPS */}
      {(strengths.length > 0 || gaps.length > 0) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {strengths.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Strengths</div>
              <ul className="space-y-1 text-sm text-slate-600">
                {strengths.map((item, index) => (
                  <li key={index} className="flex gap-1.5">
                    <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {gaps.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Gaps</div>
              <ul className="space-y-1 text-sm text-slate-600">
                {gaps.map((item, index) => (
                  <li key={index} className="flex gap-1.5">
                    <XCircleIcon className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {status !== "shortlisted" && (
          <button
            onClick={() => onShortlist(_id)}
            disabled={isBusy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <CheckCircle2Icon className="size-4" />
            Shortlist
          </button>
        )}

        {status !== "rejected" && (
          <button
            onClick={() => onReject(_id)}
            disabled={isBusy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
          >
            <XCircleIcon className="size-4" />
            Reject
          </button>
        )}

        {session ? (
          <>
            <button
              onClick={() => navigate(`/session/${session}`)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              <VideoIcon className="size-4" />
              Open interview
            </button>
            <button
              onClick={() => (onShareInvite ? onShareInvite(candidate) : onInvite(candidate))}
              disabled={isBusy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
              title="Share or copy interview link"
            >
              <Share2Icon className="size-4" />
              Share invite
            </button>
          </>
        ) : (
          <button
            onClick={() => onInvite(candidate)}
            disabled={isBusy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            <VideoIcon className="size-4" />
            Invite to interview
          </button>
        )}

        <button
          onClick={() => onRescore(_id)}
          disabled={isBusy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCwIcon className="size-4" />
          Re-score
        </button>

        <button
          onClick={() => onDelete(_id)}
          disabled={isBusy}
          className="ml-auto inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition hover:border-rose-200 hover:text-rose-500 disabled:opacity-50"
          title="Remove candidate"
        >
          <Trash2Icon className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;
