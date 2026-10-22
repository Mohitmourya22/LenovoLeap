import { useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  MailIcon,
  VideoIcon,
  XIcon,
  SparklesIcon,
  SendIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { copyToClipboard } from "../lib/utils";

function CandidateInviteModal({
  isOpen,
  onClose,
  candidate,
  job,
  sessionId,
  onEnterSession,
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmailText, setCopiedEmailText] = useState(false);

  if (!isOpen || !candidate || !sessionId) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const inviteLink = `${origin}/session/${sessionId}`;
  const jobTitle = job?.title || "Technical Role";
  const company = job?.company || "Hire-Bridge Team";
  const candidateName = candidate?.name || "Candidate";
  const candidateEmail = candidate?.email || "";

  const emailSubject = `Interview Invitation: ${jobTitle} at ${company}`;
  const emailBody = `Hi ${candidateName},

Thank you for your interest in the ${jobTitle} position at ${company}.

We are pleased to invite you to a live technical interview and coding session. You can join the session directly using the link below:

${inviteLink}

Before joining, please ensure:
1. You have a stable internet connection.
2. Your camera and microphone are connected and working.
3. You use a modern desktop browser (Chrome, Edge, Firefox, or Safari).

We look forward to meeting you!

Best regards,
${company} Hiring Team`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(inviteLink);
    if (success) {
      setCopiedLink(true);
      toast.success("Interview invite link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      toast.error("Failed to copy link. Please manually copy the URL.");
    }
  };

  const handleCopyEmailText = async () => {
    const success = await copyToClipboard(emailBody);
    if (success) {
      setCopiedEmailText(true);
      toast.success("Email invitation text copied to clipboard!");
      setTimeout(() => setCopiedEmailText(false), 2500);
    } else {
      toast.error("Failed to copy email template.");
    }
  };

  const handleOpenEmailClient = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(candidateEmail)}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
    toast.success("Opening default email client...");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md shadow-indigo-500/25">
              <VideoIcon className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Room Ready
                </span>
                <span className="text-xs font-semibold text-slate-400">1-on-1 Workspace</span>
              </div>
              <h3 className="mt-1 text-2xl font-black text-slate-900">
                Interview Invite for {candidateName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* CANDIDATE INFO STRIP */}
        <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 text-xs sm:grid-cols-3">
          <div>
            <span className="text-slate-400 font-medium">Candidate:</span>
            <div className="font-bold text-slate-800 truncate mt-0.5">{candidateName}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Candidate Email:</span>
            <div className="font-bold text-slate-800 truncate mt-0.5">
              {candidateEmail || <span className="text-slate-400 italic">No email on file</span>}
            </div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Target Role:</span>
            <div className="font-bold text-slate-800 truncate mt-0.5">{jobTitle}</div>
          </div>
        </div>

        {/* INVITE LINK BOX */}
        <div className="mt-5 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Candidate Direct Join Link
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-2 pr-3 focus-within:border-indigo-400 focus-within:bg-white transition">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 bg-transparent px-2 text-sm font-mono text-slate-800 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-indigo-300 transition"
            >
              {copiedLink ? (
                <>
                  <CheckIcon className="size-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="size-4 text-indigo-600" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Share this link with the candidate. They will join the live synchronized code editor & video room.
          </p>
        </div>

        {/* QUICK SEND OPTIONS */}
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <MailIcon className="size-4" />
            Send Invitation to Candidate
          </div>
          <p className="mt-1 text-xs text-slate-600">
            {candidateEmail
              ? `Send an invitation directly to ${candidateEmail} with your default mail client, or copy the pre-formatted invite template.`
              : "No email was detected on the resume. You can copy the invitation text or link to send via LinkedIn or messaging."}
          </p>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {candidateEmail && (
              <button
                onClick={handleOpenEmailClient}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
              >
                <SendIcon className="size-3.5" />
                Send via Email App
              </button>
            )}

            <button
              onClick={handleCopyEmailText}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition"
            >
              {copiedEmailText ? (
                <>
                  <CheckIcon className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Email Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="size-3.5 text-indigo-600" />
                  <span>Copy Email Template</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* MODAL ACTIONS */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Stay on Candidates List
          </button>

          <button
            onClick={onEnterSession}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition"
          >
            <VideoIcon className="size-4" />
            Join Room as Interviewer
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateInviteModal;
