// Struktur & isi default semua konten website. Nilai di sini dipakai bila
// database belum berisi apa pun untuk bagian tersebut, atau tidak terjangkau.
// Teks bertanda *kata* ditampilkan miring berwarna rose-gold.

export type Img = { src: string; alt: string };
export type Vid = { mp4: string; webm: string; poster: string };

type Head = { title: string; sub: string };
export type HomeText = {
  hero: { eyebrow: string; title: string };
  prices: Head; stylists: Head; reviews: Head; branches: Head; inside: Head;
  pages: { layanan: Head; stylist: Head; cabang: Head; galeri: Head; tentang: { eyebrow: string; title: string }; booking: Head };
};

export type Content = {
  /** Teks desain baru: judul & subjudul beranda dan tiap halaman. */
  home: HomeText;
  /** Versi bahasa Inggris. Kolom kosong = memakai teks bahasa Indonesia. */
  en: {
    home: HomeText;
    aboutBody: string;
    values: { title: string; desc: string }[];
    bookingSub: string;
    successNote: string;
    policies: string[];
    waGreeting: string;
    footerText: string;
    siteTitle: string;
    siteDescription: string;
    terms: { id: string; en: string }[];
  };
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
    items: Branch[];
  };
  booking: {
    title: string;
    sub: string;
    policies: string[];
    menus: { branches: string[]; categories: Category[] }[];
    /** Menu lama (satu untuk semua cabang) — dipakai bila cabang tidak punya menu sendiri. */
    categories: Category[];
    stylists: Stylist[];
    interval: number;
    leadMinutes: number;
    daysAhead: number;
    successNote: string;
  };
  testimonial: { kicker: string; quote: string; author: string; reviews: Review[] };
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
/** Ulasan asli pelanggan (mis. dari Google Maps), disalin apa adanya. */
export type Review = { name: string; branch: string; rating: number; text: string; date: string };
export type BookingService = { name: string; note: string; duration: number; price: number; from: boolean };
export type Category = { name: string; items: BookingService[] };
export type Branch = {
  name: string; address: string; hours: string; open: string; close: string;
  /** Jam berbeda untuk hari tertentu, mis. Minggu 09:00–18:00. */
  special: { days: string[]; open: string; close: string }[];
  whatsapp: string; maps: string; instagram: string; image: Img;
  /** Foto suasana cabang untuk galeri — tampil maksimal 8. */
  gallery: { image: Img }[];
};
export type Stylist = { name: string; role: string; years: string; bio: string; photo: Img; branches: string[]; days: string[] };
export type SectionKey = keyof Content;

import { menuAlamSutera, menuKedoya, menuKelapaGading } from './menus';
import { defaultTerms } from '../i18n';

const img = (file: string, alt: string): Img => ({ src: `/media/${file}.jpg`, alt });

export const defaults: Content = {
  home: {
    hero: { eyebrow: 'Hair studio & beauty bar · sejak 2019', title: 'Perawatan rambut yang personal, teliti, dan nyaman.' },
    prices: { title: 'Harga layanan', sub: 'Sesuai price list resmi tiap cabang. Geser untuk melihat semua.' },
    stylists: { title: 'Stylist kami', sub: 'Pilih stylist favorit Anda saat booking, atau serahkan pada kami.' },
    reviews: { title: 'Kata pelanggan', sub: 'Ulasan asli dari Google Maps.' },
    branches: { title: 'Cabang', sub: '' },
    inside: { title: 'Di dalam Mooi', sub: 'Foto asli dari cabang kami.' },
    pages: {
      layanan: { title: 'Harga layanan', sub: 'Sesuai price list resmi tiap cabang. Geser untuk melihat semua.' },
      stylist: { title: 'Stylist Mooi', sub: 'Kenali tim kami, lalu booking langsung dengan stylist pilihan Anda.' },
      cabang: { title: 'Cabang Mooi', sub: 'Alamat, jam buka, dan kontak tiap cabang.' },
      galeri: { title: 'Galeri', sub: 'Foto asli dari cabang Mooi.' },
      tentang: { eyebrow: 'Sejak 17 Agustus 2019', title: 'Tentang Mooi' },
      booking: { title: 'Booking', sub: '' },
    },
  },
  en: {
    home: {
      hero: { eyebrow: 'Hair studio & beauty bar · since 2019', title: 'Hair care that is personal, meticulous, and comfortable.' },
      prices: { title: 'Prices', sub: "From each branch's official price list. Swipe to see more." },
      stylists: { title: 'Our stylists', sub: 'Choose your favourite stylist when booking, or leave it to us.' },
      reviews: { title: 'What clients say', sub: 'Original Google Maps reviews (in Indonesian).' },
      branches: { title: 'Branches', sub: '' },
      inside: { title: 'Inside Mooi', sub: 'Real photos from our branches.' },
      pages: {
        layanan: { title: 'Prices', sub: "From each branch's official price list. Swipe to see more." },
        stylist: { title: 'Mooi stylists', sub: 'Meet the team, then book directly with the stylist you like.' },
        cabang: { title: 'Mooi branches', sub: 'Addresses, opening hours, and contacts.' },
        galeri: { title: 'Gallery', sub: 'Real photos from Mooi branches.' },
        tentang: { eyebrow: 'Since 17 August 2019', title: 'About Mooi' },
        booking: { title: 'Book', sub: 'Choose a branch, services, stylist, and time. Our team confirms on WhatsApp.' },
      },
    },
    aboutBody:
      'Mooi Hair Studio & Beauty Bar was founded on 17 August 2019 with a vision to offer a more personal, comfortable, and high-quality care experience. Starting with a focus on hair and beauty, Mooi has kept growing with a range of services — from haircuts, hair chemical services, and hair treatments to body treatments, lymphatic massage, Japanese head spa, and manicure & pedicure.\n\n' +
      'We believe care is not only about appearance, but also about how comfortable and confident you feel in yourself. That is why Mooi puts quality, attention to detail, personal service, and the latest techniques and trends first in every service we provide.\n\n' +
      "As we keep growing with our clients' needs, Mooi is committed to creating a complete, comfortable beauty experience that stays relevant over time.",
    values: [
      { title: 'Consultation first', desc: 'We understand your needs and hair condition before starting any treatment.' },
      { title: 'Selected products', desc: '' },
      { title: 'One standard', desc: 'The same training and procedures at every branch, for consistent results.' },
    ],
    bookingSub: 'Choose a branch, services, stylist, and time. Our team confirms on WhatsApp.',
    successNote: 'Our team will confirm your appointment on WhatsApp during opening hours.',
    policies: [
      'Booking requests are confirmed by the Mooi team on WhatsApp.',
      'Pay at the salon — cash, debit, or QRIS.',
      'Need to reschedule? Let us know on WhatsApp.',
    ],
    waGreeting: "Hello Mooi, I'd like to make a reservation.",
    footerText: 'Hair studio & beauty bar with three branches in Jakarta & Tangerang.',
    siteTitle: 'Mooi Hair Studio & Beauty Bar | Kedoya · Alam Sutera · Kelapa Gading',
    siteDescription: 'Hair studio and beauty bar with three branches in Jakarta & Tangerang: haircut, coloring, smoothing, hair spa, nails, and lash by professional stylists.',
    terms: defaultTerms,
  },
  settings: {
    whatsapp: '',
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
    ctaPrimary: 'Booking Sekarang',
    ctaSecondary: 'Lihat Layanan',
    photo: img('hero', 'Stylist mencuci rambut pelanggan di wastafel salon'),
    video: { mp4: '/media/hero.mp4', webm: '/media/hero.webm', poster: '/media/hero-poster.jpg' },
  },
  marquee: {
    items: ['Hair Cut & Styling', 'Coloring', 'Smoothing & Keratin', 'Hair Spa', 'Beauty Bar', 'Bridal & Event'],
  },
  intro: {
    kicker: 'Tentang Mooi',
    title: 'Profil Singkat Mooi',
    body: "Mooi Hair Studio & Beauty Bar didirikan pada 17 Agustus 2019 dengan visi untuk menghadirkan pengalaman perawatan yang lebih personal, nyaman, dan berkualitas. Berawal dari fokus pada dunia rambut dan beauty, Mooi terus berkembang dengan menghadirkan berbagai layanan, mulai dari haircut, hair chemical, hair treatment, body treatment, lymphatic massage, Japanese head spa, hingga manicure & pedicure.\n\nKami percaya bahwa perawatan bukan hanya tentang penampilan, tetapi juga tentang bagaimana seseorang merasa nyaman dan percaya diri dengan dirinya sendiri. Karena itu, Mooi mengutamakan kualitas, ketelitian, pelayanan yang personal, serta perkembangan teknik dan tren dalam setiap layanan yang diberikan.\n\nDengan terus berkembang mengikuti kebutuhan pelanggan, Mooi berkomitmen untuk menciptakan pengalaman beauty yang menyeluruh, nyaman, dan tetap relevan dari waktu ke waktu.",
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
      { name: 'Hair Cut & Styling', desc: 'Potongan yang disesuaikan dengan bentuk wajah dan gaya keseharian Anda.', price: '', image: img('svc-haircut', 'Stylist menata rambut pelanggan') },
      { name: 'Coloring & Highlight', desc: 'Pewarnaan modern dengan produk premium yang menjaga kesehatan rambut.', price: '', image: img('svc-coloring', 'Rambut berwarna lavender') },
      { name: 'Smoothing & Keratin', desc: 'Rambut lebih halus, mudah diatur, dan tetap sehat dalam jangka panjang.', price: '', image: img('svc-smoothing', 'Rambut dikeringkan dan diluruskan') },
      { name: 'Hair Spa & Treatment', desc: 'Perawatan intensif untuk rambut kering, rusak, dan rontok.', price: '', image: img('svc-spa', 'Pelanggan menikmati cuci rambut') },
      { name: 'Beauty Bar', desc: 'Perawatan kuku, bulu mata, dan makeup untuk tampilan sempurna.', price: '', image: img('svc-beauty', 'Kuku dengan cat gelap') },
      { name: 'Bridal & Event', desc: 'Paket rambut dan makeup untuk hari pernikahan dan acara spesial.', price: '', image: img('svc-bridal', 'Makeup artist merias wajah') },
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
      { name: 'Mooi Kedoya', address: 'Jl. Panjang No.21A, RT.12/RW.5, Kedoya Utara, Kec. Kebon Jeruk, Jakarta Barat 11520', hours: 'Setiap hari · 08.00 – 20.00', open: '08:00', close: '20:00', special: [], whatsapp: '6282318062929', maps: 'https://maps.app.goo.gl/ZBnvDdeY6anLXhD7A', instagram: 'https://instagram.com/mooihairstudio_kedoya', image: { src: '/media/branches/kedoya-1.jpg', alt: 'Interior Mooi Kedoya' }, gallery: [{ image: { src: '/media/branches/kedoya-1.jpg', alt: 'Area styling Mooi Kedoya dengan plafon lengkung' } }, { image: { src: '/media/branches/kedoya-2.jpg', alt: 'Nail bar Mooi Kedoya' } }, { image: { src: '/media/branches/kedoya-3.jpg', alt: 'Lounge pedicure Mooi Kedoya' } }, { image: { src: '/media/branches/kedoya-4.jpg', alt: 'Area keramas Mooi Kedoya' } }, { image: { src: '/media/branches/kedoya-5.jpg', alt: 'Ruang treatment Mooi Kedoya' } }] },
      { name: 'Mooi Alam Sutera', address: 'Jl. Jalur Sutera Boulevard Kav. 29D, Pakualam, Kec. Serpong Utara, Tangerang Selatan, Banten 15143', hours: 'Setiap hari · 09.00 – 20.00', open: '09:00', close: '20:00', special: [], whatsapp: '6282121209858', maps: 'https://maps.app.goo.gl/DYNCKcbMrVNz65bf8', instagram: 'https://instagram.com/mooihairstudio_alsut', image: { src: '/media/branches/alam-sutera-1.jpg', alt: 'Interior Mooi Alam Sutera' }, gallery: [{ image: { src: '/media/branches/alam-sutera-1.jpg', alt: 'Area styling Mooi Alam Sutera' } }, { image: { src: '/media/branches/alam-sutera-2.jpg', alt: 'Kursi styling dan cermin lengkung Mooi Alam Sutera' } }, { image: { src: '/media/branches/alam-sutera-3.jpg', alt: 'Lounge pedicure Mooi Alam Sutera' } }, { image: { src: '/media/branches/alam-sutera-4.jpg', alt: 'Nail bar Mooi Alam Sutera' } }, { image: { src: '/media/branches/alam-sutera-5.jpg', alt: 'Rak produk Milbon dan Davines di Mooi Alam Sutera' } }, { image: { src: '/media/branches/alam-sutera-6.jpg', alt: 'Ruang spa Mooi Alam Sutera' } }, { image: { src: '/media/branches/alam-sutera-7.jpg', alt: 'Resepsionis Mooi Alam Sutera' } }, { image: { src: '/media/branches/alam-sutera-8.jpg', alt: 'Area keramas Mooi Alam Sutera' } }] },
      { name: 'Mooi Kelapa Gading', address: 'Jl. Boulevard Raya No.15 Blok QJ.1, Kelapa Gading Barat, Kec. Kelapa Gading, Jakarta Utara 14240', hours: 'Senin–Sabtu · 08.00 – 20.00\nMinggu · 09.00 – 18.00', open: '08:00', close: '20:00', special: [{ days: ['Minggu'], open: '09:00', close: '18:00' }], whatsapp: '6281291103882', maps: 'https://maps.app.goo.gl/asNneavUwuaNMyPs7', instagram: 'https://instagram.com/mooihairstudio_klpgdg', image: img('br-3', 'Masker rambut'), gallery: [] },
    ],
  },
  booking: {
    title: 'Booking *tanpa ribet*.',
    sub: 'Pilih cabang, layanan, stylist, dan jam. Tim kami mengonfirmasi via WhatsApp.',
    policies: [
      'Permintaan booking dikonfirmasi tim Mooi via WhatsApp.',
      'Bayar di salon — tunai, debit, atau QRIS.',
      'Ingin ganti jadwal? Kabari kami via WhatsApp.',
    ],
    menus: [
      { branches: ['Mooi Kedoya'], categories: menuKedoya },
      { branches: ['Mooi Alam Sutera'], categories: menuAlamSutera },
      { branches: ['Mooi Kelapa Gading'], categories: menuKelapaGading },
    ],
    categories: [],
    stylists: [
      { name: 'Samuel', role: 'Hair Stylist', years: '', bio: '', photo: { src: '', alt: '' }, branches: ['Mooi Kedoya'], days: ['Rabu', 'Minggu'] },
      { name: 'Oscar', role: 'Hair Stylist', years: '', bio: '', photo: { src: '', alt: '' }, branches: ['Mooi Kedoya'], days: [] },
      { name: 'Eddy Casper', role: 'Hair Stylist', years: '', bio: '', photo: { src: '', alt: '' }, branches: ['Mooi Kedoya'], days: [] },
      { name: 'Shandy', role: 'Hair Stylist', years: '', bio: '', photo: { src: '', alt: '' }, branches: ['Mooi Kedoya'], days: [] },
    ],
    interval: 30,
    leadMinutes: 120,
    daysAhead: 14,
    successNote: 'Tim kami akan mengonfirmasi jadwal Anda via WhatsApp pada jam operasional.',
  },
  testimonial: {
    kicker: 'Kata Pelanggan',
    // Kosong: jangan tampilkan kutipan karangan. Isi dengan ulasan asli lewat admin.
    quote: '',
    author: '',
    reviews: [],
  },
  cta: {
    kicker: 'Reservasi',
    title: 'Saatnya merawat *diri sendiri*.',
    sub: 'Pilih cabang terdekat, kami siapkan jadwal untuk Anda.',
    primary: 'Booking Sekarang',
    secondary: 'Chat WhatsApp',
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

/** Nomor WhatsApp cabang, atau nomor cadangan bila cabang belum punya. Bisa kosong. */
export const branchWa = (b: { whatsapp?: string } | undefined, fallback: string) =>
  (b?.whatsapp?.replace(/\D/g, '') || fallback?.replace(/\D/g, '') || '');

/** Daftar kontak WhatsApp per cabang (yang punya nomor saja). */
export const branchContacts = (c: Pick<Content, 'branches' | 'settings'>) =>
  c.branches.items
    .map((b) => ({ name: b.name, wa: branchWa(b, c.settings.whatsapp) }))
    .filter((x) => x.wa);

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
