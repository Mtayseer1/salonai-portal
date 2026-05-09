create extension if not exists pgcrypto;

create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.admins add column if not exists name text;
alter table public.admins add column if not exists email text;
alter table public.admins add column if not exists is_active boolean not null default true;
alter table public.admins add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.admins add column if not exists created_at timestamptz not null default now();

create table if not exists public.partners (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  country text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.partners add column if not exists name text;
alter table public.partners add column if not exists email text;
alter table public.partners add column if not exists phone text;
alter table public.partners add column if not exists country text;
alter table public.partners add column if not exists is_active boolean not null default true;
alter table public.partners add column if not exists created_at timestamptz not null default now();

create table if not exists public.barbers (
  id uuid primary key references auth.users(id) on delete cascade,
  barber_name text,
  shop_name text,
  country text,
  description text,
  phone text,
  email text,
  is_active boolean not null default true,
  total_credits integer not null default 0,
  remaining_credits integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.barbers add column if not exists barber_name text;
alter table public.barbers add column if not exists shop_name text;
alter table public.barbers add column if not exists country text;
alter table public.barbers add column if not exists description text;
alter table public.barbers add column if not exists phone text;
alter table public.barbers add column if not exists email text;
alter table public.barbers add column if not exists is_active boolean not null default true;
alter table public.barbers add column if not exists total_credits integer not null default 0;
alter table public.barbers add column if not exists remaining_credits integer not null default 0;
alter table public.barbers add column if not exists created_at timestamptz not null default now();

create table if not exists public.partner_customers (
  partner_id uuid not null references public.partners(id) on delete cascade,
  customer_id uuid not null references public.barbers(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (partner_id, customer_id)
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.barbers(id) on delete cascade,
  change_amount integer not null,
  transaction_type text not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.credit_transactions add column if not exists customer_id uuid references public.barbers(id) on delete cascade;
alter table public.credit_transactions add column if not exists change_amount integer not null default 0;
alter table public.credit_transactions add column if not exists transaction_type text not null default 'manual';
alter table public.credit_transactions add column if not exists notes text;
alter table public.credit_transactions add column if not exists created_at timestamptz not null default now();

alter table public.admins enable row level security;
alter table public.partners enable row level security;
alter table public.barbers enable row level security;
alter table public.partner_customers enable row level security;
alter table public.credit_transactions enable row level security;

drop policy if exists "Admins can read own profile" on public.admins;
create policy "Admins can read own profile"
  on public.admins
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Partners can read own profile" on public.partners;
create policy "Partners can read own profile"
  on public.partners
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Barbers can read own profile" on public.barbers;
create policy "Barbers can read own profile"
  on public.barbers
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Partners can read linked barber profiles" on public.barbers;
create policy "Partners can read linked barber profiles"
  on public.barbers
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.partner_customers pc
      where pc.customer_id = barbers.id
        and pc.partner_id = auth.uid()
    )
  );

drop policy if exists "Partners can read linked customers" on public.partner_customers;
create policy "Partners can read linked customers"
  on public.partner_customers
  for select
  to authenticated
  using (auth.uid() = partner_id);

grant select on table public.admins to authenticated;
grant select on table public.partners to authenticated;
grant select on table public.barbers to authenticated;
grant select on table public.partner_customers to authenticated;
grant all on table public.admins to service_role;
grant all on table public.partners to service_role;
grant all on table public.barbers to service_role;
grant all on table public.partner_customers to service_role;
grant all on table public.credit_transactions to service_role;
