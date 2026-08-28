import Link from "next/link";
import { logIn } from "@/app/actions/auth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; notice?: string; next?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-8">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="material-symbols-outlined text-primary">speed</span>
          ReviewFlow AI
        </div>
        <h1 className="mt-6 text-2xl font-bold">Welcome back</h1>

        {searchParams.notice && (
          <p className="mt-4 rounded-md bg-secondary-container px-3 py-2 text-sm text-on-secondary-container">
            {searchParams.notice}
          </p>
        )}
        {searchParams.error && (
          <p className="mt-4 rounded-md bg-error-container px-3 py-2 text-sm text-on-error-container">
            {searchParams.error}
          </p>
        )}

        <form action={logIn} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={searchParams.next || "/dashboard"} />
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
              required
              className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-2.5 font-semibold text-on-primary hover:opacity-90"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary">
            Start free trial
          </Link>
        </p>
      </div>
    </div>
  );
}
