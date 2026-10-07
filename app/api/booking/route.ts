import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/anon';
import { getContent } from '@/lib/cms/get';
import { ANY, addDays, branchHours, findServices, isDate, jakartaNow, menuFor, slotsFor, stylistsAt, totals, worksOn, type Taken } from '@/lib/booking';

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

// Pesan error mengikuti bahasa halaman (lang: 'en' dari halaman bahasa Inggris).
const MSG = {
  id: {
    invalid: 'Permintaan tidak valid.',
    required: 'Nama dan nomor WhatsApp wajib diisi.',
    phone: 'Nomor WhatsApp tidak valid.',
    branch: 'Cabang tidak dikenal.',
    services: 'Pilih minimal satu layanan yang tersedia.',
    stylist: 'Stylist tidak tersedia di cabang ini.',
    date: 'Tanggal di luar jangkauan booking.',
    offDuty: 'Stylist tidak bertugas di tanggal tersebut.',
    nobody: 'Tidak ada stylist yang bertugas di tanggal tersebut.',
    config: 'Sistem booking belum dikonfigurasi.',
    slot: 'Jam tersebut tidak lagi tersedia. Silakan pilih jam lain.',
    limit: 'Terlalu banyak permintaan booking. Silakan hubungi cabang via WhatsApp.',
    save: 'Gagal menyimpan. Silakan booking via WhatsApp.',
  },
  en: {
    invalid: 'Invalid request.',
    required: 'Name and WhatsApp number are required.',
    phone: 'Invalid WhatsApp number.',
    branch: 'Unknown branch.',
    services: 'Please choose at least one available service.',
    stylist: 'This stylist is not available at this branch.',
    date: 'Date is outside the booking range.',
    offDuty: 'This stylist is not working on that date.',
    nobody: 'No stylist is working on that date.',
    config: 'The booking system is not configured yet.',
    slot: 'That time is no longer available. Please choose another time.',
    limit: 'Too many booking requests. Please contact the branch on WhatsApp.',
    save: 'Could not save. Please book via WhatsApp.',
  },
};

// Semua aturan dicek ulang di server: harga & durasi dihitung dari menu CMS,
// bukan dari angka yang dikirim browser.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) ?? {};
  } catch {
    return bad(MSG.id.invalid);
  }
  const m = body.lang === 'en' ? MSG.en : MSG.id;

  if (str(body.website, 200)) return NextResponse.json({ ok: true }); // honeypot

  const nama = str(body.nama, 100);
  const whatsapp = str(body.whatsapp, 20).replace(/[^\d+]/g, '');
  const cabang = str(body.cabang, 100);
  const stylist = str(body.stylist, 100) || ANY;
  const tanggal = str(body.tanggal, 10);
  const jam = str(body.jam, 5);
  const catatan = str(body.catatan, 1000);
  const names = Array.isArray(body.layanan) ? body.layanan.filter((x): x is string => typeof x === 'string').slice(0, 15) : [];

  if (!nama || !str(body.whatsapp, 20)) return bad(m.required);
  if (!/^\+?\d{9,15}$/.test(whatsapp)) return bad(m.phone);

  const c = await getContent();
  const branch = c.branches.items.find((b) => b.name === cabang);
  if (!branch) return bad(m.branch);

  const items = findServices(menuFor(c.booking, cabang), names);
  if (!items.length || items.length !== names.length) return bad(m.services);

  const teamAll = stylistsAt(c.booking.stylists, cabang);
  if (stylist !== ANY && !teamAll.some((s) => s.name === stylist)) return bad(m.stylist);

  const today = jakartaNow().date;
  if (!isDate(tanggal) || tanggal < today || tanggal > addDays(today, Math.max(1, c.booking.daysAhead || 14))) {
    return bad(m.date);
  }

  const onDuty = teamAll.filter((s) => worksOn(s, tanggal));
  if (stylist !== ANY && !onDuty.some((s) => s.name === stylist)) return bad(m.offDuty);
  if (teamAll.length && !onDuty.length) return bad(m.nobody);
  const team = onDuty.map((s) => s.name);

  const { duration, price } = totals(items);
  if (!supabase) return bad(m.config, 500);

  let taken: Taken[] = [];
  const { data: t } = await supabase.rpc('taken_slots', { p_cabang: cabang, p_tanggal: tanggal });
  if (Array.isArray(t)) taken = t as Taken[];

  const { open, close } = branchHours(branch, tanggal);
  const slot = slotsFor({
    date: tanggal, open, close, duration, stylist, stylistNames: team, taken,
    interval: c.booking.interval, leadMinutes: c.booking.leadMinutes,
  }).find((s) => s.time === jam);
  if (!slot?.ok) return bad(m.slot, 409);

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
    // Batas spam dijaga trigger database (reservasi_guard).
    if (error.message.includes('rate_limited')) {
      return bad(m.limit, 429);
    }
    console.error('booking insert failed:', error.message);
    return bad(m.save, 500);
  }
  return NextResponse.json({ ok: true });
}
