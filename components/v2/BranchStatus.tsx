'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Branch } from '@/lib/cms/content';
import { branchWa, waLink } from '@/lib/cms/content';
import { addDays, branchHours, fromMin, jakartaNow } from '@/lib/booking';

const jam = (m: number) => fromMin(m).replace(':', '.');

/** Status buka/tutup saat ini (WIB). Dihitung di browser agar tidak ikut ter-cache. */
export function openStatus(b: Branch, now = Date.now()) {
  const { date, minutes } = jakartaNow(now);
  const { open, close } = branchHours(b, date);
  if (minutes < open) return { on: false, text: `Tutup · buka ${jam(open)}` };
  if (minutes < close) return { on: true, text: close - minutes <= 60 ? `Segera tutup · ${jam(close)}` : `Buka · sampai ${jam(close)}` };
  return { on: false, text: `Tutup · buka besok ${jam(branchHours(b, addDays(date, 1)).open)}` };
}

export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function StatusDot({ b }: { b: Branch }) {
  const now = useNow();
  if (now === null) return <span className="text-[14px] text-[#6B5A52]">{b.hours.split('\n')[0]}</span>;
  const s = openStatus(b, now);
  return (
    <span className="inline-flex items-center gap-2 text-[14px]">
      <span className={`h-2 w-2 rounded-full ${s.on ? 'bg-emerald-600' : 'bg-[#B9A89D]'}`} aria-hidden />
      <span className={s.on ? 'text-emerald-800' : 'text-[#6B5A52]'}>{s.text}</span>
    </span>
  );
}

/** Daftar cabang ringkas di hero: nama, status, booking & WhatsApp. */
export default function BranchStatus({ branches, fallbackWa, greeting }: { branches: Branch[]; fallbackWa: string; greeting: string }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {branches.map((b) => {
        const wa = branchWa(b, fallbackWa);
        const short = b.name.replace(/^Mooi\s+/i, '');
        return (
          <li key={b.name} className="flex items-center justify-between gap-3 py-3.5">
            <div className="min-w-0">
              <p className="font-medium">{short}</p>
              <StatusDot b={b} />
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {wa && (
                <a href={waLink(wa, `${greeting} (${b.name})`)} target="_blank" rel="noopener"
                  aria-label={`WhatsApp ${b.name}`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink/80 transition-colors hover:border-ink hover:text-ink">
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" /></svg>
                </a>
              )}
              <Link href={`/booking?cabang=${encodeURIComponent(b.name)}`}
                className="rounded-full border border-ink/15 px-4 py-2 text-[14px] font-medium transition-colors hover:border-ink">
                Booking
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
