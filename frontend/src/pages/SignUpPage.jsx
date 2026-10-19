import { Link } from "react-router-dom";
import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(129,39,207,0.12),transparent_36%),linear-gradient(180deg,#f8f7ff,white)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-violet-500/10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-2 flex flex-col justify-center p-6 sm:p-10 lg:order-1">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
                <Link to="/" className="font-semibold text-indigo-700 hover:text-indigo-800">
                  Back to home
                </Link>
                <Link to="/sign-in" className="font-semibold text-slate-700 hover:text-indigo-700">
                  Sign in
                </Link>
              </div>

              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                forceRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
              />
            </div>
          </div>

          <div className="order-1 hidden flex-col justify-between bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-900 p-10 text-white lg:flex lg:order-2">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/75">Hire-Bridge AI</div>
              <h1 className="mt-8 max-w-md text-5xl font-black leading-tight">
                Build your interview team workspace.
              </h1>
              <p className="mt-4 max-w-md text-white/80">
                Create accounts, invite candidates, and run collaborative coding sessions with AI support.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Includes</p>
              <div className="mt-3 text-2xl font-black">Problems, sessions, analytics, and chat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;