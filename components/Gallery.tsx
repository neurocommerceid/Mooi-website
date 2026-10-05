import type { Content } from '@/lib/cms/content';
import BranchGallery from './BranchGallery';
import Media from './ui/Media';
import Reveal from './ui/Reveal';
import SectionHead from './ui/SectionHead';

// Grid editorial: ukuran berselang agar tidak terasa seperti template.
// Pola diulang bila jumlah foto lebih dari enam.
const layout = [
  'md:col-span-7 aspect-[4/3]',
  'md:col-span-5 aspect-[4/5] md:mt-24',
  'md:col-span-4 aspect-[3/4]',
  'md:col-span-4 aspect-[3/4] md:-mt-16',
  'md:col-span-4 aspect-[3/4]',
  'col-span-2 md:col-span-12 aspect-[21/9]',
];

export default function Gallery({ c, branches, initial }: { c: Content['gallery']; branches?: Content['branches']['items']; initial?: string }) {
  // Foto asli tiap cabang diutamakan; galeri umum hanya cadangan bila belum ada.
  const perBranch = (branches ?? [])
    .map((b) => ({ name: b.name, photos: (b.gallery ?? []).map((g) => g.image).filter((p) => p?.src) }))
    .filter((b) => b.photos.length);
  return (
    <section className="section">
      <div className="mx-auto max-w-[1400px]">
        <SectionHead kicker={c.kicker} title={c.title} sub={c.sub} center />
        {perBranch.length ? (
          <BranchGallery branches={perBranch} initial={initial} />
        ) : (
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
          {c.items.map((g, i) => (
            <Reveal key={`${g.label}-${i}`} variant="img" delay={(i % 3) * 120} className={layout[i % layout.length]}>
              <Media photo={g.image} label={g.label} className="h-full w-full" sizes="(min-width:768px) 50vw, 50vw" />
            </Reveal>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
