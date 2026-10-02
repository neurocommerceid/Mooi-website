import Link from 'next/link';
import { waLink } from '@/lib/data';
import { media } from '@/lib/media';
import Media from './ui/Media';
import Ornament from './ui/Ornament';
import Reveal from './ui/Reveal';

export default function CTA() {
  return (
    <section className="grain relative overflow-hidden bg-espresso px-6 py-32 text-center text-ivory md:py-44">
      <div className="absolute inset-0 opacity-35">
        <Media photo={media.cta} tone="dark" className="h-full w-full" zoom={false} />
      </div>
      <div className="absolute inset-0 bg-espresso/70" />
      <Ornament className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="relative">
        <Reveal><p className="kicker justify-center">Reservasi</p></Reveal>
        <Reveal delay={120}>
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-light leading-[1.05] md:text-7xl">
            Saatnya merawat <em className="text-gold-sheen">diri sendiri</em>.
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-ivory/65">
            Pilih cabang terdekat, kami siapkan jadwal untuk Anda.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={waLink()} target="_blank" rel="noopener" className="btn">Reservasi via WhatsApp</a>
            <Link href="/kontak" className="btn-line text-ivory/90">Isi Formulir</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
