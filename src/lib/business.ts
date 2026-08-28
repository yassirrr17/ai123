import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Business } from "@/lib/types";

/** Loads the signed-in user's business, or redirects to login/onboarding. Call from a Server Component. */
export async function requireBusiness(): Promise<{ business: Business; userEmail: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user!.id)
    .maybeSingle();

  if (!business) redirect("/onboarding");

  return { business: business as Business, userEmail: user!.email ?? "" };
}
