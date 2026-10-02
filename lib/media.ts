// Semua foto & video website ada di sini. Slot bernilai null akan tampil
// sebagai latar gradien beranimasi sampai diisi.
//
// Isi `src` dengan path di /public (mis. '/media/hero.mp4') atau URL penuh.
// Foto asli Mooi selalu lebih baik daripada stok — pelanggan datang untuk
// melihat salon Anda, bukan salon orang lain.

export type Photo = { src: string; alt: string; credit?: string } | null;
export type Video = { src: string; poster?: string; credit?: string } | null;

// Foto stok dari Unsplash (lisensi Unsplash: bebas dipakai komersial, tanpa
// atribusi). Dipakai sebagai ilustrasi suasana — BUKAN foto salon/hasil kerja Mooi.
// Ganti dengan foto asli Mooi secepatnya, terutama galeri.
const p = (file: string, alt: string): Photo => ({ src: `/media/${file}.jpg`, alt });

export const media = {
  // Isi dengan { src: '/media/hero.mp4', poster: '/media/hero.jpg' } untuk video latar.
  heroVideo: null as Video,
  heroPhoto: p('hero', 'Stylist mencuci rambut pelanggan di wastafel salon'),
  about: p('about', 'Perempuan dengan rambut panjang bergelombang'),
  aboutDetail: p('about-detail', 'Serum perawatan rambut dengan pipet'),
  services: {
    'Hair Cut & Styling': p('svc-haircut', 'Stylist menata rambut pelanggan'),
    'Coloring & Highlight': p('svc-coloring', 'Rambut berwarna lavender'),
    'Smoothing & Keratin': p('svc-smoothing', 'Rambut dikeringkan dan diluruskan'),
    'Hair Spa & Treatment': p('svc-spa', 'Pelanggan menikmati cuci rambut'),
    'Beauty Bar': p('svc-beauty', 'Kuku dengan cat gelap'),
    'Bridal & Event': p('svc-bridal', 'Makeup artist merias wajah'),
  } as Record<string, Photo>,
  gallery: [
    p('g-styling', 'Penataan rambut sanggul'),
    p('g-nails', 'Kuku dengan warna pastel'),
    p('g-facial', 'Perawatan wajah dengan masker'),
    p('g-makeup', 'Produk makeup'),
    p('g-blowdry', 'Pengering rambut dan kopi'),
    p('g-tools', 'Sisir, sikat, dan pengering rambut'),
  ] as Photo[],
  // Foto detail, bukan interior — sampai ada foto asli tiap cabang.
  branches: {
    kedoya: p('br-1', 'Minyak perawatan diteteskan ke tangan'),
    'alam-sutera': p('br-2', 'Lilin dan botol minyak aromaterapi'),
    'kelapa-gading': p('br-3', 'Masker rambut'),
  } as Record<string, Photo>,
  cta: p('cta', 'Perawatan dengan minyak hangat'),
};
