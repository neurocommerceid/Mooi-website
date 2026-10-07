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
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Layanan reset belum dikonfigurasi. Hubungi pengelola Mooi.');
        return;
      }
      const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) {
        const messages: Record<string, string> = {
          over_email_send_rate_limit: 'Batas pengiriman email tercapai. Tunggu sebelum meminta tautan lagi.',
          over_request_rate_limit: 'Terlalu banyak permintaan. Tunggu sebelum mencoba lagi.',
          email_address_not_authorized: 'Pengiriman ke email ini belum diizinkan oleh layanan email. Hubungi pengelola Mooi.',
          email_provider_disabled: 'Layanan login email belum diaktifkan. Hubungi pengelola Mooi.',
          unexpected_failure: 'Layanan reset mengalami gangguan. Hubungi pengelola Mooi.',
        };
        setError(messages[error.code ?? ''] ?? (error.status === 429
          ? 'Terlalu banyak permintaan. Tunggu sebelum mencoba lagi.'
          : 'Layanan email belum dapat mengirim tautan. Hubungi pengelola Mooi.'));
        if (error.code && /^[a-z_]+$/.test(error.code)) {
          setError((message) => `${message} (Kode: ${error.code})`);
        }
        return;
      }
      setSent(true);
    } catch {
      setError('Tidak dapat terhubung ke layanan reset. Periksa koneksi dan coba lagi.');
    } finally { setBusy(false); }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pearl via-pearl-soft to-pearl-deep px-6">
      <div className="w-full max-w-sm rounded-2xl border border-pearl-line bg-white/80 p-8 shadow-[0_30px_70px_-35px_rgba(74,43,22,.45)]">
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
        <Link href="/admin/login" className="mt-6 block text-sm text-bronze-mid underline">Kembali ke login</Link>
      </div>
    </main>
  );
}
