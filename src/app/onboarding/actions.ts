"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBusiness(formData: FormData) {
  const name = String(formData.get("businessName") || "").trim();
  const industry = String(formData.get("industry") || "").trim();
  if (!name) redirect(`/onboarding?error=${encodeURIComponent("Business name is required.")}`);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("businesses")
    .insert({ owner_id: user!.id, name, industry: industry || null });

  if (error) redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);

  redirect("/dashboard");
}
