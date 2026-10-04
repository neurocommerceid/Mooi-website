// Logika jadwal booking — dipakai di browser (menampilkan slot) dan di server
// (memvalidasi permintaan), supaya aturannya selalu sama.
import type { BookingService, Content, Stylist } from './cms/content';

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

export const stylistsAt = (stylists: Stylist[], branch: string) =>
  stylists.filter((s) => s.name && (!s.branches?.length || s.branches.includes(branch)));

export function findServices(categories: Content['booking']['categories'], names: string[]) {
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
 * (leadMinutes), layanan tidak selesai sebelum tutup, atau bentrok dengan
 * booking yang SUDAH DIKONFIRMASI admin untuk stylist tersebut. Untuk
 * "Siapa saja", slot tertutup hanya bila semua stylist di cabang sibuk.
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

  const busy = (who: string, t: number) =>
    opts.taken.some((x) => x.stylist === who && overlaps(t, dur, toMin(x.jam), x.durasi || 60));

  const out: Slot[] = [];
  for (let t = opts.open; t + dur <= opts.close; t += step) {
    let ok = !pastDay && t >= earliest;
    if (ok) {
      if (opts.stylist && opts.stylist !== ANY) ok = !busy(opts.stylist, t);
      else if (opts.stylistNames.length) ok = opts.stylistNames.some((n) => !busy(n, t));
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
