-- TAMKEEN CUSTOMER CART: Run in Supabase SQL Editor once.
-- Requires Supabase Authentication (email/password enabled).
create table if not exists public.customer_cart_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null check (char_length(course_id) between 1 and 100),
  quantity integer not null default 1 check (quantity between 1 and 99),
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

alter table public.customer_cart_items enable row level security;
grant select, insert, update, delete on public.customer_cart_items to authenticated;
revoke all on public.customer_cart_items from anon;

drop policy if exists "Customer can read own cart" on public.customer_cart_items;
create policy "Customer can read own cart" on public.customer_cart_items
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Customer can insert own cart" on public.customer_cart_items;
create policy "Customer can insert own cart" on public.customer_cart_items
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Customer can update own cart" on public.customer_cart_items;
create policy "Customer can update own cart" on public.customer_cart_items
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Customer can delete own cart" on public.customer_cart_items;
create policy "Customer can delete own cart" on public.customer_cart_items
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Atomic replace ensures removed programs disappear from the customer's cart.
create or replace function public.replace_customer_cart(new_items jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(new_items) <> 'array' or jsonb_array_length(new_items) > 100 then
    raise exception 'Invalid cart payload';
  end if;
  delete from public.customer_cart_items where user_id = uid;
  insert into public.customer_cart_items(user_id, course_id, quantity)
  select uid, item->>'course_id', (item->>'quantity')::integer
  from jsonb_array_elements(new_items) as item;
end;
$$;
revoke all on function public.replace_customer_cart(jsonb) from public, anon;
grant execute on function public.replace_customer_cart(jsonb) to authenticated;
