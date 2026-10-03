import type { Content } from '@/lib/cms/content';
import Reveal from './ui/Reveal';

export default function Testimonial({ c }: { c: Content['testimonial'] }) {
  if (!c.quote) return null;
  return (
    <section className="section relative overflow-hidden bg-ivory-soft text-center">
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none font-serif text-[260px] leading-none text-gold/15 md:text-[380px]">
        &ldquo;
      </span>
      <div className="relative mx-auto max-w-4xl">
        <Reveal><p className="kicker justify-center">{c.kicker}</p></Reveal>
        <Reveal delay={150}>
          <blockquote className="mt-10 font-serif text-3xl font-light italic leading-snug text-ink md:text-5xl">{c.quote}</blockquote>
        </Reveal>
        {c.author && (
          <Reveal delay={300}>
            <p className="mt-10 text-[11px] uppercase tracking-luxe text-gold-deep">{c.author}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
