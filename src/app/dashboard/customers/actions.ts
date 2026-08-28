"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireBusiness } from "@/lib/business";
import { createAndSendReviewRequest } from "@/lib/send-review-request";
import type { EmailTemplate } from "@/lib/types";

export async function addCustomer(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const serviceDate = String(formData.get("serviceDate") || "") || new Date().toISOString().slice(0, 10);

  if (!name) redirect(`/dashboard/customers?error=${encodeURIComponent("Name is required.")}`);

  const { error } = await supabase.from("customers").insert({
    business_id: business.id,
    name,
    email: email || null,
    phone: phone || null,
    service_date: serviceDate,
  });

  if (error) redirect(`/dashboard/customers?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers?success=Customer added");
}

export async function deleteCustomer(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();
  const id = String(formData.get("id"));

  await supabase.from("customers").delete().eq("id", id).eq("business_id", business.id);
  revalidatePath("/dashboard/customers");
}

export async function sendReviewRequestNow(formData: FormData) {
  const { business } = await requireBusiness();
  const supabase = createClient();
  const customerId = String(formData.get("customerId"));

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .eq("business_id", business.id)
    .single();

  if (!customer) redirect(`/dashboard/customers?error=${encodeURIComponent("Customer not found.")}`);

  const { data: template } = await supabase
    .from("email_templates")
    .select("*")
    .eq("business_id", business.id)
    .order("is_default", { ascending: false })
    .limit(1)
    .single();

  if (!template) {
    redirect(`/dashboard/customers?error=${encodeURIComponent("No email template configured.")}`);
  }

  const result = await createAndSendReviewRequest({
    business,
    customer: customer!,
    template: template as EmailTemplate,
  });

  revalidatePath("/dashboard/customers");
  revalidatePath("/dashboard");

  if (!result.ok) {
    redirect(`/dashboard/customers?error=${encodeURIComponent(result.error)}`);
  }
  redirect(`/dashboard/customers?success=${encodeURIComponent(`Review request sent to ${customer!.name}`)}`);
}
