import Link from 'next/link';
import { media } from '@/lib/media';
import Media from './ui/Media';
import Reveal from './ui/Reveal';

export default function Intro() {
  return (
    <section className="section relative overflow-hidden">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <div className="relative">
          <Reveal variant="img">
            <Media photo={media.about} className="aspect-[4/5] w-full rounded-t-[999px]" sizes="(min-width:1024px) 45vw, 100vw" />
          </Reveal>
          <Reveal variant="img" delay={300} className="animate-float absolute -bottom-10 -right-4 w-[42%] md:-right-10">
            <Media photo={media.aboutDetail} className="aspect-square w-full rounded-full border-[6px] border-ivory shadow-2xl" sizes="20vw" />
          </Reveal>
        </div>

        <div>
          <Reveal><p className="kicker">Filosofi Kami</p></Reveal>
          <Reveal delay={120}>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.1] text-ink md:text-6xl">
              Mooi berarti <em className="text-gold-sheen">indah</em>. Kami percaya keindahan lahir
              dari perhatian pada detail.
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ink-muted">
              Setiap kunjungan diawali konsultasi — bentuk wajah, kondisi rambut, dan keseharian Anda —
              sebelum gunting atau kuas menyentuh rambut. Standar yang sama kami jaga di ketiga cabang.
            </p>
          </Reveal>
          <Reveal variant="line" delay={300} className="mt-10 h-px w-full bg-line" />
          <Reveal delay={380}>
            <dl className="mt-8 grid grid-cols-3 gap-6">
              {[
                ['03', 'Cabang'],
                ['06', 'Lini layanan'],
                ['01', 'Standar layanan'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-serif text-4xl font-light text-gold md:text-5xl">{v}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ink-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={460}>
            <Link href="/tentang" className="group mt-10 inline-flex items-center gap-4 text-[12px] uppercase tracking-[0.24em] text-ink">
              Cerita Kami
              <span className="h-px w-10 bg-gold transition-all duration-500 group-hover:w-16" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
