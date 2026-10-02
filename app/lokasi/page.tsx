import Branches from '@/components/Branches';
import CTA from '@/components/CTA';
import PageHeader from '@/components/ui/PageHeader';
export const metadata = { title: 'Lokasi Cabang | Mooi Hair Studio & Beauty Bar' };

export default function Page() {
  return (
    <>
      <PageHeader
        kicker="Lokasi"
        title="Tiga Cabang"
        sub="Kedoya, Alam Sutera, dan Kelapa Gading — dengan standar layanan yang sama."
      />
      <Branches />
      <CTA />
    </>
  );
}
