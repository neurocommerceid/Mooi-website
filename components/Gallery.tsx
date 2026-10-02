import { gallery } from '@/lib/data';
import { media } from '@/lib/media';
import Media from './ui/Media';
import Reveal from './ui/Reveal';
import SectionHead from './ui/SectionHead';

// Grid editorial: ukuran berselang agar tidak terasa seperti template.
const layout = [
  'md:col-span-7 aspect-[4/3]',
  'md:col-span-5 aspect-[4/5] md:mt-24',
  'md:col-span-4 aspect-[3/4]',
  'md:col-span-4 aspect-[3/4] md:-mt-16',
  'md:col-span-4 aspect-[3/4]',
  'md:col-span-12 aspect-[21/9]',
];

export default function Gallery() {
  return (
    <section className="section">
      <div className="mx-auto max-w-[1400px]">
        <SectionHead
          kicker="Galeri"
          title={<>Detail yang <em className="text-gold-sheen">dirawat</em>.</>}
          sub="Dari potongan rambut hingga sentuhan akhir."
          center
        />
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
          {gallery.map((label, i) => (
            <Reveal key={label} variant="img" delay={(i % 3) * 120} className={`${layout[i]} ${i === 5 ? 'col-span-2' : ''}`}>
              <Media photo={media.gallery[i]} label={label} className="h-full w-full" sizes="(min-width:768px) 50vw, 50vw" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
