import Link from 'next/link';
import type { Content } from '@/lib/cms/content';
import BranchStrip from './BranchStatus';
import { P, btnDark, btnLine, link, muted, wrap } from './ui';

// Paragraf pertama "Tentang Mooi" dari CMS (Konten → Intro), supaya owner yang mengendalikan isinya.
export default function Hero({ c }: { c: Content }) {
  const v = c.hero.video;
  const para = (c.intro.body ?? '').split(/\n\s*\n/)[0]?.trim();
  return (
    <section className={`${wrap} pb-12 pt-8 md:pb-16 md:pt-12`}>
      <div className="grid gap-8 md:grid-cols-2 md:items-stretch md:gap-12">
        <div className="flex flex-col justify-center md:py-6">
          <p className={`text-[14px] ${muted}`}>Kedoya · Alam Sutera · Kelapa Gading</p>
          <h1 className="mt-3 font-display text-[2.25rem] font-normal leading-[1.08] tracking-[-0.015em] md:text-[2.9rem]">
            Mooi Hair Studio &amp; Beauty Bar
          </h1>
          {para && <p className={`mt-5 text-[16px] leading-[1.75] md:text-[17px] ${muted}`}>{para}</p>}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={P('/booking')} className={btnDark}>Booking sekarang</Link>
            <Link href={P('/layanan')} className={btnLine}>Lihat harga</Link>
          </div>
          <Link href={P('/tentang')} className={`mt-6 self-start text-[15px] ${link}`}>Cerita lengkap Mooi</Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-ivory-deep md:aspect-auto md:min-h-[520px]">
          <video className="absolute inset-0 h-full w-full object-cover" poster={v.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden>
            {v.webm && <source src={v.webm} type="video/webm" />}
            {v.mp4 && <source src={v.mp4} type="video/mp4" />}
          </video>
        </div>
      </div>
      <div className="mt-8 md:mt-10">
        <BranchStrip branches={c.branches.items} fallbackWa={c.settings.whatsapp} greeting={c.settings.waGreeting} />
      </div>
    </section>
  );
}
