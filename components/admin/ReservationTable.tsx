'use client';
import { useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { durasi, rupiah } from '@/lib/booking';

export type Row = {
  id: number; nama: string; whatsapp: string; cabang: string; layanan: string | null;
  layanan_list: { name: string; price: number; from: boolean }[] | null; stylist: string | null; ditugaskan: string | null;
  tanggal: string | null; jam: string | null; durasi: number | null; estimasi: number | null;
  catatan: string | null; status: string; created_at: string;
};

const STATUS: Record<string, string> = { baru: 'Baru', dihubungi: 'Dihubungi', dikonfirmasi: 'Dikonfirmasi', selesai: 'Selesai', batal: 'Batal' };
const tone: Record<string, string> = {
  baru: 'bg-gold/15 text-gold-deep', dihubungi: 'bg-sky-100 text-sky-800', dikonfirmasi: 'bg-violet-100 text-violet-800',
  selesai: 'bg-emerald-100 text-emerald-800', batal: 'bg-ink/10 text-ink-muted',
};

// 08xx → 628xx untuk tautan wa.me
const toWa = (n: string) => n.replace(/\D/g, '').replace(/^0/, '62');

export default function ReservationTable({ rows: initial, teams }: { rows: Row[]; teams: Record<string, string[]> }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState('semua');
  const [err, setErr] = useState('');
  const shown = useMemo(() => (filter === 'semua' ? rows : rows.filter((r) => r.status === filter)), [rows, filter]);

  async function setStatus(id: number, status: string) {
    const prev = rows;
    setRows(rows.map((r) => (r.id === id ? { ...r, status } : r)));
    const { error } = await supabaseBrowser().from('reservasi').update({ status }).eq('id', id);
    if (error) { setRows(prev); setErr(error.message); }
  }

  async function assign(id: number, ditugaskan: string) {
    const prev = rows;
    setRows(rows.map((r) => (r.id === id ? { ...r, ditugaskan: ditugaskan || null } : r)));
    const { error } = await supabaseBrowser().from('reservasi').update({ ditugaskan: ditugaskan || null }).eq('id', id);
    if (error) { setRows(prev); setErr(error.message); }
  }

  async function remove(id: number) {
    if (!confirm('Hapus reservasi ini secara permanen?')) return;
    const { error } = await supabaseBrowser().from('reservasi').delete().eq('id', id);
    if (error) setErr(error.message);
    else setRows(rows.filter((r) => r.id !== id));
  }

  const fmt = (d: string) => new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });
  const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        {['semua', ...Object.keys(STATUS)].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-[13px] ${filter === s ? 'bg-espresso text-ivory' : 'bg-white text-ink-muted hover:text-ink'}`}>
            {s === 'semua' ? 'Semua' : STATUS[s]} ({s === 'semua' ? rows.length : rows.filter((r) => r.status === s).length})
          </button>
        ))}
      </div>
      {err && <p className="mt-4 text-sm text-red-700">{err}</p>}

      {shown.length === 0 ? (
        <p className="mt-10 text-ink-muted">Belum ada reservasi.</p>
      ) : (
        <div className="mt-6 grid gap-3">
          {shown.map((r) => (
            <article key={r.id} className="grid gap-4 rounded-xl border border-line bg-white p-5 md:grid-cols-[1.3fr_1fr_auto] md:items-center">
              <div>
                <p className="font-medium">{r.nama}</p>
                <a href={`https://wa.me/${toWa(r.whatsapp)}?text=${encodeURIComponent(
                  `Halo ${r.nama}, kami dari ${r.cabang}. Booking Anda${r.tanggal ? ` untuk ${fmtDate(r.tanggal)}${r.jam ? ` pukul ${r.jam}` : ''}` : ''}${r.stylist && r.stylist !== 'Siapa saja' ? ` dengan ${r.stylist}` : ''} sudah kami terima. `
                )}`}
                  target="_blank" rel="noopener" className="text-[14px] text-gold-deep hover:underline">
                  {r.whatsapp} · WhatsApp ↗
                </a>
                <p className="mt-1 text-[12px] text-ink-faint">Masuk {fmt(r.created_at)}</p>
              </div>
              <div className="text-[14px]">
                <p className="font-medium">
                  {r.tanggal ? fmtDate(r.tanggal) : 'Tanggal belum dipilih'}{r.jam ? ` · ${r.jam}` : ''}
                  <span className="font-normal text-ink-muted"> · {r.cabang}</span>
                </p>
                {r.stylist && <p className="text-ink-muted">Pilihan pelanggan: {r.stylist}</p>}
                {(teams[r.cabang]?.length ?? 0) > 0 && (
                  <label className="mt-1 flex items-center gap-2 text-[13px]">
                    <span className="text-ink-muted">Ditugaskan:</span>
                    <select
                      value={r.ditugaskan ?? ''}
                      onChange={(e) => assign(r.id, e.target.value)}
                      className={`rounded-lg border px-2 py-1 text-[13px] ${!r.ditugaskan && (!r.stylist || r.stylist === 'Siapa saja') && r.status === 'dikonfirmasi' ? 'border-amber-400 bg-amber-50' : 'border-line bg-white'}`}
                    >
                      <option value="">{r.stylist && r.stylist !== 'Siapa saja' ? `Sesuai pilihan (${r.stylist})` : '— belum —'}</option>
                      {teams[r.cabang].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                )}
                <p className="text-ink-muted">
                  {r.layanan_list?.length ? r.layanan_list.map((l) => l.name).join(', ') : r.layanan || 'Layanan belum dipilih'}
                </p>
                {(r.estimasi ?? 0) > 0 && (
                  <p className="text-[13px] text-ink-faint">
                    Estimasi {r.layanan_list?.some((l) => l.from) ? 'mulai ' : ''}{rupiah(r.estimasi!)}{r.durasi ? ` · ${durasi(r.durasi)}` : ''}
                  </p>
                )}
                {r.catatan && <p className="mt-1 whitespace-pre-line text-[13px] text-ink-muted">“{r.catatan}”</p>}
              </div>
              <div className="flex items-center gap-2">
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)}
                  className={`rounded-full border-0 px-3 py-1.5 text-[13px] ${tone[r.status] ?? ''}`}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button onClick={() => remove(r.id)} className="px-2 text-[13px] text-ink-faint hover:text-red-700">Hapus</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
