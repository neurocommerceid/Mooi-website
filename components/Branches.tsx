import Link from 'next/link';
import { branchWa, safeUrl, waLink, type Content } from '@/lib/cms/content';
import Media from './ui/Media';
import Reveal from './ui/Reveal';
import SectionHead from './ui/SectionHead';

const pill = 'rounded-full border border-espresso-line px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-ivory/80 transition-colors duration-500 hover:border-gold hover:text-gold-light';

export default function Branches({ c, whatsapp }: { c: Content['branches']; whatsapp: string }) {
  return (
    <section className="section grain relative overflow-hidden bg-espresso text-ivory">
      <div className="relative mx-auto max-w-[1400px]">
        <SectionHead kicker={c.kicker} title={c.title} sub={c.sub} dark />
        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {c.items.map((b, i) => {
            const maps = safeUrl(b.maps);
            const ig = safeUrl(b.instagram);
            const wa = branchWa(b, whatsapp);
            return (
              <Reveal as="article" key={`${b.name}-${i}`} delay={(i % 3) * 150} className="group">
                <Media photo={b.image} tone="dark" className="aspect-[4/5] w-full rounded-t-[999px]" sizes="(min-width:768px) 33vw, 100vw" />
                <div className="pt-7">
                  <p className="font-serif text-sm italic text-gold">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 font-serif text-3xl font-light">{b.name}</h3>
                  <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-ivory/60">
                    {b.address}
                    {b.hours && <><br />{b.hours}</>}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link href={`/booking?cabang=${encodeURIComponent(b.name)}`} className={`${pill} !border-gold/60 !text-gold-light`}>Booking</Link>
                    {wa && <a href={waLink(wa, `Halo ${b.name}, saya mau bertanya.`)} target="_blank" rel="noopener" className={pill}>WhatsApp</a>}
                    {maps && <a href={maps} target="_blank" rel="noopener" className={pill}>Maps</a>}
                    {ig && <a href={ig} target="_blank" rel="noopener" className={pill}>Instagram</a>}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
