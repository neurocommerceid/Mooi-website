import type { SectionKey } from './content';

export type Field =
  | { key: string; label: string; type: 'text' | 'textarea' | 'image' | 'video' | 'strings' | 'number' | 'boolean'; help?: string }
  | { key: string; label: string; type: 'list'; help?: string; item: string; fields: Field[] }
  | { key: string; label: string; type: 'group'; help?: string; fields: Field[] };

export type Section = { title: string; desc: string; fields: Field[] };

const ACCENT = 'Apit kata dengan *bintang* agar tampil miring berwarna rose-gold.';
const t = (key: string, label: string, help?: string): Field => ({ key, label, type: 'text', help });
const ta = (key: string, label: string, help?: string): Field => ({ key, label, type: 'textarea', help });
const im = (key: string, label: string, help?: string): Field => ({ key, label, type: 'image', help });
const num = (key: string, label: string, help?: string): Field => ({ key, label, type: 'number', help });
const head = [t('kicker', 'Label kecil'), t('title', 'Judul', ACCENT), ta('sub', 'Subjudul')];
const page = (key: string, label: string): Field => ({
  key, label, type: 'group', fields: [t('kicker', 'Label kecil'), t('title', 'Judul'), ta('sub', 'Subjudul')],
});

export const schema: Record<SectionKey, Section> = {
  settings: {
    title: 'Pengaturan Umum',
    desc: 'Nomor WhatsApp, judul untuk Google, dan teks footer.',
    fields: [
      t('whatsapp', 'Nomor WhatsApp', 'Format internasional tanpa + atau spasi, mis. 62817773343. Dipakai semua tombol reservasi.'),
      t('waGreeting', 'Pesan pembuka WhatsApp', 'Teks yang otomatis terisi saat pengunjung menekan tombol reservasi.'),
      t('siteTitle', 'Judul website (Google)', 'Tampil di tab browser dan hasil pencarian. Idealnya di bawah 60 karakter.'),
      ta('siteDescription', 'Deskripsi website (Google)', 'Ringkasan di hasil pencarian. Idealnya 120–160 karakter.'),
      ta('footerText', 'Teks footer'),
    ],
  },
  hero: {
    title: 'Hero',
    desc: 'Bagian paling atas halaman utama: judul besar, video, dan tombol.',
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
    title: 'Teks Berjalan',
    desc: 'Pita teks yang bergerak di bawah hero.',
    fields: [{ key: 'items', label: 'Teks', type: 'strings' }],
  },
  intro: {
    title: 'Filosofi',
    desc: 'Bagian perkenalan di halaman utama dan halaman Tentang.',
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
    title: 'Layanan & Harga',
    desc: 'Daftar layanan. Nama layanan juga dipakai di formulir reservasi.',
    fields: [
      ...head,
      {
        key: 'items', label: 'Layanan', type: 'list', item: 'Layanan',
        fields: [t('name', 'Nama layanan'), ta('desc', 'Deskripsi'), t('price', 'Harga', 'Mis. "Mulai Rp 150.000" atau "Konsultasi".'), im('image', 'Foto')],
      },
    ],
  },
  gallery: {
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
          t('maps', 'Tautan Google Maps', 'Salin dari Google Maps → Bagikan → Salin link. Kosongkan untuk menyembunyikan tombol.'),
          t('instagram', 'Tautan Instagram'),
          im('image', 'Foto'),
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
      {
        key: 'stylists', label: 'Stylist', type: 'list', item: 'Stylist',
        help: 'Kosongkan bila pelanggan tidak memilih stylist — langkah ini otomatis dilewati.',
        fields: [
          t('name', 'Nama'),
          t('role', 'Keahlian', 'Mis. Senior Colorist.'),
          t('years', 'Pengalaman', 'Mis. 8 tahun. Kosongkan bila tidak ingin ditampilkan.'),
          ta('bio', 'Kalimat singkat', 'Opsional.'),
          im('photo', 'Foto'),
          { key: 'branches', label: 'Cabang', type: 'strings', help: 'Tulis nama cabang persis seperti di bagian Cabang. Kosongkan = semua cabang.' },
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
    desc: 'Kutipan pelanggan. Gunakan ulasan asli — kosongkan kutipan untuk menyembunyikan bagian ini.',
    fields: [t('kicker', 'Label kecil'), ta('quote', 'Kutipan'), t('author', 'Nama / keterangan pelanggan')],
  },
  cta: {
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
    title: 'Judul Halaman',
    desc: 'Header gelap di bagian atas setiap halaman selain Beranda.',
    fields: [page('tentang', 'Tentang'), page('layanan', 'Layanan'), page('galeri', 'Galeri'), page('lokasi', 'Lokasi'), page('kontak', 'Kontak')],
  },
};
