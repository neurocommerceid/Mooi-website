import BookingFlow from '@/components/booking/BookingFlow';
import { getContent } from '@/lib/cms/get';
import { P, h2, muted, wrap } from '@/components/v2/ui';

export const metadata = { title: 'Booking' };

export default async function Page({ searchParams }: { searchParams: { cabang?: string; stylist?: string } }) {
  const c = await getContent();
  // Cabang tanpa foto asli (galeri kosong) tidak memakai foto sampul stok.
  const branches = c.branches.items.map((b) => (b.gallery?.length ? b : { ...b, image: { src: '', alt: '' } }));
  return (
    <section className={`${wrap} pb-16 pt-10 md:pt-14`}>
      <h1 className={h2}>Booking</h1>
      {c.booking.sub && <p className={`mt-2 max-w-xl ${muted}`}>{c.booking.sub}</p>}
      <div className="mt-8">
        <BookingFlow branches={branches} booking={c.booking} whatsapp={c.settings.whatsapp} initialBranch={searchParams.cabang} initialStylist={searchParams.stylist} homeHref={P('/')} />
      </div>
    </section>
  );
}
