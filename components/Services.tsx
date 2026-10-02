import { services, waLink } from '@/lib/data';
import { media } from '@/lib/media';
import Media from './ui/Media';
import Reveal from './ui/Reveal';
import SectionHead from './ui/SectionHead';

export default function Services() {
  return (
    <section className="section bg-ivory-soft">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHead
            kicker="Layanan"
            title={<>Ritual perawatan, <em className="text-gold-sheen">untuk Anda</em>.</>}
          />
          <Reveal delay={200}>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-muted">
              Harga menyesuaikan panjang dan kondisi rambut. Konsultasi sebelum setiap tindakan.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 border-t border-line">
          {services.map((s, i) => (
            <Reveal as="li" key={s.name} delay={i * 70}>
              <a
                href={waLink(`Halo Mooi, saya ingin reservasi ${s.name}.`)}
                target="_blank"
                rel="noopener"
                className="group relative grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 border-b border-line py-8 transition-colors duration-500 hover:bg-ivory md:grid-cols-[80px_1.1fr_1.4fr_auto_auto] md:gap-x-10 md:px-4"
              >
                <span className="font-serif text-lg italic text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-3xl font-light text-ink transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                  {s.name}
                </h3>
                <p className="col-span-2 text-[14px] leading-relaxed text-ink-muted md:col-span-1">{s.desc}</p>
                <span className="col-span-2 text-[12px] uppercase tracking-[0.2em] text-gold-deep md:col-span-1 md:text-right">
                  {s.price}
                </span>
                {/* Pratinjau foto yang membuka saat hover (desktop) */}
                <span className="hidden h-24 w-0 overflow-hidden rounded-full transition-all duration-700 ease-out group-hover:w-24 md:block">
                  <Media photo={media.services[s.name]} className="h-24 w-24" sizes="96px" zoom={false} />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
