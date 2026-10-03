import ReservationForm from '@/components/ReservationForm';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/ui/Reveal';
import { getContent } from '@/lib/cms/get';
import { waLink } from '@/lib/cms/content';
export const metadata = { title: 'Kontak & Reservasi | Mooi Hair Studio & Beauty Bar' };

export default async function Page() {
  const c = await getContent();
  const branches = c.branches.items;
  return (
    <>
      <PageHeader {...c.pages.kontak} />

      <section className="section">
        <div className="mx-auto grid max-w-[1300px] gap-20 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <h2 className="font-serif text-4xl font-light text-ink">Isi formulir</h2>
            <div className="mt-10"><ReservationForm branches={branches.map((b) => b.name)} services={c.services.items.map((s) => s.name)} /></div>
          </Reveal>

          <Reveal delay={150}>
            <h2 className="font-serif text-4xl font-light text-ink">Atau hubungi cabang</h2>
            <div className="mt-10 border-t border-line">
              {branches.map((b, i) => (
                <div key={`${b.name}-${i}`} className="border-b border-line py-7">
                  <h3 className="font-serif text-2xl font-light text-ink">{b.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{b.address}<br />{b.hours}</p>
                  <a
                    href={waLink(c.settings.whatsapp, `Halo ${b.name}, saya mau reservasi.`)}
                    target="_blank"
                    rel="noopener"
                    className="group mt-4 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-gold-deep"
                  >
                    WhatsApp cabang ini
                    <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" />
                  </a>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
