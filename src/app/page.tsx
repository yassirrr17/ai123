import Link from "next/link";

const industries = [
  { icon: "content_cut", label: "Barbers & Salons" },
  { icon: "car_repair", label: "Mechanics" },
  { icon: "dentistry", label: "Dentists" },
  { icon: "restaurant", label: "Restaurants" },
];

const features = [
  {
    icon: "bolt",
    title: "Automatic follow-up",
    body: "As soon as a customer's service date is logged, ReviewFlow AI queues the ask -- no staff member has to remember.",
  },
  {
    icon: "route",
    title: "Smart routing",
    body: "Happy customers (4-5 stars) go straight to your Google review page. Unhappy ones land in a private feedback form -- so you catch problems before they become public reviews.",
  },
  {
    icon: "insights",
    title: "Real-time analytics",
    body: "Track requests sent, completion rate, and average rating from one dashboard, per business.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="sticky top-0 z-10 border-b border-outline-variant/60 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="material-symbols-outlined text-primary">speed</span>
            ReviewFlow AI
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
            >
              Start Free
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container">
            <span className="material-symbols-outlined !text-sm">new_releases</span>
            Built for NZ Local Businesses
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Turn completed services into genuine reviews. Automatically.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-on-surface-variant">
            ReviewFlow AI follows up with customers after their visit, making it easy to share
            honest feedback without your staff having to remember. Free up time and grow your
            local reputation.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-primary px-6 py-3 font-semibold text-on-primary shadow-lg shadow-primary/20 hover:opacity-90"
            >
              Start Free Trial
            </Link>
          </div>
          <p className="mt-3 text-sm text-on-surface-variant">
            No credit card required. Cancel anytime.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-8">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-on-surface-variant">
            Trusted by local NZ businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {industries.map((i) => (
              <div key={i.label} className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined">{i.icon}</span>
                <span className="text-sm font-medium">{i.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6"
              >
                <span className="material-symbols-outlined text-3xl text-primary">{f.icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-on-surface-variant">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-2xl bg-primary px-8 py-14 text-center text-on-primary">
            <h2 className="text-3xl font-bold">Ready to grow your local reputation?</h2>
            <p className="mx-auto mt-3 max-w-xl text-on-primary/90">
              Join NZ businesses collecting genuine feedback automatically.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-block rounded-full bg-on-primary px-6 py-3 font-semibold text-primary hover:opacity-90"
            >
              Start your free trial today
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant/60 py-8 text-center text-sm text-on-surface-variant">
        © {new Date().getFullYear()} ReviewFlow AI NZ. All rights reserved.
      </footer>
    </div>
  );
}
