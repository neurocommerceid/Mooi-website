'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { nav, waLink } from '@/lib/data';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-3.5 md:px-16 lg:px-20">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="Mooi Hair Studio & Beauty Bar" width={1061} height={618}
            className="h-11 w-auto md:h-14" priority />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              className="text-[14.5px] tracking-wide text-ink-muted transition hover:text-rose-deep">
              {n.label}
            </Link>
          ))}
        </nav>

        <a href={waLink()} target="_blank" rel="noopener"
          className="btn hidden !px-7 !py-2.5 !text-[13.5px] lg:inline-flex">Reservasi</a>

        <button onClick={() => setOpen(!open)} aria-label="Menu"
          className="text-2xl text-rose-deep lg:hidden">{open ? '✕' : '☰'}</button>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-6 pb-5 pt-2 lg:hidden">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="block py-2.5 text-[15px] text-ink-muted">{n.label}</Link>
          ))}
          <a href={waLink()} target="_blank" rel="noopener" className="btn mt-3 w-full">Reservasi via WhatsApp</a>
        </nav>
      )}
    </header>
  );
}
