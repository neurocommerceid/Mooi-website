import Intro from '@/components/Intro';
import CTA from '@/components/CTA';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/ui/Reveal';
import { getContent } from '@/lib/cms/get';
import { waLink } from '@/lib/cms/content';
export const metadata = { title: 'Tentang Kami | Mooi Hair Studio & Beauty Bar' };

export default async function Page() {
  const c = await getContent();
  return (
    <>
      <PageHeader {...c.pages.tentang} />
      <Intro c={c.intro} />
      {c.about.values.length > 0 && (
        <section className="section bg-ivory-soft">
          <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-3">
            {c.about.values.map((v, i) => (
              <Reveal key={i} delay={(i % 3) * 150} className="border-t border-gold/40 pt-8">
                <p className="font-serif text-lg italic text-gold">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-serif text-3xl font-light text-ink">{v.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}
      <CTA c={c.cta} wa={waLink(c.settings.whatsapp, c.settings.waGreeting)} />
    </>
  );
}
