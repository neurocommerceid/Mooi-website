// Halaman Booking dipisah dari Pages.tsx agar kode alur booking hanya dimuat di halaman ini.
import BookingFlow from '@/components/booking/BookingFlow';
import type { Lang } from '@/lib/i18n';
import { load } from './Pages';
import { P, h2, muted, wrap } from './ui';

export async function BookPage({ lang, cabang, stylist }: { lang: Lang; cabang?: string; stylist?: string }) {
  const c = await load(lang);
  // Cabang tanpa foto asli (galeri kosong) tidak memakai foto sampul stok.
  const branches = c.branches.items.map((b) => (b.gallery?.length ? b : { ...b, image: { src: '', alt: '' } }));
  const sub = c.home.pages.booking.sub || c.booking.sub;
  return (
    <section className={`${wrap} pb-16 pt-8 md:pt-14`}>
      <h1 className={h2}>{c.home.pages.booking.title}</h1>
      {sub && <p className={`mt-2 max-w-xl ${muted}`}>{sub}</p>}
      <div className="mt-5 md:mt-8">
        <BookingFlow branches={branches} booking={c.booking} whatsapp={c.settings.whatsapp} initialBranch={cabang} initialStylist={stylist}
          homeHref={P('/', lang)} lang={lang} terms={c.en.terms} />
      </div>
    </section>
  );
}
