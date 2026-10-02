import Gallery from '@/components/Gallery';
import CTA from '@/components/CTA';
export const metadata = { title: 'Galeri | Mooi Hair Studio & Beauty Bar' };

export default function Page() {
  return (
    <>
      <section className="bg-gradient-to-br from-cream-soft to-cream-deep px-6 py-14 text-center md:px-16 lg:px-20">
        <p className="kicker">Galeri</p>
        <h1 className="mt-3 font-serif text-3xl text-ink md:text-5xl">Hasil Kerja Kami</h1>
      </section>
      <Gallery />
      <CTA />
    </>
  );
}
