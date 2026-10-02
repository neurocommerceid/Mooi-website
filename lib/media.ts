// Semua foto & video website ada di sini. Slot bernilai null akan tampil
// sebagai latar gradien beranimasi sampai diisi.
//
// Isi `src` dengan path di /public (mis. '/media/hero.mp4') atau URL penuh.
// Foto asli Mooi selalu lebih baik daripada stok — pelanggan datang untuk
// melihat salon Anda, bukan salon orang lain.

export type Photo = { src: string; alt: string; credit?: string } | null;
export type Video = { src: string; poster?: string; credit?: string } | null;

export const media = {
  heroVideo: null as Video,
  heroPhoto: null as Photo,
  about: null as Photo,
  aboutDetail: null as Photo,
  services: {
    'Hair Cut & Styling': null as Photo,
    'Coloring & Highlight': null as Photo,
    'Smoothing & Keratin': null as Photo,
    'Hair Spa & Treatment': null as Photo,
    'Beauty Bar': null as Photo,
    'Bridal & Event': null as Photo,
  } as Record<string, Photo>,
  gallery: [null, null, null, null, null, null] as Photo[],
  branches: {
    kedoya: null as Photo,
    'alam-sutera': null as Photo,
    'kelapa-gading': null as Photo,
  } as Record<string, Photo>,
  cta: null as Photo,
};
