import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminProfile, supabaseServer } from '@/lib/supabase/server';
import { canEditSection, canManageAdmins, canReservasi, isSuper } from '@/lib/access';
import { schema } from '@/lib/cms/schema';
import { sectionKeys } from '@/lib/cms/content';
import LogoutButton from '@/components/admin/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function Panel({ children }: { children: React.ReactNode }) {
  const admin = await adminProfile();
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

  const sections = sectionKeys.filter((k) => !schema[k].legacy && canEditSection(admin, k));
  const link = 'block rounded-lg px-3 py-2 text-[14px] text-ivory/70 transition hover:bg-white/5 hover:text-ivory';

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[260px_1fr]">
      <aside className="bg-cocoa-dark px-4 py-6 text-pearl lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <Link href="/admin" className="block px-3">
          <Image src="/logo.png" alt="Mooi" width={1061} height={618} className="h-10 w-auto" />
        </Link>
        <nav className="mt-8 space-y-1">
          <Link href="/admin" className={link}>Ringkasan</Link>
          {canReservasi(admin) && <Link href="/admin/reservasi" className={link}>Reservasi</Link>}
          {sections.length > 0 && <p className="px-3 pb-1 pt-5 text-[10px] uppercase tracking-[0.2em] text-champagne">Konten</p>}
          {sections.map((k) => (
            <Link key={k} href={`/admin/konten/${k}`} className={link}>{schema[k].title}</Link>
          ))}
          {canManageAdmins(admin) && (
            <>
              <p className="px-3 pb-1 pt-5 text-[10px] uppercase tracking-[0.2em] text-champagne">Super admin</p>
              <Link href="/admin/pengguna" className={link}>Kelola Admin</Link>
            </>
          )}
        </nav>
        <div className="mt-8 space-y-1 border-t border-cocoa-line pt-4">
          <a href="/" target="_blank" className={link}>Lihat website ↗</a>
          <LogoutButton className={`${link} w-full text-left`} />
          <p className="truncate px-3 pt-2 text-[11px] text-ivory/40">{admin.email}</p>
          <p className="px-3 text-[11px] text-champagne/70">{isSuper(admin) ? 'Super admin' : 'Admin terbatas'}</p>
        </div>
      </aside>
      <div className="px-5 py-8 md:px-10 lg:py-12">{children}</div>
    </div>
  );
}
