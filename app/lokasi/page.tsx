import Branches from '@/components/Branches';
export const metadata = { title: 'Lokasi Cabang | Mooi Hair Studio & Beauty Bar' };

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-br from-cream-soft to-cream-deep px-6 py-14 text-center md:px-16 lg:px-20">
        <p className="kicker">Lokasi</p>
        <h1 className="mt-3 font-serif text-3xl text-ink md:text-5xl">Tiga Cabang di Jakarta &amp; Tangerang</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] text-ink-muted">
          Kedoya, Alam Sutera, dan Kelapa Gading — dengan standar layanan yang sama.
        </p>
      </section>
      <Branches />
    </>
  );
}
