import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { addTemplate, updateTemplate, setDefaultTemplate, deleteTemplate } from "./actions";
import type { EmailTemplate } from "@/lib/types";

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const { data: templates } = await supabase
    .from("email_templates")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold">Email Templates</h1>
      <p className="text-sm text-on-surface-variant">
        Use <code>{"{{customer_name}}"}</code>, <code>{"{{business_name}}"}</code>, and{" "}
        <code>{"{{review_link}}"}</code> as placeholders -- they&apos;re filled in automatically
        when a request is sent.
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

      <div className="mt-6 space-y-4">
        {(templates as EmailTemplate[] | null)?.map((t) => (
          <details
            key={t.id}
            className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-5"
          >
            <summary className="flex cursor-pointer items-center justify-between">
              <span className="font-semibold">
                {t.name}
                {t.is_default && (
                  <span className="ml-2 rounded-full bg-secondary-container px-2 py-0.5 text-xs font-semibold text-on-secondary-container">
                    Default
                  </span>
                )}
              </span>
              <span className="text-xs text-on-surface-variant">{t.subject}</span>
            </summary>

            <form action={updateTemplate} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={t.id} />
              <input
                name="name"
                defaultValue={t.name}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
              />
              <input
                name="subject"
                defaultValue={t.subject}
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
              />
              <textarea
                name="body"
                defaultValue={t.body}
                rows={5}
                className="w-full rounded-lg border border-outline-variant px-3 py-2 font-mono text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-on-primary"
                >
                  Save
                </button>
              </div>
            </form>

            <div className="mt-3 flex gap-2">
              {!t.is_default && (
                <form action={setDefaultTemplate}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-outline-variant px-4 py-1.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
                  >
                    Make default
                  </button>
                </form>
              )}
              {!t.is_default && (
                <form action={deleteTemplate}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-outline-variant px-4 py-1.5 text-sm font-semibold text-error hover:bg-error-container"
                  >
                    Delete
                  </button>
                </form>
              )}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-5">
        <h2 className="font-semibold">New template</h2>
        <form action={addTemplate} className="mt-3 space-y-3">
          <input
            name="name"
            required
            placeholder="Template name"
            className="w-full rounded-lg border border-outline-variant px-3 py-2"
          />
          <input
            name="subject"
            required
            placeholder="Email subject"
            className="w-full rounded-lg border border-outline-variant px-3 py-2"
          />
          <textarea
            name="body"
            required
            rows={5}
            placeholder="Hi {{customer_name}}, ..."
            className="w-full rounded-lg border border-outline-variant px-3 py-2 font-mono text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Create template
          </button>
        </form>
      </div>
    </div>
  );
}
