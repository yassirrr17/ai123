"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireBusiness } from "@/lib/business";

export async function addTemplate(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!name || !subject || !body) {
    redirect(`/dashboard/templates?error=${encodeURIComponent("All fields are required.")}`);
  }

  const { error } = await supabase.from("email_templates").insert({
    business_id: business.id,
    name,
    subject,
    body,
  });

  if (error) redirect(`/dashboard/templates?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/templates");
  redirect("/dashboard/templates?success=Template created");
}

export async function updateTemplate(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const id = String(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();

  const { error } = await supabase
    .from("email_templates")
    .update({ name, subject, body })
    .eq("id", id)
    .eq("business_id", business.id);

  if (error) redirect(`/dashboard/templates?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/templates");
  redirect("/dashboard/templates?success=Template updated");
}

export async function setDefaultTemplate(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();
  const id = String(formData.get("id"));

  await supabase.from("email_templates").update({ is_default: false }).eq("business_id", business.id);
  await supabase
    .from("email_templates")
    .update({ is_default: true })
    .eq("id", id)
    .eq("business_id", business.id);

  revalidatePath("/dashboard/templates");
}

export async function deleteTemplate(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();
  const id = String(formData.get("id"));

  await supabase.from("email_templates").delete().eq("id", id).eq("business_id", business.id);
  revalidatePath("/dashboard/templates");
}
