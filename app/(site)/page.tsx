import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Intro from '@/components/Intro';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import Branches from '@/components/Branches';
import Testimonial from '@/components/Testimonial';
import CTA from '@/components/CTA';
import { getContent } from '@/lib/cms/get';
import { waLink } from '@/lib/cms/content';

export default async function Home() {
  const c = await getContent();
  const wa = waLink(c.settings.whatsapp, c.settings.waGreeting);
  return (
    <>
      <Hero c={c.hero} />
      <Marquee items={c.marquee.items} />
      <Intro c={c.intro} />
      <Services c={c.services} />
      <Gallery c={c.gallery} />
      <Branches c={c.branches} whatsapp={c.settings.whatsapp} />
      <Testimonial c={c.testimonial} />
      <CTA c={c.cta} wa={wa} />
    </>
  );
}
