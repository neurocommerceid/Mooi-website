import { waLink } from '@/lib/data';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream-soft via-cream-mid to-cream-deep">
      <div className="pointer-events-none absolute -right-24 -top-40 h-[520px] w-[520px] rounded-full bg-white/35 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-32 h-[360px] w-[360px] rounded-full bg-rose/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-14 md:px-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-20 lg:py-20">
        <div>
          <p className="kicker">Hair Studio &amp; Beauty Bar</p>
          <h1 className="mt-4 font-serif text-[34px] leading-[1.12] text-ink md:text-5xl lg:text-[56px]">
            Rambut indah,
            <br />
            <em className="not-italic text-rose">percaya diri</em> setiap hari.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-muted md:text-lg">
            Perawatan rambut dan kecantikan oleh tim profesional Mooi. Tiga cabang di Jakarta &amp; Tangerang —
            Kedoya, Alam Sutera, dan Kelapa Gading.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={waLink()} target="_blank" rel="noopener" className="btn">Reservasi via WhatsApp</a>
            <Link href="/layanan" className="btn-ghost">Lihat Layanan</Link>
          </div>

          <dl className="mt-9 flex gap-8">
            {[
              ['3', 'Cabang Jakarta & Tangerang'],
              ['15+', 'Stylist profesional'],
              ['4.8', 'Rating Google'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-serif text-xl text-rose md:text-2xl">{v}</dt>
                <dd className="text-[12.5px] text-ink-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Ganti dengan foto interior / hasil kerja */}
        <div className="flex h-[300px] items-center justify-center rounded-t-[160px] rounded-b-2xl bg-gradient-to-br from-[#D8A991] to-rose text-[11px] tracking-[0.2em] text-white/70 shadow-2xl lg:h-[480px] lg:rounded-t-[220px]">
          FOTO INTERIOR / HASIL KERJA
        </div>
      </div>
    </section>
  );
}
