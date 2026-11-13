-- Run once in Supabase SQL Editor. Keeps anonymous chat usage within a per-IP limit.
create table if not exists public.chat_rate_events (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists chat_rate_events_lookup on public.chat_rate_events(ip_hash, created_at desc);
alter table public.chat_rate_events enable row level security;
-- No public RLS policies: only the Edge Function service-role key may access this table.
-- Schedule periodic deletion of rows older than 48 hours using Supabase cron or your retention process.
