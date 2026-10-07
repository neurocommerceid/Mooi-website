import Link from 'next/link';
import type { Content } from '@/lib/cms/content';
import BranchStatus from './BranchStatus';
import { btnDark, btnLine, muted, wrap } from './ui';

export default function Hero({ c }: { c: Content }) {
  const v = c.hero.video;
  return (
    <section className={`${wrap} grid gap-10 pb-16 pt-8 md:grid-cols-[1.1fr_.9fr] md:items-center md:gap-14 md:pb-24 md:pt-14`}>
      <div>
        <p className={`text-[14px] ${muted}`}>Sejak 2019 · Jakarta &amp; Tangerang</p>
        <h1 className="mt-4 font-display text-[2.5rem] font-normal leading-[1.04] tracking-[-0.02em] md:text-[3.6rem] lg:text-[4.1rem]">
          Salon rambut &amp; beauty bar di Kedoya, Alam Sutera, dan Kelapa Gading.
        </h1>
        <p className={`mt-5 max-w-[34rem] text-[17px] ${muted}`}>
          Haircut, coloring, smoothing, hair spa, sampai nail &amp; lash. Pilih cabang, layanan, stylist, dan jam
          sendiri — tim kami konfirmasi lewat WhatsApp.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/booking" className={btnDark}>Booking sekarang</Link>
          <a href="#harga" className={btnLine}>Lihat harga</a>
        </div>
        <div className="mt-10">
          <BranchStatus branches={c.branches.items} fallbackWa={c.settings.whatsapp} greeting={c.settings.waGreeting} />
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-[460px]">
        <div className="aspect-[4/5] overflow-hidden rounded-[28px] bg-ivory-deep">
          <video className="h-full w-full object-cover" poster={v.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden>
            {v.webm && <source src={v.webm} type="video/webm" />}
            {v.mp4 && <source src={v.mp4} type="video/mp4" />}
          </video>
        </div>
      </div>
    </section>
  );
}
