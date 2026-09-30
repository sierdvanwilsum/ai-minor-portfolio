-- Uitvoeren in de SQL Editor van je eigen Supabase-project.
begin;

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
drop policy if exists "Admin sees own membership" on public.portfolio_admins;
create policy "Admin sees own membership" on public.portfolio_admins
  for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.portfolio_content (
  id text primary key check (id = 'main'),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  version integer not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.portfolio_content enable row level security;
revoke all on public.portfolio_content from anon, authenticated;
grant select on public.portfolio_content to anon;
grant select, insert, update on public.portfolio_content to authenticated;

drop policy if exists "Public portfolio read" on public.portfolio_content;
create policy "Public portfolio read" on public.portfolio_content for select to anon, authenticated using (true);
drop policy if exists "Admin portfolio insert" on public.portfolio_content;
create policy "Admin portfolio insert" on public.portfolio_content for insert to authenticated
  with check (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));
drop policy if exists "Admin portfolio update" on public.portfolio_content;
create policy "Admin portfolio update" on public.portfolio_content for update to authenticated
  using (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())))
  with check (exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));

create or replace function public.bump_portfolio_version() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.version := old.version + 1;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.bump_portfolio_version() from public, anon, authenticated;
drop trigger if exists portfolio_version on public.portfolio_content;
create trigger portfolio_version before update on public.portfolio_content
  for each row execute function public.bump_portfolio_version();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 10485760,
  array['image/jpeg','image/png','image/webp','image/gif','application/pdf','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

drop policy if exists "Portfolio media admin read" on storage.objects;
create policy "Portfolio media admin read" on storage.objects for select to authenticated
  using (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));
drop policy if exists "Portfolio media admin upload" on storage.objects;
create policy "Portfolio media admin upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-media' and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid())));

commit;
