import { requireBusiness } from "@/lib/business";
import { updateBusiness } from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const { business, userEmail } = await requireBusiness();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-sm text-on-surface-variant">Logged in as {userEmail}</p>

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

      {!business.google_review_link && (
        <p className="mt-4 rounded-md bg-error-container px-3 py-2 text-sm text-on-error-container">
          Add your Google review link below -- without it, customers who leave a positive rating
          have nowhere to be routed.
        </p>
      )}

      <form
        action={updateBusiness}
        className="mt-6 space-y-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6"
      >
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            Business name
          </label>
          <input
            id="name"
            name="name"
            defaultValue={business.name}
            required
            className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="industry">
            Industry
          </label>
          <input
            id="industry"
            name="industry"
            defaultValue={business.industry ?? ""}
            className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="googleReviewLink">
            Google review link
          </label>
          <input
            id="googleReviewLink"
            name="googleReviewLink"
            type="url"
            placeholder="https://g.page/r/your-business/review"
            defaultValue={business.google_review_link ?? ""}
            className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2"
          />
          <p className="mt-1 text-xs text-on-surface-variant">
            Find yours by searching your business on Google Maps &rarr; Share &rarr; Write a
            review, or via the{" "}
            <a
              className="text-primary underline"
              href="https://support.google.com/business/answer/7035772"
              target="_blank"
              rel="noreferrer"
            >
              Google Business Profile
            </a>{" "}
            review link generator.
          </p>
        </div>
        <button
          type="submit"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
