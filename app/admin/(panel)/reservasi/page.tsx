import { supabaseServer } from '@/lib/supabase/server';
import ReservationTable, { type Row } from '@/components/admin/ReservationTable';

export default async function Reservasi() {
  const { data, error } = await supabaseServer()
    .from('reservasi')
    .select('id, nama, whatsapp, cabang, layanan, layanan_list, stylist, tanggal, jam, durasi, estimasi, catatan, status, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  return (
    <div className="max-w-6xl">
      <h1 className="font-serif text-4xl">Reservasi</h1>
      <p className="mt-2 text-ink-muted">Permintaan dari halaman Booking. Hubungi pelanggan via WhatsApp, lalu ubah status ke <b>Dikonfirmasi</b> — jam tersebut otomatis tertutup untuk pelanggan lain.</p>
      {error ? <p className="mt-6 text-red-700">Gagal memuat: {error.message}</p> : <ReservationTable rows={(data ?? []) as Row[]} />}
    </div>
  );
}
