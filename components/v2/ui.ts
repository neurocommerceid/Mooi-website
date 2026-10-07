// Gaya dasar desain v2 — tombol sederhana, tanpa efek kilau.
export const btnDark =
  'inline-flex items-center justify-center gap-2 rounded-full bg-espresso px-6 py-3.5 text-[15px] font-medium text-ivory transition-colors hover:bg-[#3A2C27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep';
export const btnLine =
  'inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-3.5 text-[15px] font-medium text-ink transition-colors hover:border-ink hover:bg-white/60';
export const link = 'font-medium text-[#8A543B] underline decoration-[#8A543B]/30 underline-offset-4 hover:decoration-[#8A543B]';
export const h2 = 'font-display text-[2rem] font-normal leading-[1.08] tracking-[-0.015em] md:text-[2.75rem]';
export const muted = 'text-[#6B5A52]';
export const wrap = 'mx-auto w-full max-w-[1200px] px-5 md:px-10';

// Semua halaman desain baru ada di bawah /v2 sampai disetujui. Saat dipindah
// ke alamat utama, cukup ubah BASE menjadi ''.
const BASE = '/v2';
export const P = (path: string) => (path === '/' ? BASE || '/' : BASE + path);
export const short = (name: string) => name.replace(/^Mooi\s+/i, '');
