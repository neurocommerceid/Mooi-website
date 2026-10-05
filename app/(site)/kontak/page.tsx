import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/ui/Reveal';
import { getContent } from '@/lib/cms/get';
import { branchWa, safeUrl, waLink } from '@/lib/cms/content';
export const metadata = { title: 'Kontak | Mooi Hair Studio & Beauty Bar' };

export default async function Page() {
  const c = await getContent();
  return (
    <>
      <PageHeader {...c.pages.kontak} />
      <section className="section">
        <div className="mx-auto grid max-w-[1300px] gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="rounded-3xl bg-espresso p-10 text-ivory">
              <p className="kicker">Booking online</p>
              <h2 className="mt-5 font-serif text-4xl font-light leading-tight">Pilih layanan, stylist, dan jam dalam satu menit.</h2>
              <p className="mt-4 text-[15px] text-ivory/65">Permintaan Anda langsung masuk ke tim kami dan dikonfirmasi via WhatsApp.</p>
              <Link href="/booking" className="btn mt-8">Booking Sekarang</Link>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="font-serif text-4xl font-light text-ink">Hubungi cabang</h2>
            <div className="mt-8 border-t border-line">
              {c.branches.items.map((b, i) => {
                const maps = safeUrl(b.maps);
                return (
                  <div key={`${b.name}-${i}`} className="border-b border-line py-7">
                    <h3 className="font-serif text-2xl font-light text-ink">{b.name}</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{b.address}<br />{b.hours}</p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-gold-deep">
                      <Link href={`/booking?cabang=${encodeURIComponent(b.name)}`} className="hover:underline">Booking cabang ini</Link>
                      <a href={waLink(branchWa(b, c.settings.whatsapp), `Halo ${b.name}, saya ingin bertanya.`)} target="_blank" rel="noopener" className="hover:underline">WhatsApp</a>
                      {maps && <a href={maps} target="_blank" rel="noopener" className="hover:underline">Maps</a>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
