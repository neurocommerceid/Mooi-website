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
