'use client';
import { useEffect, useRef, useState } from 'react';
import { waLink } from '@/lib/cms/content';

export type Contact = { name: string; wa: string };

const Icon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
  </svg>
);

/**
 * Tombol WhatsApp yang menanyakan cabang lebih dulu, lalu membuka WhatsApp
 * cabang tersebut. Bila hanya ada satu cabang bernomor, langsung dibuka.
 */
export default function WaChooser({
  contacts, greeting, label, className = '', variant = 'button', placement = 'top', wrapClassName = 'relative inline-flex',
  heading = 'Chat dengan cabang', pickLabel = 'Chat WhatsApp — pilih cabang',
}: {
  contacts: Contact[]; greeting: string; label: React.ReactNode; className?: string;
  variant?: 'button' | 'fab'; placement?: 'top' | 'bottom' | 'top-end'; wrapClassName?: string;
  heading?: string; pickLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  if (!contacts.length) return null;
  const msg = (c: Contact) => greeting.replace(/\bMooi\b/, c.name);
  const single = contacts.length === 1 ? contacts[0] : null;

  const trigger =
    variant === 'fab' ? (
      <>
        <span className="relative flex h-7 w-7 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:2.5s]" />
          <Icon className="relative h-6 w-6 text-gold-light" />
        </span>
        <span className="hidden text-[11px] uppercase tracking-[0.22em] lg:inline">{label}</span>
      </>
    ) : (
      label
    );

  return (
    <div ref={box} className={variant === 'fab' ? 'fixed bottom-5 right-5 z-50 lg:bottom-8 lg:right-8' : wrapClassName}>
      {single ? (
        <a href={waLink(single.wa, msg(single))} target="_blank" rel="noopener" aria-label={`WhatsApp ${single.name}`} className={className}>
          {trigger}
        </a>
      ) : (
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" aria-label={pickLabel} className={className}>
          {trigger}
        </button>
      )}

      {open && (
        <div role="menu"
          className={`animate-pop absolute z-50 w-[280px] overflow-hidden rounded-2xl border border-line bg-ivory text-left text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,.45)] ${
            variant === 'fab' || placement === 'top-end' ? 'bottom-[calc(100%+12px)] right-0' : placement === 'top' ? 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2' : 'left-1/2 top-[calc(100%+10px)] -translate-x-1/2'
          }`}>
          <p className="px-5 pb-2 pt-4 text-[11px] uppercase tracking-[0.2em] text-gold-deep">{heading}</p>
          {contacts.map((c) => (
            <a key={c.name} role="menuitem" href={waLink(c.wa, msg(c))} target="_blank" rel="noopener" onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-t border-line/70 px-5 py-3.5 transition hover:bg-ivory-soft">
              <Icon className="h-5 w-5 shrink-0 text-[#25D366]" />
              <span className="flex-1">
                <span className="block text-[15px]">{c.name.replace(/^Mooi\s+/, '')}</span>
                <span className="block text-[12px] text-ink-faint">+{c.wa.replace(/^(\d{2})(\d{3})(\d{4})(\d+)$/, '$1 $2-$3-$4')}</span>
              </span>
              <span className="text-ink-faint">→</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
