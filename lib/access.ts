// Hak akses admin. Pembatasan sesungguhnya dijaga database (RLS + trigger,
// lihat supabase/migrations/20261009_admin_roles.sql); panel hanya menyesuaikan tampilan.
import type { SectionKey } from './cms/content';

export type Perm = 'konten' | 'cabang' | 'harga' | 'stylist' | 'booking' | 'reservasi' | 'hapus_reservasi';
export type AdminProfile = { email: string; name: string | null; role: 'super' | 'staff'; permissions: Perm[]; branches: string[] };

export const PERMS: { key: Perm; label: string; desc: string; warn?: string }[] = [
  { key: 'konten', label: 'Teks & foto website', desc: 'Teks beranda & halaman, video hero, profil, ulasan, bahasa Inggris, pengaturan umum.' },
  { key: 'cabang', label: 'Data cabang', desc: 'Alamat, jam buka, WhatsApp, Maps, Instagram, foto & galeri cabang.' },
  { key: 'harga', label: 'Menu & harga', desc: 'Daftar layanan dan harga per cabang.', warn: 'Harga harus sesuai price list resmi — berikan hanya ke orang yang dipercaya.' },
  { key: 'stylist', label: 'Stylist', desc: 'Nama, foto, keahlian, cabang, dan hari kerja stylist.' },
  { key: 'booking', label: 'Pengaturan booking', desc: 'Jarak slot, batas waktu booking, ketentuan, pesan setelah booking.' },
  { key: 'reservasi', label: 'Lihat & kelola reservasi', desc: 'Melihat data pelanggan, mengubah status & stylist yang ditugaskan.' },
  { key: 'hapus_reservasi', label: 'Hapus reservasi', desc: 'Menghapus reservasi secara permanen.' },
];
export const permLabel = (p: string) => PERMS.find((x) => x.key === p)?.label ?? p;

/** Bagian konten → hak akses (sama dengan public.content_perm di database). */
const SECTION_PERM: Partial<Record<SectionKey, Perm | 'booking*'>> = {
  home: 'konten', en: 'konten', hero: 'konten', intro: 'konten', about: 'konten', testimonial: 'konten', settings: 'konten',
  branches: 'cabang',
  booking: 'booking*',
};

// Menu "Kelola Admin" disembunyikan sampai fitur diumumkan ke owner.
// Aktifkan dengan env SHOW_KELOLA_ADMIN=1 di Vercel (lalu redeploy). Hak akses di database tetap berlaku.
export const ADMIN_MANAGEMENT_ENABLED = process.env.SHOW_KELOLA_ADMIN === '1';

export const isSuper = (a: AdminProfile | null) => a?.role === 'super';
export const can = (a: AdminProfile | null, p: Perm) => !!a && (a.role === 'super' || a.permissions.includes(p));

export function canEditSection(a: AdminProfile | null, key: SectionKey) {
  if (isSuper(a)) return true;
  const need = SECTION_PERM[key];
  if (!need) return false;
  if (need === 'booking*') return can(a, 'harga') || can(a, 'stylist') || can(a, 'booking');
  return can(a, need);
}

/** Field bagian Booking yang boleh diedit: menu → harga, stylist → stylist, sisanya → pengaturan booking. */
export function bookingFieldAllowed(a: AdminProfile | null, fieldKey: string) {
  if (isSuper(a)) return true;
  if (fieldKey === 'menus' || fieldKey === 'categories') return can(a, 'harga');
  if (fieldKey === 'stylists') return can(a, 'stylist');
  return can(a, 'booking');
}

export const canReservasi = (a: AdminProfile | null) => can(a, 'reservasi');
/** Cabang reservasi yang boleh dilihat; null = semua cabang. */
export const reservasiBranches = (a: AdminProfile | null) => (isSuper(a) || !a?.branches.length ? null : a.branches);
