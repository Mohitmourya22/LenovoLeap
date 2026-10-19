import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-violet-500/20">
            <Clock className="size-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Your Past Sessions</h2>
            <p className="text-sm text-slate-500">Review completed rooms and active ones you can rejoin.</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <Loader className="size-10 animate-spin text-indigo-600" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => {
              const isActive = session.status === "active";

              return (
                <div
                  key={session._id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                        <Code2 className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-slate-950">{session.problem}</h3>
                        <span className={`badge badge-sm mt-2 ${getDifficultyBadgeClass(session.difficulty)}`}>
                          {session.difficulty}
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                        Active
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-slate-400" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-slate-400" />
                      <span>
                        {session.participant ? "2" : "1"} participant{session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-medium text-slate-500">
                    <span>{isActive ? "In progress" : "Completed"}</span>
                    <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl flex items-center justify-center">
                <Trophy className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-1">No sessions yet</p>
              <p className="text-sm text-slate-500">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;
