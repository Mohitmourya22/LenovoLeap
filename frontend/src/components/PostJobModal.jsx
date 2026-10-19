import { useState } from "react";
import { LoaderIcon, PlusIcon, BriefcaseIcon } from "lucide-react";

const EMPTY = {
  title: "",
  company: "",
  location: "Remote",
  employmentType: "full-time",
  minExperienceYears: 0,
  requiredSkills: "",
  niceToHaveSkills: "",
  description: "",
};

// Calls onSubmit(form) which should return a promise; closes + resets on success.
function PostJobModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(EMPTY);

  if (!isOpen) return null;

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim() || isSubmitting) return;
    try {
      await onSubmit(form);
      setForm(EMPTY);
      onClose();
    } catch {
      // error toast handled by the mutation hook
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400";
  const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
            <BriefcaseIcon className="size-5" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Post a Job</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              Title <span className="text-rose-500">*</span>
            </label>
            <input className={inputClass} value={form.title} onChange={update("title")} placeholder="e.g. Senior Frontend Engineer" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Company</label>
              <input className={inputClass} value={form.company} onChange={update("company")} placeholder="Company name" />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input className={inputClass} value={form.location} onChange={update("location")} placeholder="Remote / City" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Employment type</label>
              <select className={inputClass} value={form.employmentType} onChange={update("employmentType")}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Minimum experience (years)</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.minExperienceYears}
                onChange={update("minExperienceYears")}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Required skills</label>
            <input
              className={inputClass}
              value={form.requiredSkills}
              onChange={update("requiredSkills")}
              placeholder="Comma-separated, e.g. React, TypeScript, Node.js"
            />
          </div>

          <div>
            <label className={labelClass}>Nice-to-have skills</label>
            <input
              className={inputClass}
              value={form.niceToHaveSkills}
              onChange={update("niceToHaveSkills")}
              placeholder="Comma-separated, e.g. GraphQL, Docker"
            />
          </div>

          <div>
            <label className={labelClass}>
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              className={`${inputClass} min-h-[120px] resize-y`}
              value={form.description}
              onChange={update("description")}
              placeholder="Describe the role, responsibilities, and what you're looking for…"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !form.title.trim() || !form.description.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? <LoaderIcon className="size-5 animate-spin" /> : <PlusIcon className="size-5" />}
            {isSubmitting ? "Posting…" : "Post Job"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostJobModal;
