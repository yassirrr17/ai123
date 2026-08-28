# ReviewFlow AI

Automated review collection for NZ local businesses. A business owner adds customers after a
job, ReviewFlow AI emails them a short "how did we do?" link a few days later, happy customers
(4-5★) get routed straight to the business's Google review page, and unhappy customers (1-3★)
land in a private feedback form instead of a public review.

This is a real, working product: Supabase for auth + database, Resend for email, deployable to
Vercel with a daily cron job driving the automation. The original Stitch design mockups (all 17
screens, including the internal sales-CRM concept) are kept in [`design-reference/`](./design-reference)
for visual reference and as the next build phase.

## How it works

1. A business owner signs up and creates their business profile (`/signup` → `/onboarding`).
2. They add customers as jobs are completed (`/dashboard/customers`), either one at a time or
   automatically via an **automation rule** (`/dashboard/automation`) that fires N days after
   the customer's service date.
3. Sending a request creates a `review_requests` row with a unique token and emails the customer
   a link to `/r/<token>` using the business's chosen email template.
4. The customer taps a star rating on that public page:
   - **4-5★** → marked `completed`, redirected straight to the business's Google review link.
   - **1-3★** → asked for private feedback instead, which is saved and never made public.
5. `/dashboard` and `/dashboard/analytics` show live stats (requests sent, completion rate,
   average rating, rating distribution, positive rate) pulled straight from the database.

## Stack

- **Next.js 14** (App Router, TypeScript, Server Actions -- no separate API layer needed for CRUD)
- **Supabase** (Postgres + Auth + Row Level Security) -- each business's data is isolated via RLS
  policies scoped to `businesses.owner_id = auth.uid()`
- **Resend** for transactional email
- **Tailwind CSS**, using the exact color/type tokens from the original Stitch design system
- Deploys to **Vercel**, with `vercel.json` wiring up a daily cron hit to
  `/api/cron/automation`

## Local setup

### 1. Create a Supabase project

Create a new project at [supabase.com](https://supabase.com/dashboard), then run the migration in
`supabase/migrations/0001_init.sql` against it -- either paste it into the SQL Editor in the
Supabase dashboard, or with the CLI:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This creates `businesses`, `customers`, `email_templates`, `automation_rules`, and
`review_requests`, enables RLS on all of them, and seeds a default email template whenever a new
business is created.

In **Authentication → Providers**, email/password is enabled by default. If you want to skip
email confirmation during testing, turn off "Confirm email" under **Authentication → Settings**
(re-enable it before going live).

### 2. Get a Resend API key

Sign up at [resend.com](https://resend.com), grab an API key. Without a verified domain you can
still send from `onboarding@resend.dev` for testing -- add your own domain under
**Domains** in Resend before sending to real customers (deliverability from the shared test
sender is not reliable for production use).

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (keep secret, server-only) |
| `RESEND_API_KEY` | Resend → API Keys |
| `RESEND_FROM_EMAIL` | e.g. `ReviewFlow AI <reviews@yourdomain.co.nz>` once a domain is verified |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, your Vercel URL in production |
| `CRON_SECRET` | any random string, used to authorize the cron endpoint |

### 4. Run it

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, sign up, add your Google review link under
**Settings**, add a customer, and hit **Send request** to try the full loop end to end.

## Deploying

1. Push this repo to GitHub (already done if you're reading this on the deployed branch) and
   import it in [Vercel](https://vercel.com/new).
2. Add the same environment variables from `.env.local` in the Vercel project settings, using
   your real production `NEXT_PUBLIC_APP_URL` (the deployed domain).
3. Vercel will pick up `vercel.json` automatically and schedule
   `/api/cron/automation` to run daily. Set the `CRON_SECRET` env var in Vercel -- Vercel's own
   cron requests are authenticated automatically, so this only matters if you want to trigger the
   endpoint manually (e.g. `curl -H "Authorization: Bearer $CRON_SECRET" https://your-app/api/cron/automation`).
4. Add and verify your sending domain in Resend so `RESEND_FROM_EMAIL` delivers reliably.

## What's not built yet

- **Billing** -- there's no Stripe integration, so every account is currently unlimited/free.
  Wire up Stripe (or a simple manual invoicing flow) once you're ready to charge.
- **SMS review requests** -- the schema and email flow generalize easily to SMS (e.g. via
  Twilio) if email-only isn't enough for a given trade.
- **CSV import / bulk customer upload** -- customers are added one at a time or via the
  automation rule; bulk import would speed up onboarding larger businesses.
- **Internal sales CRM** -- the `design-reference/` folder includes a full second app (leads
  pipeline, lead scoring, sales scripts, sales CRM dashboard) for running your own outbound sales
  to land NZ business customers. Not built yet -- ask to have it added as a `/sales` section
  once the core product is live and validated.
