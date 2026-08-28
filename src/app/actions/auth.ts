"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const businessName = String(formData.get("businessName") || "").trim();

  if (!email || !password || !businessName) {
    redirect(`/signup?error=${encodeURIComponent("Please fill in every field.")}`);
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.session) {
    // Email confirmation disabled -- we're already logged in, create the business now.
    const { error: bizError } = await supabase
      .from("businesses")
      .insert({ owner_id: data.user!.id, name: businessName });
    if (bizError) {
      redirect(`/signup?error=${encodeURIComponent(bizError.message)}`);
    }
    redirect("/dashboard");
  }

  // Email confirmation required -- business gets created on first login via /onboarding.
  redirect(`/login?notice=${encodeURIComponent("Check your email to confirm your account, then log in.")}&businessName=${encodeURIComponent(businessName)}`);
}

export async function logIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(next || "/dashboard");
}

export async function logOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
