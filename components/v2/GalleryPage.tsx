// Halaman Galeri dipisah dari Pages.tsx agar lightbox hanya dimuat di halaman ini.
import Gallery from './Gallery';
import type { Lang } from '@/lib/i18n';
import { load } from './Pages';
import { h2, muted, wrap } from './ui';

export async function GalleryPage({ lang, cabang }: { lang: Lang; cabang?: string }) {
  const c = await load(lang);
  const branches = c.branches.items.map((b) => ({ name: b.name, photos: (b.gallery ?? []).map((g) => g.image).filter((i) => i?.src) }));
  return (
    <section className={`${wrap} py-8 md:py-16`}>
      <h1 className={h2}>{c.home.pages.galeri.title}</h1>
      {c.home.pages.galeri.sub && <p className={`mt-2 ${muted}`}>{c.home.pages.galeri.sub}</p>}
      <div className="mt-5 md:mt-8"><Gallery branches={branches} initial={cabang} lang={lang} /></div>
    </section>
  );
}
