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

-- Stylist yang ditugaskan admin (pilihan pelanggan tetap di kolom stylist).
alter table public.reservasi add column if not exists ditugaskan text;

create or replace function public.taken_slots(p_cabang text, p_tanggal date)
returns table (stylist text, jam text, durasi integer)
language sql stable security definer set search_path = '' as $$
  select coalesce(nullif(r.ditugaskan, ''), r.stylist, 'Siapa saja'), r.jam, coalesce(r.durasi, 60)
  from public.reservasi r
  where r.cabang = p_cabang and r.tanggal = p_tanggal and r.status = 'dikonfirmasi' and r.jam is not null;
$$;

-- =====================================================================
-- Keamanan booking: kunci insert publik + batas spam
-- =====================================================================
-- Kunci publik ada di browser, jadi siapa pun bisa insert langsung ke REST API
-- tanpa lewat /api/booking. Tanpa ini, orang bisa membuat booking berstatus
-- "dikonfirmasi" dan memblokir slot semua stylist.
drop policy if exists "anon dapat mengirim reservasi" on public.reservasi;
create policy "anon dapat mengirim reservasi" on public.reservasi
  for insert to anon
  with check (status = 'baru' and ditugaskan is null);

create or replace function public.reservasi_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  today date := (now() at time zone 'Asia/Jakarta')::date;
begin
  -- Fungsi ini security definer, jadi current_user selalu pemiliknya;
  -- role pemanggil yang asli ada di setting 'role'.
  if coalesce(current_setting('role', true), '') not in ('anon', 'authenticated') or public.is_admin() then
    return new; -- admin & service role bebas
  end if;
  new.status := 'baru';
  new.ditugaskan := null;
  new.created_at := now();
  if length(new.nama) > 100 or length(new.whatsapp) > 20 or length(new.cabang) > 100
     or length(coalesce(new.catatan, '')) > 1000 or length(coalesce(new.layanan, '')) > 2000
     or length(coalesce(new.stylist, '')) > 100
     or pg_column_size(new.layanan_list) > 8000 then
    raise exception 'invalid_booking' using errcode = 'P0001';
  end if;
  if new.tanggal is null or new.tanggal < today or new.tanggal > today + 60 then
    raise exception 'invalid_booking' using errcode = 'P0001';
  end if;
  -- Maks 3 permintaan per nomor WhatsApp per 24 jam.
  if (select count(*) from public.reservasi r
      where r.whatsapp = new.whatsapp and r.created_at > now() - interval '24 hours') >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  -- Rem darurat: maks 30 permintaan baru per 10 menit untuk seluruh website.
  if (select count(*) from public.reservasi r
      where r.created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke all on function public.reservasi_guard() from public, anon, authenticated;

drop trigger if exists reservasi_guard on public.reservasi;
create trigger reservasi_guard before insert on public.reservasi
  for each row execute function public.reservasi_guard();

create index if not exists reservasi_whatsapp_created_idx on public.reservasi (whatsapp, created_at desc);
create index if not exists reservasi_created_idx on public.reservasi (created_at desc);

-- Performa RLS: auth.jwt() dievaluasi sekali per query, bukan per baris.
drop policy if exists "admin melihat dirinya" on public.admins;
create policy "admin melihat dirinya" on public.admins
  for select to authenticated using (email = lower(coalesce((select auth.jwt()) ->> 'email', '')));

-- Fungsi event trigger bawaan; tidak perlu bisa dipanggil lewat REST.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
