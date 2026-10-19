import { Link } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.14),transparent_36%),linear-gradient(180deg,#f8f7ff,white)] px-4 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-indigo-500/10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-600 p-10 text-white lg:flex">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.35em] text-white/75">Hire-Bridge AI</div>
              <h1 className="mt-8 max-w-md text-5xl font-black leading-tight">
                Welcome back to your interview workspace.
              </h1>
              <p className="mt-4 max-w-md text-white/80">
                Continue live coding, room playback, chat, and AI guidance in one place.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Protected by</p>
              <div className="mt-3 text-2xl font-black">Clerk + JWT + Socket.IO</div>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
                <Link to="/" className="font-semibold text-indigo-700 hover:text-indigo-800">
                  Back to home
                </Link>
                <Link to="/sign-up" className="font-semibold text-slate-700 hover:text-indigo-700">
                  Create account
                </Link>
              </div>

              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                forceRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;