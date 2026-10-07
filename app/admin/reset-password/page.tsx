'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PasswordInput from '@/components/admin/PasswordInput';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function check() {
      try {
        // SDK memproses code PKCE atau token recovery sebelum getSession selesai.
        const sb = supabaseBrowser();
        const { data, error } = await sb.auth.getSession();
        if (error || !data.session) throw new Error('invalid session');
        const { data: user, error: userError } = await sb.auth.getUser();
        if (userError || !user.user) throw new Error('invalid user');
        if (active) setReady(true);
      } catch {
        if (active) setError('Tautan tidak valid atau sudah kedaluwarsa. Minta tautan baru dan buka di browser yang sama.');
      } finally { if (active) setChecking(false); }
    }
    void check();
    return () => { active = false; };
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get('password'));
    if (password !== String(fd.get('confirm'))) { setError('Konfirmasi kata sandi tidak sama.'); return; }
    setBusy(true);
    setError('');
    try {
      const { error } = await supabaseBrowser().auth.updateUser({ password });
      if (error) { setError(error.message); return; }
      setDone(true);
      setReady(false);
      // Tutup sesi recovery sebelum login ulang dengan kata sandi baru.
      await supabaseBrowser().auth.signOut({ scope: 'local' });
    } catch { setError('Koneksi bermasalah. Silakan coba lagi.'); }
    finally { setBusy(false); }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-espresso px-6">
      <div className="w-full max-w-sm rounded-2xl bg-ivory p-8 shadow-2xl">
        <h1 className="font-serif text-3xl">Kata sandi baru</h1>
        {checking && <p role="status" className="mt-4 text-sm">Memeriksa tautan…</p>}
        {done && <p role="status" className="mt-4 text-sm">Kata sandi berhasil diganti. Silakan login dengan kata sandi baru.</p>}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        {ready && <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">Kata sandi baru<PasswordInput name="password" autoComplete="new-password" required minLength={8} placeholder="Minimal 8 karakter" /></label>
          <label className="grid gap-2 text-sm">Ulangi kata sandi<PasswordInput name="confirm" autoComplete="new-password" required minLength={8} /></label>
          <button className="btn w-full disabled:opacity-60" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan kata sandi'}</button>
        </form>}
        {!checking && !ready && !done && <Link href="/admin/forgot-password" className="mt-6 block text-sm text-gold underline">Minta tautan baru</Link>}
        <Link href="/admin/login" className="mt-6 block text-sm text-gold underline">Kembali ke login</Link>
      </div>
    </main>
  );
}
