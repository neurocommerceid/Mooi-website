import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentAdmin, supabaseServer } from '@/lib/supabase/server';
import { schema } from '@/lib/cms/schema';
import { sectionKeys } from '@/lib/cms/content';
import LogoutButton from '@/components/admin/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function Panel({ children }: { children: React.ReactNode }) {
  const admin = await currentAdmin();
  if (!admin) {
    const { data } = await supabaseServer().auth.getUser();
    if (!data.user) redirect('/admin/login');
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-serif text-3xl">Akun ini tidak punya akses admin</h1>
          <p className="mt-3 text-sm text-ink-muted">{data.user.email} belum terdaftar sebagai admin.</p>
          <LogoutButton className="btn mt-6" />
        </div>
      </main>
    );
  }

  const link = 'block rounded-lg px-3 py-2 text-[14px] text-ivory/70 transition hover:bg-white/5 hover:text-ivory';

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[260px_1fr]">
      <aside className="bg-espresso px-4 py-6 text-ivory lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <Link href="/admin" className="block px-3">
          <Image src="/logo.png" alt="Mooi" width={1061} height={618} className="h-10 w-auto" />
        </Link>
        <nav className="mt-8 space-y-1">
          <Link href="/admin" className={link}>Ringkasan</Link>
          <Link href="/admin/reservasi" className={link}>Reservasi</Link>
          <p className="px-3 pb-1 pt-5 text-[10px] uppercase tracking-[0.2em] text-gold">Konten</p>
          {sectionKeys.filter((k) => !schema[k].legacy).map((k) => (
            <Link key={k} href={`/admin/konten/${k}`} className={link}>{schema[k].title}</Link>
          ))}
          <p className="px-3 pb-1 pt-5 text-[10px] uppercase tracking-[0.2em] text-ivory/40">Desain lama</p>
          {sectionKeys.filter((k) => schema[k].legacy).map((k) => (
            <Link key={k} href={`/admin/konten/${k}`} className={`${link} opacity-60`}>{schema[k].title}</Link>
          ))}
        </nav>
        <div className="mt-8 space-y-1 border-t border-espresso-line pt-4">
          <a href="/" target="_blank" className={link}>Lihat website ↗</a>
          <a href="/v2" target="_blank" className={link}>Lihat desain baru ↗</a>
          <LogoutButton className={`${link} w-full text-left`} />
          <p className="truncate px-3 pt-2 text-[11px] text-ivory/40">{admin}</p>
        </div>
      </aside>
      <div className="px-5 py-8 md:px-10 lg:py-12">{children}</div>
    </div>
  );
}
