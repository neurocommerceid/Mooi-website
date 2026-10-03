'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { nav } from '@/lib/nav';

export default function Navbar({ wa }: { wa: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ${
        solid ? 'bg-espresso/90 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,.6)] backdrop-blur-md' : 'bg-transparent py-6'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24">
        <Link href="/" className="shrink-0" aria-label="Mooi — Beranda">
          <Image
            src="/logo.png"
            alt="Mooi Hair Studio & Beauty Bar"
            width={1061}
            height={618}
            priority
            className={`w-auto transition-all duration-700 ${solid ? 'h-10' : 'h-12 md:h-14'}`}
          />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {nav.map((n) => {
            const active = n.href === '/' ? path === '/' : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`group relative text-[12px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                  active ? 'text-gold-light' : 'text-ivory/75 hover:text-ivory'
                }`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-gold-light transition-all duration-500 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <a href={wa} target="_blank" rel="noopener" className="btn hidden !px-7 !py-3 lg:inline-flex">
          Reservasi
        </a>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          className="relative h-10 w-10 lg:hidden"
        >
          <span className={`absolute left-2 right-2 h-px bg-ivory transition-all duration-500 ${open ? 'top-1/2 rotate-45' : 'top-[38%]'}`} />
          <span className={`absolute left-2 right-2 h-px bg-ivory transition-all duration-500 ${open ? 'top-1/2 -rotate-45' : 'top-[62%]'}`} />
        </button>
      </div>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-700 lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <nav className="min-h-0 px-6">
          <div className="pb-8 pt-6">
            {nav.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                className="block border-b border-espresso-line py-4 font-serif text-3xl font-light text-ivory transition-all duration-700"
                style={{ transitionDelay: open ? `${i * 60}ms` : '0ms', opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(12px)' }}
              >
                {n.label}
              </Link>
            ))}
            <a href={wa} target="_blank" rel="noopener" className="btn mt-8 w-full">
              Reservasi via WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
