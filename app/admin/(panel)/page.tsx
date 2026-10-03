import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { schema } from '@/lib/cms/schema';
import { sectionKeys } from '@/lib/cms/content';

export default async function Dashboard() {
  const sb = supabaseServer();
  const [{ count: baru }, { data: rows }] = await Promise.all([
    sb.from('reservasi').select('id', { count: 'exact', head: true }).eq('status', 'baru'),
    sb.from('site_content').select('key, updated_at, updated_by'),
  ]);
  const meta = Object.fromEntries((rows ?? []).map((r) => [r.key, r]));
  const fmt = (d: string) => new Date(d).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-4xl">Ringkasan</h1>

      <Link href="/admin/reservasi" className="mt-8 flex items-center justify-between rounded-2xl bg-espresso p-6 text-ivory transition hover:bg-espresso-soft">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Reservasi baru</p>
          <p className="mt-1 font-serif text-5xl">{baru ?? 0}</p>
        </div>
        <span className="text-sm text-ivory/70">Lihat semua →</span>
      </Link>

      <h2 className="mt-12 font-serif text-2xl">Konten website</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {sectionKeys.map((k) => (
          <Link key={k} href={`/admin/konten/${k}`} className="rounded-xl border border-line bg-white p-5 transition hover:border-gold">
            <p className="font-medium">{schema[k].title}</p>
            <p className="mt-1 text-sm text-ink-muted">{schema[k].desc}</p>
            <p className="mt-3 text-[12px] text-ink-faint">
              {meta[k] ? `Diubah ${fmt(meta[k].updated_at)}${meta[k].updated_by ? ` oleh ${meta[k].updated_by}` : ''}` : 'Masih memakai isi bawaan'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
