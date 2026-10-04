import { supabaseServer } from '@/lib/supabase/server';
import { getContent } from '@/lib/cms/get';
import { stylistsAt } from '@/lib/booking';
import ReservationTable, { type Row } from '@/components/admin/ReservationTable';

export default async function Reservasi() {
  const [{ data, error }, content] = await Promise.all([
    supabaseServer()
      .from('reservasi')
      .select('id, nama, whatsapp, cabang, layanan, layanan_list, stylist, ditugaskan, tanggal, jam, durasi, estimasi, catatan, status, created_at')
      .order('created_at', { ascending: false })
      .limit(500),
    getContent(),
  ]);
  // Stylist per cabang, untuk pilihan "Ditugaskan".
  const teams = Object.fromEntries(
    content.branches.items.map((b) => [b.name, stylistsAt(content.booking.stylists, b.name).map((s) => s.name)]),
  );

  return (
    <div className="max-w-6xl">
      <h1 className="font-serif text-4xl">Reservasi</h1>
      <p className="mt-2 text-ink-muted">Permintaan dari halaman Booking. Hubungi pelanggan via WhatsApp, pilih stylist di <b>Ditugaskan</b>, lalu ubah status ke <b>Dikonfirmasi</b> — jam tersebut otomatis tertutup untuk pelanggan lain. Kotak kuning = sudah dikonfirmasi tapi belum ada stylist.</p>
      {error ? <p className="mt-6 text-red-700">Gagal memuat: {error.message}</p> : <ReservationTable rows={(data ?? []) as Row[]} teams={teams} />}
    </div>
  );
}
