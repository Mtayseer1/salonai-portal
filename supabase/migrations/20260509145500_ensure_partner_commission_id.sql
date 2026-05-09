alter table public.partner_commissions
  add column if not exists id uuid default gen_random_uuid();
