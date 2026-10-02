import Link from 'next/link';
import { waLink } from '@/lib/data';
import { media } from '@/lib/media';
import Ornament from './ui/Ornament';
import { Placeholder } from './ui/Media';
import Image from 'next/image';
import HeroVideo from './ui/HeroVideo';

export default function Hero() {
  const video = media.heroVideo;
  const photo = media.heroPhoto;

  return (
    <section className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-espresso text-ivory">
      {/* Latar: foto (desktop) / video (ponsel) / gradien beranimasi */}
      <div className="absolute inset-0">
        {photo ? (
          <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="animate-kenburns object-cover" />
        ) : (
          <Placeholder tone="dark" />
        )}
        {video && <HeroVideo video={video} desktop={false} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/40 to-espresso/20 xl:via-espresso/60 xl:to-espresso/55" />
      </div>

      {/* Desktop: video dalam jendela kubah, dikelilingi cincin ornamen */}
      <div className="pointer-events-none absolute right-[6vw] top-1/2 hidden -translate-y-1/2 xl:block">
       <div style={{ animation: 'rise 1.6s .5s both' }}>
        <Ornament className="absolute left-1/2 top-1/2 h-[860px] w-[860px] -translate-x-1/2 -translate-y-1/2 opacity-60" />
        {video ? (
          <div className="relative h-[68vh] max-h-[640px] min-h-[460px] aspect-[9/16] overflow-hidden rounded-t-full border border-gold/40 shadow-[0_40px_120px_-30px_rgba(0,0,0,.8)]">
            <HeroVideo video={video} desktop className="h-full w-full object-cover" />
            <div className="absolute inset-0 rounded-t-full ring-1 ring-inset ring-white/10" />
          </div>
        ) : null}
       </div>
      </div>

      <div className="relative w-full px-6 pb-20 pt-40 md:px-16 md:pb-28 lg:px-24">
        <p className="kicker" style={{ animation: 'rise 1s .1s both' }}>Hair Studio &amp; Beauty Bar</p>

        <h1 className="mt-7 max-w-4xl font-serif text-[52px] font-light leading-[0.98] md:text-[88px] lg:text-[112px]">
          <span className="line-mask"><span style={{ animationDelay: '.15s' }}>Keindahan yang</span></span>
          <span className="line-mask">
            <span style={{ animationDelay: '.3s' }}>
              <em className="text-gold-sheen pr-2 font-normal">dirawat</em> dengan
            </span>
          </span>
          <span className="line-mask"><span style={{ animationDelay: '.45s' }}>sepenuh hati.</span></span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between xl:max-w-[52%] xl:flex-col xl:items-start xl:gap-8">
          <p className="max-w-md text-[15px] leading-relaxed text-ivory/70 md:text-base" style={{ animation: 'rise 1.2s .7s both' }}>
            Potongan, warna, dan perawatan rambut oleh tim profesional Mooi — di Kedoya, Alam Sutera,
            dan Kelapa Gading.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row" style={{ animation: 'rise 1.2s .85s both' }}>
            <a href={waLink()} target="_blank" rel="noopener" className="btn">Reservasi Sekarang</a>
            <Link href="/layanan" className="btn-line text-ivory/90">Lihat Layanan</Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="text-[10px] uppercase tracking-luxe text-ivory/50">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-ivory/15">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-gold-light" />
        </span>
      </div>
    </section>
  );
}
