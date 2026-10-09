-- SUDAH DITERAPKAN (9 Okt 2026). Disimpan sebagai catatan.
alter table public.admins
  add column if not exists name text,
  add column if not exists role text not null default 'staff',
  add column if not exists permissions text[] not null default '{}',
  add column if not exists branches text[] not null default '{}',
  add column if not exists created_by text;
alter table public.admins drop constraint if exists admins_role_check;
alter table public.admins add constraint admins_role_check check (role in ('super', 'staff'));
alter table public.admins drop constraint if exists admins_permissions_check;
alter table public.admins add constraint admins_permissions_check
  check (permissions <@ array['konten','cabang','harga','stylist','booking','reservasi','hapus_reservasi']::text[]);
update public.admins set role = 'super' where email in ('admin.mooihairstudio@gmail.com', 'neurocommerceid@gmail.com');

create or replace function public.jwt_email() returns text language sql stable set search_path = '' as $$
  select lower(coalesce((select auth.jwt()) ->> 'email', '')); $$;
create or replace function public.is_super() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where email = public.jwt_email() and role = 'super'); $$;
create or replace function public.has_perm(p text) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where email = public.jwt_email() and (role = 'super' or p = any(permissions))); $$;
create or replace function public.can_reservasi(c text) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.email = public.jwt_email()
    and (a.role = 'super' or ('reservasi' = any(a.permissions) and (cardinality(a.branches) = 0 or c = any(a.branches))))); $$;
create or replace function public.current_admin() returns jsonb language sql stable security definer set search_path = '' as $$
  select to_jsonb(a) - 'created_at' from public.admins a where a.email = public.jwt_email(); $$;
create or replace function public.content_perm(k text) returns text language sql immutable set search_path = '' as $$
  select case when k in ('home','en','hero','intro','about','testimonial','settings') then 'konten'
    when k = 'branches' then 'cabang' when k = 'booking' then 'booking*' else 'super' end; $$;
create or replace function public.can_write_content(k text) returns boolean language sql stable security definer set search_path = '' as $$
  select public.is_super() or case public.content_perm(k) when 'super' then false
    when 'booking*' then public.has_perm('harga') or public.has_perm('stylist') or public.has_perm('booking')
    else public.has_perm(public.content_perm(k)) end; $$;
revoke all on function public.is_super(), public.has_perm(text), public.can_reservasi(text), public.current_admin(), public.can_write_content(text) from public, anon;
grant execute on function public.is_super(), public.has_perm(text), public.can_reservasi(text), public.current_admin(), public.can_write_content(text) to authenticated;
