create table if not exists public.gemini_generation_logs (
  id uuid primary key default gen_random_uuid(),
  request_id text,
  user_id uuid references auth.users(id) on delete set null,
  edge_function text not null,
  gender text,
  mode text,
  customer_name text,
  customer_phone text,
  src_file_url text,
  selected_options jsonb not null default '{}'::jsonb,
  prompt text not null,
  prompt_length integer generated always as (char_length(prompt)) stored,
  gemini_model text not null,
  status text not null default 'started' check (status in ('started', 'success', 'error')),
  generated_image_base64 text,
  generated_image_mime_type text,
  error_message text,
  error_details jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists gemini_generation_logs_request_id_idx
  on public.gemini_generation_logs (request_id);

create index if not exists gemini_generation_logs_user_created_idx
  on public.gemini_generation_logs (user_id, created_at desc);

create index if not exists gemini_generation_logs_status_created_idx
  on public.gemini_generation_logs (status, created_at desc);

alter table public.gemini_generation_logs enable row level security;

drop policy if exists "Service role can manage gemini generation logs"
  on public.gemini_generation_logs;

create policy "Service role can manage gemini generation logs"
  on public.gemini_generation_logs
  for all
  to service_role
  using (true)
  with check (true);

grant all on table public.gemini_generation_logs to service_role;
