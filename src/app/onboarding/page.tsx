import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createBusiness } from "./actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (business) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-8">
        <h1 className="text-2xl font-bold">Set up your business</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          One more step -- tell us about the business you want ReviewFlow AI to collect reviews
          for.
        </p>

        {searchParams.error && (
          <p className="mt-4 rounded-md bg-error-container px-3 py-2 text-sm text-on-error-container">
            {searchParams.error}
          </p>
        )}

        <form action={createBusiness} className="mt-6 space-y-4">
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
            <label className="text-sm font-medium" htmlFor="industry">
              Industry (optional)
            </label>
            <input
              id="industry"
              name="industry"
              className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2"
              placeholder="e.g. Mechanic, Barber, Dentist"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-2.5 font-semibold text-on-primary hover:opacity-90"
          >
            Continue to dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
