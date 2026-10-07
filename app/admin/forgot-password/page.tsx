'use client';
import Link from 'next/link';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function ForgotPassword() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email')).trim();
    setBusy(true);
    setError('');
    try {
      const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setError('Email reset belum dapat dikirim. Tunggu sebentar lalu coba lagi.');
    } finally { setBusy(false); }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-espresso px-6">
      <div className="w-full max-w-sm rounded-2xl bg-ivory p-8 shadow-2xl">
        <h1 className="font-serif text-3xl">Lupa password</h1>
        {sent ? <p role="status" className="mt-4 text-sm leading-relaxed">Jika email terdaftar, tautan reset akan dikirim. Periksa inbox dan spam. Buka tautan di browser yang sama dengan halaman ini.</p> : (
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="text-sm">Email admin
              <input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-gold" />
            </label>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button className="btn w-full disabled:opacity-60" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim tautan reset'}</button>
          </form>
        )}
        <Link href="/admin/login" className="mt-6 block text-sm text-gold underline">Kembali ke login</Link>
      </div>
    </main>
  );
}
