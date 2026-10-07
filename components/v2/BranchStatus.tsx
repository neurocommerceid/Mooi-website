'use client';
import { useEffect, useState } from 'react';
import type { Branch } from '@/lib/cms/content';
import { branchWa, safeUrl, waLink } from '@/lib/cms/content';
import { addDays, branchHours, fromMin, jakartaNow } from '@/lib/booking';
import { short } from './ui';

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
  if (now === null) return <span className="text-[14px] text-[#7A6352]">{b.hours.split('\n')[0]}</span>;
  const s = openStatus(b, now);
  return (
    <span className="inline-flex items-center gap-2 text-[14px]">
      <span className={`h-2 w-2 rounded-full ${s.on ? 'bg-emerald-600' : 'bg-[#C9B8A8]'}`} aria-hidden />
      <span className={s.on ? 'text-emerald-800' : 'text-[#7A6352]'}>{s.text}</span>
    </span>
  );
}

/** Ringkasan cabang di beranda: status buka, WhatsApp, petunjuk arah. Booking ada di bar/nav. */
export default function BranchStrip({ branches, fallbackWa, greeting }: { branches: Branch[]; fallbackWa: string; greeting: string }) {
  return (
    <div className="grid gap-3 md:grid-cols-3 md:gap-4">
      {branches.map((b) => {
        const wa = branchWa(b, fallbackWa);
        const maps = safeUrl(b.maps);
        return (
          <div key={b.name} className="rounded-2xl border border-pearl-line bg-white/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[1.3rem] leading-tight">{short(b.name)}</p>
                <StatusDot b={b} />
              </div>
              {wa && (
                <a href={waLink(wa, `${greeting} (${b.name})`)} target="_blank" rel="noopener" aria-label={`WhatsApp ${b.name}`}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cocoa/15 text-[#1f9d55] transition-colors hover:border-cocoa">
                  <WaIcon />
                </a>
              )}
            </div>
            <p className="mt-3 line-clamp-2 text-[14px] text-[#7A6352]">{b.address}</p>
            {maps && (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[14px] font-medium text-[#7B5435]">
                <a href={maps} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:underline">
                  Petunjuk arah
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </a>
                <a href={maps} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:underline">
                  Ulasan Google
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="currentColor" d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const WaIcon = ({ className = 'h-[18px] w-[18px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" /></svg>
);
