-- ReviewFlow AI core schema
create extension if not exists pgcrypto;

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  industry text,
  google_review_link text,
  created_at timestamptz not null default now()
);
create unique index if not exists businesses_owner_id_idx on businesses(owner_id);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  service_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists customers_business_id_idx on customers(business_id);

create table if not exists email_templates (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  subject text not null,
  body text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists email_templates_business_id_idx on email_templates(business_id);

create table if not exists automation_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  trigger_delay_days int not null default 1,
  template_id uuid references email_templates(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists automation_rules_business_id_idx on automation_rules(business_id);

create table if not exists review_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  automation_rule_id uuid references automation_rules(id) on delete set null,
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  status text not null default 'pending' check (status in ('pending', 'sent', 'opened', 'completed', 'failed')),
  rating int check (rating between 1 and 5),
  feedback text,
  sent_at timestamptz,
  opened_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists review_requests_business_id_idx on review_requests(business_id);
create index if not exists review_requests_customer_id_idx on review_requests(customer_id);
create index if not exists review_requests_token_idx on review_requests(token);

-- Row Level Security: every table scoped to the authenticated owner via businesses.owner_id.
-- The public /r/[token] flow never uses these client policies -- it goes through
-- the service-role key on the server, which bypasses RLS entirely.
alter table businesses enable row level security;
alter table customers enable row level security;
alter table email_templates enable row level security;
alter table automation_rules enable row level security;
alter table review_requests enable row level security;

create policy "owner reads own business" on businesses
  for select using (owner_id = auth.uid());
create policy "owner inserts own business" on businesses
  for insert with check (owner_id = auth.uid());
create policy "owner updates own business" on businesses
  for update using (owner_id = auth.uid());

create policy "owner manages own customers" on customers
  for all using (business_id in (select id from businesses where owner_id = auth.uid()))
  with check (business_id in (select id from businesses where owner_id = auth.uid()));

create policy "owner manages own templates" on email_templates
  for all using (business_id in (select id from businesses where owner_id = auth.uid()))
  with check (business_id in (select id from businesses where owner_id = auth.uid()));

create policy "owner manages own automation rules" on automation_rules
  for all using (business_id in (select id from businesses where owner_id = auth.uid()))
  with check (business_id in (select id from businesses where owner_id = auth.uid()));

create policy "owner manages own review requests" on review_requests
  for all using (business_id in (select id from businesses where owner_id = auth.uid()))
  with check (business_id in (select id from businesses where owner_id = auth.uid()));

-- Seed a sensible default email template whenever a business is created.
create or replace function public.create_default_template()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into email_templates (business_id, name, subject, body, is_default)
  values (
    new.id,
    'Default Review Request',
    'How did we do, {{customer_name}}?',
    E'Hi {{customer_name}},\n\nThanks for choosing {{business_name}} recently. We''d love to hear how it went -- it only takes 10 seconds.\n\n{{review_link}}\n\nThanks for your time,\n{{business_name}}',
    true
  );
  return new;
end;
$$;

drop trigger if exists on_business_created on businesses;
create trigger on_business_created
  after insert on businesses
  for each row execute function public.create_default_template();
