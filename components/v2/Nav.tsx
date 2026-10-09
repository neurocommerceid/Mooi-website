'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ui, type Lang } from '@/lib/i18n';
import { P, btnDark, switchLang, wrap } from './ui';

function LangSwitch({ lang, path, className = '' }: { lang: Lang; path: string; className?: string }) {
  return (
    <div className={`flex items-center rounded-full border border-pearl-line bg-white/60 p-0.5 text-[12px] font-semibold ${className}`} aria-label={ui[lang].nav.lang}>
      {(['id', 'en'] as Lang[]).map((l) => (
        <Link key={l} href={switchLang(path, l)} hrefLang={l} aria-current={l === lang ? 'true' : undefined}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${l === lang ? 'bg-bronze text-pearl' : 'text-cocoa/60 hover:text-cocoa'}`}>
          {l}
        </Link>
      ))}
    </div>
  );
}

export default function Nav({ lang }: { lang: Lang }) {
  const t = ui[lang].nav;
  const path = usePathname() ?? P('/', lang);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  const links = [
    { href: P('/layanan', lang), label: t.prices },
    { href: P('/stylist', lang), label: t.stylists },
    { href: P('/cabang', lang), label: t.branches },
    { href: P('/galeri', lang), label: t.gallery },
    { href: P('/tentang', lang), label: t.about },
    { href: P('/artikel', lang), label: t.articles },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors ${scrolled || open ? 'border-b border-pearl-line bg-pearl/95 backdrop-blur' : 'border-b border-transparent bg-pearl'}`}>
      <div className={`${wrap} flex h-16 items-center justify-between md:h-[72px]`}>
        <Link href={P('/', lang)} aria-label={`Mooi — ${t.home}`} className="shrink-0">
          <Image src="/logo.png" alt="Mooi Hair Studio & Beauty Bar" width={1061} height={618} priority className="h-10 w-auto md:h-11" />
        </Link>
        <nav className="hidden items-center gap-5 text-[14px] md:flex lg:gap-7 lg:text-[15px]">
          {links.map((l) => {
            const on = path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={on ? 'page' : undefined}
                className={`relative py-1 transition-colors ${on ? 'text-cocoa' : 'text-cocoa/70 hover:text-cocoa'}`}>
                {l.label}
                {on && <span className="absolute -bottom-0.5 left-0 h-px w-full bg-bronze-mid" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch lang={lang} path={path} />
          <Link href={P('/booking', lang)} className={`${btnDark} !hidden !px-5 !py-2.5 text-[14px] md:!inline-flex`}>{t.book}</Link>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? t.closeMenu : t.openMenu}
            className="grid h-10 w-10 place-items-center rounded-full text-cocoa md:hidden">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              {open
                ? <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                : <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-pearl-line bg-pearl md:hidden">
          <div className={`${wrap} grid py-2`}>
            {[{ href: P('/', lang), label: t.home }, ...links].map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-pearl-line/70 py-3 text-[16px] last:border-0">{l.label}</Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
