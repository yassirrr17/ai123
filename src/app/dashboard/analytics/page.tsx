import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/StatCard";
import { BarRow } from "@/components/BarRow";
import type { ReviewRequest } from "@/lib/types";

export default async function AnalyticsPage() {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const { data: requests } = await supabase
    .from("review_requests")
    .select("*")
    .eq("business_id", business.id);

  const all = (requests ?? []) as ReviewRequest[];
  const sent = all.filter((r) => r.status !== "pending" && r.status !== "failed");
  const completed = all.filter((r) => r.status === "completed");
  const rated = completed.filter((r) => r.rating != null);
  const avgRating = rated.length
    ? (rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length).toFixed(1)
    : "-";
  const completionRate = sent.length ? Math.round((completed.length / sent.length) * 100) : 0;
  const positiveRate = completed.length
    ? Math.round((completed.filter((r) => (r.rating ?? 0) >= 4).length / completed.length) * 100)
    : 0;

  const ratingCounts = [1, 2, 3, 4, 5].map(
    (star) => rated.filter((r) => r.rating === star).length
  );
  const maxRatingCount = Math.max(1, ...ratingCounts);

  const last30 = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
  const sentByDay = last30.map(
    (day) => sent.filter((r) => r.sent_at?.slice(0, 10) === day).length
  );
  const maxPerDay = Math.max(1, ...sentByDay);

  return (
    <div>
      <h1 className="text-2xl font-bold">Performance Analytics</h1>
      <p className="text-sm text-on-surface-variant">
        Real numbers for {business.name}, pulled live from your review requests.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total requests" value={String(sent.length)} icon="send" />
        <StatCard label="Completion rate" value={`${completionRate}%`} icon="task_alt" />
        <StatCard label="Avg. rating" value={avgRating} icon="star" />
        <StatCard label="Positive rate" value={`${positiveRate}%`} icon="thumb_up" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-5">
          <h2 className="font-semibold">Rating distribution</h2>
          <div className="mt-4 space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <BarRow
                key={star}
                label={`${star} star`}
                value={ratingCounts[star - 1]}
                max={maxRatingCount}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-5">
          <h2 className="font-semibold">Requests sent, last 30 days</h2>
          <div className="mt-4 flex h-40 items-end gap-1">
            {sentByDay.map((count, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/80"
                style={{ height: `${Math.max(4, (count / maxPerDay) * 100)}%` }}
                title={`${last30[i]}: ${count}`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-on-surface-variant">Hover a bar for the exact date.</p>
        </div>
      </div>
    </div>
  );
}
