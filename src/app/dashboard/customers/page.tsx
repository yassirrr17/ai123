import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { addCustomer, deleteCustomer, sendReviewRequestNow } from "./actions";
import type { Customer } from "@/lib/types";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const { business } = await requireBusiness();
  const supabase = createClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold">Customers</h1>
      <p className="text-sm text-on-surface-variant">
        Add customers after each visit -- send them a review request whenever you&apos;re ready.
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

      <form
        action={addCustomer}
        className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-5 sm:grid-cols-5"
      >
        <input
          name="name"
          required
          placeholder="Customer name"
          className="rounded-lg border border-outline-variant px-3 py-2 sm:col-span-1"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-lg border border-outline-variant px-3 py-2 sm:col-span-1"
        />
        <input
          name="phone"
          placeholder="Phone (optional)"
          className="rounded-lg border border-outline-variant px-3 py-2 sm:col-span-1"
        />
        <input
          name="serviceDate"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="rounded-lg border border-outline-variant px-3 py-2 sm:col-span-1"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary hover:opacity-90 sm:col-span-1"
        >
          Add customer
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
        {!customers || customers.length === 0 ? (
          <p className="p-6 text-center text-sm text-on-surface-variant">No customers yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container text-xs uppercase text-on-surface-variant">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Service date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(customers as Customer[]).map((c) => (
                <tr key={c.id} className="border-t border-outline-variant/40">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{c.email ?? "-"}</td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {new Date(c.service_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <form action={sendReviewRequestNow}>
                        <input type="hidden" name="customerId" value={c.id} />
                        <button
                          type="submit"
                          disabled={!c.email}
                          className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                          title={c.email ? "Send review request" : "No email on file"}
                        >
                          Send request
                        </button>
                      </form>
                      <form action={deleteCustomer}>
                        <input type="hidden" name="id" value={c.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-outline-variant px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
