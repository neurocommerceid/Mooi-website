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
| `NEXT_PUBLIC_WHATSAPP` | Nomor WhatsApp format internasional tanpa `+`, mis. `6281288451500` |

## Supabase

Jalankan `supabase/schema.sql` di SQL Editor Supabase. Isinya membuat tabel
`reservasi` beserta Row Level Security — pengunjung hanya bisa **insert**,
tidak bisa membaca data orang lain.

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
lib/data.ts       Data layanan, cabang, dan navigasi  ← edit di sini
lib/supabase.ts   Klien Supabase
public/logo.png   Logo Mooi (transparan)
```

## Yang masih perlu diisi

- [ ] Foto interior & hasil kerja (hero, galeri, cabang) — ganti blok gradien
- [ ] Alamat lengkap & jam operasional tiap cabang (`lib/data.ts`)
- [ ] Tautan Google Maps tiap cabang (`lib/data.ts`)
- [ ] Daftar harga layanan yang sebenarnya (`lib/data.ts`)
- [ ] Teks halaman Tentang Kami (`app/tentang/page.tsx`)
- [ ] Nomor WhatsApp resmi (env `NEXT_PUBLIC_WHATSAPP`)
