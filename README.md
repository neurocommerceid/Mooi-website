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
| `NEXT_PUBLIC_WHATSAPP` | Nomor WhatsApp format internasional tanpa `+`, mis. `62817773343` |

## Supabase

Jalankan `supabase/schema.sql` di SQL Editor Supabase. Isinya membuat tabel
`reservasi` beserta Row Level Security — pengunjung hanya bisa **insert**,
tidak bisa membaca data orang lain.

## CMS (panel admin)

Buka **`/admin`**. Semua teks, foto, video, layanan & harga, cabang, galeri, dan
nomor WhatsApp bisa diubah di sana tanpa menyentuh kode. Setelah **Simpan**,
website diperbarui dalam hitungan detik.

- **Booking** (`/booking`): pelanggan memilih cabang → layanan → stylist → jadwal →
  data diri. Menu layanan (durasi & harga), stylist, jam buka cabang, dan aturan
  jadwal diatur di **Admin → Konten → Booking**. Harga & durasi bawaan hanyalah contoh.
- **Reservasi**: semua permintaan booking, dengan status Baru → Dihubungi →
  **Dikonfirmasi** → Selesai / Batal. Jam yang *Dikonfirmasi* otomatis tertutup
  untuk stylist tersebut di halaman booking. Tidak ada pengingat otomatis —
  konfirmasi dilakukan manual via WhatsApp.
- **Teks *miring emas***: apit kata dengan bintang, mis. `Tiga cabang, *satu standar*.`
- **Foto** dikompres otomatis di browser sebelum diunggah (maks. sisi 2400 px,
  WebP/JPEG) — foto kamera 5 MB biasanya jadi ±400 KB. Foto asli maks. 30 MB.
- **Video** tidak dikompres otomatis (maks. 50 MB, idealnya < 15 MB). Kecilkan
  dulu, mis. dengan HandBrake atau aplikasi kompres video di ponsel.
- Semua media disimpan di Supabase Storage (bucket `media`).
- Bagian yang belum pernah disimpan memakai isi bawaan di `lib/cms/content.ts`.

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
3. Tambahkan tiga environment variable di atas
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
- [ ] Alamat lengkap & jam operasional tiap cabang
- [ ] Tautan Google Maps tiap cabang
- [ ] Daftar harga layanan yang sebenarnya
- [ ] Nilai "Produk pilihan" di halaman Tentang
- [ ] Testimoni asli dari ulasan Google
- [ ] Menu booking: harga & durasi asli, daftar stylist, jam buka tiap cabang
- [ ] Kebijakan booking yang benar-benar berlaku (DP, reschedule, pembatalan)
- [x] Nomor WhatsApp resmi (env `NEXT_PUBLIC_WHATSAPP`)
