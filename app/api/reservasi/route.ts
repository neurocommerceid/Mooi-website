import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/anon';
import { getContent } from '@/lib/cms/get';

const str = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) ?? {};

    // Honeypot terisi = bot. Balas sukses supaya bot tidak mencoba lagi.
    if (str(body.website, 200)) return NextResponse.json({ ok: true });

    const nama = str(body.nama, 100);
    const whatsapp = str(body.whatsapp, 20).replace(/[^\d+]/g, '');
    const cabang = str(body.cabang, 100);
    const layanan = str(body.layanan, 100);
    const tanggal = str(body.tanggal, 10);
    const catatan = str(body.catatan, 1000);

    if (!nama || !whatsapp || !cabang) {
      return NextResponse.json({ error: 'Nama, WhatsApp, dan cabang wajib diisi.' }, { status: 400 });
    }
    if (!/^\+?\d{9,15}$/.test(whatsapp)) {
      return NextResponse.json({ error: 'Nomor WhatsApp tidak valid.' }, { status: 400 });
    }
    const content = await getContent();
    if (!content.branches.items.some((b) => b.name === cabang)) {
      return NextResponse.json({ error: 'Cabang tidak dikenal.' }, { status: 400 });
    }
    if (layanan && !content.services.items.some((s) => s.name === layanan)) {
      return NextResponse.json({ error: 'Layanan tidak dikenal.' }, { status: 400 });
    }
    if (tanggal && !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
      return NextResponse.json({ error: 'Tanggal tidak valid.' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase belum dikonfigurasi.' }, { status: 500 });
    }

    const { error } = await supabase.from('reservasi').insert({
      nama,
      whatsapp,
      cabang,
      layanan: layanan || null,
      tanggal: tanggal || null,
      catatan: catatan || null,
    });

    if (error) {
      console.error('reservasi insert failed:', error.message);
      return NextResponse.json(
        { error: 'Gagal menyimpan. Silakan reservasi via WhatsApp.' },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }
}
