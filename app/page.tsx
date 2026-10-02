import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Intro from '@/components/Intro';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import Branches from '@/components/Branches';
import Testimonial from '@/components/Testimonial';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Intro />
      <Services />
      <Gallery />
      <Branches />
      <Testimonial />
      <CTA />
    </>
  );
}
