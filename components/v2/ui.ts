// Gaya dasar desain v2 — palet dari materi brand Mooi: putih mutiara, bronze, champagne.
export const btnDark =
  'btn-bronze inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium md:px-6 md:py-3.5 md:text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-mid';
export const btnLine =
  'inline-flex items-center justify-center gap-2 rounded-full border border-cocoa/25 px-5 py-3 text-[14px] md:px-6 md:py-3.5 md:text-[15px] font-medium text-cocoa transition-colors hover:border-cocoa hover:bg-white/60';
export const link = 'font-medium text-[#7B5435] underline decoration-[#7B5435]/30 underline-offset-4 hover:decoration-[#7B5435]';
export const h2 = 'metal-text font-display text-[1.65rem] font-normal leading-[1.1] tracking-[-0.015em] md:text-[2.75rem]';
export const muted = 'text-[#7A6352]';
export const wrap = 'mx-auto w-full max-w-[1200px] px-4 md:px-10';

import type { Lang } from '@/lib/i18n';

// Bahasa Indonesia di alamat utama, bahasa Inggris di bawah /en.
const BASE = '';
export const P = (path: string, lang: Lang = 'id') => {
  const root = BASE + (lang === 'en' ? '/en' : '');
  return path === '/' ? root || '/' : root + path;
};
/** Alamat halaman yang sama dalam bahasa lain. */
export const switchLang = (pathname: string, to: Lang) => {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  let bare = rest === '/en' ? '' : rest.startsWith('/en/') ? rest.slice(3) : rest;
  if (bare === '/') bare = '';
  return BASE + (to === 'en' ? '/en' : '') + bare || '/';
};
export const short = (name: string) => name.replace(/^Mooi\s+/i, '');
