import Link from 'next/link';
import type { Content } from '@/lib/cms/content';
import Media from './ui/Media';
import Ornament from './ui/Ornament';
import Reveal from './ui/Reveal';
import Rich from './ui/Rich';

export default function CTA({ c, wa }: { c: Content['cta']; wa: string }) {
  return (
    <section className="grain relative overflow-hidden bg-espresso px-6 py-32 text-center text-ivory md:py-44">
      <div className="absolute inset-0 opacity-35">
        <Media photo={c.image} tone="dark" className="h-full w-full" zoom={false} />
      </div>
      <div className="absolute inset-0 bg-espresso/70" />
      <Ornament className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="relative">
        <Reveal><p className="kicker justify-center">{c.kicker}</p></Reveal>
        <Reveal delay={120}>
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-light leading-[1.05] md:text-7xl">
            <Rich text={c.title} />
          </h2>
        </Reveal>
        {c.sub && (
          <Reveal delay={240}>
            <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-ivory/65">{c.sub}</p>
          </Reveal>
        )}
        <Reveal delay={360}>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/booking" className="btn">{c.primary}</Link>
            <a href={wa} target="_blank" rel="noopener" className="btn-line text-ivory/90">{c.secondary}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
