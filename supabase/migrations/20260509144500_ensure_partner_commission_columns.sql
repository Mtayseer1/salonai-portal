alter table public.partner_commissions
  add column if not exists partner_id uuid references public.partners(id) on delete cascade;

alter table public.partner_commissions
  add column if not exists customer_id uuid references public.barbers(id) on delete cascade;

alter table public.partner_commissions
  add column if not exists credit_transaction_id uuid references public.credit_transactions(id) on delete set null;

alter table public.partner_commissions
  add column if not exists package_id text;

alter table public.partner_commissions
  add column if not exists package_name text;

alter table public.partner_commissions
  add column if not exists credits integer not null default 0;

alter table public.partner_commissions
  add column if not exists package_total_amount numeric(12, 2) not null default 0;

alter table public.partner_commissions
  add column if not exists vat_rate_percent numeric(5, 2) not null default 16;

alter table public.partner_commissions
  add column if not exists vat_deducted_amount numeric(12, 2) not null default 0;

alter table public.partner_commissions
  add column if not exists commission_base_amount numeric(12, 2) not null default 0;

alter table public.partner_commissions
  add column if not exists commission_rate_percent numeric(5, 2) not null default 20;

alter table public.partner_commissions
  add column if not exists commission_amount numeric(12, 2) not null default 0;

alter table public.partner_commissions
  add column if not exists status text not null default 'pending';

alter table public.partner_commissions
  add column if not exists notes text;

alter table public.partner_commissions
  add column if not exists created_at timestamptz not null default now();

alter table public.partner_commissions
  add column if not exists paid_at timestamptz;

alter table public.partner_commissions enable row level security;

drop policy if exists "Partners can read own commissions" on public.partner_commissions;

create policy "Partners can read own commissions"
  on public.partner_commissions
  for select
  to authenticated
  using (partner_id = auth.uid());

grant select on table public.partner_commissions to authenticated;
grant all on table public.partner_commissions to service_role;
