import { useState } from "react";
import {
  XIcon,
  FileCodeIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  CalendarIcon,
  Loader2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useSubmissions } from "../hooks/useSubmissions";

function SubmissionsModal({ isOpen, onClose }) {
  const { data, isLoading } = useSubmissions();
  const [expandedId, setExpandedId] = useState(null);

  if (!isOpen) return null;

  const submissions = data?.submissions || [];

  const toggleExpand = (id) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2Icon className="size-3.5" />
            Accepted
          </span>
        );
      case "wrong-answer":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            <XCircleIcon className="size-3.5" />
            Wrong Answer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <AlertTriangleIcon className="size-3.5" />
            {status || "Failed"}
          </span>
        );
    }
  };

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <FileCodeIcon className="size-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950">Submissions History</h3>
              <p className="text-xs text-slate-500">Track all your code runs, benchmarks, and problem results</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="mt-4 max-h-[440px] overflow-y-auto space-y-3 pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2Icon className="size-8 animate-spin text-indigo-600 mb-2" />
              <p className="text-sm font-semibold text-slate-600">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
              <FileCodeIcon className="mx-auto size-10 text-slate-300 mb-3" />
              <h4 className="font-bold text-slate-800">No submissions recorded yet</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Head over to the Problems arena, solve a challenge, and hit "Run Code" to benchmark your solutions!
              </p>
            </div>
          ) : (
            submissions.map((sub) => {
              const isExpanded = expandedId === sub._id;
              const dateStr = new Date(sub.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={sub._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{sub.problemTitle || "Challenge"}</h4>
                          {getStatusBadge(sub.status)}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="capitalize font-medium text-slate-700">{sub.language}</span>
                          <span className="inline-flex items-center gap-1">
                            <ClockIcon className="size-3" />
                            {sub.runtimeMs}ms
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarIcon className="size-3" />
                            {dateStr}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(sub._id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      {isExpanded ? "Hide Code" : "View Code"}
                      {isExpanded ? <ChevronUpIcon className="size-3.5" /> : <ChevronDownIcon className="size-3.5" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <pre className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-48 leading-relaxed">
                        {sub.sourceCode}
                      </pre>
                      {sub.testResult && (
                        <div className="mt-2 text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded-lg">
                          Output: {sub.testResult}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4 flex justify-between items-center text-xs text-slate-500">
          <span>Total runs: {submissions.length}</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
}

export default SubmissionsModal;
