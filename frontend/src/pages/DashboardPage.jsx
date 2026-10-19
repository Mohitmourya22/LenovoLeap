import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import { useJobStats } from "../hooks/useJobs";
import { BarChart3, Briefcase, FileText, FolderOpen, LayoutDashboard, Settings, Trophy, Users2 } from "lucide-react";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "Easy", visibility: "public", sessionId: "" });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();
  const { data: jobStatsData } = useJobStats();
  const jobStats = jobStatsData?.stats || { openJobs: 0, shortlisted: 0, avgMatchScore: 0 };

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
        visibility: roomConfig.visibility,
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          setRoomConfig((current) => ({ ...current, sessionId: data.session._id }));
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <div className="min-h-screen bg-[#f6f5ff] text-slate-900">
        <Navbar />

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6">
          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-5">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
                <LayoutDashboard className="size-5" />
              </div>
              <div>
                <div className="text-lg font-black leading-tight text-indigo-700">HIRE-BRIDGE</div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-500">AI-powered coding</div>
              </div>
            </div>

            <nav className="space-y-2 text-sm font-medium text-slate-600">
              {[
                { label: "Dashboard", Icon: LayoutDashboard, to: "/dashboard" },
                { label: "Problems", Icon: FolderOpen, to: "/problems" },
                { label: "Jobs", Icon: Briefcase, to: "/jobs" },
                { label: "Sessions", Icon: Users2 },
                { label: "Submissions", Icon: FileText },
                { label: "Analytics", Icon: BarChart3 },
                { label: "Leaderboard", Icon: Trophy },
                { label: "Settings", Icon: Settings },
              ].map(({ label, Icon, to }) => {
                const active = to && location.pathname === to;
                return (
                  <button
                    key={label}
                    onClick={to ? () => navigate(to) : undefined}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                      active
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : to
                        ? "hover:bg-slate-100"
                        : "cursor-default text-slate-400"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>

            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5"
            >
              + Create Session
            </button>
          </aside>

          <main className="space-y-6">
            <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-6">
                <StatsCards
                  activeSessionsCount={activeSessions.length}
                  recentSessionsCount={recentSessions.length}
                />
                <ActiveSessions
                  sessions={activeSessions}
                  isLoading={loadingActiveSessions}
                  isUserInSession={isUserInSession}
                />
                <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 p-6 text-white shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Recruiting</div>
                    <Briefcase className="size-5 text-white/80" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-3xl font-black">{jobStats.openJobs}</div>
                      <div className="mt-1 text-xs text-white/70">Open jobs</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black">{jobStats.shortlisted}</div>
                      <div className="mt-1 text-xs text-white/70">Shortlisted</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black">{jobStats.avgMatchScore}%</div>
                      <div className="mt-1 text-xs text-white/70">Avg match</div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/jobs")}
                    className="mt-5 w-full rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
                  >
                    Open recruiting →
                  </button>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">
                    Weekly goal
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-4xl font-black text-slate-950">85%</div>
                      <div className="text-sm text-slate-500">You're only 2 sessions away.</div>
                    </div>
                    <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-right">
                      <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Streak</div>
                      <div className="text-2xl font-black text-indigo-700">12</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">
                    Suggested problems
                  </div>
                  <div className="space-y-3">
                    {[
                      ["LRU Cache", "Medium"],
                      ["Valid Parentheses", "Easy"],
                      ["Merge Intervals", "Medium"],
                    ].map(([label, difficulty]) => (
                      <div key={label} className="rounded-2xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-slate-900">{label}</div>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{difficulty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;
