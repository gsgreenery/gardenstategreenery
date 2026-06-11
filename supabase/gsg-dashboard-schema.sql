begin;

create or replace function public.gsg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.gsg_employees (
  slug text primary key,
  name text not null,
  title text not null,
  env text,
  is_management boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gsg_jobs (
  id text primary key,
  customer text not null,
  town text not null,
  service text not null,
  date date,
  crew text,
  status text not null default 'Scheduled',
  amount numeric(10, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gsg_customers (
  id text primary key,
  name text not null,
  phone text,
  town text not null,
  last_service text,
  access text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gsg_expenses (
  id text primary key,
  item text not null,
  category text not null,
  date date,
  amount numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gsg_blacklist (
  id text primary key,
  name text not null,
  reason text not null,
  status text not null default 'Do not book',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gsg_crew_notes (
  id text primary key,
  text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gsg_equipment (
  id text primary key,
  item text not null,
  note text,
  status text not null default 'Ready',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gsg_marketing_sources (
  id text primary key,
  source text not null,
  leads integer not null default 0,
  booked integer not null default 0,
  spend numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gsg_audit_log (
  id text primary key,
  actor text not null,
  actor_slug text not null,
  action text not null,
  target text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists gsg_jobs_date_idx on public.gsg_jobs (date);
create index if not exists gsg_jobs_status_idx on public.gsg_jobs (status);
create index if not exists gsg_jobs_town_idx on public.gsg_jobs (town);
create index if not exists gsg_customers_town_idx on public.gsg_customers (town);
create index if not exists gsg_expenses_date_idx on public.gsg_expenses (date);
create index if not exists gsg_audit_log_created_at_idx on public.gsg_audit_log (created_at desc);

drop trigger if exists gsg_employees_set_updated_at on public.gsg_employees;
create trigger gsg_employees_set_updated_at
before update on public.gsg_employees
for each row execute function public.gsg_set_updated_at();

drop trigger if exists gsg_jobs_set_updated_at on public.gsg_jobs;
create trigger gsg_jobs_set_updated_at
before update on public.gsg_jobs
for each row execute function public.gsg_set_updated_at();

drop trigger if exists gsg_customers_set_updated_at on public.gsg_customers;
create trigger gsg_customers_set_updated_at
before update on public.gsg_customers
for each row execute function public.gsg_set_updated_at();

drop trigger if exists gsg_expenses_set_updated_at on public.gsg_expenses;
create trigger gsg_expenses_set_updated_at
before update on public.gsg_expenses
for each row execute function public.gsg_set_updated_at();

drop trigger if exists gsg_blacklist_set_updated_at on public.gsg_blacklist;
create trigger gsg_blacklist_set_updated_at
before update on public.gsg_blacklist
for each row execute function public.gsg_set_updated_at();

drop trigger if exists gsg_crew_notes_set_updated_at on public.gsg_crew_notes;
create trigger gsg_crew_notes_set_updated_at
before update on public.gsg_crew_notes
for each row execute function public.gsg_set_updated_at();

drop trigger if exists gsg_equipment_set_updated_at on public.gsg_equipment;
create trigger gsg_equipment_set_updated_at
before update on public.gsg_equipment
for each row execute function public.gsg_set_updated_at();

drop trigger if exists gsg_marketing_sources_set_updated_at on public.gsg_marketing_sources;
create trigger gsg_marketing_sources_set_updated_at
before update on public.gsg_marketing_sources
for each row execute function public.gsg_set_updated_at();

alter table public.gsg_employees enable row level security;
alter table public.gsg_jobs enable row level security;
alter table public.gsg_customers enable row level security;
alter table public.gsg_expenses enable row level security;
alter table public.gsg_blacklist enable row level security;
alter table public.gsg_crew_notes enable row level security;
alter table public.gsg_equipment enable row level security;
alter table public.gsg_marketing_sources enable row level security;
alter table public.gsg_audit_log enable row level security;

revoke all on table public.gsg_employees from anon, authenticated;
revoke all on table public.gsg_jobs from anon, authenticated;
revoke all on table public.gsg_customers from anon, authenticated;
revoke all on table public.gsg_expenses from anon, authenticated;
revoke all on table public.gsg_blacklist from anon, authenticated;
revoke all on table public.gsg_crew_notes from anon, authenticated;
revoke all on table public.gsg_equipment from anon, authenticated;
revoke all on table public.gsg_marketing_sources from anon, authenticated;
revoke all on table public.gsg_audit_log from anon, authenticated;

grant usage on schema public to service_role;
grant all on table public.gsg_employees to service_role;
grant all on table public.gsg_jobs to service_role;
grant all on table public.gsg_customers to service_role;
grant all on table public.gsg_expenses to service_role;
grant all on table public.gsg_blacklist to service_role;
grant all on table public.gsg_crew_notes to service_role;
grant all on table public.gsg_equipment to service_role;
grant all on table public.gsg_marketing_sources to service_role;
grant all on table public.gsg_audit_log to service_role;

drop policy if exists "gsg service role manages employees" on public.gsg_employees;
create policy "gsg service role manages employees"
on public.gsg_employees
for all to service_role
using (true)
with check (true);

drop policy if exists "gsg service role manages jobs" on public.gsg_jobs;
create policy "gsg service role manages jobs"
on public.gsg_jobs
for all to service_role
using (true)
with check (true);

drop policy if exists "gsg service role manages customers" on public.gsg_customers;
create policy "gsg service role manages customers"
on public.gsg_customers
for all to service_role
using (true)
with check (true);

drop policy if exists "gsg service role manages expenses" on public.gsg_expenses;
create policy "gsg service role manages expenses"
on public.gsg_expenses
for all to service_role
using (true)
with check (true);

drop policy if exists "gsg service role manages blacklist" on public.gsg_blacklist;
create policy "gsg service role manages blacklist"
on public.gsg_blacklist
for all to service_role
using (true)
with check (true);

drop policy if exists "gsg service role manages crew notes" on public.gsg_crew_notes;
create policy "gsg service role manages crew notes"
on public.gsg_crew_notes
for all to service_role
using (true)
with check (true);

drop policy if exists "gsg service role manages equipment" on public.gsg_equipment;
create policy "gsg service role manages equipment"
on public.gsg_equipment
for all to service_role
using (true)
with check (true);

drop policy if exists "gsg service role manages marketing" on public.gsg_marketing_sources;
create policy "gsg service role manages marketing"
on public.gsg_marketing_sources
for all to service_role
using (true)
with check (true);

drop policy if exists "gsg service role manages audit log" on public.gsg_audit_log;
create policy "gsg service role manages audit log"
on public.gsg_audit_log
for all to service_role
using (true)
with check (true);

alter table public.gsg_employees
add column if not exists is_management boolean not null default false;

insert into public.gsg_employees (slug, name, title, env, is_management)
values
  ('lucas', 'Lucas', 'Logistics, Operations, Infrastructure', 'GSG_DASHBOARD_PASSWORD_LUCAS', true),
  ('cairo', 'Cairo', 'Field Supervision & Relations', 'GSG_DASHBOARD_PASSWORD_CAIRO', false),
  ('danny', 'Danny', 'Business & Financial', 'GSG_DASHBOARD_PASSWORD_DANNY', true),
  ('peter', 'Peter', 'Marketing & Social Media', 'GSG_DASHBOARD_PASSWORD_PETER', false),
  ('sam', 'Sam', 'Relations & Operations', 'GSG_DASHBOARD_PASSWORD_SAM', false)
on conflict (slug) do update
set
  name = excluded.name,
  title = excluded.title,
  env = excluded.env,
  is_management = excluded.is_management;

commit;
