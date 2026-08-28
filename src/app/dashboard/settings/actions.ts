"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireBusiness } from "@/lib/business";

export async function updateBusiness(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const industry = String(formData.get("industry") || "").trim();
  const googleReviewLink = String(formData.get("googleReviewLink") || "").trim();

  if (!name) redirect(`/dashboard/settings?error=${encodeURIComponent("Business name is required.")}`);
  if (googleReviewLink && !/^https?:\/\//i.test(googleReviewLink)) {
    redirect(`/dashboard/settings?error=${encodeURIComponent("Google review link must be a full URL.")}`);
  }

  const { error } = await supabase
    .from("businesses")
    .update({ name, industry: industry || null, google_review_link: googleReviewLink || null })
    .eq("id", business.id);

  if (error) redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings?success=Settings saved");
}
