import Gallery from '@/components/Gallery';
import CTA from '@/components/CTA';
import PageHeader from '@/components/ui/PageHeader';
export const metadata = { title: 'Galeri | Mooi Hair Studio & Beauty Bar' };

export default function Page() {
  return (
    <>
      <PageHeader kicker="Galeri" title="Hasil Kerja Kami" />
      <Gallery />
      <CTA />
    </>
  );
}
