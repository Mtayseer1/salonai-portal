alter table public.partner_customers
  add column if not exists created_at timestamptz not null default now();

alter table public.credit_transactions
  add column if not exists package_id text;

alter table public.credit_transactions
  add column if not exists package_name text;

alter table public.credit_transactions
  add column if not exists package_price_before_vat numeric(12, 2);

alter table public.credit_transactions
  add column if not exists package_vat_amount numeric(12, 2);

alter table public.credit_transactions
  add column if not exists package_total_amount numeric(12, 2);

alter table public.credit_transactions
  add column if not exists partner_id uuid references public.partners(id) on delete set null;

alter table public.credit_transactions
  add column if not exists commission_amount numeric(12, 2);

alter table public.credit_transactions
  add column if not exists created_by uuid references auth.users(id) on delete set null;

create table if not exists public.partner_commissions (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  customer_id uuid not null references public.barbers(id) on delete cascade,
  credit_transaction_id uuid references public.credit_transactions(id) on delete set null,
  package_id text,
  package_name text not null,
  credits integer not null,
  package_total_amount numeric(12, 2) not null default 0,
  vat_rate_percent numeric(5, 2) not null default 16,
  vat_deducted_amount numeric(12, 2) not null default 0,
  commission_base_amount numeric(12, 2) not null default 0,
  commission_rate_percent numeric(5, 2) not null default 20,
  commission_amount numeric(12, 2) not null default 0,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.partner_commissions enable row level security;

drop policy if exists "Partners can read own commissions" on public.partner_commissions;

create policy "Partners can read own commissions"
  on public.partner_commissions
  for select
  to authenticated
  using (partner_id = auth.uid());

grant select on table public.partner_commissions to authenticated;
grant all on table public.partner_commissions to service_role;

create or replace function public.admin_add_package_credits(
  p_customer_id uuid,
  p_package_id text,
  p_admin_id uuid,
  p_notes text default null
)
returns table (
  remaining_credits integer,
  total_credits integer,
  credits_added integer,
  package_name text,
  package_total_amount numeric,
  partner_id uuid,
  commission_amount numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_package record;
  v_customer record;
  v_partner_id uuid;
  v_transaction_id uuid;
  v_total_amount numeric(12, 2);
  v_vat_rate numeric(5, 2) := 16;
  v_vat_amount numeric(12, 2);
  v_commission_base numeric(12, 2);
  v_commission_rate numeric(5, 2) := 20;
  v_commission_amount numeric(12, 2);
  v_remaining_credits integer;
  v_total_credits integer;
begin
  select
    id::text as id,
    name,
    images_count::integer as images_count,
    price_before_vat::numeric as price_before_vat,
    coalesce(vat_percent, 16)::numeric as vat_percent
  into v_package
  from public.packages
  where id::text = p_package_id
    and is_active = true
  limit 1;

  if not found then
    raise exception 'Invalid or inactive package.';
  end if;

  select
    id,
    remaining_credits::integer as remaining_credits,
    total_credits::integer as total_credits
  into v_customer
  from public.barbers
  where id = p_customer_id
  for update;

  if not found then
    raise exception 'Customer not found.';
  end if;

  v_total_amount := round(
    (coalesce(v_package.price_before_vat, 0) * (1 + coalesce(v_package.vat_percent, 16) / 100))::numeric,
    2
  );
  v_commission_base := round((v_total_amount / (1 + v_vat_rate / 100))::numeric, 2);
  v_vat_amount := round((v_total_amount - v_commission_base)::numeric, 2);
  v_commission_amount := round((v_commission_base * v_commission_rate / 100)::numeric, 2);

  v_remaining_credits := coalesce(v_customer.remaining_credits, 0) + v_package.images_count;
  v_total_credits := coalesce(v_customer.total_credits, 0) + v_package.images_count;

  update public.barbers
  set
    remaining_credits = v_remaining_credits,
    total_credits = v_total_credits
  where id = p_customer_id;

  select pc.partner_id
  into v_partner_id
  from public.partner_customers pc
  where pc.customer_id = p_customer_id
  order by pc.created_at asc
  limit 1;

  insert into public.credit_transactions (
    customer_id,
    change_amount,
    transaction_type,
    notes,
    package_id,
    package_name,
    package_price_before_vat,
    package_vat_amount,
    package_total_amount,
    partner_id,
    commission_amount,
    created_by
  )
  values (
    p_customer_id,
    v_package.images_count,
    'admin_package_add',
    coalesce(p_notes, 'Admin added ' || v_package.name || ' package'),
    v_package.id,
    v_package.name,
    v_commission_base,
    v_vat_amount,
    v_total_amount,
    v_partner_id,
    case when v_partner_id is null then null else v_commission_amount end,
    p_admin_id
  )
  returning id into v_transaction_id;

  if v_partner_id is not null then
    insert into public.partner_commissions (
      partner_id,
      customer_id,
      credit_transaction_id,
      package_id,
      package_name,
      credits,
      package_total_amount,
      vat_rate_percent,
      vat_deducted_amount,
      commission_base_amount,
      commission_rate_percent,
      commission_amount,
      status,
      notes
    )
    values (
      v_partner_id,
      p_customer_id,
      v_transaction_id,
      v_package.id,
      v_package.name,
      v_package.images_count,
      v_total_amount,
      v_vat_rate,
      v_vat_amount,
      v_commission_base,
      v_commission_rate,
      v_commission_amount,
      'pending',
      '20% commission after 16% VAT deduction for ' || v_package.name
    );
  end if;

  return query select
    v_remaining_credits,
    v_total_credits,
    v_package.images_count,
    v_package.name::text,
    v_total_amount,
    v_partner_id,
    case when v_partner_id is null then 0::numeric else v_commission_amount end;
end;
$$;

revoke all on function public.admin_add_package_credits(uuid, text, uuid, text) from public;
grant execute on function public.admin_add_package_credits(uuid, text, uuid, text) to service_role;
