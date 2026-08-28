import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { addRule, toggleRule, deleteRule } from "./actions";
import type { AutomationRule, EmailTemplate } from "@/lib/types";

export default async function AutomationPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const [{ data: rules }, { data: templates }] = await Promise.all([
    supabase
      .from("automation_rules")
      .select("*")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false }),
    supabase.from("email_templates").select("*").eq("business_id", business.id),
  ]);

  const templateMap = new Map((templates as EmailTemplate[] | null)?.map((t) => [t.id, t.name]));

  return (
    <div>
      <h1 className="text-2xl font-bold">Automation Rules</h1>
      <p className="text-sm text-on-surface-variant">
        Automatically send a review request N days after a customer&apos;s service date. A rule
        checks every customer daily and only sends once per customer.
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-md bg-error-container px-3 py-2 text-sm text-on-error-container">
          {searchParams.error}
        </p>
      )}
      {searchParams.success && (
        <p className="mt-4 rounded-md bg-secondary-container px-3 py-2 text-sm text-on-secondary-container">
          {searchParams.success}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {!rules || rules.length === 0 ? (
          <p className="rounded-xl border border-dashed border-outline-variant p-6 text-center text-sm text-on-surface-variant">
            No automation rules yet -- create one below.
          </p>
        ) : (
          (rules as AutomationRule[]).map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-4"
            >
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-on-surface-variant">
                  {r.trigger_delay_days} day{r.trigger_delay_days === 1 ? "" : "s"} after service
                  date &middot; {templateMap.get(r.template_id ?? "") ?? "No template"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <form action={toggleRule}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="active" value={String(r.active)} />
                  <button
                    type="submit"
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      r.active
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {r.active ? "Active" : "Paused"}
                  </button>
                </form>
                <form action={deleteRule}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-outline-variant px-3 py-1.5 text-xs font-semibold text-error hover:bg-error-container"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-5">
        <h2 className="font-semibold">New rule</h2>
        <form action={addRule} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input
            name="name"
            required
            placeholder="Rule name"
            className="rounded-lg border border-outline-variant px-3 py-2 sm:col-span-2"
          />
          <input
            name="delay"
            type="number"
            min={0}
            defaultValue={1}
            className="rounded-lg border border-outline-variant px-3 py-2"
            title="Days after service date"
          />
          <select
            name="templateId"
            required
            className="rounded-lg border border-outline-variant px-3 py-2"
          >
            <option value="">Select template</option>
            {(templates as EmailTemplate[] | null)?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary sm:col-span-4"
          >
            Create rule
          </button>
        </form>
      </div>
    </div>
  );
}
