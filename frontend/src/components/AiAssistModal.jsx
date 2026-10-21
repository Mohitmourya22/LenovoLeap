import { useState, useEffect } from "react";
import {
  SparklesIcon,
  XIcon,
  ClockIcon,
  ZapIcon,
  LightbulbIcon,
  BookOpenIcon,
  CopyIcon,
  CheckIcon,
  Loader2Icon,
  RefreshCwIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAiAssist } from "../hooks/useAiAssist";

const MODES = [
  { id: "explain", label: "Explain Code", icon: BookOpenIcon, desc: "Step-by-step logic breakdown" },
  { id: "complexity", label: "Complexity", icon: ClockIcon, desc: "Big-O Time & Space analysis" },
  { id: "optimize", label: "Optimize", icon: ZapIcon, desc: "Algorithmic & memory enhancements" },
  { id: "hint", label: "Hints & Questions", icon: LightbulbIcon, desc: "Progressive hints & interviewer probes" },
];

function AiAssistModal({ isOpen, onClose, code, language = "javascript", problemTitle = "" }) {
  const [activeMode, setActiveMode] = useState("explain");
  const [copied, setCopied] = useState(false);
  const [cache, setCache] = useState({});

  const aiAssistMutation = useAiAssist();

  const fetchInsights = (mode) => {
    if (!code || !code.trim()) {
      toast.error("Please write or paste some code first!");
      return;
    }

    aiAssistMutation.mutate(
      {
        mode,
        code,
        language,
        prompt: `Problem: ${problemTitle || "Interview Problem"}`,
      },
      {
        onSuccess: (data) => {
          setCache((prev) => ({
            ...prev,
            [mode]: { result: data.result, source: data.source },
          }));
        },
      }
    );
  };

  useEffect(() => {
    if (isOpen) {
      // Clear cache if code has changed significantly or if active mode not cached
      if (!cache[activeMode]) {
        fetchInsights(activeMode);
      }
    }
  }, [isOpen, activeMode]);

  const handleTabChange = (modeId) => {
    setActiveMode(modeId);
    if (!cache[modeId]) {
      fetchInsights(modeId);
    }
  };

  const handleCopy = () => {
    const currentText = cache[activeMode]?.result;
    if (currentText) {
      navigator.clipboard.writeText(currentText);
      setCopied(true);
      toast.success("Insights copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  const currentData = cache[activeMode];
  const isLoading = aiAssistMutation.isPending;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-3xl rounded-[28px] border border-slate-200 bg-white p-0 shadow-2xl overflow-hidden text-slate-900">
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur shadow-inner">
                <SparklesIcon className="size-6 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black tracking-tight text-white">Hire-Bridge AI Co-Pilot</h3>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                    v2.0
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/80">
                  Real-time algorithmic review, Big-O metrics, and interview-ready feedback
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <XIcon className="size-5" />
            </button>
          </div>

          {/* TABS */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MODES.map((m) => {
              const Icon = m.icon;
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleTabChange(m.id)}
                  className={`flex flex-col items-start rounded-2xl p-3 text-left transition ${
                    isActive
                      ? "bg-white text-indigo-900 shadow-md"
                      : "bg-white/10 text-white/90 hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Icon className="size-4" />
                    <span>{m.label}</span>
                  </div>
                  <span className={`mt-0.5 text-[11px] line-clamp-1 ${isActive ? "text-slate-500" : "text-white/70"}`}>
                    {m.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-indigo-700">
              Target Language: <span className="text-slate-700 uppercase">{language}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchInsights(activeMode)}
                disabled={isLoading}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                title="Regenerate insights"
              >
                <RefreshCwIcon className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Re-analyze
              </button>

              <button
                onClick={handleCopy}
                disabled={isLoading || !currentData?.result}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                title="Copy to clipboard"
              >
                {copied ? <CheckIcon className="size-3.5 text-emerald-600" /> : <CopyIcon className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="min-h-[220px] max-h-[360px] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/70 p-5 font-sans leading-relaxed text-slate-800 text-sm">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <Loader2Icon className="size-9 animate-spin text-indigo-600 mb-3" />
                <p className="font-semibold text-slate-900">Synthesizing code insights...</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Analyzing algorithmic patterns, memory footprint, and interview-ready recommendations.
                </p>
              </div>
            ) : currentData?.result ? (
              <div className="whitespace-pre-line space-y-2">
                {currentData.result}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Click a tab above to generate instant AI insights for your current code.
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>
              Engine:{" "}
              {currentData?.source === "openai"
                ? "OpenAI GPT-4o-mini"
                : "Heuristic Pattern Analyzer"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
}

export default AiAssistModal;
