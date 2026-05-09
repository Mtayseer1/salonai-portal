create table if not exists public.partner_payouts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners(id) on delete cascade,
  amount numeric(12, 2) not null default 0,
  commission_count integer not null default 0,
  notes text,
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

alter table public.partner_payouts
  add column if not exists id uuid default gen_random_uuid();

alter table public.partner_payouts
  add column if not exists partner_id uuid references public.partners(id) on delete cascade;

alter table public.partner_payouts
  add column if not exists amount numeric(12, 2) not null default 0;

alter table public.partner_payouts
  add column if not exists commission_count integer not null default 0;

alter table public.partner_payouts
  add column if not exists notes text;

alter table public.partner_payouts
  add column if not exists paid_at timestamptz not null default now();

alter table public.partner_payouts
  add column if not exists created_at timestamptz not null default now();

alter table public.partner_payouts
  add column if not exists created_by uuid references auth.users(id) on delete set null;

alter table public.partner_payouts enable row level security;

drop policy if exists "Partners can read own payouts" on public.partner_payouts;

create policy "Partners can read own payouts"
  on public.partner_payouts
  for select
  to authenticated
  using (partner_id = auth.uid());

grant select on table public.partner_payouts to authenticated;
grant all on table public.partner_payouts to service_role;

create or replace function public.admin_pay_partner_commissions(
  p_partner_id uuid,
  p_admin_id uuid,
  p_notes text default null
)
returns table (
  payout_id uuid,
  paid_amount numeric,
  paid_count integer,
  paid_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payout_id uuid;
  v_paid_amount numeric(12, 2);
  v_paid_count integer;
  v_paid_at timestamptz := now();
begin
  if not exists (select 1 from public.partners p where p.id = p_partner_id) then
    raise exception 'Partner not found.';
  end if;

  with due as (
    select
      pc.id,
      coalesce(pc.commission_amount, 0)::numeric as commission_amount
    from public.partner_commissions pc
    where pc.partner_id = p_partner_id
      and coalesce(pc.status, 'pending') <> 'paid'
      and coalesce(pc.commission_amount, 0) > 0
    for update
  ),
  updated as (
    update public.partner_commissions pc
    set
      status = 'paid',
      paid_at = v_paid_at
    from due
    where pc.id = due.id
    returning due.commission_amount
  )
  select
    coalesce(round(sum(updated.commission_amount)::numeric, 2), 0),
    count(*)::integer
  into v_paid_amount, v_paid_count
  from updated;

  if coalesce(v_paid_count, 0) = 0 or coalesce(v_paid_amount, 0) <= 0 then
    raise exception 'No unpaid commission found for this partner.';
  end if;

  insert into public.partner_payouts (
    partner_id,
    amount,
    commission_count,
    notes,
    paid_at,
    created_by
  )
  values (
    p_partner_id,
    v_paid_amount,
    v_paid_count,
    coalesce(p_notes, 'Admin paid all pending partner commissions'),
    v_paid_at,
    p_admin_id
  )
  returning id into v_payout_id;

  return query select
    v_payout_id,
    v_paid_amount,
    v_paid_count,
    v_paid_at;
end;
$$;

revoke all on function public.admin_pay_partner_commissions(uuid, uuid, text) from public;
grant execute on function public.admin_pay_partner_commissions(uuid, uuid, text) to service_role;
