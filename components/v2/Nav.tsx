'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { P, btnDark, wrap } from './ui';

const links = [
  { href: P('/layanan'), label: 'Harga' },
  { href: P('/cabang'), label: 'Cabang' },
  { href: P('/galeri'), label: 'Galeri' },
  { href: P('/tentang'), label: 'Tentang' },
];

export default function Nav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  return (
    <header className={`sticky top-0 z-40 transition-colors ${scrolled || open ? 'border-b border-line bg-ivory/95 backdrop-blur' : 'border-b border-transparent bg-ivory'}`}>
      <div className={`${wrap} flex h-16 items-center justify-between md:h-[72px]`}>
        <Link href={P('/')} aria-label="Mooi — Beranda" className="shrink-0">
          <Image src="/logo.png" alt="Mooi Hair Studio & Beauty Bar" width={1061} height={618} priority className="h-10 w-auto md:h-11" />
        </Link>
        <nav className="hidden items-center gap-8 text-[15px] md:flex">
          {links.map((l) => {
            const on = path?.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={on ? 'page' : undefined}
                className={`relative py-1 transition-colors ${on ? 'text-ink' : 'text-ink/70 hover:text-ink'}`}>
                {l.label}
                {on && <span className="absolute -bottom-0.5 left-0 h-px w-full bg-gold-deep" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={P('/booking')} className={`${btnDark} !px-5 !py-2.5 text-[14px]`}>Booking</Link>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Tutup menu' : 'Buka menu'}
            className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              {open
                ? <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                : <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-ivory md:hidden">
          <div className={`${wrap} grid py-2`}>
            {[{ href: P('/'), label: 'Beranda' }, ...links].map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-line/70 py-3.5 text-[17px] last:border-0">{l.label}</Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
