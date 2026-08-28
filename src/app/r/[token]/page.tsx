import { createAdminClient } from "@/lib/supabase/admin";
import { rateAndRoute, submitFeedback } from "./actions";

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { thankyou?: string; feedback?: string; error?: string };
}) {
  const admin = createAdminClient();
  const { data: request } = await admin
    .from("review_requests")
    .select("*, businesses(name), customers(name)")
    .eq("token", params.token)
    .maybeSingle();

  if (!request || searchParams.error) {
    return (
      <Shell>
        <p className="text-lg font-semibold">This review link isn&apos;t valid.</p>
        <p className="mt-2 text-sm text-on-surface-variant">
          It may have expired or already been used. Contact the business directly if you&apos;d
          like to share feedback.
        </p>
      </Shell>
    );
  }

  const businessName = (request as unknown as { businesses: { name: string } }).businesses?.name ?? "us";
  const customerName = (request as unknown as { customers: { name: string } }).customers?.name ?? "";

  if (request.status === "sent") {
    await admin
      .from("review_requests")
      .update({ status: "opened", opened_at: new Date().toISOString() })
      .eq("id", request.id)
      .eq("status", "sent");
  }

  if (searchParams.thankyou || (request.status === "completed" && !searchParams.feedback)) {
    return (
      <Shell>
        <span className="material-symbols-outlined text-5xl text-secondary">check_circle</span>
        <p className="mt-4 text-lg font-semibold">Thank you{customerName ? `, ${customerName}` : ""}!</p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Your feedback helps {businessName} keep improving.
        </p>
      </Shell>
    );
  }

  if (searchParams.feedback) {
    return (
      <Shell>
        <p className="text-lg font-semibold">Sorry to hear that.</p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Tell {businessName} what went wrong -- this goes directly to them, not a public review.
        </p>
        <form action={submitFeedback} className="mt-6 space-y-3 text-left">
          <input type="hidden" name="token" value={params.token} />
          <textarea
            name="feedback"
            required
            rows={5}
            placeholder="What could we have done better?"
            className="w-full rounded-lg border border-outline-variant px-3 py-2"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-2.5 font-semibold text-on-primary hover:opacity-90"
          >
            Send private feedback
          </button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="text-lg font-semibold">
        Hi{customerName ? ` ${customerName}` : ""}, how was your experience with {businessName}?
      </p>
      <form action={rateAndRoute} className="mt-6">
        <input type="hidden" name="token" value={params.token} />
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="submit"
              name="rating"
              value={star}
              className="group flex h-14 w-14 items-center justify-center rounded-full border border-outline-variant text-2xl hover:bg-primary hover:text-on-primary"
              aria-label={`${star} star${star === 1 ? "" : "s"}`}
            >
              ★
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-on-surface-variant">Tap a star to rate your experience.</p>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-8 text-center">
        {children}
      </div>
    </div>
  );
}
