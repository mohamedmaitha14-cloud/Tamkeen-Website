-- Tamkeen purchase history: run once in Supabase SQL Editor.
-- This table is READ ONLY to customers. Never insert purchases from browser JS.
-- A future verified payment webhook using the service role should write paid orders.
create table if not exists public.customer_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  course_title text not null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'AED',
  payment_status text not null default 'paid' check (payment_status in ('paid','refunded','partially_refunded')),
  provider_payment_id text unique,
  purchased_at timestamptz not null default now()
);
create index if not exists customer_purchases_user_date_idx on public.customer_purchases (user_id, purchased_at desc);
alter table public.customer_purchases enable row level security;
revoke all on public.customer_purchases from anon, authenticated;
grant select on public.customer_purchases to authenticated;
drop policy if exists "Customers read only own purchases" on public.customer_purchases;
create policy "Customers read only own purchases" on public.customer_purchases
  for select to authenticated using ((select auth.uid()) = user_id);
-- IMPORTANT: no insert/update/delete policies for customers.
-- When adding a payment provider, verify webhook signatures server-side, map the
-- payment to the authenticated user and purchased courses, then insert with a
-- server-side service-role credential. Never expose service-role keys in HTML/JS.
