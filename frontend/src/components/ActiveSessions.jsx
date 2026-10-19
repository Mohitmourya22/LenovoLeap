import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  HashIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  const featuredSession = sessions[0];
  const remainingSessions = sessions.slice(1);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-violet-500/20">
              <ZapIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Live Sessions</h2>
              <p className="text-sm text-slate-500">Join an active room or jump back into your own.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500" />
            {sessions.length} active
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderIcon className="size-10 animate-spin text-indigo-600" />
          </div>
        ) : sessions.length > 0 ? (
          <>
            {featuredSession && (
              <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 p-6 text-white shadow-xl shadow-violet-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_30%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-white/85 backdrop-blur">
                      <VideoIcon className="size-4" />
                      Live session
                    </div>

                    <h3 className="text-3xl font-black tracking-tight sm:text-4xl">{featuredSession.problem}</h3>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/90">
                      <span className={`rounded-full bg-white/15 px-3 py-1 ${getDifficultyBadgeClass(featuredSession.difficulty)} border border-white/10 text-white`}>
                        {featuredSession.difficulty.slice(0, 1).toUpperCase() + featuredSession.difficulty.slice(1)}
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1">Host: {featuredSession.host?.name}</span>
                      <span className="rounded-full bg-white/15 px-3 py-1">{featuredSession.participant ? "2/2 Active" : "1/2 Active"}</span>
                    </div>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
                      Jump straight into the active room with live video, synchronized code, chat, and session playback.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch lg:min-w-[240px]">
                    {featuredSession.participant && !isUserInSession(featuredSession) ? (
                      <button className="rounded-2xl bg-white/20 px-5 py-3 font-semibold text-white backdrop-blur">
                        Room full
                      </button>
                    ) : (
                      <Link
                        to={`/session/${featuredSession._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5"
                      >
                        {isUserInSession(featuredSession) ? "Rejoin session" : "Join session"}
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    )}

                    <div className="grid gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:grid-cols-2 lg:grid-cols-1">
                      <div className="rounded-xl bg-white/10 px-4 py-3 text-center">
                        <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">Host</div>
                        <div className="mt-1 text-sm font-semibold leading-5">{featuredSession.host?.name}</div>
                      </div>
                      <div className="rounded-xl bg-white/10 px-4 py-3 text-center">
                        <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">Room</div>
                        <div className="mt-1 text-sm font-semibold leading-5">Open now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              {remainingSessions.length > 0 ? (
                remainingSessions.map((session) => (
                  <div
                    key={session._id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-sm">
                          <HashIcon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-lg font-bold text-slate-950">{session.problem}</h4>
                          <p className="text-sm text-slate-500">{session.host?.name}</p>
                        </div>
                      </div>

                      <span className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}>
                        {session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="size-4 text-slate-400" />
                        <span>{session.participant ? "2/2" : "1/2"} participants</span>
                      </div>

                      {session.participant && !isUserInSession(session) ? (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                          Full
                        </span>
                      ) : (
                        <Link
                          to={`/session/${session._id}`}
                          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                        >
                          {isUserInSession(session) ? "Rejoin" : "Join"}
                          <ArrowRightIcon className="size-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl flex items-center justify-center">
                    <SparklesIcon className="w-10 h-10 text-indigo-500" />
                  </div>
                  <p className="text-lg font-semibold text-slate-700 mb-1">No additional sessions</p>
                  <p className="text-sm text-slate-500">Create a room and start the first live session.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl flex items-center justify-center">
              <SparklesIcon className="w-10 h-10 text-indigo-500" />
            </div>
            <p className="text-lg font-semibold text-slate-700 mb-1">No active sessions</p>
            <p className="text-sm text-slate-500">Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default ActiveSessions;
