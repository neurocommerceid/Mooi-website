import { branches, waLink } from '@/lib/data';
import { media } from '@/lib/media';
import Media from './ui/Media';
import Reveal from './ui/Reveal';
import SectionHead from './ui/SectionHead';

const pill = 'rounded-full border border-espresso-line px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-ivory/80 transition-colors duration-500 hover:border-gold hover:text-gold-light';

export default function Branches() {
  return (
    <section className="section grain relative overflow-hidden bg-espresso text-ivory">
      <div className="relative mx-auto max-w-[1400px]">
        <SectionHead
          kicker="Lokasi"
          title={<>Tiga cabang, <em className="text-gold-sheen">satu standar</em>.</>}
          sub="Kunjungi cabang terdekat, atau reservasi lebih dulu via WhatsApp."
          dark
        />
        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {branches.map((b, i) => (
            <Reveal as="article" key={b.slug} delay={i * 150} className="group">
              <Media
                photo={media.branches[b.slug]}
                tone="dark"
                className="aspect-[4/5] w-full rounded-t-[999px]"
                sizes="(min-width:768px) 33vw, 100vw"
              />
              <div className="pt-7">
                <p className="font-serif text-sm italic text-gold">0{i + 1}</p>
                <h3 className="mt-1 font-serif text-3xl font-light">{b.name}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ivory/60">
                  {b.address}
                  <br />
                  {b.hours}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <a href={waLink(`Halo ${b.name}, saya mau reservasi.`)} target="_blank" rel="noopener" className={pill}>WhatsApp</a>
                  {b.maps !== '#' && <a href={b.maps} target="_blank" rel="noopener" className={pill}>Maps</a>}
                  <a href={b.ig} target="_blank" rel="noopener" className={pill}>Instagram</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
