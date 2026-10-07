import type { SectionKey } from './content';

export type Field =
  | { key: string; label: string; type: 'text' | 'textarea' | 'image' | 'video' | 'strings' | 'number' | 'boolean' | 'branches' | 'days'; help?: string }
  | { key: string; label: string; type: 'list'; help?: string; item: string; fields: Field[] }
  | { key: string; label: string; type: 'group'; help?: string; fields: Field[] };

/** legacy: hanya dipakai desain lama — dikelompokkan terpisah di dasbor admin. */
export type Section = { title: string; desc: string; fields: Field[]; legacy?: boolean };

const ACCENT = 'Apit kata dengan *bintang* agar tampil miring berwarna rose-gold.';
const t = (key: string, label: string, help?: string): Field => ({ key, label, type: 'text', help });
const ta = (key: string, label: string, help?: string): Field => ({ key, label, type: 'textarea', help });
const im = (key: string, label: string, help?: string): Field => ({ key, label, type: 'image', help });
const num = (key: string, label: string, help?: string): Field => ({ key, label, type: 'number', help });
const head = [t('kicker', 'Label kecil'), t('title', 'Judul', ACCENT), ta('sub', 'Subjudul')];
const page = (key: string, label: string): Field => ({
  key, label, type: 'group', fields: [t('kicker', 'Label kecil'), t('title', 'Judul'), ta('sub', 'Subjudul')],
});

const head2 = (key: string, label: string, help?: string): Field => ({
  key, label, type: 'group', help, fields: [t('title', 'Judul'), ta('sub', 'Subjudul', 'Kosongkan untuk menyembunyikan.')],
});

export const schema: Record<SectionKey, Section> = {
  home: {
    title: 'Teks Desain Baru',
    desc: 'Judul hero, judul tiap bagian di beranda, dan judul tiap halaman.',
    fields: [
      { key: 'hero', label: 'Hero (paling atas beranda)', type: 'group', fields: [
        t('eyebrow', 'Baris kecil di atas judul'),
        ta('title', 'Judul', 'Singkat — idealnya di bawah 60 karakter agar rapi di ponsel.'),
      ] },
      head2('prices', 'Bagian Harga'),
      head2('stylists', 'Bagian Stylist'),
      head2('reviews', 'Bagian Ulasan'),
      head2('branches', 'Bagian Cabang'),
      head2('inside', 'Bagian Foto Interior'),
      { key: 'pages', label: 'Judul halaman', type: 'group', fields: [
        head2('layanan', 'Halaman Harga'),
        head2('stylist', 'Halaman Stylist'),
        head2('cabang', 'Halaman Cabang'),
        head2('galeri', 'Halaman Galeri'),
        { key: 'tentang', label: 'Halaman Tentang', type: 'group', fields: [t('eyebrow', 'Baris kecil'), t('title', 'Judul')] },
        head2('booking', 'Halaman Booking', 'Subjudul kosong = memakai subjudul dari bagian Booking.'),
      ] },
    ],
  },
  settings: {
    title: 'Pengaturan Umum',
    desc: 'Nomor WhatsApp, judul untuk Google, dan teks footer.',
    fields: [
      t('whatsapp', 'Nomor WhatsApp cadangan (opsional)', 'Hanya dipakai untuk cabang yang belum punya nomor sendiri. Nomor tiap cabang diatur di bagian Cabang.'),
      t('waGreeting', 'Pesan pembuka WhatsApp', 'Teks yang otomatis terisi. Kata "Mooi" diganti nama cabang yang dipilih.'),
      t('siteTitle', 'Judul website (Google)', 'Tampil di tab browser dan hasil pencarian. Idealnya di bawah 60 karakter.'),
      ta('siteDescription', 'Deskripsi website (Google)', 'Ringkasan di hasil pencarian. Idealnya 120–160 karakter.'),
      ta('footerText', 'Teks footer'),
    ],
  },
  hero: {
    title: 'Hero — video',
    desc: 'Video hero (dipakai kedua desain). Teks hero desain baru ada di "Teks Desain Baru".',
    fields: [
      t('kicker', 'Label kecil'),
      t('line1', 'Judul — baris 1', ACCENT),
      t('line2', 'Judul — baris 2', ACCENT),
      t('line3', 'Judul — baris 3', ACCENT),
      ta('sub', 'Paragraf'),
      t('ctaPrimary', 'Tombol utama (ke halaman Booking)'),
      t('ctaSecondary', 'Tombol kedua (ke Layanan)'),
      { key: 'video', label: 'Video', type: 'video', help: 'Video vertikal (portrait) 8–15 detik, tanpa suara. Layar penuh di ponsel, jendela kubah di desktop.' },
      im('photo', 'Foto latar (desktop)', 'Tampil di belakang video pada layar lebar, dan menggantikan video bila video kosong.'),
    ],
  },
  marquee: {
    legacy: true,
    title: 'Teks Berjalan',
    desc: 'Pita teks yang bergerak di bawah hero.',
    fields: [{ key: 'items', label: 'Teks', type: 'strings' }],
  },
  intro: {
    title: 'Profil Mooi',
    desc: 'Paragraf tampil di halaman Tentang (desain baru). Label, judul, angka, dan foto hanya untuk desain lama.',
    fields: [
      t('kicker', 'Label kecil'),
      ta('title', 'Judul', ACCENT),
      ta('body', 'Paragraf'),
      { key: 'stats', label: 'Angka', type: 'list', item: 'Angka', fields: [t('value', 'Angka'), t('label', 'Keterangan')] },
      t('link', 'Teks tautan ke halaman Tentang', 'Kosongkan untuk menyembunyikan.'),
      im('image', 'Foto utama (bentuk kubah)'),
      im('imageDetail', 'Foto kecil (lingkaran)'),
    ],
  },
  services: {
    legacy: true,
    title: 'Layanan & Harga',
    desc: 'Daftar layanan. Nama layanan juga dipakai di formulir reservasi.',
    fields: [
      ...head,
      {
        key: 'items', label: 'Layanan', type: 'list', item: 'Layanan',
        fields: [t('name', 'Nama layanan'), ta('desc', 'Deskripsi'), t('price', 'Teks harga (opsional)', 'Harga berbeda tiap cabang — sebaiknya kosongkan. Bila diisi, WAJIB sama persis dengan price list.'), im('image', 'Foto')],
      },
    ],
  },
  gallery: {
    legacy: true,
    title: 'Galeri',
    desc: 'Foto di halaman utama dan halaman Galeri. Tata letak berulang setiap 6 foto.',
    fields: [
      ...head,
      { key: 'items', label: 'Foto', type: 'list', item: 'Foto', fields: [t('label', 'Keterangan'), im('image', 'Foto')] },
    ],
  },
  branches: {
    title: 'Cabang',
    desc: 'Alamat, jam buka, dan tautan tiap cabang. Nama cabang juga dipakai di formulir reservasi.',
    fields: [
      ...head,
      {
        key: 'items', label: 'Cabang', type: 'list', item: 'Cabang',
        fields: [
          t('name', 'Nama cabang'),
          ta('address', 'Alamat'),
          t('hours', 'Jam buka (teks)', 'Tampil di website, mis. "Setiap hari · 09.00 – 20.00".'),
          t('open', 'Jam buka untuk booking', 'Format 24 jam, mis. 09:00.'),
          t('close', 'Jam tutup untuk booking', 'Format 24 jam, mis. 20:00. Layanan harus selesai sebelum jam ini.'),
          {
            key: 'special', label: 'Jam khusus', type: 'list', item: 'Jam khusus',
            help: 'Untuk hari dengan jam berbeda, mis. Minggu 09:00–18:00.',
            fields: [{ key: 'days', label: 'Hari', type: 'days' }, t('open', 'Buka', 'Mis. 09:00.'), t('close', 'Tutup', 'Mis. 18:00.')],
          },
          t('whatsapp', 'WhatsApp cabang', 'Format 62xxx tanpa + atau spasi. Kosongkan untuk memakai nomor utama di Pengaturan Umum.'),
          t('maps', 'Tautan Google Maps', 'Salin dari Google Maps → Bagikan → Salin link. Kosongkan untuk menyembunyikan tombol.'),
          t('instagram', 'Tautan Instagram'),
          im('image', 'Foto utama cabang'),
          {
            key: 'gallery', label: 'Galeri cabang', type: 'list', item: 'Foto',
            help: 'Idealnya 5–8 foto. Yang tampil di website maksimal 8 foto pertama — urutkan dengan tombol ↑↓.',
            fields: [im('image', 'Foto')],
          },
        ],
      },
    ],
  },
  booking: {
    title: 'Booking',
    desc: 'Menu layanan, stylist, dan aturan jadwal untuk halaman Booking. Harga & durasi bawaan hanyalah contoh — sesuaikan.',
    fields: [
      t('title', 'Judul', ACCENT),
      ta('sub', 'Subjudul'),
      { key: 'policies', label: 'Kebijakan (tampil saat konfirmasi)', type: 'strings', help: 'Tulis hanya yang benar-benar berlaku di salon.' },
      {
        key: 'menus', label: 'Menu per cabang', type: 'list', item: 'Menu',
        help: 'Tiap cabang bisa punya menu & harga sendiri. Menu tanpa cabang dicentang berlaku untuk cabang yang belum punya menu.',
        fields: [
          { key: 'branches', label: 'Berlaku di cabang', type: 'branches' },
          {
            key: 'categories', label: 'Kategori layanan', type: 'list', item: 'Kategori',
            fields: [
              t('name', 'Nama kategori', 'Mis. Hair, Coloring, Nails.'),
              {
                key: 'items', label: 'Layanan', type: 'list', item: 'Layanan',
                fields: [
                  t('name', 'Nama layanan'),
                  t('note', 'Keterangan singkat', 'Opsional, mis. "Termasuk keramas".'),
                  num('duration', 'Durasi (menit)', 'Dipakai untuk menghitung jam yang tersedia.'),
                  num('price', 'Harga (Rp)', 'Angka saja, tanpa titik. Mis. 150000.'),
                  { key: 'from', label: 'Harga "mulai dari"', type: 'boolean', help: 'Centang bila harga bisa naik sesuai panjang/kondisi rambut.' },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'stylists', label: 'Stylist', type: 'list', item: 'Stylist',
        help: 'Kosongkan bila pelanggan tidak memilih stylist — langkah ini otomatis dilewati.',
        fields: [
          t('name', 'Nama'),
          t('role', 'Keahlian', 'Mis. Senior Colorist.'),
          t('years', 'Pengalaman', 'Mis. 8 tahun. Kosongkan bila tidak ingin ditampilkan.'),
          ta('bio', 'Kalimat singkat', 'Opsional.'),
          im('photo', 'Foto'),
          { key: 'branches', label: 'Bertugas di cabang', type: 'branches', help: 'Tidak dicentang sama sekali = bertugas di semua cabang.' },
          { key: 'days', label: 'Hari kerja', type: 'days', help: 'Tidak dicentang sama sekali = setiap hari.' },
        ],
      },
      num('interval', 'Jarak antar slot (menit)', 'Mis. 30.'),
      num('leadMinutes', 'Minimal booking sebelum jam (menit)', 'Mis. 120 = tidak bisa booking untuk 2 jam ke depan.'),
      num('daysAhead', 'Bisa booking berapa hari ke depan', 'Mis. 14.'),
      ta('successNote', 'Pesan setelah booking terkirim'),
    ],
  },
  testimonial: {
    title: 'Testimoni',
    desc: 'Ulasan pelanggan. Hanya ulasan asli (mis. dari Google Maps), disalin apa adanya — jangan diubah atau dikarang.',
    fields: [
      {
        key: 'reviews', label: 'Ulasan (tampil di desain baru)', type: 'list', item: 'Ulasan',
        help: 'Bagian "Kata pelanggan" baru muncul bila ada minimal satu ulasan.',
        fields: [
          t('name', 'Nama pengulas', 'Tulis seperti di Google, mis. "Rina A."'),
          t('branch', 'Cabang', 'Mooi Kedoya / Mooi Alam Sutera / Mooi Kelapa Gading'),
          num('rating', 'Bintang (1–5)'),
          ta('text', 'Isi ulasan', 'Salin persis. Boleh dipotong dengan "…" bila terlalu panjang, tanpa mengubah kata.'),
          t('date', 'Waktu', 'Mis. "2 bulan lalu" atau "Sep 2026"'),
        ],
      },
      t('kicker', 'Label kecil (desain lama)'), ta('quote', 'Kutipan (desain lama)'), t('author', 'Nama / keterangan (desain lama)'),
    ],
  },
  cta: {
    legacy: true,
    title: 'Ajakan Reservasi',
    desc: 'Bagian gelap di bawah setiap halaman.',
    fields: [
      t('kicker', 'Label kecil'),
      t('title', 'Judul', ACCENT),
      ta('sub', 'Subjudul'),
      t('primary', 'Tombol utama (ke halaman Booking)'),
      t('secondary', 'Tombol kedua (WhatsApp)'),
      im('image', 'Foto latar', 'Ditampilkan samar di belakang teks.'),
    ],
  },
  about: {
    title: 'Nilai (halaman Tentang)',
    desc: 'Tiga kolom nilai di halaman Tentang.',
    fields: [{ key: 'values', label: 'Nilai', type: 'list', item: 'Nilai', fields: [t('title', 'Judul'), ta('desc', 'Deskripsi')] }],
  },
  pages: {
    legacy: true,
    title: 'Judul Halaman',
    desc: 'Header gelap di bagian atas setiap halaman selain Beranda.',
    fields: [page('tentang', 'Tentang'), page('layanan', 'Layanan'), page('galeri', 'Galeri'), page('lokasi', 'Lokasi'), page('kontak', 'Kontak')],
  },
};
