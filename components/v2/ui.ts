// Gaya dasar desain v2 — palet dari materi brand Mooi: putih mutiara, bronze, champagne.
export const btnDark =
  'btn-bronze inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-mid';
export const btnLine =
  'inline-flex items-center justify-center gap-2 rounded-full border border-cocoa/25 px-6 py-3.5 text-[15px] font-medium text-cocoa transition-colors hover:border-cocoa hover:bg-white/60';
export const link = 'font-medium text-[#7B5435] underline decoration-[#7B5435]/30 underline-offset-4 hover:decoration-[#7B5435]';
export const h2 = 'metal-text font-display text-[2rem] font-normal leading-[1.08] tracking-[-0.015em] md:text-[2.75rem]';
export const muted = 'text-[#7A6352]';
export const wrap = 'mx-auto w-full max-w-[1200px] px-5 md:px-10';

// Semua halaman desain baru ada di bawah /v2 sampai disetujui. Saat dipindah
// ke alamat utama, cukup ubah BASE menjadi ''.
const BASE = '/v2';
export const P = (path: string) => (path === '/' ? BASE || '/' : BASE + path);
export const short = (name: string) => name.replace(/^Mooi\s+/i, '');
