import BookingFlow from '@/components/booking/BookingFlow';
import Rich from '@/components/ui/Rich';
import { getContent } from '@/lib/cms/get';

export const metadata = { title: 'Booking | Mooi Hair Studio & Beauty Bar' };

export default async function Page({ searchParams }: { searchParams: { cabang?: string } }) {
  const c = await getContent();
  return (
    <>
      <section className="grain relative overflow-hidden bg-espresso px-6 pb-14 pt-36 text-ivory md:px-16 md:pb-16 md:pt-40 lg:px-24">
        <div className="relative mx-auto max-w-[1200px]">
          <p className="kicker">Booking</p>
          <h1 className="mt-5 font-serif text-5xl font-light leading-[1.05] md:text-6xl">
            <span className="line-mask"><span><Rich text={c.booking.title} /></span></span>
          </h1>
          {c.booking.sub && <p className="mt-4 max-w-xl text-[15px] text-ivory/65">{c.booking.sub}</p>}
        </div>
      </section>
      <section className="px-6 py-12 md:px-16 md:py-16 lg:px-24">
        <BookingFlow
          branches={c.branches.items}
          booking={c.booking}
          whatsapp={c.settings.whatsapp}
          initialBranch={searchParams.cabang}
        />
      </section>
    </>
  );
}
