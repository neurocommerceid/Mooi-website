import Services from '@/components/Services';
import CTA from '@/components/CTA';
export const metadata = { title: 'Layanan & Harga | Mooi Hair Studio & Beauty Bar' };

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-br from-cream-soft to-cream-deep px-6 py-14 text-center md:px-16 lg:px-20">
        <p className="kicker">Layanan</p>
        <h1 className="mt-3 font-serif text-3xl text-ink md:text-5xl">Layanan &amp; Daftar Harga</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] text-ink-muted">
          Harga dapat berbeda sesuai panjang rambut dan kondisi. Konsultasi gratis sebelum tindakan.
        </p>
      </section>
      <Services />
      <CTA />
    </>
  );
}
