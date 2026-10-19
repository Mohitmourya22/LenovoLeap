import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
            <UsersIcon className="size-6" />
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Live
          </span>
        </div>
        <div className="text-4xl font-black tracking-tight text-slate-950">{activeSessionsCount}</div>
        <div className="mt-2 text-sm text-slate-500">Active Sessions</div>
      </div>

      <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <TrophyIcon className="size-6" />
          </div>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
            Total
          </span>
        </div>
        <div className="text-4xl font-black tracking-tight text-slate-950">{recentSessionsCount}</div>
        <div className="mt-2 text-sm text-slate-500">Total Sessions</div>
      </div>
    </div>
  );
}

export default StatsCards;
