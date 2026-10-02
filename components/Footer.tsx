import Image from 'next/image';
import Link from 'next/link';
import { branches, services, nav } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-ink px-6 pb-24 pt-14 text-[#C9B4AA] md:px-16 lg:px-20 lg:pb-10">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image src="/logo.png" alt="Mooi" width={1061} height={618}
            className="h-14 w-auto brightness-0 invert opacity-90" />
          <p className="mt-4 max-w-[260px] text-sm leading-relaxed">
            Hair Studio &amp; Beauty Bar dengan tiga cabang di Jakarta &amp; Tangerang. Dirawat oleh tim profesional
            sejak hari pertama.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-[12.5px] uppercase tracking-[0.2em] text-[#D9A58E]">Layanan</h4>
          <ul className="space-y-1.5 text-sm">
            {services.slice(0, 5).map((s) => <li key={s.name}>{s.name}</li>)}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-[12.5px] uppercase tracking-[0.2em] text-[#D9A58E]">Cabang</h4>
          <ul className="space-y-1.5 text-sm">
            {branches.map((b) => <li key={b.slug}>{b.name.replace('Mooi ', '')}</li>)}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-[12.5px] uppercase tracking-[0.2em] text-[#D9A58E]">Halaman</h4>
          <ul className="space-y-1.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="transition hover:text-white">{n.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1440px] flex-col gap-2 border-t border-white/10 pt-5 text-[12px] text-[#A28C82] sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Mooi Hair Studio &amp; Beauty Bar</span>
        <span>Website by Neuro Commerce</span>
      </div>
    </footer>
  );
}
