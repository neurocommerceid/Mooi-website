'use client';
import { useState } from 'react';
import { branches, services } from '@/lib/data';

export default function ReservationForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // currentTarget is null after the first await, so keep a reference
    const form = e.currentTarget;
    setState('sending');
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch('/api/reservasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal mengirim');
      form.reset();
      setState('ok');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setState('error');
    }
  }

  const field =
    'w-full border-0 border-b border-line bg-transparent px-0 py-4 text-[15px] font-light text-ink placeholder:text-ink-faint outline-none transition-colors duration-500 focus:border-gold focus:ring-0';

  if (state === 'ok')
    return (
      <div className="border border-line bg-ivory-soft p-10 text-center">
        <p className="font-serif text-4xl font-light italic text-gold-deep">Terima kasih.</p>
        <p className="mt-4 text-sm text-ink-muted">
          Permintaan reservasi Anda sudah kami terima. Tim Mooi akan menghubungi via WhatsApp.
        </p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="grid gap-2">
      {/* Honeypot: hidden from people, bots fill it */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <input name="nama" required maxLength={100} placeholder="Nama lengkap" className={field} />
      <input name="whatsapp" required type="tel" inputMode="tel" maxLength={20} placeholder="Nomor WhatsApp" className={field} />
      <select name="cabang" required defaultValue="" className={field}>
        <option value="" disabled>Pilih cabang</option>
        {branches.map((b) => <option key={b.slug} value={b.name}>{b.name}</option>)}
      </select>
      <select name="layanan" defaultValue="" className={field}>
        <option value="">Pilih layanan (opsional)</option>
        {services.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
      </select>
      <input name="tanggal" type="date" className={field} />
      <textarea name="catatan" rows={3} maxLength={1000} placeholder="Catatan (opsional)" className={field} />

      {state === 'error' && <p className="text-sm text-red-600">{msg}</p>}

      <button type="submit" disabled={state === 'sending'} className="btn mt-8 disabled:opacity-60">
        {state === 'sending' ? 'Mengirim…' : 'Kirim Permintaan Reservasi'}
      </button>
    </form>
  );
}
