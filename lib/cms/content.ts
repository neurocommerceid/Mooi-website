// Struktur & isi default semua konten website. Nilai di sini dipakai bila
// database belum berisi apa pun untuk bagian tersebut, atau tidak terjangkau.
// Teks bertanda *kata* ditampilkan miring berwarna rose-gold.

export type Img = { src: string; alt: string };
export type Vid = { mp4: string; webm: string; poster: string };

export type Content = {
  settings: {
    whatsapp: string;
    waGreeting: string;
    siteTitle: string;
    siteDescription: string;
    footerText: string;
  };
  hero: {
    kicker: string;
    line1: string;
    line2: string;
    line3: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    photo: Img;
    video: Vid;
  };
  marquee: { items: string[] };
  intro: {
    kicker: string;
    title: string;
    body: string;
    stats: { value: string; label: string }[];
    link: string;
    image: Img;
    imageDetail: Img;
  };
  services: {
    kicker: string;
    title: string;
    sub: string;
    items: { name: string; desc: string; price: string; image: Img }[];
  };
  gallery: {
    kicker: string;
    title: string;
    sub: string;
    items: { label: string; image: Img }[];
  };
  branches: {
    kicker: string;
    title: string;
    sub: string;
    items: { name: string; address: string; hours: string; maps: string; instagram: string; image: Img }[];
  };
  testimonial: { kicker: string; quote: string; author: string };
  cta: { kicker: string; title: string; sub: string; primary: string; secondary: string; image: Img };
  about: { values: { title: string; desc: string }[] };
  pages: {
    tentang: PageHead;
    layanan: PageHead;
    galeri: PageHead;
    lokasi: PageHead;
    kontak: PageHead;
  };
};

export type PageHead = { kicker: string; title: string; sub: string };
export type SectionKey = keyof Content;

const img = (file: string, alt: string): Img => ({ src: `/media/${file}.jpg`, alt });

export const defaults: Content = {
  settings: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? '62817773343',
    waGreeting: 'Halo Mooi, saya mau reservasi.',
    siteTitle: 'Mooi Hair Studio & Beauty Bar | Kedoya · Alam Sutera · Kelapa Gading',
    siteDescription:
      'Hair studio dan beauty bar dengan tiga cabang di Jakarta & Tangerang. Hair cut, coloring, smoothing, hair spa, dan beauty bar oleh stylist profesional.',
    footerText: 'Hair Studio & Beauty Bar dengan tiga cabang di Jakarta & Tangerang.',
  },
  hero: {
    kicker: 'Hair Studio & Beauty Bar',
    line1: 'Keindahan yang',
    line2: '*dirawat* dengan',
    line3: 'sepenuh hati.',
    sub: 'Potongan, warna, dan perawatan rambut oleh tim profesional Mooi — di Kedoya, Alam Sutera, dan Kelapa Gading.',
    ctaPrimary: 'Reservasi Sekarang',
    ctaSecondary: 'Lihat Layanan',
    photo: img('hero', 'Stylist mencuci rambut pelanggan di wastafel salon'),
    video: { mp4: '/media/hero.mp4', webm: '/media/hero.webm', poster: '/media/hero-poster.jpg' },
  },
  marquee: {
    items: ['Hair Cut & Styling', 'Coloring', 'Smoothing & Keratin', 'Hair Spa', 'Beauty Bar', 'Bridal & Event'],
  },
  intro: {
    kicker: 'Filosofi Kami',
    title: 'Mooi berarti *indah*. Kami percaya keindahan lahir dari perhatian pada detail.',
    body: 'Setiap kunjungan diawali konsultasi — bentuk wajah, kondisi rambut, dan keseharian Anda — sebelum gunting atau kuas menyentuh rambut. Standar yang sama kami jaga di ketiga cabang.',
    stats: [
      { value: '03', label: 'Cabang' },
      { value: '06', label: 'Lini layanan' },
      { value: '01', label: 'Standar layanan' },
    ],
    link: 'Cerita Kami',
    image: img('about', 'Perempuan dengan rambut panjang bergelombang'),
    imageDetail: img('about-detail', 'Serum perawatan rambut dengan pipet'),
  },
  services: {
    kicker: 'Layanan',
    title: 'Ritual perawatan, *untuk Anda*.',
    sub: 'Harga menyesuaikan panjang dan kondisi rambut. Konsultasi sebelum setiap tindakan.',
    items: [
      { name: 'Hair Cut & Styling', desc: 'Potongan yang disesuaikan dengan bentuk wajah dan gaya keseharian Anda.', price: 'Mulai Rp 150.000', image: img('svc-haircut', 'Stylist menata rambut pelanggan') },
      { name: 'Coloring & Highlight', desc: 'Pewarnaan modern dengan produk premium yang menjaga kesehatan rambut.', price: 'Mulai Rp 450.000', image: img('svc-coloring', 'Rambut berwarna lavender') },
      { name: 'Smoothing & Keratin', desc: 'Rambut lebih halus, mudah diatur, dan tetap sehat dalam jangka panjang.', price: 'Mulai Rp 650.000', image: img('svc-smoothing', 'Rambut dikeringkan dan diluruskan') },
      { name: 'Hair Spa & Treatment', desc: 'Perawatan intensif untuk rambut kering, rusak, dan rontok.', price: 'Mulai Rp 200.000', image: img('svc-spa', 'Pelanggan menikmati cuci rambut') },
      { name: 'Beauty Bar', desc: 'Perawatan kuku, bulu mata, dan makeup untuk tampilan sempurna.', price: 'Mulai Rp 125.000', image: img('svc-beauty', 'Kuku dengan cat gelap') },
      { name: 'Bridal & Event', desc: 'Paket rambut dan makeup untuk hari pernikahan dan acara spesial.', price: 'Konsultasi', image: img('svc-bridal', 'Makeup artist merias wajah') },
    ],
  },
  gallery: {
    kicker: 'Galeri',
    title: 'Detail yang *dirawat*.',
    sub: 'Dari potongan rambut hingga sentuhan akhir.',
    items: [
      { label: 'Styling', image: img('g-styling', 'Penataan rambut sanggul') },
      { label: 'Nail Art', image: img('g-nails', 'Kuku dengan warna pastel') },
      { label: 'Facial', image: img('g-facial', 'Perawatan wajah dengan masker') },
      { label: 'Makeup', image: img('g-makeup', 'Produk makeup') },
      { label: 'Blow Dry', image: img('g-blowdry', 'Pengering rambut dan kopi') },
      { label: 'Peralatan', image: img('g-tools', 'Sisir, sikat, dan pengering rambut') },
    ],
  },
  branches: {
    kicker: 'Lokasi',
    title: 'Tiga cabang, *satu standar*.',
    sub: 'Kunjungi cabang terdekat, atau reservasi lebih dulu via WhatsApp.',
    items: [
      { name: 'Mooi Kedoya', address: 'Jl. [alamat cabang Kedoya]', hours: 'Setiap hari · 09.00 – 20.00', maps: '', instagram: 'https://instagram.com/mooihairstudio_kedoya', image: img('br-1', 'Minyak perawatan diteteskan ke tangan') },
      { name: 'Mooi Alam Sutera', address: 'Jl. [alamat cabang Alam Sutera]', hours: 'Setiap hari · 09.00 – 20.00', maps: '', instagram: 'https://instagram.com/mooihairstudio_alsut', image: img('br-2', 'Lilin dan botol minyak aromaterapi') },
      { name: 'Mooi Kelapa Gading', address: 'Jl. [alamat cabang Kelapa Gading]', hours: 'Setiap hari · 09.00 – 20.00', maps: '', instagram: 'https://instagram.com/mooihairstudio_klpgdg', image: img('br-3', 'Masker rambut') },
    ],
  },
  testimonial: {
    kicker: 'Kata Pelanggan',
    quote: 'Hasilnya selalu rapi dan stylist-nya ngerti banget maunya kita. Sudah langganan dari cabang pertama buka.',
    author: 'Pelanggan Mooi · Kelapa Gading',
  },
  cta: {
    kicker: 'Reservasi',
    title: 'Saatnya merawat *diri sendiri*.',
    sub: 'Pilih cabang terdekat, kami siapkan jadwal untuk Anda.',
    primary: 'Reservasi via WhatsApp',
    secondary: 'Isi Formulir',
    image: img('cta', 'Perawatan dengan minyak hangat'),
  },
  about: {
    values: [
      { title: 'Konsultasi dulu', desc: 'Kami memahami kebutuhan dan kondisi rambut Anda sebelum memulai tindakan apa pun.' },
      { title: 'Produk pilihan', desc: '[Sebutkan merek/produk yang digunakan Mooi.]' },
      { title: 'Satu standar', desc: 'Pelatihan dan prosedur yang sama di setiap cabang, agar hasilnya konsisten.' },
    ],
  },
  pages: {
    tentang: { kicker: 'Tentang Kami', title: 'Cerita di balik Mooi', sub: '' },
    layanan: { kicker: 'Layanan', title: 'Layanan & Harga', sub: 'Harga dapat berbeda sesuai panjang rambut dan kondisi. Konsultasi sebelum setiap tindakan.' },
    galeri: { kicker: 'Galeri', title: 'Galeri', sub: '' },
    lokasi: { kicker: 'Lokasi', title: 'Tiga Cabang', sub: 'Kedoya, Alam Sutera, dan Kelapa Gading — dengan standar layanan yang sama.' },
    kontak: { kicker: 'Kontak', title: 'Reservasi', sub: 'Tim kami akan menghubungi via WhatsApp untuk konfirmasi jadwal.' },
  },
};

export const sectionKeys = Object.keys(defaults) as SectionKey[];

export const waLink = (number: string, text: string) =>
  `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

// Hanya izinkan tautan http(s) / mailto / tel — cegah `javascript:` dari input admin.
export function safeUrl(url: string | undefined): string | null {
  if (!url) return null;
  const u = url.trim();
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(u) ? u : null;
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
