import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  MapPinIcon,
  LoaderIcon,
  UsersIcon,
  Trash2Icon,
  ClockIcon,
} from "lucide-react";

import Navbar from "../components/Navbar";
import ResumeUploadCard from "../components/ResumeUploadCard";
import CandidateCard from "../components/CandidateCard";
import CandidateInviteModal from "../components/CandidateInviteModal";
import {
  useJob,
  useCandidates,
  useUpdateJobStatus,
  useDeleteJob,
  useUploadResume,
  useUpdateCandidateStatus,
  useRescoreCandidate,
  useInviteCandidate,
  useDeleteCandidate,
} from "../hooks/useJobs";

const FILTERS = [
  ["", "All"],
  ["new", "New"],
  ["shortlisted", "Shortlisted"],
  ["rejected", "Rejected"],
];

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [inviteModalData, setInviteModalData] = useState(null);

  const { data: jobData, isLoading: loadingJob, refetch: refetchJob } = useJob(id);
  const { data: candData, isLoading: loadingCandidates, refetch: refetchCandidates } = useCandidates(id, statusFilter);

  const updateJobStatus = useUpdateJobStatus();
  const deleteJob = useDeleteJob();
  const uploadResume = useUploadResume();
  const updateStatus = useUpdateCandidateStatus();
  const rescore = useRescoreCandidate();
  const invite = useInviteCandidate();
  const removeCandidate = useDeleteCandidate();

  const job = jobData?.job;
  const candidates = candData?.candidates || [];

  const runOnCandidate = async (candidateId, action) => {
    setPendingId(candidateId);
    try {
      await action();
      await refetchCandidates();
    } catch {
      // error toast handled by the mutation hook
    } finally {
      setPendingId(null);
    }
  };

  const handleShortlist = (cid) => runOnCandidate(cid, () => updateStatus.mutateAsync({ id: cid, status: "shortlisted" }));
  const handleReject = (cid) => runOnCandidate(cid, () => updateStatus.mutateAsync({ id: cid, status: "rejected" }));
  const handleRescore = (cid) => runOnCandidate(cid, () => rescore.mutateAsync(cid));
  const handleDelete = (cid) => runOnCandidate(cid, () => removeCandidate.mutateAsync(cid));

  const handleInvite = async (candidate) => {
    const candidateId = candidate?._id || candidate;
    setPendingId(candidateId);
    try {
      const data = await invite.mutateAsync(candidateId);
      await refetchCandidates();
      const updatedCandidate = {
        ...(typeof candidate === "object" ? candidate : candidates.find((c) => c._id === candidateId) || {}),
        session: data.sessionId,
        status: "shortlisted",
      };
      setInviteModalData({
        candidate: updatedCandidate,
        sessionId: data.sessionId,
      });
    } catch {
      // error toast handled by the mutation hook
    } finally {
      setPendingId(null);
    }
  };

  const handleShareInvite = (cand) => {
    if (cand?.session) {
      setInviteModalData({
        candidate: cand,
        sessionId: cand.session,
      });
    } else {
      handleInvite(cand);
    }
  };

  const handleUpload = async ({ file, name }) => {
    await uploadResume.mutateAsync({ jobId: id, file, name });
    await refetchCandidates();
  };

  const handleToggleJob = async () => {
    await updateJobStatus.mutateAsync({ id, status: job.status === "open" ? "closed" : "open" });
    refetchJob();
  };

  const handleDeleteJob = async () => {
    if (!window.confirm("Delete this job and all of its candidates? This cannot be undone.")) return;
    try {
      await deleteJob.mutateAsync(id);
      navigate("/jobs");
    } catch {
      // error toast handled by the mutation hook
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-[#f6f5ff]">
        <Navbar />
        <div className="flex justify-center py-20">
          <LoaderIcon className="size-10 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f6f5ff]">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-black text-slate-900">Job not found</h1>
          <Link to="/jobs" className="mt-4 inline-block font-semibold text-indigo-700 hover:underline">
            ← Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  const shortlistedCount = candidates.filter((c) => c.status === "shortlisted").length;

  return (
    <div className="min-h-screen bg-[#f6f5ff] text-slate-900">
      <Navbar />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-700">
          <ArrowLeftIcon className="size-4" />
          Back to jobs
        </Link>

        {/* JOB HEADER */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-slate-950">{job.title}</h1>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    job.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <BriefcaseIcon className="size-4" />
                  {job.company || "—"} · <span className="capitalize">{job.employmentType?.replace("-", " ")}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="size-4" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="size-4" />
                  {job.minExperienceYears}+ yrs experience
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleJob}
                disabled={updateJobStatus.isPending}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                {job.status === "open" ? "Close job" : "Reopen job"}
              </button>
              <button
                onClick={handleDeleteJob}
                disabled={deleteJob.isPending}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition hover:border-rose-200 hover:text-rose-500 disabled:opacity-50"
                title="Delete job"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>

          {job.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">{job.description}</p>
          )}

          <div className="mt-4 space-y-2">
            {job.requiredSkills?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Required</span>
                {job.requiredSkills.map((skill) => (
                  <span key={skill} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {job.niceToHaveSkills?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nice to have</span>
                {job.niceToHaveSkills.map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* CANDIDATES */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <UsersIcon className="size-5 text-indigo-600" />
                Candidates
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm font-semibold text-slate-500">
                  {candidates.length}
                </span>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {FILTERS.map(([value, label]) => (
                  <button
                    key={label}
                    onClick={() => setStatusFilter(value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      statusFilter === value
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loadingCandidates ? (
              <div className="flex justify-center py-16">
                <LoaderIcon className="size-8 animate-spin text-indigo-600" />
              </div>
            ) : candidates.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <UsersIcon className="size-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No candidates{statusFilter ? " here" : " yet"}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {statusFilter ? "Try a different filter." : "Upload a resume to screen your first candidate."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate._id}
                    candidate={candidate}
                    isBusy={pendingId === candidate._id}
                    onShortlist={handleShortlist}
                    onReject={handleReject}
                    onRescore={handleRescore}
                    onInvite={handleInvite}
                    onShareInvite={handleShareInvite}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ResumeUploadCard onUpload={handleUpload} isUploading={uploadResume.isPending} />

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">Pipeline</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total screened</span>
                  <span className="font-bold text-slate-900">{candidates.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Shortlisted</span>
                  <span className="font-bold text-emerald-700">{shortlistedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Top match</span>
                  <span className="font-bold text-indigo-700">
                    {candidates.length ? `${Math.max(...candidates.map((c) => c.matchScore || 0))}%` : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CandidateInviteModal
        isOpen={Boolean(inviteModalData)}
        onClose={() => setInviteModalData(null)}
        candidate={inviteModalData?.candidate}
        job={job}
        sessionId={inviteModalData?.sessionId}
        onEnterSession={() => {
          if (inviteModalData?.sessionId) {
            navigate(`/session/${inviteModalData.sessionId}`);
          }
        }}
      />
    </div>
  );
}

export default JobDetailPage;
