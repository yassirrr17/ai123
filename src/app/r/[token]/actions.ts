"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function rateAndRoute(formData: FormData) {
  const token = String(formData.get("token"));
  const rating = Number(formData.get("rating"));

  const admin = createAdminClient();
  const { data: request } = await admin
    .from("review_requests")
    .select("*, businesses(google_review_link)")
    .eq("token", token)
    .single();

  if (!request) redirect(`/r/${token}?error=1`);

  if (rating >= 4) {
    await admin
      .from("review_requests")
      .update({ rating, status: "completed", completed_at: new Date().toISOString() })
      .eq("id", request!.id);

    const googleLink = (request as unknown as { businesses: { google_review_link: string | null } })
      .businesses?.google_review_link;
    if (googleLink) redirect(googleLink);
    redirect(`/r/${token}?thankyou=1`);
  }

  await admin.from("review_requests").update({ rating }).eq("id", request!.id);
  redirect(`/r/${token}?feedback=1`);
}

export async function submitFeedback(formData: FormData) {
  const token = String(formData.get("token"));
  const feedback = String(formData.get("feedback") || "").trim();

  const admin = createAdminClient();
  await admin
    .from("review_requests")
    .update({ feedback, status: "completed", completed_at: new Date().toISOString() })
    .eq("token", token);

  redirect(`/r/${token}?thankyou=1`);
}
