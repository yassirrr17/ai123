import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default function SignupPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-8">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="material-symbols-outlined text-primary">speed</span>
          ReviewFlow AI
        </div>
        <h1 className="mt-6 text-2xl font-bold">Start your free trial</h1>
        <p className="mt-1 text-sm text-on-surface-variant">No credit card required.</p>

        {searchParams.error && (
          <p className="mt-4 rounded-md bg-error-container px-3 py-2 text-sm text-on-error-container">
            {searchParams.error}
          </p>
        )}

        <form action={signUp} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="businessName">
              Business name
            </label>
            <input
              id="businessName"
              name="businessName"
              required
              className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2"
              placeholder="e.g. Central Auto Repair"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2"
              placeholder="you@business.co.nz"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
              className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-2.5 font-semibold text-on-primary hover:opacity-90"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
