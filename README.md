# Mooi Hair Studio & Beauty Bar — Website

Next.js 14 (App Router) + Tailwind CSS + Supabase.
Dibangun oleh Neuro Commerce.

## Jalankan lokal

```bash
npm install
cp .env.example .env.local   # isi kredensial Supabase
npm run dev
```

Buka http://localhost:3000

## Variabel lingkungan

| Variabel | Keterangan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/publishable key Supabase |
| `NEXT_PUBLIC_SITE_URL` | Opsional. Domain resmi; bawaan `https://www.mooihairstudio.com` |

## Supabase

Jalankan `supabase/schema.sql` di SQL Editor Supabase. Isinya membuat tabel
`reservasi` beserta Row Level Security — pengunjung hanya bisa **insert**,
tidak bisa membaca data orang lain.

## CMS (panel admin)

Buka **`/admin`**. Semua teks, foto, video, layanan & harga, cabang, galeri, dan
nomor WhatsApp bisa diubah di sana tanpa menyentuh kode. Setelah **Simpan**,
website diperbarui dalam hitungan detik.

- **Booking** (`/booking`): pelanggan memilih cabang → layanan → stylist → jadwal →
  data diri. **Menu & harga per cabang** (dari price list resmi, Okt 2026), stylist
  beserta cabang & hari kerjanya, jam buka, dan aturan jadwal diatur di
  **Admin → Konten → Booking**. Durasi layanan masih estimasi — mohon dicek.
- **WhatsApp per cabang**: Admin → Konten → Cabang. Kosong = nomor utama.
- **Foto iPhone (HEIC)** bisa diunggah langsung; dikonversi otomatis di browser.
- **Reservasi**: semua permintaan booking, dengan status Baru → Dihubungi →
  **Dikonfirmasi** → Selesai / Batal, plus kolom **Ditugaskan** (stylist yang
  mengerjakan). Booking *Dikonfirmasi* menempati satu stylist: yang ditugaskan,
  pilihan pelanggan, atau — bila "Siapa saja" dan belum ditugaskan — satu stylist
  mana pun. Slot tertutup saat tidak ada stylist yang bebas. Bila daftar stylist
  kosong, kapasitas tidak diketahui sehingga slot tidak pernah ditutup. Tidak ada pengingat otomatis —
  konfirmasi dilakukan manual via WhatsApp.
- **Teks *miring emas***: apit kata dengan bintang, mis. `Tiga cabang, *satu standar*.`
- **Foto** dikompres otomatis di browser sebelum diunggah (maks. sisi 2400 px,
  WebP/JPEG) — foto kamera 5 MB biasanya jadi ±400 KB. Foto asli maks. 30 MB.
- **Video** tidak dikompres otomatis (maks. 50 MB, idealnya < 15 MB). Kecilkan
  dulu, mis. dengan HandBrake atau aplikasi kompres video di ponsel.
- Semua media disimpan di Supabase Storage (bucket `media`).
- Bagian yang belum pernah disimpan memakai isi bawaan di `lib/cms/content.ts`.

### Reset kata sandi admin

Di `/admin/login`, pilih **Lupa password?**, masukkan email admin, lalu buka
tautan email di browser yang sama. Halaman `/admin/reset-password` menerima
sesi recovery Supabase dan menyediakan formulir kata sandi baru beserta konfirmasi.
Ikon mata tersedia di kolom kata sandi login dan reset.

Sebelum digunakan di production, atur **Supabase → Authentication → URL
Configuration**: **Site URL** harus domain website Mooi aktif, bukan localhost.
Tambahkan `https://DOMAIN-MOOI-AKTIF/admin/reset-password` ke **Redirect URLs**
(ganti domain dengan alamat deployment aktif). Tambahkan alamat development
hanya jika diperlukan. Form mengirim redirect ke origin yang sedang dibuka;
origin itu harus diizinkan Supabase. Gunakan email reset baru dari form ini.

Pengiriman email dan perubahan password sungguhan perlu diuji pada deployment
dengan konfigurasi Supabase aktif.

### Menambah admin

1. Supabase → Authentication → Users → **Add user** → isi email & kata sandi,
   centang *Auto Confirm User*.
2. Supabase → SQL Editor:
   `insert into public.admins (email) values ('email@contoh.com');`

Hak akses dijaga oleh Row Level Security di database: akun yang tidak terdaftar
di tabel `admins` tidak bisa mengubah apa pun, walaupun berhasil login.

**Matikan pendaftaran publik**: Supabase → Authentication → Sign In / Providers →
nonaktifkan *Allow new users to sign up*.

## Deploy ke Vercel

1. Push repo ini ke GitHub
2. Vercel → New Project → import repo
3. Tambahkan dua environment variable di atas
4. Deploy
5. Setelah domain siap: Settings → Domains → tambahkan domain Mooi

## Struktur

```
app/              Halaman (Beranda, Tentang, Layanan, Galeri, Lokasi, Kontak)
app/api/reservasi Endpoint penyimpanan form reservasi ke Supabase
components/       Komponen UI per bagian
app/(site)/       Halaman publik
app/admin/        Panel admin (CMS)
lib/cms/          Model konten, isi bawaan, skema form admin
lib/supabase/     Klien Supabase (server & browser)
public/media/     Foto & video bawaan (stok Unsplash/Pexels)
public/logo.png   Logo Mooi (transparan)
```

## Yang masih perlu diisi

Semua bisa diisi lewat `/admin`:

- [ ] Foto asli Mooi untuk galeri & cabang (sekarang foto stok)
- [x] Alamat lengkap, jam operasional & WhatsApp tiap cabang
- [ ] Tautan Google Maps resmi tiap cabang (sekarang tautan pencarian alamat)
- [ ] Daftar harga layanan yang sebenarnya
- [ ] Nilai "Produk pilihan" di halaman Tentang
- [ ] Testimoni asli dari ulasan Google
- [ ] Menu booking: harga & durasi asli, daftar stylist, jam buka tiap cabang
- [ ] Kebijakan booking yang benar-benar berlaku (DP, reschedule, pembatalan)
- [x] Nomor WhatsApp per cabang (Admin → Cabang)

## Halaman & bahasa

- Bahasa Indonesia di alamat utama (`/`, `/layanan`, `/stylist`, `/cabang`, `/galeri`, `/tentang`, `/booking`),
  bahasa Inggris di `/en/...`. Teks Inggris diatur di Admin → **Bahasa Inggris (EN)**.
- Alamat lama diarahkan permanen: `/v2/*` → `/*`, `/lokasi` dan `/kontak` → `/cabang`.
- Alamat `*.vercel.app` tidak diindeks Google; domain resmi diindeks.
