import Link from "next/link";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/StatCard";
import type { ReviewRequest } from "@/lib/types";

export default async function DashboardPage() {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const { data: requests } = await supabase
    .from("review_requests")
    .select("*, customers(name, email)")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const all = (requests ?? []) as (ReviewRequest & { customers: { name: string; email: string } | null })[];

  const sent = all.filter((r) => r.status !== "pending" && r.status !== "failed");
  const completed = all.filter((r) => r.status === "completed");
  const rated = completed.filter((r) => r.rating != null);
  const avgRating = rated.length
    ? (rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length).toFixed(1)
    : "-";
  const completionRate = sent.length ? Math.round((completed.length / sent.length) * 100) : 0;
  const positive = completed.filter((r) => (r.rating ?? 0) >= 4).length;

  const { count: customerCount } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true })
    .eq("business_id", business.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-on-surface-variant">
            Here&apos;s how {business.name} is doing with review requests.
          </p>
        </div>
        <Link
          href="/dashboard/customers"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
        >
          + Add customer
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Requests sent" value={String(sent.length)} icon="send" />
        <StatCard label="Completed" value={String(completed.length)} icon="task_alt" />
        <StatCard
          label="Completion rate"
          value={`${completionRate}%`}
          icon="trending_up"
        />
        <StatCard label="Avg. rating" value={avgRating} icon="star" hint={`${positive} positive reviews`} />
      </div>

      {(customerCount ?? 0) === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-outline-variant p-6 text-center">
          <p className="font-semibold">No customers yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Add your first customer to start sending automated review requests.
          </p>
          <Link
            href="/dashboard/customers"
            className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Add a customer
          </Link>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Recent activity</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
          {all.length === 0 ? (
            <p className="p-6 text-center text-sm text-on-surface-variant">
              No review requests yet.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container text-xs uppercase text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Sent</th>
                </tr>
              </thead>
              <tbody>
                {all.slice(0, 10).map((r) => (
                  <tr key={r.id} className="border-t border-outline-variant/40">
                    <td className="px-4 py-3 font-medium">{r.customers?.name ?? "Unknown"}</td>
                    <td className="px-4 py-3 capitalize">{r.status}</td>
                    <td className="px-4 py-3">{r.rating ? "★".repeat(r.rating) : "-"}</td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {r.sent_at ? new Date(r.sent_at).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
