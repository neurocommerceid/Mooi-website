import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import Branches from '@/components/Branches';
import Testimonial from '@/components/Testimonial';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-2 border-b border-line bg-white px-6 py-6 text-[12.5px] uppercase tracking-[0.2em] text-ink-muted">
        <span>Hair Treatment</span><span>Coloring</span><span>Smoothing</span>
        <span>Beauty Bar</span><span>Bridal</span>
      </div>
      <Services />
      <Gallery />
      <Branches />
      <Testimonial />
      <CTA />
    </>
  );
}
