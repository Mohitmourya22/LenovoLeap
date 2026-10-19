import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  PlusIcon,
  LoaderIcon,
  UsersIcon,
  CheckCircle2Icon,
  GaugeIcon,
  MapPinIcon,
} from "lucide-react";

import Navbar from "../components/Navbar";
import PostJobModal from "../components/PostJobModal";
import { useJobs, useJobStats, useCreateJob } from "../hooks/useJobs";

const employmentPill = (type) => {
  switch (type) {
    case "contract":
      return "bg-amber-50 text-amber-700";
    case "internship":
      return "bg-sky-50 text-sky-700";
    case "part-time":
      return "bg-violet-50 text-violet-700";
    default:
      return "bg-indigo-50 text-indigo-700";
  }
};

function StatCard({ icon: Icon, label, value, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-700",
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`mb-6 flex size-12 items-center justify-center rounded-2xl ${tones[tone]}`}>
        <Icon className="size-6" />
      </div>
      <div className="text-4xl font-black tracking-tight text-slate-950">{value}</div>
      <div className="mt-2 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function JobsPage() {
  const [showModal, setShowModal] = useState(false);

  const { data: jobsData, isLoading, refetch: refetchJobs } = useJobs();
  const { data: statsData, refetch: refetchStats } = useJobStats();
  const createJobMutation = useCreateJob();

  const jobs = jobsData?.jobs || [];
  const stats = statsData?.stats || { openJobs: 0, totalCandidates: 0, shortlisted: 0, avgMatchScore: 0 };

  const handleCreate = async (form) => {
    await createJobMutation.mutateAsync(form);
    refetchJobs();
    refetchStats();
  };

  return (
    <>
      <div className="min-h-screen bg-[#f6f5ff] text-slate-900">
        <Navbar />

        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6">
          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">
                <BriefcaseIcon className="size-4" />
                Recruiting
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Jobs & Candidates</h1>
              <p className="mt-1 text-sm text-slate-500">
                Post a role, upload resumes, and let the AI screener rank candidates by fit.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
            >
              <PlusIcon className="size-5" />
              Post a Job
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={BriefcaseIcon} label="Open jobs" value={stats.openJobs} tone="indigo" />
            <StatCard icon={UsersIcon} label="Resumes screened" value={stats.totalCandidates} tone="violet" />
            <StatCard icon={CheckCircle2Icon} label="Shortlisted" value={stats.shortlisted} tone="emerald" />
            <StatCard icon={GaugeIcon} label="Avg match score" value={`${stats.avgMatchScore}%`} tone="amber" />
          </div>

          {/* JOBS LIST */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoaderIcon className="size-10 animate-spin text-indigo-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
                <BriefcaseIcon className="size-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No jobs yet</h3>
              <p className="mt-1 text-sm text-slate-500">Post your first role to start screening candidates.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
              >
                <PlusIcon className="size-5" />
                Post a Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="group flex flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-slate-900 group-hover:text-indigo-700">
                        {job.title}
                      </h3>
                      <div className="mt-0.5 text-sm text-slate-500">{job.company || "—"}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        job.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full px-2.5 py-1 font-medium capitalize ${employmentPill(job.employmentType)}`}>
                      {job.employmentType?.replace("-", " ")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <MapPinIcon className="size-3.5" />
                      {job.location}
                    </span>
                  </div>

                  {job.requiredSkills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.requiredSkills.slice(0, 5).map((skill) => (
                        <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 5 && (
                        <span className="rounded-full px-2 py-1 text-xs text-slate-400">
                          +{job.requiredSkills.length - 5}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                      <UsersIcon className="size-4 text-indigo-600" />
                      {job.candidateCount} candidate{job.candidateCount === 1 ? "" : "s"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2Icon className="size-4" />
                      {job.shortlistedCount} shortlisted
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <PostJobModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreate}
        isSubmitting={createJobMutation.isPending}
      />
    </>
  );
}

export default JobsPage;
