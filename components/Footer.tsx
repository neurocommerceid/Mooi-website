import Image from 'next/image';
import Link from 'next/link';
import type { Content } from '@/lib/cms/content';
import { nav } from '@/lib/nav';

export default function Footer({ c }: { c: Content }) {
  const cols: [string, { label: string; href: string }[]][] = [
    ['Layanan', c.services.items.map((s) => ({ label: s.name, href: '/layanan' }))],
    ['Cabang', c.branches.items.map((b) => ({ label: b.name.replace(/^Mooi\s+/, ''), href: '/lokasi' }))],
    ['Halaman', nav],
  ];
  return (
    <footer className="bg-espresso-soft px-6 pb-28 pt-20 text-ivory/60 md:px-16 lg:px-24 lg:pb-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="hairline" />
        <div className="grid gap-12 pt-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Image src="/logo.png" alt="Mooi" width={1061} height={618} className="h-16 w-auto" />
            <p className="mt-6 max-w-[280px] text-sm leading-relaxed">{c.settings.footerText}</p>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-5 text-[11px] uppercase tracking-luxe text-gold">{title}</h4>
              <ul className="space-y-2.5 text-sm">
                {links.map((l, i) => (
                  <li key={`${l.label}-${i}`}>
                    <Link href={l.href} className="transition-colors duration-300 hover:text-ivory">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-espresso-line pt-6 text-[11px] uppercase tracking-[0.2em] text-ivory/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Mooi Hair Studio &amp; Beauty Bar</span>
          <span>Website by Neuro Commerce</span>
        </div>
      </div>
    </footer>
  );
}
