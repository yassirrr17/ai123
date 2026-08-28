"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireBusiness } from "@/lib/business";

export async function addRule(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const delay = Number(formData.get("delay") || 1);
  const templateId = String(formData.get("templateId") || "");

  if (!name || !templateId) {
    redirect(`/dashboard/automation?error=${encodeURIComponent("Name and template are required.")}`);
  }

  const { error } = await supabase.from("automation_rules").insert({
    business_id: business.id,
    name,
    trigger_delay_days: Number.isFinite(delay) && delay >= 0 ? delay : 1,
    template_id: templateId,
    active: true,
  });

  if (error) redirect(`/dashboard/automation?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/automation");
  redirect("/dashboard/automation?success=Automation rule created");
}

export async function toggleRule(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();
  const id = String(formData.get("id"));
  const active = String(formData.get("active")) === "true";

  await supabase
    .from("automation_rules")
    .update({ active: !active })
    .eq("id", id)
    .eq("business_id", business.id);

  revalidatePath("/dashboard/automation");
}

export async function deleteRule(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();
  const id = String(formData.get("id"));

  await supabase.from("automation_rules").delete().eq("id", id).eq("business_id", business.id);
  revalidatePath("/dashboard/automation");
}
