import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.1),transparent_35%),linear-gradient(180deg,#f8f7ff,white)] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl shadow-indigo-500/10 sm:p-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">Hire-Bridge AI</p>
              <h1 className="mt-3 text-3xl font-black text-slate-950">Forgot password</h1>
            </div>
            <Link to="/sign-in" className="text-sm font-semibold text-indigo-700 hover:text-indigo-800">
              Back to sign in
            </Link>
          </div>

          <div className="space-y-4 text-slate-600">
            <p>
              Password recovery is handled by Clerk. Use the sign-in flow to trigger email-based reset instructions.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7">
              If you want a custom reset experience later, wire this route to a dedicated Clerk reset component or a server-backed email token flow.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;