// Dua bahasa untuk desain baru: Indonesia (utama) & Inggris.
// Teks antarmuka ada di sini; teks konten bahasa Inggris diatur di CMS (bagian "Bahasa Inggris").
import type { Branch, Stylist } from './cms/content';
import { DAYS, branchHours, dayIndex, fromMin } from './booking';

export type Lang = 'id' | 'en';
export const LANGS: Lang[] = ['id', 'en'];

/** Istilah menu Indonesia → Inggris. Hanya kata yang diganti — angka & harga tidak pernah diubah. */
export type Term = { id: string; en: string };
export const defaultTerms: Term[] = [
  { id: 'Sangat panjang', en: 'Extra long' },
  { id: 'Pendek', en: 'Short' },
  { id: 'Sedang', en: 'Medium' },
  { id: 'Panjang', en: 'Long' },
  { id: '(ribu)', en: '(thousand IDR)' },
  { id: 'Stylist mana saja', en: 'Any stylist' },
  { id: 'termasuk', en: 'incl.' },
  { id: 'Termasuk', en: 'Incl.' },
  { id: 'Rabu & Minggu', en: 'Wed & Sun' },
  { id: 'versi ikat Super/Premium tersedia', en: 'Super/Premium tied version available' },
  { id: 'blow kering', en: 'dry blow' },
  { id: 'blow catok', en: 'flat-iron blow' },
  { id: 'tanpa blow', en: 'no blow-dry' },
  { id: 'ring/lem', en: 'ring/glue' },
  { id: 'Catok Curly', en: 'Curling Iron' },
  { id: 'Sanggul', en: 'Updo' },
  { id: 'Pasang Bulu Mata Palsu', en: 'False Eyelash Application' },
  { id: 'Creambath Tradisional', en: 'Traditional Creambath' },
  { id: 'Totok Wajah', en: 'Facial Acupressure' },
  { id: 'Totok Perut', en: 'Abdominal Acupressure' },
  { id: 'Ratus Kecantikan', en: 'Ratus (Herbal Steam)' },
  { id: 'Sulam Alis', en: 'Eyebrow Embroidery' },
  { id: 'mnt', en: 'min' },
  { id: 'rb', en: 'k' },
  { id: 'jt', en: 'M' },
];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Terjemahkan teks menu dengan daftar istilah (frasa terpanjang lebih dulu, per kata utuh). */
export function translate(text: string, terms: Term[], lang: Lang) {
  if (lang === 'id' || !text) return text;
  const list = [...terms].filter((t) => t.id?.trim() && t.en?.trim()).sort((a, b) => b.id.length - a.id.length);
  let out = text;
  for (const t of list) {
    const word = /^[\w]/.test(t.id) ? '(?<![\\p{L}])' : '';
    const end = /[\w]$/.test(t.id) ? '(?![\\p{L}])' : '';
    out = out.replace(new RegExp(word + esc(t.id) + end, 'gu'), t.en);
  }
  return out;
}

const DAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_ID_SHORT = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const dot = (m: number) => fromMin(m).replace(':', '.');

/** Jam buka cabang. ID: teks dari CMS. EN: disusun otomatis dari jam buka & jam khusus. */
export function hoursText(b: Branch, lang: Lang) {
  if (lang === 'id') return b.hours;
  // Senin..Minggu, hari berurutan dengan jam sama digabung.
  const order = [1, 2, 3, 4, 5, 6, 0];
  const sample = (d: number) => {
    // tanggal mana pun dengan hari d (2026-10-04 = Minggu)
    const date = `2026-10-${String(4 + d).padStart(2, '0')}`;
    const h = branchHours(b, date);
    return `${dot(h.open)} – ${dot(h.close)}`;
  };
  const groups: { days: number[]; h: string }[] = [];
  for (const d of order) {
    const h = sample(d);
    const last = groups[groups.length - 1];
    if (last && last.h === h) last.days.push(d);
    else groups.push({ days: [d], h });
  }
  if (groups.length === 1) return `Daily · ${groups[0].h}`;
  return groups
    .map((g) => `${g.days.length > 1 ? `${DAY_EN[g.days[0]]}–${DAY_EN[g.days[g.days.length - 1]]}` : DAY_EN[g.days[0]]} · ${g.h}`)
    .join('\n');
}

export function daysLabelL(s: Stylist, lang: Lang) {
  const days = (s.days ?? []).map(dayIndex).filter((i) => i >= 0).sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
  if (!days.length || days.length >= 7) return '';
  return lang === 'en' ? `${days.map((i) => DAY_EN[i]).join(' & ')} only` : `Hanya ${days.map((i) => DAYS[i]).join(' & ')}`;
}

export function durasiL(min: number, lang: Lang) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (lang === 'en') return [h ? `${h} hr` : '', m ? `${m} min` : ''].filter(Boolean).join(' ') || '0 min';
  return [h ? `${h} jam` : '', m ? `${m} mnt` : ''].filter(Boolean).join(' ') || '0 mnt';
}

const locale = (lang: Lang) => (lang === 'en' ? 'en-GB' : 'id-ID');
export const dateLong = (date: string, lang: Lang) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString(locale(lang), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const dateFmt = (date: string, lang: Lang, opt: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString(locale(lang), { ...opt, timeZone: 'UTC' });

export { DAY_ID_SHORT };

/** Teks antarmuka desain baru. */
export const ui = {
  id: {
    nav: { home: 'Beranda', prices: 'Harga', stylists: 'Stylist', branches: 'Cabang', gallery: 'Galeri', about: 'Tentang', articles: 'Artikel', book: 'Booking', openMenu: 'Buka menu', closeMenu: 'Tutup menu', lang: 'Bahasa' },
    bookNow: 'Booking sekarang',
    seePrices: 'Lihat harga',
    whatsapp: 'WhatsApp',
    status: {
      opensAt: (t: string) => `Tutup · buka ${t}`,
      closingSoon: (t: string) => `Segera tutup · ${t}`,
      openUntil: (t: string) => `Buka · sampai ${t}`,
      opensTomorrow: (t: string) => `Tutup · buka besok ${t}`,
    },
    directions: 'Petunjuk arah',
    googleReviews: 'Ulasan Google',
    fullAddresses: 'Alamat & jam lengkap',
    from: 'mulai',
    chooseBranch: 'Pilih cabang',
    prev: 'Sebelumnya',
    next: 'Berikutnya',
    noMenu: 'Daftar harga cabang ini belum tersedia di website. Tanyakan langsung via WhatsApp cabang.',
    fullList: 'Daftar lengkap',
    bookAt: (b: string) => `Booking di ${b}`,
    viewGallery: 'Lihat galeri',
    allStylists: 'Lihat semua stylist',
    bookWith: (n: string) => `Booking dengan ${n}`,
    stylistsSoon: 'Profil stylist segera ditampilkan.',
    readAllReviews: 'Baca semua ulasan di Google Maps:',
    starsOf: (n: number) => `${n} dari 5 bintang`,
    photosSoon: 'Foto segera ditambahkan.',
    zoom: 'Perbesar',
    close: 'Tutup',
    prevPhoto: 'Foto sebelumnya',
    nextPhoto: 'Foto berikutnya',
    chatWith: 'Chat dengan cabang',
    chatPick: 'Chat WhatsApp — pilih cabang',
    articles: {
      none: 'Artikel segera hadir.',
      read: 'Baca artikel',
      back: 'Semua artikel',
      minutes: (n: number) => `${n} menit baca`,
      ctaTitle: 'Konsultasikan rambut Anda',
      ctaSub: 'Stylist kami membantu memilih perawatan yang sesuai dengan kondisi rambut Anda.',
      onlyId: '',
    },
  },
  en: {
    nav: { home: 'Home', prices: 'Prices', stylists: 'Stylists', branches: 'Branches', gallery: 'Gallery', about: 'About', articles: 'Articles', book: 'Book', openMenu: 'Open menu', closeMenu: 'Close menu', lang: 'Language' },
    bookNow: 'Book now',
    seePrices: 'See prices',
    whatsapp: 'WhatsApp',
    status: {
      opensAt: (t: string) => `Closed · opens ${t}`,
      closingSoon: (t: string) => `Closing soon · ${t}`,
      openUntil: (t: string) => `Open · until ${t}`,
      opensTomorrow: (t: string) => `Closed · opens tomorrow ${t}`,
    },
    directions: 'Directions',
    googleReviews: 'Google reviews',
    fullAddresses: 'Full addresses & hours',
    from: 'from',
    chooseBranch: 'Choose branch',
    prev: 'Previous',
    next: 'Next',
    noMenu: "This branch's price list isn't on the website yet. Please ask the branch on WhatsApp.",
    fullList: 'Full price list',
    bookAt: (b: string) => `Book at ${b}`,
    viewGallery: 'View gallery',
    allStylists: 'See all stylists',
    bookWith: (n: string) => `Book with ${n}`,
    stylistsSoon: 'Stylist profiles coming soon.',
    readAllReviews: 'Read all reviews on Google Maps:',
    starsOf: (n: number) => `${n} out of 5 stars`,
    photosSoon: 'Photos coming soon.',
    zoom: 'Enlarge',
    close: 'Close',
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    chatWith: 'Chat with a branch',
    chatPick: 'WhatsApp chat — choose a branch',
    articles: {
      none: 'Articles coming soon.',
      read: 'Read article',
      back: 'All articles',
      minutes: (n: number) => `${n} min read`,
      ctaTitle: 'Talk to us about your hair',
      ctaSub: 'Our stylists help you choose the right treatment for your hair.',
      onlyId: 'This article is available in Indonesian only.',
    },
  },
};
export type UI = (typeof ui)['id'];

/** Teks alur booking. */
export const bk = {
  id: {
    steps: { cabang: 'Cabang', layanan: 'Layanan', stylist: 'Stylist', jadwal: 'Jadwal', data: 'Data diri' },
    stepOf: (i: number, n: number) => `Langkah ${i} dari ${n}`,
    branchTitle: 'Mau ke cabang mana?',
    branchSub: 'Semua cabang punya standar layanan yang sama.',
    servicesTitle: 'Pilih layanan',
    servicesSub: (b: string) => `${b} · boleh lebih dari satu`,
    stylistTitle: 'Pilih stylist',
    stylistSub: (b: string) => `Tersedia di ${b}`,
    anyName: 'Siapa saja',
    anyRole: 'Kami pilihkan yang sedang tersedia',
    anyHint: 'Paling banyak pilihan jam',
    scheduleTitle: 'Pilih jadwal',
    today: 'Hari ini',
    tomorrow: 'Besok',
    slots: (n: number) => `${n} slot`,
    full: 'penuh',
    parts: ['Pagi', 'Siang', 'Sore & malam'],
    noSlots: 'Tidak ada jam tersisa di tanggal ini. Coba tanggal lain.',
    struck: 'Jam yang dicoret sudah lewat, terlalu dekat, atau sudah terisi.',
    pickDate: 'Pilih tanggal untuk melihat jam yang tersedia.',
    dataTitle: 'Hampir selesai',
    dataSub: 'Untuk konfirmasi via WhatsApp.',
    name: 'Nama lengkap',
    phone: 'Nomor WhatsApp',
    phoneHint: 'Periksa lagi nomornya (9–15 digit).',
    notes: 'Catatan untuk stylist',
    optional: '(opsional)',
    notesPh: 'Mis. rambut baru di-bleach 2 bulan lalu',
    sending: 'Mengirim…',
    send: 'Kirim permintaan booking',
    sendShort: 'Kirim',
    nextBtn: 'Lanjut',
    summary: 'Ringkasan',
    edit: 'Ubah',
    schedule: 'Jadwal',
    estimate: 'Estimasi',
    from: 'mulai',
    nServices: (n: number) => `${n} layanan`,
    pickBranch: 'Pilih cabang',
    noMenu: 'Menu layanan belum diisi.',
    picked: 'Dipilih',
    pick: 'Pilih',
    doneTitle: 'Permintaan terkirim.',
    sendWa: (b: string) => `Kirim detail ke WhatsApp ${b}`,
    home: 'Kembali ke beranda',
    errSend: 'Gagal mengirim. Coba lagi atau booking via WhatsApp.',
    errNet: 'Koneksi bermasalah. Coba lagi atau booking via WhatsApp.',
  },
  en: {
    steps: { cabang: 'Branch', layanan: 'Services', stylist: 'Stylist', jadwal: 'Schedule', data: 'Your details' },
    stepOf: (i: number, n: number) => `Step ${i} of ${n}`,
    branchTitle: 'Which branch?',
    branchSub: 'Every branch shares the same service standard.',
    servicesTitle: 'Choose services',
    servicesSub: (b: string) => `${b} · you can pick more than one`,
    stylistTitle: 'Choose a stylist',
    stylistSub: (b: string) => `Available at ${b}`,
    anyName: 'Anyone',
    anyRole: "We'll pick whoever is available",
    anyHint: 'Most time options',
    scheduleTitle: 'Choose a time',
    today: 'Today',
    tomorrow: 'Tomorrow',
    slots: (n: number) => `${n} slot${n === 1 ? '' : 's'}`,
    full: 'full',
    parts: ['Morning', 'Afternoon', 'Evening'],
    noSlots: 'No times left on this date. Please try another date.',
    struck: 'Struck-out times have passed, are too soon, or are taken.',
    pickDate: 'Choose a date to see available times.',
    dataTitle: 'Almost done',
    dataSub: "We'll confirm on WhatsApp.",
    name: 'Full name',
    phone: 'WhatsApp number',
    phoneHint: 'Please check the number (9–15 digits).',
    notes: 'Notes for the stylist',
    optional: '(optional)',
    notesPh: 'E.g. hair was bleached 2 months ago',
    sending: 'Sending…',
    send: 'Send booking request',
    sendShort: 'Send',
    nextBtn: 'Next',
    summary: 'Summary',
    edit: 'Edit',
    schedule: 'Schedule',
    estimate: 'Estimate',
    from: 'from',
    nServices: (n: number) => `${n} service${n === 1 ? '' : 's'}`,
    pickBranch: 'Choose a branch',
    noMenu: 'The service menu is not filled in yet.',
    picked: 'Selected',
    pick: 'Choose',
    doneTitle: 'Request sent.',
    sendWa: (b: string) => `Send details to ${b} on WhatsApp`,
    home: 'Back to home',
    errSend: 'Could not send. Please try again or book via WhatsApp.',
    errNet: 'Connection problem. Please try again or book via WhatsApp.',
  },
};
