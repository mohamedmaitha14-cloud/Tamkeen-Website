-- Run this in Supabase SQL Editor once.
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  help_type text not null check (char_length(help_type) between 1 and 120),
  program_topic text not null default '' check (char_length(program_topic) <= 300),
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);
alter table public.contact_inquiries enable row level security;
-- Visitors may submit, but cannot read, update, or delete submissions.
revoke all on public.contact_inquiries from anon;
grant insert on public.contact_inquiries to anon;
drop policy if exists "Allow public inquiry submissions" on public.contact_inquiries;
create policy "Allow public inquiry submissions" on public.contact_inquiries
for insert to anon with check (true);
-- Consider CAPTCHA, rate limiting or an Edge Function before production use to reduce spam.
