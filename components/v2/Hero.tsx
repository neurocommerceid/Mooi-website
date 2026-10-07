import Link from 'next/link';
import type { Content } from '@/lib/cms/content';
import { P, btnDark, link } from './ui';

/**
 * Satu struktur, satu video:
 * - HP: video portrait layar penuh, judul di atasnya, tanpa tombol (bar bawah
 *   sudah memegang Booking & WhatsApp).
 * - Desktop: dua kolom sama tinggi, satu tombol utama.
 */
export default function Hero({ c }: { c: Content }) {
  const v = c.hero.video;
  return (
    <section className="md:mx-auto md:w-full md:max-w-[1200px] md:px-10 md:py-14">
      <div className="relative h-[calc(100svh-64px-84px)] max-h-[760px] min-h-[460px] overflow-hidden bg-espresso md:grid md:h-auto md:max-h-none md:min-h-0 md:grid-cols-2 md:items-stretch md:gap-12 md:overflow-visible md:bg-transparent">
        <div className="absolute inset-0 md:relative md:order-2 md:min-h-[560px] md:overflow-hidden md:rounded-[28px] md:bg-ivory-deep">
          <video className="absolute inset-0 h-full w-full object-cover" poster={v.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden>
            {v.webm && <source src={v.webm} type="video/webm" />}
            {v.mp4 && <source src={v.mp4} type="video/mp4" />}
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/15 to-transparent md:hidden" />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-7 text-ivory md:relative md:order-1 md:flex md:flex-col md:justify-center md:p-0 md:text-ink">
          <p className="text-[14px] text-ivory/75 md:text-[15px] md:text-[#6B5A52]">Hair studio &amp; beauty bar · sejak 2019</p>
          <h1 className="mt-2 font-display text-[2.05rem] font-normal leading-[1.1] tracking-[-0.01em] md:mt-3 md:text-[3.1rem] md:leading-[1.06] md:tracking-[-0.02em] lg:text-[3.5rem]">
            <span className="sr-only">Mooi Hair Studio &amp; Beauty Bar — </span>
            Perawatan rambut yang personal, teliti, dan nyaman.
          </h1>
          <div className="mt-4 flex items-center gap-6 md:mt-8">
            <Link href={P('/booking')} className={`${btnDark} hidden md:inline-flex`}>Booking sekarang</Link>
            <a href="#harga" className={`inline-flex items-center gap-2 text-[15px] font-medium text-ivory underline decoration-ivory/40 underline-offset-4 md:hidden`}>
              Lihat harga
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </a>
            <a href="#harga" className={`hidden text-[15px] md:inline ${link}`}>Lihat harga</a>
          </div>
        </div>
      </div>
    </section>
  );
}
