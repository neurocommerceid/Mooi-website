import Gallery from '@/components/v2/Gallery';
import { getContent } from '@/lib/cms/get';
import { h2, muted, wrap } from '@/components/v2/ui';

export const metadata = { title: 'Galeri' };

export default async function Page({ searchParams }: { searchParams: { cabang?: string } }) {
  const c = await getContent();
  const branches = c.branches.items.map((b) => ({ name: b.name, photos: (b.gallery ?? []).map((g) => g.image).filter((i) => i?.src) }));
  return (
    <section className={`${wrap} py-12 md:py-16`}>
      <h1 className={h2}>Galeri</h1>
      <p className={`mt-2 ${muted}`}>Foto asli dari cabang Mooi.</p>
      <div className="mt-8"><Gallery branches={branches} initial={searchParams.cabang} /></div>
    </section>
  );
}
