-- Tabel penyimpanan permintaan reservasi dari formulir website
create table if not exists reservasi (
  id          bigserial primary key,
  nama        text not null,
  whatsapp    text not null,
  cabang      text not null,
  layanan     text,
  tanggal     date,
  catatan     text,
  created_at  timestamptz not null default now()
);

alter table reservasi enable row level security;

-- Pengunjung website hanya boleh menambah data, tidak boleh membaca
create policy "anon dapat mengirim reservasi"
  on reservasi for insert
  to anon
  with check (true);

-- Hak akses eksplisit untuk role anon (dibutuhkan agar insert lewat API berjalan)
grant insert on reservasi to anon;
grant usage on sequence reservasi_id_seq to anon;

-- =====================================================================
-- CMS: admin, konten website, media, dan akses admin ke reservasi
-- =====================================================================

create table if not exists public.admins (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where email = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "admin melihat dirinya" on public.admins
  for select to authenticated using (email = lower(coalesce(auth.jwt() ->> 'email', '')));
grant select on public.admins to authenticated;

-- Tambah admin: insert into public.admins (email) values ('nama@domain.com');

create table if not exists public.site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.site_content enable row level security;
create policy "konten dapat dibaca publik" on public.site_content for select to anon, authenticated using (true);
create policy "admin menambah konten" on public.site_content for insert to authenticated with check (public.is_admin());
create policy "admin mengubah konten" on public.site_content for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin menghapus konten" on public.site_content for delete to authenticated using (public.is_admin());
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

alter table public.reservasi add column if not exists status text not null default 'baru'
  check (status in ('baru', 'dihubungi', 'selesai', 'batal'));
create policy "admin membaca reservasi" on public.reservasi for select to authenticated using (public.is_admin());
create policy "admin mengubah reservasi" on public.reservasi for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin menghapus reservasi" on public.reservasi for delete to authenticated using (public.is_admin());
grant select, update, delete on public.reservasi to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm'])
on conflict (id) do nothing;
create policy "admin upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admin ubah media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admin hapus media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- =====================================================================
-- Booking: kolom detail, status "dikonfirmasi", dan slot terisi
-- =====================================================================
alter table public.reservasi
  add column if not exists stylist text,
  add column if not exists jam text check (jam is null or jam ~ '^[0-2][0-9]:[0-5][0-9]$'),
  add column if not exists layanan_list jsonb,
  add column if not exists durasi integer check (durasi is null or durasi between 0 and 1440),
  add column if not exists estimasi integer check (estimasi is null or estimasi >= 0);

alter table public.reservasi drop constraint if exists reservasi_status_check;
alter table public.reservasi add constraint reservasi_status_check
  check (status in ('baru', 'dihubungi', 'dikonfirmasi', 'selesai', 'batal'));

-- Hanya stylist, jam, durasi — tanpa data pelanggan.
create or replace function public.taken_slots(p_cabang text, p_tanggal date)
returns table (stylist text, jam text, durasi integer)
language sql stable security definer set search_path = '' as $$
  select r.stylist, r.jam, coalesce(r.durasi, 60) from public.reservasi r
  where r.cabang = p_cabang and r.tanggal = p_tanggal and r.status = 'dikonfirmasi'
    and r.jam is not null and r.stylist is not null;
$$;
revoke all on function public.taken_slots(text, date) from public;
grant execute on function public.taken_slots(text, date) to anon, authenticated;
