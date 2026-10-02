import Reveal from './ui/Reveal';

export default function Testimonial() {
  return (
    <section className="section relative overflow-hidden bg-ivory-soft text-center">
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none font-serif text-[260px] leading-none text-gold/15 md:text-[380px]">
        &ldquo;
      </span>
      <div className="relative mx-auto max-w-4xl">
        <Reveal><p className="kicker justify-center">Kata Pelanggan</p></Reveal>
        <Reveal delay={150}>
          <blockquote className="mt-10 font-serif text-3xl font-light italic leading-snug text-ink md:text-5xl">
            Hasilnya selalu rapi dan stylist-nya ngerti banget maunya kita. Sudah langganan dari cabang
            pertama buka.
          </blockquote>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-10 text-[11px] uppercase tracking-luxe text-gold-deep">Pelanggan Mooi · Kelapa Gading</p>
        </Reveal>
      </div>
    </section>
  );
}
