import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/anon';
import { getContent } from '@/lib/cms/get';
import { ANY, addDays, branchHours, findServices, isDate, jakartaNow, slotsFor, stylistsAt, totals, type Taken } from '@/lib/booking';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

// Semua aturan dicek ulang di server: harga & durasi dihitung dari menu CMS,
// bukan dari angka yang dikirim browser.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) ?? {};
  } catch {
    return bad('Permintaan tidak valid.');
  }

  if (str(body.website, 200)) return NextResponse.json({ ok: true }); // honeypot

  const nama = str(body.nama, 100);
  const whatsapp = str(body.whatsapp, 20).replace(/[^\d+]/g, '');
  const cabang = str(body.cabang, 100);
  const stylist = str(body.stylist, 100) || ANY;
  const tanggal = str(body.tanggal, 10);
  const jam = str(body.jam, 5);
  const catatan = str(body.catatan, 1000);
  const names = Array.isArray(body.layanan) ? body.layanan.filter((x): x is string => typeof x === 'string').slice(0, 15) : [];

  if (!nama || !str(body.whatsapp, 20)) return bad('Nama dan nomor WhatsApp wajib diisi.');
  if (!/^\+?\d{9,15}$/.test(whatsapp)) return bad('Nomor WhatsApp tidak valid.');

  const c = await getContent();
  const branch = c.branches.items.find((b) => b.name === cabang);
  if (!branch) return bad('Cabang tidak dikenal.');

  const items = findServices(c.booking.categories, names);
  if (!items.length || items.length !== names.length) return bad('Pilih minimal satu layanan yang tersedia.');

  const team = stylistsAt(c.booking.stylists, cabang).map((s) => s.name);
  if (stylist !== ANY && !team.includes(stylist)) return bad('Stylist tidak tersedia di cabang ini.');

  const today = jakartaNow().date;
  if (!isDate(tanggal) || tanggal < today || tanggal > addDays(today, Math.max(1, c.booking.daysAhead || 14))) {
    return bad('Tanggal di luar jangkauan booking.');
  }

  const { duration, price } = totals(items);
  if (!supabase) return bad('Sistem booking belum dikonfigurasi.', 500);

  let taken: Taken[] = [];
  const { data: t } = await supabase.rpc('taken_slots', { p_cabang: cabang, p_tanggal: tanggal });
  if (Array.isArray(t)) taken = t as Taken[];

  const { open, close } = branchHours(branch);
  const slot = slotsFor({
    date: tanggal, open, close, duration, stylist, stylistNames: team, taken,
    interval: c.booking.interval, leadMinutes: c.booking.leadMinutes,
  }).find((s) => s.time === jam);
  if (!slot?.ok) return bad('Jam tersebut tidak lagi tersedia. Silakan pilih jam lain.', 409);

  // Pengunjung (anon) hanya boleh insert, tidak boleh membaca balik — jadi tanpa .select().
  const { error } = await supabase.from('reservasi').insert({
    nama,
    whatsapp,
    cabang,
    stylist,
    tanggal,
    jam,
    layanan: items.map((i) => i.name).join(', '),
    layanan_list: items.map((i) => ({ name: i.name, duration: i.duration, price: i.price, from: i.from })),
    durasi: duration,
    estimasi: price,
    catatan: catatan || null,
  });
  if (error) {
    console.error('booking insert failed:', error.message);
    return bad('Gagal menyimpan. Silakan booking via WhatsApp.', 500);
  }
  return NextResponse.json({ ok: true });
}
