-- =====================================================================
-- Hak akses admin (bagian 2 & 3). Aman dijalankan lebih dari sekali.
-- Jalankan di Supabase → SQL Editor → Run.
-- Bagian 1 (kolom role/permissions/branches + fungsi is_super, has_perm,
-- can_reservasi, current_admin, can_write_content) sudah diterapkan.
-- =====================================================================

-- Bagian "booking" berisi menu+harga, stylist, dan pengaturan dalam satu baris:
-- periksa bagian mana yang berubah dan tolak bila di luar hak akses.
create or replace function public.booking_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  o jsonb := case when tg_op = 'UPDATE' then old.data else '{}'::jsonb end;
  n jsonb := new.data;
begin
  if new.key <> 'booking' or coalesce(current_setting('role', true), '') <> 'authenticated' or public.is_super() then
    return new;
  end if;
  if ((o->'menus') is distinct from (n->'menus') or (o->'categories') is distinct from (n->'categories')) and not public.has_perm('harga') then
    raise exception 'Akses ditolak: Anda tidak punya hak mengubah menu & harga.' using errcode = '42501';
  end if;
  if (o->'stylists') is distinct from (n->'stylists') and not public.has_perm('stylist') then
    raise exception 'Akses ditolak: Anda tidak punya hak mengubah stylist.' using errcode = '42501';
  end if;
  if (o - 'menus' - 'categories' - 'stylists') is distinct from (n - 'menus' - 'categories' - 'stylists') and not public.has_perm('booking') then
    raise exception 'Akses ditolak: Anda tidak punya hak mengubah pengaturan booking.' using errcode = '42501';
  end if;
  return new;
end $$;
revoke all on function public.booking_guard() from public, anon, authenticated;
drop trigger if exists booking_guard on public.site_content;
create trigger booking_guard before insert or update on public.site_content
  for each row execute function public.booking_guard();

-- Konten: per bagian sesuai hak akses; menghapus hanya super admin.
drop policy if exists "admin menambah konten" on public.site_content;
drop policy if exists "admin mengubah konten" on public.site_content;
drop policy if exists "admin menghapus konten" on public.site_content;
drop policy if exists "super menghapus konten" on public.site_content;
create policy "admin menambah konten" on public.site_content for insert to authenticated with check (public.can_write_content(key));
create policy "admin mengubah konten" on public.site_content for update to authenticated using (public.can_write_content(key)) with check (public.can_write_content(key));
create policy "super menghapus konten" on public.site_content for delete to authenticated using (public.is_super());

-- Reservasi: hanya cabang yang diizinkan; menghapus butuh hak "hapus_reservasi".
drop policy if exists "admin membaca reservasi" on public.reservasi;
drop policy if exists "admin mengubah reservasi" on public.reservasi;
drop policy if exists "admin menghapus reservasi" on public.reservasi;
create policy "admin membaca reservasi" on public.reservasi for select to authenticated using (public.can_reservasi(cabang));
create policy "admin mengubah reservasi" on public.reservasi for update to authenticated using (public.can_reservasi(cabang)) with check (public.can_reservasi(cabang));
create policy "admin menghapus reservasi" on public.reservasi for delete to authenticated using (public.can_reservasi(cabang) and public.has_perm('hapus_reservasi'));

-- Tabel admin: tiap admin melihat dirinya; super admin melihat & mengelola semua.
drop policy if exists "admin melihat dirinya" on public.admins;
drop policy if exists "super mengubah admin" on public.admins;
drop policy if exists "super menghapus admin" on public.admins;
drop policy if exists "super menambah admin" on public.admins;
create policy "admin melihat dirinya" on public.admins for select to authenticated using (email = public.jwt_email() or public.is_super());
create policy "super mengubah admin" on public.admins for update to authenticated using (public.is_super()) with check (public.is_super());
create policy "super menghapus admin" on public.admins for delete to authenticated using (public.is_super());
create policy "super menambah admin" on public.admins for insert to authenticated with check (public.is_super());
grant insert, update, delete on public.admins to authenticated;

-- Selalu ada minimal satu super admin.
create or replace function public.keep_one_super() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (tg_op = 'DELETE' and old.role = 'super') or (tg_op = 'UPDATE' and old.role = 'super' and new.role <> 'super') then
    if (select count(*) from public.admins where role = 'super' and email <> old.email) = 0 then
      raise exception 'Harus ada minimal satu super admin.' using errcode = '42501';
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end $$;
revoke all on function public.keep_one_super() from public, anon, authenticated;
drop trigger if exists keep_one_super on public.admins;
create trigger keep_one_super before update or delete on public.admins
  for each row execute function public.keep_one_super();

-- Email admin selalu huruf kecil.
create or replace function public.admins_lower_email() returns trigger
language plpgsql set search_path = '' as $$
begin new.email := lower(trim(new.email)); return new; end $$;
drop trigger if exists admins_lower_email on public.admins;
create trigger admins_lower_email before insert or update on public.admins
  for each row execute function public.admins_lower_email();

-- Foto (storage): yang boleh mengedit konten bergambar; menghapus hanya super admin.
drop policy if exists "admin upload media" on storage.objects;
drop policy if exists "admin ubah media" on storage.objects;
drop policy if exists "admin hapus media" on storage.objects;
drop policy if exists "super hapus media" on storage.objects;
create policy "admin upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (public.has_perm('konten') or public.has_perm('cabang') or public.has_perm('stylist')));
create policy "admin ubah media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (public.has_perm('konten') or public.has_perm('cabang') or public.has_perm('stylist')));
create policy "super hapus media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_super());

select 'Selesai: hak akses admin aktif.' as hasil;
