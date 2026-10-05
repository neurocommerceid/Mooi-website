// Logika jadwal booking — dipakai di browser (menampilkan slot) dan di server
// (memvalidasi permintaan), supaya aturannya selalu sama.
import type { BookingService, Category, Content, Stylist } from './cms/content';

export const ANY = 'Siapa saja';
const TZ_OFFSET_MIN = 7 * 60; // WIB

export const toMin = (hhmm: string) => {
  const m = /^(\d{1,2})[:.](\d{2})$/.exec(hhmm?.trim() ?? '');
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
};
export const fromMin = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

/** Tanggal (YYYY-MM-DD) dan menit sejak tengah malam, dalam WIB. */
export function jakartaNow(now = Date.now()) {
  const d = new Date(now + TZ_OFFSET_MIN * 60_000);
  return { date: d.toISOString().slice(0, 10), minutes: d.getUTCHours() * 60 + d.getUTCMinutes() };
}

export function addDays(date: string, n: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

export function branchHours(b: Content['branches']['items'][number]) {
  const open = toMin(b.open || '09:00');
  const close = toMin(b.close || '20:00');
  return { open: Number.isFinite(open) ? open : 540, close: Number.isFinite(close) ? close : 1200 };
}

// "Mooi Kelapa Gading", "Kelapa Gading", "kelapa  gading" dianggap cabang yang sama.
export const branchKey = (s: string) => (s ?? '').toLowerCase().replace(/^\s*mooi\s+/, '').replace(/\s+/g, ' ').trim();
export const sameBranch = (a: string, b: string) => !!branchKey(a) && branchKey(a) === branchKey(b);

export const stylistsAt = (stylists: Stylist[], branch: string) =>
  stylists
    .map((s) => ({ ...s, name: (s.name ?? '').trim() }))
    .filter((s) => {
      const list = (s.branches ?? []).filter((b) => b?.trim());
      return s.name && (!list.length || list.some((b) => sameBranch(b, branch)));
    });

// ---------- hari kerja stylist ----------
export const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAY_ALIAS: Record<string, number> = {
  minggu: 0, ahad: 0, sun: 0, sunday: 0, senin: 1, mon: 1, monday: 1, selasa: 2, tue: 2, tuesday: 2,
  rabu: 3, wed: 3, wednesday: 3, kamis: 4, thu: 4, thursday: 4, jumat: 5, "jum'at": 5, fri: 5, friday: 5,
  sabtu: 6, sat: 6, saturday: 6,
};
export const dayIndex = (d: string) => DAY_ALIAS[(d ?? '').toLowerCase().trim()] ?? -1;
export const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

/** Stylist bertugas pada tanggal tsb. Daftar hari kosong = setiap hari. */
export const worksOn = (s: Stylist, date: string) => {
  const days = (s.days ?? []).map(dayIndex).filter((i) => i >= 0);
  return !days.length || days.includes(weekday(date));
};
export const daysLabel = (s: Stylist) => {
  const days = (s.days ?? []).map(dayIndex).filter((i) => i >= 0).sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
  return days.length && days.length < 7 ? `Hanya ${days.map((i) => DAYS[i]).join(' & ')}` : '';
};

/** Menu untuk cabang: menu khusus cabang, atau menu umum bila tidak ada. */
export function menuFor(booking: Content['booking'], branch: string): Category[] {
  const m = (booking.menus ?? []).find((x) => (x.branches ?? []).some((b) => sameBranch(b, branch)))
    ?? (booking.menus ?? []).find((x) => !(x.branches ?? []).filter((b) => b?.trim()).length);
  return (m?.categories?.length ? m.categories : booking.categories ?? []).filter((c) => c.items?.length);
}

export function findServices(categories: Category[], names: string[]) {
  const all = categories.flatMap((c) => c.items.map((i) => ({ ...i, category: c.name })));
  return names.map((n) => all.find((i) => i.name === n)).filter(Boolean) as (BookingService & { category: string })[];
}

export const totals = (items: BookingService[]) => ({
  duration: items.reduce((a, i) => a + (Number(i.duration) || 0), 0),
  price: items.reduce((a, i) => a + (Number(i.price) || 0), 0),
  from: items.some((i) => i.from),
});

export type Taken = { stylist: string; jam: string; durasi: number };
export type Slot = { time: string; ok: boolean };

const overlaps = (a: number, aLen: number, b: number, bLen: number) => a < b + bLen && b < a + aLen;

/**
 * Slot mulai yang tersedia. Slot tertutup bila: sudah lewat / terlalu dekat
 * (leadMinutes), layanan tidak selesai sebelum tutup, atau tidak ada stylist
 * yang bebas. Booking terkonfirmasi tanpa stylist ("Siapa saja") dihitung
 * memakai satu stylist mana pun. Bila cabang tidak punya daftar stylist,
 * kapasitas tidak diketahui sehingga slot tidak pernah ditutup.
 */
export function slotsFor(opts: {
  date: string;
  open: number;
  close: number;
  interval: number;
  duration: number;
  leadMinutes: number;
  stylist: string;
  stylistNames: string[];
  taken: Taken[];
  now?: number;
}): Slot[] {
  const step = Math.max(10, opts.interval || 30);
  const dur = Math.max(step, opts.duration || step);
  const nowJ = jakartaNow(opts.now);
  const earliest = opts.date === nowJ.date ? nowJ.minutes + Math.max(0, opts.leadMinutes) : -1;
  const pastDay = opts.date < nowJ.date;
  const team = opts.stylistNames;
  const wanted = opts.stylist && opts.stylist !== ANY ? opts.stylist : '';

  const hits = (t: number) => opts.taken.filter((x) => overlaps(t, dur, toMin(x.jam), x.durasi || 60));

  const out: Slot[] = [];
  for (let t = opts.open; t + dur <= opts.close; t += step) {
    let ok = !pastDay && t >= earliest;
    if (ok && team.length) {
      const h = hits(t);
      const named = new Set(h.map((x) => x.stylist).filter((n) => team.includes(n)));
      const anon = h.filter((x) => !team.includes(x.stylist)).length; // "Siapa saja" / tak dikenal
      const free = team.filter((n) => !named.has(n));
      if (wanted) {
        // Stylist ini harus bebas, dan sisa stylist bebas lain cukup untuk booking tanpa nama.
        ok = !named.has(wanted) && free.length - 1 >= anon;
      } else {
        ok = free.length > anon;
      }
    }
    out.push({ time: fromMin(t), ok });
  }
  return out;
}

export const rupiah = (n: number) => 'Rp ' + Math.round(n || 0).toLocaleString('id-ID');
export function durasi(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return [h ? `${h} jam` : '', m ? `${m} mnt` : ''].filter(Boolean).join(' ') || '0 mnt';
}
export function tanggalPanjang(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
