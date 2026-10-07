'use client';
import Image from 'next/image';
import Link from 'next/link';
import PasswordInput from '@/components/admin/PasswordInput';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function Login() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setErr('');
    try {
      const { error } = await supabaseBrowser().auth.signInWithPassword({
        email: String(fd.get('email')).trim(),
        password: String(fd.get('password')),
      });
      if (error) {
        setErr(error.message === 'Invalid login credentials' ? 'Email atau kata sandi salah.' : error.message);
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setErr('Tidak dapat terhubung. Silakan coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  const field = 'w-full rounded-lg border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-gold';

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pearl via-pearl-soft to-pearl-deep px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-pearl-line bg-white/80 p-8 shadow-[0_30px_70px_-35px_rgba(74,43,22,.45)]">
        <Image src="/logo.png" alt="Mooi" width={1061} height={618} className="mx-auto h-16 w-auto" priority />
        <h1 className="mt-6 text-center font-serif text-3xl">Panel Admin</h1>
        <div className="mt-8 grid gap-3">
          <input name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
          <PasswordInput name="password" required autoComplete="current-password" placeholder="Kata sandi" aria-label="Kata sandi" />
        </div>
        <Link href="/admin/forgot-password" className="mt-3 block text-right text-sm text-bronze-mid underline">Lupa password?</Link>
        {err && <p className="mt-3 text-sm text-red-700">{err}</p>}
        <button disabled={busy} className="btn mt-6 w-full disabled:opacity-60">{busy ? 'Masuk…' : 'Masuk'}</button>
      </form>
    </main>
  );
}
