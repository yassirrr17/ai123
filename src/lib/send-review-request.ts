import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, REVIEW_EMAIL_FROM, fillTemplate } from "@/lib/resend";
import type { Business, Customer, EmailTemplate } from "@/lib/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function createAndSendReviewRequest(params: {
  business: Business;
  customer: Customer;
  template: EmailTemplate;
  automationRuleId?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { business, customer, template, automationRuleId } = params;
  if (!customer.email) return { ok: false, error: "Customer has no email on file." };

  const admin = createAdminClient();

  const { data: request, error: insertError } = await admin
    .from("review_requests")
    .insert({
      business_id: business.id,
      customer_id: customer.id,
      automation_rule_id: automationRuleId ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (insertError || !request) {
    return { ok: false, error: insertError?.message ?? "Could not create review request." };
  }

  const reviewLink = `${APP_URL}/r/${request.token}`;
  const vars = {
    customer_name: customer.name,
    business_name: business.name,
    review_link: reviewLink,
  };

  const resend = getResendClient();
  if (!resend) {
    // No email provider configured yet -- leave the request queued as pending so it
    // shows up in the dashboard, rather than silently failing.
    return { ok: false, error: "RESEND_API_KEY is not configured." };
  }

  const { error: sendError } = await resend.emails.send({
    from: REVIEW_EMAIL_FROM,
    to: customer.email,
    subject: fillTemplate(template.subject, vars),
    text: fillTemplate(template.body, vars),
  });

  if (sendError) {
    await admin.from("review_requests").update({ status: "failed" }).eq("id", request.id);
    return { ok: false, error: sendError.message };
  }

  await admin
    .from("review_requests")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", request.id);

  return { ok: true };
}
