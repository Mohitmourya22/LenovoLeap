import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, Search } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const allProblems = Object.values(PROBLEMS);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const problems = useMemo(() => {
    return allProblems.filter((problem) => {
      const matchesQuery =
        problem.title.toLowerCase().includes(query.toLowerCase()) ||
        problem.category.toLowerCase().includes(query.toLowerCase()) ||
        problem.description.text.toLowerCase().includes(query.toLowerCase());

      const matchesDifficulty = difficulty === "All" || problem.difficulty === difficulty;

      return matchesQuery && matchesDifficulty;
    });
  }, [allProblems, difficulty, query]);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-[#f6f5ff]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">Problems</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">Practice Problems</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Search, filter, and jump into interview-style challenges with difficulty tags and clean problem summaries.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search className="size-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search problems..."
                className="w-full bg-transparent outline-none"
              />
            </label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 outline-none"
            >
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {['All', 'Easy', 'Medium', 'Hard'].map((tag) => (
            <button
              key={tag}
              onClick={() => setDifficulty(tag)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                difficulty === tag ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                    <Code2Icon className="size-6" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-950">{problem.title}</h2>
                      <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{problem.category}</p>
                    <p className="mt-3 max-w-3xl text-slate-600">{problem.description.text}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-indigo-700">
                  <span className="font-semibold">Solve</span>
                  <ChevronRightIcon className="size-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Total Problems</div>
            <div className="mt-2 text-3xl font-black text-slate-950">{problems.length}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Easy</div>
            <div className="mt-2 text-3xl font-black text-emerald-600">{easyProblemsCount}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Medium</div>
            <div className="mt-2 text-3xl font-black text-amber-600">{mediumProblemsCount}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Hard</div>
            <div className="mt-2 text-3xl font-black text-rose-600">{hardProblemsCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
