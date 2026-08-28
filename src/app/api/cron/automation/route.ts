import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAndSendReviewRequest } from "@/lib/send-review-request";
import type { AutomationRule, Business, Customer, EmailTemplate } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Runs once a day (see vercel.json). For every active automation rule, finds
 * customers whose service_date + trigger_delay_days has arrived and who have
 * never been sent a request for that rule, then sends one.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const results: { customer: string; rule: string; ok: boolean; error?: string }[] = [];

  const { data: rules } = await admin
    .from("automation_rules")
    .select("*, businesses(*)")
    .eq("active", true);

  for (const rule of (rules ?? []) as (AutomationRule & { businesses: Business })[]) {
    const business = rule.businesses;
    if (!business || !rule.template_id) continue;

    const { data: template } = await admin
      .from("email_templates")
      .select("*")
      .eq("id", rule.template_id)
      .single();
    if (!template) continue;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - rule.trigger_delay_days);
    const cutoffDate = cutoff.toISOString().slice(0, 10);

    const { data: candidates } = await admin
      .from("customers")
      .select("*")
      .eq("business_id", business.id)
      .not("email", "is", null)
      .lte("service_date", cutoffDate);

    for (const customer of (candidates ?? []) as Customer[]) {
      const { data: existing } = await admin
        .from("review_requests")
        .select("id")
        .eq("customer_id", customer.id)
        .eq("automation_rule_id", rule.id)
        .maybeSingle();
      if (existing) continue;

      const result = await createAndSendReviewRequest({
        business,
        customer,
        template: template as EmailTemplate,
        automationRuleId: rule.id,
      });

      results.push({ customer: customer.name, rule: rule.name, ok: result.ok, error: result.ok ? undefined : result.error });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
