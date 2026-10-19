import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Crown,
  Database,
  GitBranch,
  Globe,
  Layers3,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

const features = [
  { icon: Video, label: "Live Video Chat" },
  { icon: Code2, label: "Monaco Editor" },
  { icon: Globe, label: "Multi-language" },
  { icon: Layers3, label: "Screen Sharing" },
  { icon: Bot, label: "AI Insights" },
  { icon: GitBranch, label: "Session Playback" },
];

const stats = [
  { label: "Active Users", value: "10K+", icon: Users },
  { label: "Sessions Conducted", value: "50K+", icon: Code2 },
  { label: "Uptime SLA", value: "99.9%", icon: ShieldCheck },
  { label: "User Rating", value: "4.8", icon: Star },
];

const insights = [
  "Explain code with AI suggestions",
  "Optimize solutions for time and space",
  "Generate interview-ready answers",
  "Analyze complexity in seconds",
];

function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6f5ff] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-16 lg:px-8">
        <header className="flex items-center justify-between py-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 text-white shadow-lg shadow-violet-500/25">
              <Code2 className="size-5" />
            </div>
            <div>
              <div className="text-sm font-black tracking-[0.28em] text-indigo-700">HIRE-BRIDGE</div>
              <div className="text-xs uppercase tracking-[0.32em] text-slate-500">AI-powered coding</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-indigo-700">Features</a>
            <a href="#solutions" className="hover:text-indigo-700">Solutions</a>
            <a href="#resources" className="hover:text-indigo-700">Resources</a>
            <a href="#pricing" className="hover:text-indigo-700">Pricing</a>
          </nav>

          <SignInButton mode="modal">
            <button className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-700">
              Get Started
            </button>
          </SignInButton>
        </header>

        <main className="flex-1">
          <section className="grid items-center gap-14 py-8 lg:grid-cols-2 lg:py-14">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700 shadow-sm">
                <Zap className="size-4" /> Real-time collaboration
              </div>

              <div className="space-y-5">
                <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl">
                  Code Together,
                  <span className="block bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
                    Learn Together.
                  </span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Hire-Bridge AI combines collaborative coding rooms, live interviews,
                  AI feedback, and WebRTC sessions into one polished workspace for modern
                  technical hiring.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <SignInButton mode="modal">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5">
                    Start Coding Now <ArrowRight className="size-4" />
                  </button>
                </SignInButton>
                <a
                  href="#solutions"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
                >
                  <Play className="size-4" /> Watch Demo
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-2" id="features">
                {features.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-sm">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                      <Icon className="size-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 hidden rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-xl shadow-indigo-500/10 backdrop-blur md:block">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <div className="flex -space-x-2">
                    <div className="size-8 rounded-full border-2 border-white bg-indigo-600" />
                    <div className="size-8 rounded-full border-2 border-white bg-slate-300" />
                    <div className="size-8 rounded-full border-2 border-white bg-violet-400" />
                  </div>
                  <span>Online session</span>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-900/20">
                <div className="flex items-center gap-2 pb-4">
                  <span className="size-3 rounded-full bg-red-400" />
                  <span className="size-3 rounded-full bg-yellow-400" />
                  <span className="size-3 rounded-full bg-emerald-400" />
                  <div className="ml-3 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                    solution.js - Hire-Bridge AI
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-2xl bg-[#0f1117] p-4 text-sm text-slate-200 shadow-inner">
                    <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                      <span className="rounded-full bg-white/5 px-3 py-1">Monaco Editor</span>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">Real-time sync</span>
                    </div>
                    <pre className="overflow-hidden whitespace-pre-wrap font-mono leading-7 text-slate-200">
{`function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
}`}
                    </pre>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Users className="size-4 text-indigo-600" /> Participants
                      </div>
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                          <span>Mohit Mourya</span>
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Host</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                          <span>Mansoon Patel</span>
                          <span className="rounded-full bg-slate-200 px-2 py-1 text-xs">Watching</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-600 p-4 text-white shadow-lg shadow-violet-500/20">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="size-4" /> AI Insights
                      </div>
                      <ul className="space-y-2 text-sm text-white/90">
                        {insights.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl bg-white/5 p-3 text-center text-xs text-slate-300">
                  <div>
                    <div className="text-lg font-bold text-white">Live Chat</div>
                    <div>Typing indicators</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">WebRTC</div>
                    <div>Audio / video / screen</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Socket.IO</div>
                    <div>Presence + sync</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 py-10 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <Icon className="size-5" />
                </div>
                <div className="text-3xl font-black text-slate-950">{value}</div>
                <div className="mt-1 text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </section>

          <section id="solutions" className="space-y-6 py-10">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">
                Everything you need to hire better
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                A collaborative workspace for interviews, practice, and AI-guided feedback.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Candidates code in a shared room while interviewers get live video, persistent sessions,
                and structured AI analysis without leaving the flow.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Video className="size-5" />
                </div>
                <h3 className="text-2xl font-bold text-slate-950">Integrated audio & video</h3>
                <p className="mt-3 max-w-2xl text-slate-600">
                  WebRTC-powered calling, shared screens, and participant presence create a real interview
                  room that feels immediate and professional.
                </p>
                <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="text-sm font-semibold text-slate-900">Participant Grid</div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="aspect-square rounded-2xl bg-slate-200" />
                        <div className="aspect-square rounded-2xl bg-indigo-200" />
                        <div className="aspect-square rounded-2xl bg-violet-200" />
                        <div className="aspect-square rounded-2xl bg-slate-100" />
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#10131d] p-4 text-slate-200">
                      <div className="text-sm font-semibold text-white">AI Assistant</div>
                      <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="rounded-xl bg-white/5 px-3 py-2">Complexity: O(n) time, O(n) space</div>
                        <div className="rounded-xl bg-white/5 px-3 py-2">Optimization: Use a hash map for lookups</div>
                        <div className="rounded-xl bg-white/5 px-3 py-2">Interview tip: narrate trade-offs clearly</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Database className="size-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">Session playback</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Review a session stroke by stroke and understand how a problem was solved.
                  </p>
                </div>

                <div className="rounded-[28px] bg-gradient-to-br from-violet-700 to-fuchsia-600 p-6 text-white shadow-xl shadow-violet-500/20">
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-white/15">
                    <Crown className="size-5" />
                  </div>
                  <h3 className="text-xl font-bold">AI Insights</h3>
                  <p className="mt-3 text-sm leading-7 text-white/85">
                    Get automated summaries of performance, code efficiency, and communication style.
                  </p>
                  <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-4 text-xs uppercase tracking-[0.3em] text-white/75">
                    <span>Enterprise feature</span>
                    <span>Secure by design</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-10 border-t border-slate-200 py-8 text-sm text-slate-500">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>© 2026 Hire-Bridge AI. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-indigo-700">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-700">Terms of Service</a>
              <a href="#" className="hover:text-indigo-700">Help Center</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;